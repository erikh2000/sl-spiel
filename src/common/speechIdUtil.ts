import {calcCrc} from "./crcUtil";
import Emotion from "../types/Emotion";
import SpielLine from "../types/SpielLine";
import Spiel from "../types/Spiel";

const SEPARATOR_CHAR = 0;
const SEPARATOR_SIZE = 1;
const EMOTION_SIZE = 1;
const OCCURRENCE_SIZE = 1;
const FIXED_SIZE = EMOTION_SIZE + OCCURRENCE_SIZE + (SEPARATOR_SIZE * 2);

function _generateSpeechIdBytes(emotion:Emotion, dialogueText:string, occurrenceNo:number):Uint8Array {
  const byteCount = FIXED_SIZE + dialogueText.length;
  const bytes = new Uint8Array(byteCount);
  let i = 0;
  bytes[i++] = emotion;
  bytes[i++] = SEPARATOR_CHAR;
  for (let j = 0; j < dialogueText.length; ++j) { bytes[i++] = dialogueText.charCodeAt(j); }
  bytes[i++] = SEPARATOR_CHAR;
  bytes[i++] = occurrenceNo;
  return bytes;
}

function _generateSpeechId(emotion:Emotion, dialogueText:string, occurrenceNo:number):string {
  return calcCrc(_generateSpeechIdBytes(emotion, dialogueText, occurrenceNo));
}

function _findOccurrenceCount(lines:SpielLine[], emotion:Emotion, dialogueText:string):number {
  let occurrenceCount = 0;
  for (const line of lines) {
    for(const lineDialogueText of line.dialogue) {
      if (line.emotion === emotion && lineDialogueText === dialogueText) ++occurrenceCount;
    }
  }
  return occurrenceCount;
}

function _findAllLines(spiel:Spiel):SpielLine[] {
  const lines:SpielLine[] = [];
  for(let node of spiel.nodes) {
    lines.push(node.line);
    for(let reply of node.replies) {
      lines.push(reply.line);
    }
  }
  for(let rootReply of spiel.rootReplies) {
    lines.push(rootReply.line);
  }
  return lines;
}

export function assignSpeechIds(spiel:Spiel) {
  const lines = _findAllLines(spiel);
  const lineCount = lines.length;
  for(let lineI = 0; lineI < lineCount; ++lineI) {
    const line = lines[lineI];
    const dialogueCount = line.dialogue.length;
    for(let dialogueI = 0; dialogueI < dialogueCount; ++dialogueI) {
      const dialogueText = line.dialogue[dialogueI];
      const emotion = line.emotion;
      const occurrenceCount = _findOccurrenceCount(lines, emotion, dialogueText);
      line.speechIds[dialogueI] = _generateSpeechId(emotion, dialogueText, occurrenceCount);
    }
  }
} 