import SpielLine, {duplicateSpielLine, randomizeSpielLine, repairSpielLine} from "./SpielLine";
import SpielReply, {duplicateSpielReply, randomizeSpielReply, repairSpielReply} from "./SpielReply";
import {removeEmptyElements} from "../common/arrayUtil";

class SpielNode {
  line:SpielLine;
  replies:SpielReply[];
  postDelay: number; // Measured in beats, where one beat is the typical delay after a completed sentence. Conversation speed (controlled by user) scales the time of one beat.
  
  constructor(line:SpielLine, replies:SpielReply[], postDelay:number = 0) {
    this.line = line;
    this.replies = replies;
    this.postDelay = postDelay;
  }
  
  nextDialogue():string {
    return this.line.nextDialogue();
  }
}

export function randomizeSpielNode(node:SpielNode) {
  randomizeSpielLine(node.line);
  for(let replyI = 0; replyI < node.replies.length; ++replyI) {
    const reply = node.replies[replyI];
    randomizeSpielReply(reply);
  }
}

export function duplicateSpielNode(from:SpielNode) {
  return new SpielNode(
    duplicateSpielLine(from.line),
    from.replies.map((reply:SpielReply) => duplicateSpielReply(reply)),
    from.postDelay
  );
}

export function repairSpielNode(node:SpielNode):boolean {
  let wasChanged = false;
  
  if (node.line === undefined) {
    node.line = new SpielLine('', ['']);
    wasChanged = true;
  } else {
    wasChanged = repairSpielLine(node.line) || wasChanged;
  }
  
  if (node.postDelay === undefined) {
    node.postDelay = 0;
    wasChanged = true;
  }

  const repairedReplies = removeEmptyElements(node.replies);
  if (repairedReplies) {
    node.replies = repairedReplies;
    wasChanged = true;
  }
  node.replies.forEach(reply => { wasChanged = repairSpielReply(reply) || wasChanged; });
  
  return wasChanged;
}

export default SpielNode;