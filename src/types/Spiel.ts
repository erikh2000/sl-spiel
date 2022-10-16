import {removeEmptyElements} from "common/arrayUtil";
import SpielNode, {duplicateSpielNode, repairSpielNode} from 'types/SpielNode';
import SpielReply, {duplicateSpielReply, repairSpielReply} from 'types/SpielReply';
import { findCharacterWithMostLines } from "analysis/findUtil";
import MatchManager from "../traversal/MatchManager";

function _duplicateSpiel(from:Spiel):Spiel {
    const spiel = new Spiel();
    spiel.nodes = from.nodes.map(node => duplicateSpielNode(node));
    spiel.rootReplies = from.rootReplies.map(reply => duplicateSpielReply(reply));
    spiel.defaultCharacter = from.defaultCharacter;
    spiel.currentNodeIndex = from.currentNodeIndex;
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
    if (spiel.defaultCharacter === undefined) {
        spiel.defaultCharacter = findCharacterWithMostLines(spiel.nodes) || '';
        wasChanged = true;
    }
    if (spiel.currentNodeIndex < 0) {
        spiel.currentNodeIndex = 0;
        wasChanged = true;
    } else if (spiel.currentNodeIndex !== 0 && spiel.currentNodeIndex >= spiel.nodes.length) {
        spiel.currentNodeIndex = spiel.nodes.length ? spiel.nodes.length-1 : 0;
        wasChanged = true;
    }
    if (wasChanged) spiel.matchManager = null;
    return wasChanged;
}

class Spiel {
    nodes:SpielNode[];
    rootReplies:SpielReply[];
    defaultCharacter:string;
    currentNodeIndex:number;
    matchManager:MatchManager|null;
    
    constructor() {
        this.nodes = [];
        this.rootReplies = [];
        this.defaultCharacter = '';
        this.currentNodeIndex = 0;
        this.matchManager = null;
    }
    
    get currentNode():SpielNode | null {
        return this.currentNodeIndex >= this.nodes.length ? null : this.nodes[this.currentNodeIndex]; 
    }
    
    moveFirst() {
        this.currentNodeIndex = 0;
    }
    
    get hasPrevious() {
        return this.currentNodeIndex > 0 && this.nodes.length > 0;
    }

    movePrevious() {
        if (!this.hasPrevious) return;
        --this.currentNodeIndex;
    }

    get hasNext() {
        return (this.currentNodeIndex < this.nodes.length-1 && this.nodes.length > 0);
    }
    
    moveNext() {
        if (!this.hasNext) return;
        ++this.currentNodeIndex;
    }

    moveLast() {
        this.currentNodeIndex = this.nodes.length === 0 ? 0 : this.nodes.length - 1;
    }

    moveTo(nodeIndex:number) {
        this.currentNodeIndex = nodeIndex < 0 || nodeIndex >= this.nodes.length ?
          0 : nodeIndex;
    }
    
    duplicate():Spiel {
        return _duplicateSpiel(this);
    }
    
    checkForMatch(text:string):SpielReply | null {
        if (!this.nodes.length) return null;
        if (!this.matchManager) this.matchManager = new MatchManager(this);
        this.matchManager.setNode(this.currentNodeIndex);
        return this.matchManager.checkForMatch(text);
    }
    
    addNode(node:SpielNode) {
        this.matchManager = null;
        this.nodes.push(node);
    }
    
    addNodes(nodes:SpielNode[]) {
        if (!nodes.length) return;
        this.matchManager = null;
        this.nodes = this.nodes.concat(nodes);
    }
}

export default Spiel;