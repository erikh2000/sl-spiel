import {splitAndTrimText} from "common/textFormatUtil";

/*
  Match format is designed with these goals:
  
  * easy to read and write by humans
  * more common use cases for speech recognition are expressed with simpler defaults
  * don't try to cover more use cases than what is actually needed.
  * realistic lack of precision when considering the chaos of continuous speech recognition.

  EXAMPLES
  
  thanks           = match the word "thanks".
  thank you        = match the phrase "thank you" (two words must be together)
  thank...you      = match the word "thank" followed by "you" with any number of words between.
  [thank you       = match the phrase "thank you" when preceded by a pause, e.g. start of sentence.
  thank you]       = match the phrase "thank you" when followed by a pause, e.g. end of sentence.
  
 */

type Phrase = string[];

export interface IMatchRuleset {
  phrases:Phrase[],
  matchFromStart:boolean,
  matchToEnd:boolean
}

type WordPositions = number[];
export type WordPositionMap = {
  [id: string]: WordPositions;
}

function _stripAnchors(phrase:string):string {
  const startPos = phrase.startsWith('[') ? 1 : 0;
  const endPos = phrase.endsWith(']') ? phrase.length - 1 : phrase.length;
  return phrase.substring(startPos, endPos);
}

const POSITION_RANGE_KEY = '__positionRange';
function _getLastWordPosition(wordPositionMap:WordPositionMap):number {
  return wordPositionMap[POSITION_RANGE_KEY][1];
}

function _arePhraseWordsAtPosition(phrase:Phrase, wordNo:number, startPhraseWordI:number, wordPositionMap:WordPositionMap):boolean {
  for(let i = startPhraseWordI; i < phrase.length; ++i) {
    const wordPositions = wordPositionMap[phrase[i]];
    if (!wordPositions || !wordPositions.includes(wordNo + i)) return false;
  }
  return true;
}

function _isPhraseAtPosition(phrase:Phrase, wordNo:number, wordPositionMap:WordPositionMap):boolean {
  return _arePhraseWordsAtPosition(phrase, wordNo, 0, wordPositionMap);
}

function _isFirstPhraseAtStart(phrases:Phrase[], wordPositionMap:WordPositionMap):boolean {
  return _isPhraseAtPosition(phrases[0], 0, wordPositionMap);
}

function _isLastPhraseAtEnd(phrases:Phrase[], wordPositionMap:WordPositionMap):boolean {
  const lastPhrase = phrases[phrases.length - 1];
  const wordCount = _getLastWordPosition(wordPositionMap) + 1;
  return _isPhraseAtPosition(lastPhrase, wordCount - lastPhrase.length, wordPositionMap);
}

function _findPhraseInWordPositionMap(phrase:Phrase, wordPositionMap:WordPositionMap, lookFromWordNo:number):number {
  const firstWordPositions = wordPositionMap[phrase[0]];
  if (!firstWordPositions) return -1;
  for(let i = 0; i < firstWordPositions.length; ++i) {
    const position = firstWordPositions[i];
    if (position < lookFromWordNo) continue;
    if (_arePhraseWordsAtPosition(phrase, position, 1, wordPositionMap))
      return position;
  }
  return -1;
}

export function createMatchRulesetFromCriterion(matchCriterion:string):IMatchRuleset {
  const trimmedCriterion = matchCriterion.trim();
  const matchFromStart = trimmedCriterion.startsWith('[');
  const matchToEnd = trimmedCriterion.endsWith(']');
  const useCriteria:string = _stripAnchors(trimmedCriterion).trim();
  if (useCriteria === '') return { matchFromStart, matchToEnd, phrases:[] };
  const wholePhrases = splitAndTrimText(useCriteria, '...');
  const phrases = wholePhrases.map(wholePhrase => splitAndTrimText(wholePhrase, ' '));
  return { matchFromStart, matchToEnd, phrases };
}

export function createWordPositionMap(text:string):WordPositionMap {
  const words = splitAndTrimText(text, ' ');
  const wordPositionMap:WordPositionMap = {};
  wordPositionMap[POSITION_RANGE_KEY] = [0, words.length-1];
  if (words.length === 0) return wordPositionMap;

  for(let wordI = 0; wordI < words.length; ++wordI) {
    const word = words[wordI];
    let wordPositions = wordPositionMap[word];
    if (!wordPositions) wordPositions = wordPositionMap[word] = [];
    wordPositions.push(wordI);
  }

  return wordPositionMap;
}

export function matchesRulesetInWordPositionMap(matchRuleset:IMatchRuleset, wordPositionMap:WordPositionMap) {
  const { phrases, matchFromStart, matchToEnd } = matchRuleset;
  if (!phrases.length) return false;

  if (matchFromStart && !_isFirstPhraseAtStart(phrases, wordPositionMap)) return false;
  if (matchToEnd && !_isLastPhraseAtEnd(phrases, wordPositionMap)) return false;

  let lookFromWordNo = 0;
  for(let phraseI = 0; phraseI < phrases.length; ++phraseI) {
    const phrase = phrases[phraseI];
    const foundWordNo = _findPhraseInWordPositionMap(phrase, wordPositionMap, lookFromWordNo);
    if (foundWordNo === -1) return false;
    lookFromWordNo += foundWordNo + phrase.length;
  }

  return true;
}