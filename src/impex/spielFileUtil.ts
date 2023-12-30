import Emotion from "../types/Emotion";
import Spiel from '../types/Spiel';
import SpielLine from "../types/SpielLine";
import SpielNode from '../types/SpielNode';
import SpielReply from '../types/SpielReply';
import {parse, stringify} from 'yaml';
import {emotionToParenthetical, parentheticalToEmotion} from "./emotionUtil";
import {assignSpeechIds} from "../common/speechIdUtil";

function _emotionToParenthetical(emotion:Emotion):string {
  if (emotion === Emotion.NEUTRAL) return '';
  return `(${emotionToParenthetical(emotion)}) `;
}

function _runtimeRepliesToStorable(replies:SpielReply[]):any {
  return replies.map((reply:SpielReply) => {
    return { [reply.line.character]: 
        `${reply.matchCriteria.join(' / ')} -> ${_emotionToParenthetical(reply.line.emotion)}${reply.line.dialogue.join(' / ')}` };
  });
}

function _isSimpleNode(node:SpielNode) {
  return node.replies.length === 0 && node.postDelay === 0;
}

function _runtimeSimpleNodeToStorable(node:SpielNode) {
  return { [node.line.character]:
      `${_emotionToParenthetical(node.line.emotion)}${node.line.dialogue.join(' / ')}` };
}

function _runtimeComplexNodeToStorable(node:SpielNode) {
  return { 
    [node.line.character]: {
      dialogue: `${_emotionToParenthetical(node.line.emotion)}${node.line.dialogue.join(' / ')}`,
      replies: _runtimeRepliesToStorable(node.replies),
      postDelay: node.postDelay
    }
  };
}

function _runtimeNodesToStorable(nodes:SpielNode[]):any {
  return nodes.map((node:SpielNode) => _isSimpleNode(node)
    ? _runtimeSimpleNodeToStorable(node)
    : _runtimeComplexNodeToStorable(node));
}

function _runtimeToStorable(spiel:Spiel):any {
  return {
    nodes: _runtimeNodesToStorable(spiel.nodes),
    rootReplies: _runtimeRepliesToStorable(spiel.rootReplies),
    defaultCharacter: spiel.defaultCharacter
  };
}

function _isSimpleStorableNode(storableNode:any) {
  const character = _getCharacterFromStorableNodeOrReply(storableNode);
  return !(storableNode[character].dialogue);
}

function _getCharacterFromStorableNodeOrReply(nodeOrReply:any) {
  return Object.keys(nodeOrReply)[0];  
}

type DialogueAndEmotion = {
  dialogue: string[],
  emotion: Emotion
};

function _parseStorableDialogue(storableDialogue:string):DialogueAndEmotion {
  const parentheticalStart = storableDialogue.indexOf('(');
  const parentheticalEnd = storableDialogue.indexOf(')');
  const parenthetical = (parentheticalStart === -1 || parentheticalEnd <= parentheticalStart) 
    ? 'neutral' : storableDialogue.substring(parentheticalStart+1, parentheticalEnd).trim();
  const emotion = parentheticalToEmotion(parenthetical);
  const remainder = storableDialogue.substring(parentheticalEnd+1);
  const dialogue = remainder.split('/').map(line => line.trim());
  return { dialogue, emotion };
}

function _storableSimpleNodeToRuntime(storableNode:any):SpielNode {
  const character = _getCharacterFromStorableNodeOrReply(storableNode);
  const {dialogue, emotion} = _parseStorableDialogue(storableNode[character]);
  return new SpielNode(new SpielLine(character, dialogue, emotion), []);
}

function _storableComplexNodeToRuntime(storableNode:any):SpielNode {
  const character = _getCharacterFromStorableNodeOrReply(storableNode);
  const nodeData = storableNode[character];
  const postDelay = nodeData.postDelay;
  const {dialogue, emotion} = _parseStorableDialogue(nodeData.dialogue);
  const replies = _storableRepliesToRuntime(nodeData.replies);
  return new SpielNode(new SpielLine(character, dialogue, emotion), replies, postDelay);
}

function _storableNodesToRuntime(storableNodes:any):SpielNode[] {
  return storableNodes.map((storableNode:any) => {
    return _isSimpleStorableNode(storableNode) 
      ? _storableSimpleNodeToRuntime(storableNode)
      : _storableComplexNodeToRuntime(storableNode)
  });
}

type MatchCriteriaDialogueAndEmotion = {
  matchCriteria: string[],
  dialogue: string[],
  emotion: Emotion
};

function _parseStorableReply(storableReply:string):MatchCriteriaDialogueAndEmotion {
  const sides = storableReply.split('->').map(side => side.trim());
  const matchCriteria = sides[0].split('/').map(criterion => criterion.trim());
  const { dialogue, emotion } = _parseStorableDialogue(sides[1]);
  return { matchCriteria, dialogue, emotion };
}

function _storableRepliesToRuntime(storableReplies:any):SpielReply[] {
  return storableReplies.map((storableReply:any) => {
    const character = _getCharacterFromStorableNodeOrReply(storableReply);
    const {matchCriteria, dialogue, emotion} = _parseStorableReply(storableReply[character]);
    return new SpielReply(new SpielLine(character, dialogue, emotion), matchCriteria);
  });
}

function _storableToRuntime(storableSpiel:any):Spiel {
  const spiel = new Spiel();
  spiel.nodes = _storableNodesToRuntime(storableSpiel.nodes);
  spiel.rootReplies = _storableRepliesToRuntime(storableSpiel.rootReplies);
  spiel.defaultCharacter = storableSpiel.defaultCharacter;
  assignSpeechIds(spiel);
  spiel.randomize(); // By randomizing, allows the nextDialogue() method to sometimes choose a first dialogue text after the spiel is loaded.
  return spiel;
}

export function exportSpielFile(spiel:Spiel):string {
  const storableSpiel = _runtimeToStorable(spiel);
  return stringify(storableSpiel);
}

export function importSpielFile(text:string):Spiel {
  const storableSpiel = parse(text);
  return _storableToRuntime(storableSpiel);
}