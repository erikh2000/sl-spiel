import {findCharacterWithMostLines} from "../analysis/findUtil";
import {removeEmptyElements} from "../common/arrayUtil";
import {splitText} from "../common/textFormatUtil";
import Emotion from './Emotion';
import MatchManager from "../traversal/MatchManager";
import SpielNode, {duplicateSpielNode, repairSpielNode} from './SpielNode';
import SpielReply, {duplicateSpielReply, repairSpielReply} from './SpielReply';
import SpielLine from "./SpielLine";
import {assignSpeechIds} from "../common/speechIdUtil";

function _duplicateSpiel(from:Spiel):Spiel {
    const spiel = new Spiel();
    spiel.nodes = from.nodes.map(node => duplicateSpielNode(node));
    spiel.rootReplies = from.rootReplies.map(reply => duplicateSpielReply(reply));
    spiel.defaultCharacter = from.defaultCharacter;
    spiel.currentNodeIndex = from.currentNodeIndex;
    return spiel;
}

function _createReply(matchCriteria:string|string[], dialogue:string|string[], character:string, emotion:Emotion):SpielReply {
    if (typeof dialogue === 'string') dialogue = splitText(dialogue);
    if (typeof matchCriteria === 'string') matchCriteria = splitText(matchCriteria);
    const replyLine = new SpielLine(character, dialogue, emotion);
    return new SpielReply(replyLine, matchCriteria);
}

function _repairCurrentNodeIndex(spiel:Spiel):boolean {
    if (spiel.currentNodeIndex < 0) {
        spiel.currentNodeIndex = 0;
        return true;
    }
    if (spiel.currentNodeIndex !== 0 && spiel.currentNodeIndex >= spiel.nodes.length) {
        spiel.currentNodeIndex = spiel.nodes.length ? spiel.nodes.length-1 : 0;
        return true;
    }
    return false;
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
    wasChanged = _repairCurrentNodeIndex(spiel) || wasChanged;
    if (wasChanged) spiel.matchManager = null;
    assignSpeechIds(spiel);
    return wasChanged;
}

const DIALOGUE_PLACEHOLDER = [''];

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
    
    // Clear matching rules to cause a lazy refresh later.
    refreshMatching() {
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
    
    movePreviousLooped() {
        if (this.hasPrevious) {
            --this.currentNodeIndex;
        } else {
            this.moveLast();
        }
    }

    get hasNext() {
        return (this.currentNodeIndex < this.nodes.length-1 && this.nodes.length > 0);
    }
    
    moveNext() {
        if (!this.hasNext) return;
        ++this.currentNodeIndex;
    }
    
    moveNextLooped() {
        if (this.hasNext) {
            ++this.currentNodeIndex;
        } else {
            this.moveFirst();
        }
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
        if (!this.nodes.length && !this.rootReplies.length) return null;
        if (!this.matchManager) this.matchManager = new MatchManager(this);
        if (this.nodes.length) this.matchManager.setNode(this.currentNodeIndex);
        return this.matchManager.checkForMatch(text);
    }
    
    createNode(character?:string, emotion?:Emotion, dialogue?:string|string[]) {
        if (character) {
            if (this.defaultCharacter === '') this.defaultCharacter = character;
        } else {
            character = this.defaultCharacter;
        }
        if (!emotion) emotion = Emotion.NEUTRAL;
        if (!dialogue) dialogue = DIALOGUE_PLACEHOLDER;
        if (typeof dialogue === 'string') dialogue = splitText(dialogue);
        const node = new SpielNode(new SpielLine(character, dialogue, emotion), []);
        if (this.currentNodeIndex < this.nodes.length - 1) {
            this.nodes.splice(this.currentNodeIndex+1, 0, node);
            this.moveNext();
        } else {
            this.nodes.push(node);
            this.moveLast();
        }
        assignSpeechIds(this);
        this.refreshMatching();
    }
    
    moveNode(nodeIndex:number, newIndex:number) {
        if (nodeIndex < 0 || nodeIndex >= this.nodes.length) throw Error('Invalid node index');
        if (newIndex < 0 || newIndex >= this.nodes.length) throw Error('Invalid new index');
        const node = this.nodes[nodeIndex];
        this.nodes.splice(nodeIndex, 1);
        this.nodes.splice(newIndex, 0, node);
    }
    
    addDialogue(dialogue:string|string[]) {
        const node = this.currentNode;
        if (!node) throw Error('No current node');
        if (typeof dialogue === 'string') dialogue = splitText(dialogue);
        node.line.dialogue = (node.line.dialogue === DIALOGUE_PLACEHOLDER) ?
          dialogue : node.line.dialogue.concat(dialogue);
        assignSpeechIds(this);
    }
    
    updateDialogue(dialogue:string|string[]) {
        const node = this.currentNode;
        if (!node) throw Error('No current node');
        if (typeof dialogue === 'string') dialogue = splitText(dialogue);
        node.line.dialogue = dialogue;
        assignSpeechIds(this);
    }
    
    addReply(matchCriteria:string|string[], dialogue:string|string[], character?:string, emotion?:Emotion) {
        const node = this.currentNode;
        if (!node) throw Error('No current node');
        if (!character) character = node.line.character;
        if (!emotion) emotion = node.line.emotion;
        const reply = _createReply(matchCriteria, dialogue, character, emotion);
        node.replies.push(reply);
        assignSpeechIds(this);
        this.refreshMatching();
    }
    
    updateReply(replyIndex:number, matchCriteria:string|string[], dialogue:string|string[], character?:string, emotion?:Emotion) {
        const node = this.currentNode;
        if (!node) throw Error('No current node');
        if (replyIndex < 0 || replyIndex >= node.replies.length) throw Error('index OOB');
        if (!character) character = node.line.character;
        if (!emotion) emotion = node.line.emotion;
        node.replies[replyIndex] = _createReply(matchCriteria, dialogue, character, emotion);
        assignSpeechIds(this);
        this.refreshMatching();
    }
    
    removeReply(removeIndex:number) {
        const node = this.currentNode;
        if (!node) throw Error('No current node');
        if (removeIndex < 0 || removeIndex >= node.replies.length) throw Error('index OOB');
        node.replies = node.replies.filter((reply, replyIndex) => replyIndex != removeIndex);
        this.refreshMatching();
    }
    
    removeAllReplies() {
        const node = this.currentNode;
        if (!node) throw Error('No current node');
        node.replies = [];
        this.refreshMatching();
    }
    
    addRootReply(matchCriteria:string|string[], dialogue:string|string[], character?:string, emotion?:Emotion) {
        if (!character) character = this.defaultCharacter;
        if (!emotion) emotion = Emotion.NEUTRAL;
        const reply = _createReply(matchCriteria, dialogue, character, emotion);
        this.rootReplies.push(reply);
        assignSpeechIds(this);
        this.refreshMatching();
    }

    updateRootReply(replyIndex:number, matchCriteria:string|string[], dialogue:string|string[], character?:string, emotion?:Emotion) {
        if (replyIndex < 0 || replyIndex >= this.rootReplies.length) throw Error('index OOB');
        if (!character) character = this.defaultCharacter;
        if (!emotion) emotion = Emotion.NEUTRAL;
        this.rootReplies[replyIndex] = _createReply(matchCriteria, dialogue, character, emotion);
        assignSpeechIds(this);
        this.refreshMatching();
    }
    
    removeRootReply(removeIndex:number) {
        if (removeIndex < 0 || removeIndex >= this.rootReplies.length) throw Error('index OOB');
        this.rootReplies = this.rootReplies.filter((reply, replyIndex) => replyIndex != removeIndex);
        this.refreshMatching();
    }

    removeAllRootReplies() {
        this.rootReplies = [];
        this.refreshMatching();
    }
    
    removeNode(removeIndex:number) {
        if (removeIndex < 0 || removeIndex >= this.nodes.length) throw Error('index OOB');
        this.nodes = this.nodes.filter((node, nodeIndex) => removeIndex !== nodeIndex);
        _repairCurrentNodeIndex(this);
        this.refreshMatching();
    }

    removeCurrentNode() {
        if (!this.nodes.length) throw Error('No current node');
        this.removeNode(this.currentNodeIndex);
        _repairCurrentNodeIndex(this);
        this.refreshMatching();
    }
}

export default Spiel;