import Emotion, {emotionNames} from 'types/Emotion';
import {splitAndTrimText} from "common/textFormatUtil";
import unprocessedWordToEmotionMap from "impex/wordToEmotionMap.json";

type WordToEmotionMap = {
  [word: string]: Emotion;
}

let isInitialized:boolean = false;
const wordToEmotionMap:WordToEmotionMap = {};

function _initAsNeeded() {
  if (isInitialized) return;
  Object.keys(unprocessedWordToEmotionMap).forEach(key => {
    const emotionName:any = (unprocessedWordToEmotionMap as any)[key];
    const emotionNo = emotionNames.indexOf(emotionName);
    wordToEmotionMap[key] = emotionNo as Emotion;
  });
  isInitialized = true;
}

export function parentheticalToEmotion(parenthetical:string):Emotion {
  _initAsNeeded();
  const words = splitAndTrimText(parenthetical.toLowerCase(), ' ');
  for(let wordI = 0; wordI < words.length; ++wordI) {
    const emotion:any = wordToEmotionMap[words[wordI]];
    if (emotion) return emotion as Emotion;
  }
  return Emotion.NEUTRAL;
}