import SpielLine from "types/SpielLine";

export function getRandomLineDialogue(line:SpielLine):string {
  const dialogueCount = line.dialogue.length;
  return dialogueCount === 0 ? '' : line.dialogue[Math.floor((Math.random() * dialogueCount))];
}