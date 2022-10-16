import Spiel, {repairSpiel} from '../Spiel';
import Emotion from 'types/Emotion';
import SpielNode from 'types/SpielNode';
import SpielReply from 'types/SpielReply';
import SpielLine from 'types/SpielLine';

function _node(nodeIndex:number, replies:SpielReply[]):SpielNode {
  return new SpielNode(new SpielLine('BUBBA', [`${nodeIndex}`]), replies);
}

function _reply(code:string, criteria:string[]):SpielReply {
  return new SpielReply(new SpielLine('BUBBA', [code]), criteria);
}

function _getCode(reply:SpielReply | null):string | null {
  return reply === null ? null : reply.line.dialogue[0];
}

describe('Spiel', () => {
  describe('duplicate()', () => {
    it('duplicates a spiel', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const node = new SpielNode(line, [reply]);
      const original = new Spiel();
      original.addNode(node);
      original.rootReplies = [reply];
      const duplicate = original.duplicate();
      expect(duplicate).toEqual(original);
    });
  });
  
  describe('repairSpiel()', () => {
    it('returns false if no repair needed', () => {
      const spiel = new Spiel();
      expect(repairSpiel(spiel)).toBeFalsy();
    });

    it('does not change spiel if no repair needed', () => {
      const spiel = new Spiel();
      spiel.addNode(new SpielNode(new SpielLine('',['']), []));
      const expected = spiel.duplicate();
      repairSpiel(spiel);
      expect(spiel).toEqual(expected);
    });

    it('fixes invalid node', () => {
      const spiel = new Spiel();
      const invalidNode = {} as SpielNode;
      const fixedNode = new SpielNode(new SpielLine('',[]), []);
      spiel.addNode(invalidNode);
      const expected = new Spiel();
      expected.addNode(fixedNode);
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel).toEqual(expected);
    });

    it('fixes missing node array', () => {
      const spiel = new Spiel();
      const missingNodeArray = 'garbage' as unknown;
      spiel.nodes = missingNodeArray as SpielNode[];
      const expected = new Spiel();
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel).toEqual(expected);
    });
    
    it('fixes node array with empty element', () => {
      const spiel = new Spiel();
      const missingElement = null as unknown;
      spiel.addNode(missingElement as SpielNode);
      const expected = new Spiel();
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel).toEqual(expected);
    });
    
    it('fixes invalid root reply', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY)
      const invalidReply = { line } as SpielReply;
      const spiel = new Spiel();
      spiel.rootReplies = [invalidReply];
      const expected = new Spiel();
      expected.rootReplies = [{ line, matchCriteria:[] }];
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel).toEqual(expected);
    });

    it('fixes root reply array with empty element', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY)
      const reply = { line, matchCriteria:[] } as SpielReply;
      const spiel = new Spiel();
      const empty = undefined as unknown;
      const emptyReply = empty as SpielReply;
      spiel.rootReplies = [reply, emptyReply];
      const expected = new Spiel();
      expected.rootReplies = [reply];
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel).toEqual(expected);
    });
    
    it('fixes missing default character', () => {
      const spiel = new Spiel();
      const empty = undefined as unknown;
      spiel.defaultCharacter = empty as string;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.defaultCharacter).toEqual('');
    });
    
    it('fixes node index that is under-bounds in empty spiel', () => {
      const spiel = new Spiel();
      spiel.currentNodeIndex = -1;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.currentNodeIndex).toEqual(0);
    });

    it('fixes node index that is over-bounds in empty spiel', () => {
      const spiel = new Spiel();
      spiel.currentNodeIndex = 1;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.currentNodeIndex).toEqual(0);
    });

    it('fixes node index that is under-bounds in populated spiel', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.currentNodeIndex = -1;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.currentNodeIndex).toEqual(0);
    });

    it('fixes node index that is over-bounds in populated spiel', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.currentNodeIndex = 3;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.currentNodeIndex).toEqual(2);
    });
  });

  describe('checkForMatch()', () => {
    let spiel:Spiel;

    beforeEach(() => {
      spiel = new Spiel();
      spiel.addNodes([
        _node(0, [ _reply('a',['ay']) ]),
        _node(1, [ _reply('b', ['bee', 'baby']) ]),
        _node(2, []),
        _node(3, [
          _reply('c', ['see', 'sea', 'sigh']),
          _reply('d', ['dee', 'dead'])
        ])
      ]);
      spiel.rootReplies = [
        _reply('x', []),
        _reply('y', ['why', 'yay', 'baby']),
        _reply('z', ['zee'])
      ];
    });

    it('handles no match', () => {
      const reply = spiel.checkForMatch('garuffalo');
      expect(_getCode(reply)).toEqual(null);
    });

    it('does not match on a node when spiel has none', () => {
      spiel = new Spiel();
      const reply = spiel.checkForMatch('ay');
      expect(_getCode(reply)).toEqual(null);
    });

    it('matches on current node', () => {
      const reply = spiel.checkForMatch('ay');
      expect(_getCode(reply)).toEqual('a');
    });

    it('does not match on current node when text does not match it', () => {
      const reply = spiel.checkForMatch('bee');
      expect(_getCode(reply)).toEqual(null);
    });

    it('does not match on node with no replies', () => {
      spiel.moveTo(2);
      const reply = spiel.checkForMatch('bee');
      expect(_getCode(reply)).toEqual(null);
    });

    it('matches on node reply with one criterion', () => {
      spiel.moveTo(0);
      const reply = spiel.checkForMatch('ay baby');
      expect(_getCode(reply)).toEqual('a');
    });

    it('matches first of two criteria', () => {
      spiel.moveTo(1);
      const reply = spiel.checkForMatch('bee');
      expect(_getCode(reply)).toEqual('b');
    });

    it('matches second of two criteria', () => {
      spiel.moveTo(1);
      const reply = spiel.checkForMatch('baby');
      expect(_getCode(reply)).toEqual('b');
    });

    it('matches earlier reply when multiple replies would match', () => {
      spiel.moveTo(3);
      const reply = spiel.checkForMatch('dead sea');
      expect(_getCode(reply)).toEqual('c');
    });

    it('matches root reply', () => {
      spiel.moveTo(2);
      const reply = spiel.checkForMatch('why');
      expect(_getCode(reply)).toEqual('y');
    });

    it('matches earlier root reply when multiple replies would match', () => {
      spiel.moveTo(2);
      const reply = spiel.checkForMatch('zee baby');
      expect(_getCode(reply)).toEqual('y');
    });

    it('matches current node reply before root reply when either would match', () => {
      spiel.moveTo(1);
      const reply = spiel.checkForMatch('zee baby');
      expect(_getCode(reply)).toEqual('b');
    });

    it('matches the same when called twice', () => {
      spiel.moveTo(1);
      spiel.checkForMatch('zee baby');
      const reply = spiel.checkForMatch('zee baby');
      expect(_getCode(reply)).toEqual('b');
    });
    
    it('matches for a newly added node', () => {
      spiel.addNode(_node(4, [
        _reply('e', ['go', 'goo', 'gosh'])
      ]));
      spiel.moveLast();
      const reply = spiel.checkForMatch('goo');
      expect(_getCode(reply)).toEqual('e');
    });
  });
  
  describe('movement', () => {
    it('returns null node for empty spiel', () => {
      const spiel = new Spiel();
      expect(spiel.currentNode).toBeNull();
    });

    it('returns null node for empty spiel after moving to first', () => {
      const spiel = new Spiel();
      spiel.moveFirst();
      expect(spiel.currentNode).toBeNull();
    });

    it('returns null node for empty spiel after moving to last', () => {
      const spiel = new Spiel();
      spiel.moveLast();
      expect(spiel.currentNode).toBeNull();
    });

    it('returns null node for empty spiel after moving to next node', () => {
      const spiel = new Spiel();
      spiel.moveNext();
      expect(spiel.currentNode).toBeNull();
    });

    it('returns null node for empty spiel after moving to previous node', () => {
      const spiel = new Spiel();
      spiel.movePrevious();
      expect(spiel.currentNode).toBeNull();
    });

    it('returns null node for empty spiel after moving to a node by index', () => {
      const spiel = new Spiel();
      spiel.moveTo(3);
      expect(spiel.currentNode).toBeNull();
    });
    
    it('returns first node for spiel with one node', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, [])];
      spiel.addNodes(nodes);
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
    });

    it('returns first node for spiel with multiple nodes', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, [])];
      spiel.addNodes(nodes);
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
    });

    it('returns last node after moving to it', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveLast();
      expect(spiel.currentNode?.line.dialogue).toEqual(['2']);
    });

    it('returns first node after moving to it', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveLast();
      spiel.moveFirst();
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
    });

    it('returns next node after moving to it', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveNext();
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });

    it('returns previous node after moving to it', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveLast();
      spiel.movePrevious();
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });

    it('returns first node after attempting to move to previous node from first', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.movePrevious();
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
    });

    it('returns last node after attempting to move to next node from last', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveLast();
      spiel.moveNext();
      expect(spiel.currentNode?.line.dialogue).toEqual(['2']);
    });

    it('returns node after moving to it by index', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveTo(1);
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });

    it('hasPrevious is false when spiel is empty', () => {
      const spiel = new Spiel();
      expect(spiel.hasPrevious).toBeFalsy();
    });

    it('hasPrevious is false when at first node', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      expect(spiel.hasPrevious).toBeFalsy();
    });

    it('hasPrevious is true when at second node', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveNext();
      expect(spiel.hasPrevious).toBeTruthy();
    });

    it('hasNext is false when spiel is empty', () => {
      const spiel = new Spiel();
      expect(spiel.hasNext).toBeFalsy();
    });

    it('hasNext is false when at last node', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      spiel.moveLast();
      expect(spiel.hasNext).toBeFalsy();
    });

    it('hasNext is true when nodes are after the current', () => {
      const spiel = new Spiel();
      const nodes = [_node(0, []), _node(1, []), _node(2, [])];
      spiel.addNodes(nodes);
      expect(spiel.hasNext).toBeTruthy();
    });
  });
});