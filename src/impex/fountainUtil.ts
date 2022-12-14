import fountain from '../3rdParty/fountainJs';
import {findCharacterWithMostLines} from "../analysis/findUtil";
import {stripHtml} from '../common/htmlFormatUtil';
import Emotion from "../types/Emotion";
import Spiel from '../types/Spiel';
import SpielLine from "../types/SpielLine";
import SpielNode from '../types/SpielNode';
import {parentheticalToEmotion} from "./emotionUtil";

function _normalizeCharacter(character:string):string {
  const leftParenthesesI = character.indexOf('('); // Remove "(CONT'D)", "(VO)", and similar qualifiers.
  if (leftParenthesesI === -1) return character.trim();
  return character.substring(0, leftParenthesesI).trim();
}

function _findEmotionForParenthetical(parenthetical:string | null):Emotion {
  if (!parenthetical) return Emotion.NEUTRAL;
  const middle = parenthetical.substring(1, parenthetical.length - 1); // Strip "(" and ")".
  return parentheticalToEmotion(middle);
}

function _fountainTokensToSpiel(tokens:any) : Spiel {
  const spiel:Spiel = new Spiel();

  let lastNormalizedCharacter:string = '';
  let lastParenthetical:string|null = null;
  for(let tokenI = 0; tokenI < tokens.length; ++tokenI) {
    const token = tokens[tokenI];
    switch(token.type) {
      case 'character':
        lastNormalizedCharacter = _normalizeCharacter(token.text);
        break;

      case 'parenthetical':
        lastParenthetical = stripHtml(token.text);
        break;

      case 'dialogue':
        const emotion = _findEmotionForParenthetical(lastParenthetical);
        const line = new SpielLine(lastNormalizedCharacter, [stripHtml(token.text)], emotion);
        const nodeId = spiel.nodes.length;
        spiel.nodes.push(new SpielNode(line,[]));
        lastParenthetical = null;
        break;

      default:
        break;
    }
  }

  spiel.defaultCharacter = findCharacterWithMostLines(spiel.nodes) ?? '';
  return spiel;
}

export function importFountain(text:string) : Spiel {
  let spiel:Spiel = new Spiel();
  fountain.parse(text, true, (output:any) => {
    spiel = _fountainTokensToSpiel(output.tokens);
  });
  return spiel;
}