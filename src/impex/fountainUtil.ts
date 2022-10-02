import fountain from '3rdParty/fountainJs';
import {stripHtml} from 'common/htmlFormatUtil';
import Emotion from "types/Emotion";
import Spiel from 'types/Spiel';
import SpielLine from "types/SpielLine";
import SpielNode from 'types/SpielNode';
import {findCharacterWithMostLines} from "traversal/spielUtil";
import {parentheticalToEmotion} from "impex/emotionUtil";

function _normalizeCharacter(character:string):string {
  const leftParenthesesI = character.indexOf('('); // Remove "(CONT'D)", "(VO)", and similar qualifiers.
  if (leftParenthesesI === -1) return character.trim();
  return character.substring(0, leftParenthesesI).trim();
}

function _findEmotionForParenthetical(parenthetical:string | null):Emotion {
  if (!parenthetical) return Emotion.NEUTRAL;
  return parentheticalToEmotion(parenthetical);
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
        const nodeId = spiel.nextNodeId++;
        spiel.nodes.push(new SpielNode(nodeId, line,[]));
        lastParenthetical = null;
        break;

      default:
        break;
    }
  }

  spiel.defaultCharacter = findCharacterWithMostLines(spiel.nodes) ?? '';
  return spiel;
}

export function loadSpielFromText(text:string) : Spiel {
  let spiel:Spiel = new Spiel();
  fountain.parse(text, true, (output:any) => {
    spiel = _fountainTokensToSpiel(output.tokens);
  });
  return spiel;
}