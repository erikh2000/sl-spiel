import MatchManager from "../MatchManager";
import Spiel from "types/Spiel";
import SpielLine from "types/SpielLine";
import SpielNode from "types/SpielNode";
import SpielReply from "types/SpielReply";

function _node(nodeIndex:number, replies:SpielReply[]):SpielNode {
  return new SpielNode(new SpielLine('BUBBA', [`${nodeIndex}`]), replies);
}

function _reply(code:string, criteria:string[]):SpielReply {
  return new SpielReply(new SpielLine('BUBBA', [code]), criteria);
}

function _getCode(reply:SpielReply | null):string | null {
  return reply === null ? null : reply.line.dialogue[0];
}

describe('MatchManager', () => {
  describe('setNode()', () => {
    it('throws when setting to a non-existent node', () => {
      const matchManager = new MatchManager();
      expect(() => matchManager.setNode(1)).toThrow();
    });

    it('sets to a new node', () => {
      const spiel = new Spiel();
      const reply = new SpielReply(new SpielLine('BUBBA', ['Hey!']), ['hi']);
      const node = new SpielNode(new SpielLine('BUBBA', ['Hi!']), [reply]);
      spiel.nodes = [node];
      const matchManager = new MatchManager();
      matchManager.loadForSpiel(spiel);
      matchManager.setNode(0);
    });
  });

  describe('checkForMatch()', () => {
    let spiel:Spiel;
    let matchManager:MatchManager;

    beforeEach(() => {
      spiel = new Spiel();
      spiel.nodes = [
        _node(0, [ _reply('a',['ay']) ]),
        _node(1, [ _reply('b', ['bee', 'baby']) ]),
        _node(2, []),
        _node(3, [
          _reply('c', ['see', 'sea', 'sigh']),
          _reply('d', ['dee', 'dead'])
        ])
      ];
      spiel.rootReplies = [
        _reply('x', []),
        _reply('y', ['why', 'yay', 'baby']),
        _reply('z', ['zee'])
      ];
      matchManager = new MatchManager();
      matchManager.loadForSpiel(spiel);
    });

    it('handles no match', () => {
      const reply = matchManager.checkForMatch('garuffalo');
      expect(_getCode(reply)).toEqual(null);
    });

    it('does not match on a node when no node is set', () => {
      const reply = matchManager.checkForMatch('ay');
      expect(_getCode(reply)).toEqual(null);
    });

    it('matches on current node', () => {
      matchManager.setNode(0);
      const reply = matchManager.checkForMatch('ay');
      expect(_getCode(reply)).toEqual('a');
    });

    it('does not match on current node when text does not match it', () => {
      matchManager.setNode(0);
      const reply = matchManager.checkForMatch('bee');
      expect(_getCode(reply)).toEqual(null);
    });

    it('does not match on node with no replies', () => {
      matchManager.setNode(2);
      const reply = matchManager.checkForMatch('bee');
      expect(_getCode(reply)).toEqual(null);
    });

    it('matches on node reply with one criterion', () => {
      matchManager.setNode(0);
      const reply = matchManager.checkForMatch('ay baby');
      expect(_getCode(reply)).toEqual('a');
    });

    it('matches first of two criteria', () => {
      matchManager.setNode(1);
      const reply = matchManager.checkForMatch('bee');
      expect(_getCode(reply)).toEqual('b');
    });

    it('matches second of two criteria', () => {
      matchManager.setNode(1);
      const reply = matchManager.checkForMatch('baby');
      expect(_getCode(reply)).toEqual('b');
    });

    it('matches earlier reply when multiple replies would match', () => {
      matchManager.setNode(3);
      const reply = matchManager.checkForMatch('dead sea');
      expect(_getCode(reply)).toEqual('c');
    });

    it('matches root reply', () => {
      matchManager.setNode(2);
      const reply = matchManager.checkForMatch('why');
      expect(_getCode(reply)).toEqual('y');
    });

    it('matches earlier root reply when multiple replies would match', () => {
      matchManager.setNode(2);
      const reply = matchManager.checkForMatch('zee baby');
      expect(_getCode(reply)).toEqual('y');
    });

    it('matches current node reply before root reply when either would match', () => {
      matchManager.setNode(1);
      const reply = matchManager.checkForMatch('zee baby');
      expect(_getCode(reply)).toEqual('b');
    });
  });

});