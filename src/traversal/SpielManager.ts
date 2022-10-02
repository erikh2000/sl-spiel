import Spiel from "types/Spiel";
import SpielReply from "types/SpielReply";
import {
  createMatchRulesetFromCriterion,
  createWordPositionMap,
  IMatchRuleset,
  matchesRulesetInWordPositionMap,
  WordPositionMap
} from "traversal/matchUtil";

interface IMatcher {
  ruleset:IMatchRuleset,
  reply:SpielReply
}

export type NodeMatchersMap = {
  [id: number]: IMatcher[];
}

function _findMatch(wordPositionMap:WordPositionMap, matchers:IMatcher[]):SpielReply | null {
  for(let i = 0; i < matchers.length; ++i) {
    const matcher = matchers[i];
    if (matchesRulesetInWordPositionMap(matcher.ruleset, wordPositionMap)) {
      return matcher.reply;
    }
  }
  return null;
}

function _createMatchersForReplies(replies:SpielReply[]) {
  const matchers:IMatcher[] = [];
  replies.forEach(reply => {
    reply.matchCriteria.forEach(criterion => {
      matchers.push({
        ruleset:createMatchRulesetFromCriterion(criterion),
        reply
      })
    });
  });
  return matchers;
}

function _createNodeMatchers(spiel:Spiel):NodeMatchersMap {
  const map:NodeMatchersMap = {};
  spiel.nodes.forEach(node => {
    map[node.id] = _createMatchersForReplies(node.replies);
  })
  return map;
}

function _createRootMatchers(spiel:Spiel):IMatcher[] {
  return _createMatchersForReplies(spiel.rootReplies);
}

class SpielManager {
  rootMatchers:IMatcher[];
  nodeMatchers:NodeMatchersMap;
  currentNodeMatchers:IMatcher[];
  emptyMatchers:IMatcher[];

  constructor() {
    this.rootMatchers = [];
    this.nodeMatchers = {};
    this.currentNodeMatchers = this.emptyMatchers = [];
  }

  loadForSpiel(spiel:Spiel) {
    this.rootMatchers = _createRootMatchers(spiel);
    this.nodeMatchers = _createNodeMatchers(spiel);
  }

  setNode(nodeId:number) {
    const matchers = this.nodeMatchers[nodeId];
    if (!matchers) throw Error(`Node ID ${nodeId} doesn't exist.`);
    this.currentNodeMatchers = matchers;
  }

  checkForMatch(text:string):SpielReply | null {
    const wordPositionMap = createWordPositionMap(text);
    return  _findMatch(wordPositionMap, this.currentNodeMatchers) ||
      _findMatch(wordPositionMap, this.rootMatchers) || null;
  }
}

export default SpielManager;