import {removeEmptyElements} from "common/arrayUtil";
import SpielNode, {duplicateSpielNode, repairSpielNode} from 'types/SpielNode';
import SpielReply, {duplicateSpielReply, repairSpielReply} from 'types/SpielReply';
import { doNodesContainInvalidIds, findCharacterWithMostLines, findHighestNodeId } from "analysis/findUtil";
import { reassignNodeIds } from "traversal/nodeOperationUtil";

class Spiel {
    nodes:SpielNode[];
    rootReplies:SpielReply[];
    nextNodeId:number;
    defaultCharacter:string;
    
    constructor() {
        this.nodes = [];
        this.rootReplies = [];
        this.nextNodeId = 1;
        this.defaultCharacter = '';
    }
}

export function duplicateSpiel(from:Spiel):Spiel {
    const spiel = new Spiel();
    spiel.nodes = from.nodes.map(node => duplicateSpielNode(node));
    spiel.rootReplies = from.rootReplies.map(reply => duplicateSpielReply(reply));
    spiel.nextNodeId = from.nextNodeId;
    spiel.defaultCharacter = from.defaultCharacter;
    return spiel;
}

export function repairSpiel(spiel:Spiel):boolean {
    let wasChanged = false;
    const repairedNodes = removeEmptyElements(spiel.nodes);
    if (repairedNodes) {
        spiel.nodes = repairedNodes;
        wasChanged = true;
    }
    spiel.nodes.forEach(node => {
        wasChanged = repairSpielNode(node) || wasChanged;
    });
    const repairedRootReplies = removeEmptyElements(spiel.rootReplies);
    if (repairedRootReplies) {
        spiel.rootReplies = repairedRootReplies;
        wasChanged = true;
    }
    spiel.rootReplies.forEach(rootReply => {
        wasChanged = repairSpielReply(rootReply) || wasChanged;
    });
    if (doNodesContainInvalidIds(spiel.nodes)) {
        reassignNodeIds(spiel); // If you ever start using node IDs as foreign keys, this won't work.
        wasChanged = true;
    }
    const highestNodeId = findHighestNodeId(spiel.nodes);
    if (spiel.nextNodeId === undefined || (highestNodeId !== -1 && highestNodeId >= spiel.nextNodeId)) {
        spiel.nextNodeId = highestNodeId+1;
        wasChanged = true;
    }
    if (spiel.defaultCharacter === undefined) {
        spiel.defaultCharacter = findCharacterWithMostLines(spiel.nodes) || '';
        wasChanged = true;
    }  
    return wasChanged;
}

export default Spiel;