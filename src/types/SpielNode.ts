import SpielLine, {duplicateSpielLine, repairSpielLine} from "types/SpielLine";
import SpielReply, {duplicateSpielReply, repairSpielReply} from "types/SpielReply";
import {removeEmptyElements} from "common/arrayUtil";

class SpielNode {
  line:SpielLine;
  replies:SpielReply[];
  
  constructor(line:SpielLine, replies:SpielReply[]) {
    this.line = line;
    this.replies = replies;
  }
}

export function duplicateSpielNode(from:SpielNode) {
  return new SpielNode(
    duplicateSpielLine(from.line),
    from.replies.map((reply:SpielReply) => duplicateSpielReply(reply))
  );
}

export function repairSpielNode(node:SpielNode):boolean {
  let wasChanged = false;
  
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