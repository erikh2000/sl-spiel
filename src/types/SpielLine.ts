import Emotion from 'types/Emotion';
import { removeEmptyElements } from 'common/arrayUtil';

class SpielLine {
  character: string;
  dialogue: string[];
  emotion: Emotion;
  
  constructor(character:string, dialogue:string[], emotion:Emotion = Emotion.NEUTRAL) {
    this.character = character;
    this.dialogue = dialogue;
    this.emotion = emotion;
  }
}

export function duplicateSpielLine(from:SpielLine):SpielLine {
    return new SpielLine(from.character, from.dialogue, from.emotion);
}

export function repairSpielLine(line:SpielLine):boolean {
  let wasChanged = false;
  
  if (line.character === undefined) {
    line.character = '';
    wasChanged = true;
  }
  if (line.dialogue === undefined || line.dialogue.length === 0) {
    line.dialogue = [''];
    wasChanged = true;
  }
  const repairedDialogue = removeEmptyElements(line.dialogue);
  if (repairedDialogue) {
    line.dialogue = repairedDialogue;
    wasChanged = true;
  }
  if (line.emotion === undefined) {
    line.emotion = Emotion.NEUTRAL;
    wasChanged = true;
  }
  
  return wasChanged;
}

export default SpielLine;