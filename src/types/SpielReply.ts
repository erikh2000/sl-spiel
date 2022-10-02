import SpielLine, {duplicateSpielLine, repairSpielLine} from 'types/SpielLine';
import { removeEmptyElements } from 'common/arrayUtil';

class SpielReply {
  line: SpielLine;
  matchCriteria: string[];
  
  constructor(line:SpielLine, matchCriteria:string[]) {
    this.line = line;
    this.matchCriteria = matchCriteria;
  }
}

export function duplicateSpielReply(from:SpielReply):SpielReply {
  return new SpielReply(
    duplicateSpielLine(from.line),
    [...from.matchCriteria]
  );
}

export function repairSpielReply(reply:SpielReply):boolean {
  let wasChanged = false;
  
  wasChanged = repairSpielLine(reply.line) || wasChanged;
  
  if (reply.matchCriteria === undefined) {
    reply.matchCriteria = [];
    wasChanged = true;
  }
  const repairedMatchCriteria = removeEmptyElements(reply.matchCriteria);
  if (repairedMatchCriteria) {
    reply.matchCriteria = repairedMatchCriteria;
    wasChanged = true;
  }
  
  return wasChanged;
}

export default SpielReply;