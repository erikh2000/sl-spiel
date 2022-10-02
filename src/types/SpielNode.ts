import SpielLine, {duplicateSpielLine, repairSpielLine} from "types/SpielLine";
import SpielReply, {duplicateSpielReply, repairSpielReply} from "types/SpielReply";
import {removeEmptyElements} from "common/arrayUtil";

export const INVALID_ID_MARKER = -1;

class SpielNode {
  id:number;
  line:SpielLine;
  replies:SpielReply[];
  
  constructor(id:number, line:SpielLine, replies:SpielReply[]) {
    this.line = line;
    this.replies = replies;
    this.id = id;
  }
}

export function duplicateSpielNode(from:SpielNode) {
  return new SpielNode(
    from.id,
    duplicateSpielLine(from.line),
    from.replies.map((reply:SpielReply) => duplicateSpielReply(reply))
  );
}

export function repairSpielNode(node:SpielNode):boolean {
  let wasChanged = false;
  
  if (node.id === undefined) {
    node.id = INVALID_ID_MARKER; // Signals a problem to calling code. Can't assign a valid ID here without knowing other IDs assigned.
    wasChanged = true;
  }
  if (node.line === undefined) {
    node.line = new SpielLine('', []);
    wasChanged = true;
  } else {
    wasChanged = repairSpielLine(node.line) || wasChanged;
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