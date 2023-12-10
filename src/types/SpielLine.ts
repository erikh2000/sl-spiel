import Emotion from './Emotion';
import { removeEmptyElements } from '../common/arrayUtil';

export const PLAYER_CHARACTER_NAME = 'PLAYER';

class SpielLine {
  character: string;
  dialogue: string[];
  speechIds: string[];
  emotion: Emotion;
  lastDialogueNo: number;
  
  constructor(character:string, dialogue:string[], emotion:Emotion = Emotion.NEUTRAL) {
    this.character = character;
    this.dialogue = dialogue;
    this.speechIds = [];
    this.emotion = emotion;
    this.lastDialogueNo = 0;
  }
  
  /* If only one dialogue text is present, returns that. Otherwise, returns randomly
     chosen dialogue text that is not the same as last returned. */
  nextDialogue():string {
    if (this.dialogue.length === 1) return this.dialogue[0];
    const randomOffset = Math.floor((Math.random() * (this.dialogue.length - 1))) + 1;
    this.lastDialogueNo = (this.lastDialogueNo + randomOffset) % this.dialogue.length;
    return this.dialogue[this.lastDialogueNo];
  }
}

export function duplicateSpielLine(from:SpielLine):SpielLine {
    const duplicate = new SpielLine(from.character, from.dialogue, from.emotion);
    duplicate.speechIds = from.speechIds;
    duplicate.lastDialogueNo = from.lastDialogueNo;
    return duplicate;
}

export function randomizeSpielLine(line:SpielLine) {
  line.lastDialogueNo = Math.floor(Math.random() * line.dialogue.length);
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