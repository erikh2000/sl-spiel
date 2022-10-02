import SpielManager from "../SpielManager";
import Spiel from "types/Spiel";
import SpielLine from "types/SpielLine";
import SpielNode from "types/SpielNode";
import SpielReply from "types/SpielReply";

function _node(nodeId:number, replies:SpielReply[]):SpielNode {
  return new SpielNode(nodeId, new SpielLine('BUBBA', [`${nodeId}`]), replies);
}

function _reply(code:string, criteria:string[]):SpielReply {
  return new SpielReply(new SpielLine('BUBBA', [code]), criteria);
}

function _getCode(reply:SpielReply | null):string | null {
  return reply === null ? null : reply.line.dialogue[0];
}

describe('SpielManager', () => {
  describe('setNode()', () => {
    it('throws when setting to a non-existent node', () => {
      const spielManager = new SpielManager();
      expect(() => spielManager.setNode(1)).toThrow();
    });

    it('sets to a new node', () => {
      const spiel = new Spiel();
      const reply = new SpielReply(new SpielLine('BUBBA', ['Hey!']), ['hi']);
      const node = new SpielNode(1, new SpielLine('BUBBA', ['Hi!']), [reply]);
      spiel.nodes = [node];
      const spielManager = new SpielManager();
      spielManager.loadForSpiel(spiel);
      spielManager.setNode(1);
    });
  });

  describe('checkForMatch()', () => {
    let spiel:Spiel;
    let spielManager:SpielManager;

    beforeEach(() => {
      spiel = new Spiel();
      spiel.nodes = [
        _node(1, [ _reply('a',['ay']) ]),
        _node(2, [ _reply('b', ['bee', 'baby']) ]),
        _node(3, []),
        _node(4, [
          _reply('c', ['see', 'sea', 'sigh']),
          _reply('d', ['dee', 'dead'])
        ])
      ];
      spiel.rootReplies = [
        _reply('x', []),
        _reply('y', ['why', 'yay', 'baby']),
        _reply('z', ['zee'])
      ];
      spielManager = new SpielManager();
      spielManager.loadForSpiel(spiel);
    });

    it('handles no match', () => {
      const reply = spielManager.checkForMatch('garuffalo');
      expect(_getCode(reply)).toEqual(null);
    });

    it('does not match on a node when no node is set', () => {
      const reply = spielManager.checkForMatch('ay');
      expect(_getCode(reply)).toEqual(null);
    });

    it('matches on current node', () => {
      spielManager.setNode(1);
      const reply = spielManager.checkForMatch('ay');
      expect(_getCode(reply)).toEqual('a');
    });

    it('does not match on current node when text does not match it', () => {
      spielManager.setNode(1);
      const reply = spielManager.checkForMatch('bee');
      expect(_getCode(reply)).toEqual(null);
    });

    it('does not match on node with no replies', () => {
      spielManager.setNode(3);
      const reply = spielManager.checkForMatch('bee');
      expect(_getCode(reply)).toEqual(null);
    });

    it('matches on node reply with one criterion', () => {
      spielManager.setNode(1);
      const reply = spielManager.checkForMatch('ay baby');
      expect(_getCode(reply)).toEqual('a');
    });

    it('matches first of two criteria', () => {
      spielManager.setNode(2);
      const reply = spielManager.checkForMatch('bee');
      expect(_getCode(reply)).toEqual('b');
    });

    it('matches second of two criteria', () => {
      spielManager.setNode(2);
      const reply = spielManager.checkForMatch('baby');
      expect(_getCode(reply)).toEqual('b');
    });

    it('matches earlier reply when multiple replies would match', () => {
      spielManager.setNode(4);
      const reply = spielManager.checkForMatch('dead sea');
      expect(_getCode(reply)).toEqual('c');
    });

    it('matches root reply', () => {
      spielManager.setNode(3);
      const reply = spielManager.checkForMatch('why');
      expect(_getCode(reply)).toEqual('y');
    });

    it('matches earlier root reply when multiple replies would match', () => {
      spielManager.setNode(3);
      const reply = spielManager.checkForMatch('zee baby');
      expect(_getCode(reply)).toEqual('y');
    });

    it('matches current node reply before root reply when either would match', () => {
      spielManager.setNode(2);
      const reply = spielManager.checkForMatch('zee baby');
      expect(_getCode(reply)).toEqual('b');
    });
  });

});