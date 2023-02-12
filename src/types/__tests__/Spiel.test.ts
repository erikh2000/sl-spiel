import Spiel, {repairSpiel} from '../Spiel';
import Emotion from '../Emotion';
import SpielNode from '../SpielNode';
import SpielReply from '../SpielReply';

function _getCode(reply:SpielReply | null):string | null {
  return reply === null ? null : reply.line.dialogue[0];
}

describe('Spiel', () => {
  describe('duplicate()', () => {
    it('duplicates a spiel', () => {
      const original = new Spiel();
      original.createNode('BUBBA', Emotion.HAPPY,['Howdy!', 'Hello!']);
      original.addReply(['hi', 'hello'], 'Welcome!');
      original.addRootReply('bye / goodbye', 'Leaving now? / Don\'t go!', 'BUBBA', Emotion.SAD);
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
      spiel.createNode();
      const expected = spiel.duplicate();
      repairSpiel(spiel);
      expect(spiel).toEqual(expected);
    });

    it('fixes invalid node', () => {
      const spiel = new Spiel();
      spiel.createNode();
      const expected = spiel.duplicate();
      spiel.nodes[0] = {} as SpielNode;
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
      spiel.nodes.push(missingElement as SpielNode);
      const expected = new Spiel();
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel).toEqual(expected);
    });
    
    it('fixes invalid root reply', () => {
      const invalidMatchCriteria = undefined as unknown;
      const spiel = new Spiel();
      spiel.addRootReply([], ['Howdy!', 'Hello!'], 'BUBBA', Emotion.HAPPY);
      const expected = spiel.duplicate();
      spiel.rootReplies[0].matchCriteria = invalidMatchCriteria as string[]
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel).toEqual(expected);
    });

    it('fixes root reply array with empty element', () => {
      const empty = undefined as unknown;
      const emptyReply = empty as SpielReply;
      const spiel = new Spiel();
      spiel.addRootReply([], ['Howdy!', 'Hello!'], 'BUBBA', Emotion.HAPPY);
      const expected = spiel.duplicate();
      spiel.addRootReply([], [''], 'BUBBA', Emotion.NEUTRAL);
      spiel.rootReplies[1] = emptyReply;
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
      spiel.createNode();
      spiel.createNode();
      spiel.createNode();
      spiel.currentNodeIndex = -1;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.currentNodeIndex).toEqual(0);
    });

    it('fixes node index that is over-bounds in populated spiel', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.createNode();
      spiel.createNode();
      spiel.currentNodeIndex = 3;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.currentNodeIndex).toEqual(2);
    });
  });

  describe('checkForMatch()', () => {
    let spiel:Spiel;

    beforeEach(() => {
      spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.addReply('ay', 'a');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.addReply('bee / baby', 'b');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '3');
      spiel.addReply('see / sea', 'c');
      spiel.addReply('dee / dead', 'd');
      spiel.addRootReply([], 'x');
      spiel.addRootReply(['why', 'yay', 'baby'], 'y');
      spiel.addRootReply(['zee'], 'z');
      spiel.moveFirst();
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
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '4');
      spiel.addReply(['go', 'goo', 'gosh'], 'g');
      const reply = spiel.checkForMatch('goo');
      expect(_getCode(reply)).toEqual('g');
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
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
    });
  
    it('returns last created node for spiel with multiple nodes', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });
  
    it('returns last node after moving to it', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      spiel.moveLast();
      expect(spiel.currentNode?.line.dialogue).toEqual(['2']);
    });
  
    it('returns first node after moving to it', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
    });
  
    it('returns next node after moving to it', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      spiel.moveNext();
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });
  
    it('returns previous node after moving to it', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveLast();
      spiel.movePrevious();
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });
  
    it('returns first node after attempting to move to previous node from first', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      spiel.movePrevious();
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
    });
  
    it('returns last node after attempting to move to next node from last', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveLast();
      spiel.moveNext();
      expect(spiel.currentNode?.line.dialogue).toEqual(['2']);
    });
  
    it('returns node after moving to it by index', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveTo(1);
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });
  
    it('hasPrevious is false when spiel is empty', () => {
      const spiel = new Spiel();
      expect(spiel.hasPrevious).toBeFalsy();
    });
  
    it('hasPrevious is false when at first node', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      expect(spiel.hasPrevious).toBeFalsy();
    });
  
    it('hasPrevious is true when at second node', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      spiel.moveNext();
      expect(spiel.hasPrevious).toBeTruthy();
    });
  
    it('hasNext is false when spiel is empty', () => {
      const spiel = new Spiel();
      expect(spiel.hasNext).toBeFalsy();
    });
  
    it('hasNext is false when at last node', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveLast();
      expect(spiel.hasNext).toBeFalsy();
    });
  
    it('hasNext is true when nodes are after the current', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      expect(spiel.hasNext).toBeTruthy();
    });

    it('moving next looped works', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveLast();
      spiel.moveNextLooped();
      expect(spiel.currentNode?.line.dialogue).toEqual(['0']);
      spiel.moveNextLooped();
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });

    it('moving previous looped works', () => {
      const spiel = new Spiel();
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '0');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '1');
      spiel.createNode('BUBBA', Emotion.NEUTRAL, '2');
      spiel.moveFirst();
      spiel.movePreviousLooped();
      expect(spiel.currentNode?.line.dialogue).toEqual(['2']);
      spiel.movePreviousLooped();
      expect(spiel.currentNode?.line.dialogue).toEqual(['1']);
    });
  });
  
  describe('addDialogue()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.addDialogue('blah')).toThrow();
    });
    
    it('adds dialogue to a node without dialogues', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addDialogue('hey');
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 1);
      expect(dialogue && dialogue[0]).toEqual('hey');
    });
  
    it('adds dialogue to a node with dialogues', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'hey');
      spiel.addDialogue('ho');
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 2);
      expect(dialogue && dialogue[0]).toEqual('hey');
      expect(dialogue && dialogue[1]).toEqual('ho');
    });
  
    it('adds dialogue with in-line variants', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addDialogue('hey / ho');
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 1);
      expect(dialogue && dialogue[0]).toEqual('hey');
    });
  
    it('adds dialogue with array of variants', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addDialogue(['hey', 'ho']);
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 1);
      expect(dialogue && dialogue[0]).toEqual('hey');
    });
  });
  
  describe('updateDialogue()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.updateDialogue('blah')).toThrow();
    });
  
    it('adds dialogue to a node without dialogues', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.updateDialogue('hey');
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 1);
      expect(dialogue && dialogue[0]).toEqual('hey');
    });
  
    it('updates dialogue for a node with dialogues', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'hey');
      spiel.updateDialogue('ho');
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 1);
      expect(dialogue && dialogue[0]).toEqual('ho');
    });
  
    it('updates dialogue with in-line variants', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.updateDialogue('hey / ho');
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 1);
      expect(dialogue && dialogue[0]).toEqual('hey');
    });
  
    it('updated dialogue with array of variants', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.updateDialogue(['hey', 'ho']);
      const dialogue = spiel.currentNode?.line?.dialogue;
      expect(dialogue && dialogue.length === 1);
      expect(dialogue && dialogue[0]).toEqual('hey');
    });
  });
  
  describe('addReply()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.addReply([],'blah')).toThrow();
    });
    
    it('adds reply to a node without replies', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.dialogue[0] === 'a');
    });
  
    it('adds multiple replies', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      spiel.addReply(['goodbye'], 'b');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.dialogue[0] === 'a');
      const reply2 = spiel.checkForMatch('goodbye');
      expect(reply2?.line?.dialogue[0] === 'b');
    });
    
    it('adds a reply with character and emotion specified', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply('hello', 'a', 'BIFF', Emotion.HAPPY);
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
      expect(reply?.line?.emotion).toEqual(Emotion.HAPPY);
    });

    it('adds a reply with character inherited from node', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addReply('hello', 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
    });

    it('adds a reply with character different from node', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addReply('hello', 'a', 'BUFFY');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BUFFY');
    });
  });
  
  describe('updateReply()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.updateReply(0, [],'blah')).toThrow();
    });
  
    it('throws on an under-bounds index', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      expect(() => spiel.updateReply(-1, [],'blah')).toThrow();
    });
  
    it('throws on an over-bounds index', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      expect(() => spiel.updateReply(1, [],'blah')).toThrow();
    });
  
    it('updates a reply', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      spiel.updateReply(0, ['goodbye'], 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply).toBeNull();
      const reply2 = spiel.checkForMatch('goodbye');
      expect(reply2?.line?.dialogue[0] === 'a');
    });

    it('updates a reply with character and emotion specified', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply('hey', 'b');
      spiel.updateReply(0, 'hello', 'a', 'BIFF', Emotion.HAPPY);
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
      expect(reply?.line?.emotion).toEqual(Emotion.HAPPY);
    });

    it('updates a reply with character inherited from node', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addReply('hey', 'b');
      spiel.updateReply(0, 'hello', 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
    });

    it('updates a reply with character different from node', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addReply('hey', 'b');
      spiel.updateReply(0, 'hello', 'a', 'BUFFY');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BUFFY');
    });
  });
  
  describe('removeReply()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.removeReply(0)).toThrow();
    });
  
    it('throws on an under-bounds index', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      expect(() => spiel.removeReply(-1)).toThrow();
    });
  
    it('throws on an over-bounds index', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      expect(() => spiel.removeReply(1)).toThrow();
    });
  
    it('removes a reply', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      spiel.addReply(['goodbye'], 'b');
      spiel.removeReply(0);
      const reply = spiel.checkForMatch('hello');
      expect(reply).toBeNull();
      const reply2 = spiel.checkForMatch('goodbye');
      expect(reply2?.line?.dialogue[0] === 'a');
    });
  });
  
  describe('removeAllReplies()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.removeAllReplies()).toThrow();
    });
    
    it('does nothing for a node with no replies', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.removeAllReplies();
      expect(spiel.currentNode?.replies.length === 0);
    });

    it('removes replies', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addReply(['hello'], 'a');
      spiel.addReply(['goodbye'], 'b');
      spiel.removeAllReplies();
      const reply = spiel.checkForMatch('hello');
      expect(reply).toBeNull();
      expect(spiel.currentNode?.replies.length === 0);
    });
  });

  describe('addRootReply()', () => {
    it('adds first root reply', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.dialogue[0] === 'a');
    });

    it('adds multiple root replies', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      spiel.addRootReply(['goodbye'], 'b');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.dialogue[0] === 'a');
      const reply2 = spiel.checkForMatch('goodbye');
      expect(reply2?.line?.dialogue[0] === 'b');
    });

    it('adds a root reply with character and emotion specified', () => {
      const spiel = new Spiel();
      spiel.addRootReply('hello', 'a', 'BIFF', Emotion.HAPPY);
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
      expect(reply?.line?.emotion).toEqual(Emotion.HAPPY);
    });

    it('adds a root reply with character inherited from default', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addRootReply('hello', 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
    });

    it('adds a root reply with character different from default', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addRootReply('hello', 'a', 'BUFFY');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BUFFY');
    });
  });

  describe('updateRootReply()', () => {
    it('throws on an under-bounds index', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      expect(() => spiel.updateRootReply(-1, [],'blah')).toThrow();
    });

    it('throws on an over-bounds index', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      expect(() => spiel.updateRootReply(1, [],'blah')).toThrow();
    });

    it('updates a root reply', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      spiel.updateRootReply(0, ['goodbye'], 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply).toBeNull();
      const reply2 = spiel.checkForMatch('goodbye');
      expect(reply2?.line?.dialogue[0] === 'a');
    });

    it('updates a root reply with character and emotion specified', () => {
      const spiel = new Spiel();
      spiel.createNode();
      spiel.addRootReply('hey', 'b');
      spiel.updateRootReply(0, 'hello', 'a', 'BIFF', Emotion.HAPPY);
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
      expect(reply?.line?.emotion).toEqual(Emotion.HAPPY);
    });

    it('updates a root reply with default character', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addRootReply('hey', 'b');
      spiel.updateRootReply(0, 'hello', 'a');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BIFF');
    });

    it('updates a root reply with character different from default', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      spiel.addRootReply('hey', 'b');
      spiel.updateRootReply(0, 'hello', 'a', 'BUFFY');
      const reply = spiel.checkForMatch('hello');
      expect(reply?.line?.character).toEqual('BUFFY');
    });
  });

  describe('removeRootReply()', () => {
    it('throws on an under-bounds index', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      expect(() => spiel.removeRootReply(-1)).toThrow();
    });

    it('throws on an over-bounds index', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      expect(() => spiel.removeRootReply(1)).toThrow();
    });

    it('removes a root eply', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      spiel.addRootReply(['goodbye'], 'b');
      spiel.removeRootReply(0);
      const reply = spiel.checkForMatch('hello');
      expect(reply).toBeNull();
      const reply2 = spiel.checkForMatch('goodbye');
      expect(reply2?.line?.dialogue[0] === 'a');
    });
  });

  describe('removeAllRootReplies()', () => {
    it('does nothing for a spiel with no root replies', () => {
      const spiel = new Spiel();
      spiel.removeAllRootReplies();
      expect(spiel.rootReplies.length === 0);
    });

    it('removes root replies', () => {
      const spiel = new Spiel();
      spiel.addRootReply(['hello'], 'a');
      spiel.addRootReply(['goodbye'], 'b');
      spiel.removeAllRootReplies();
      const reply = spiel.checkForMatch('hello');
      expect(reply).toBeNull();
      expect(spiel.rootReplies.length === 0);
    });
  });
  
  describe('removeNode()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.removeNode(0)).toThrow();
    });
    
    it('throws on an under-bounds index', () => {
      const spiel = new Spiel();
      spiel.createNode();
      expect(() => spiel.removeNode(-1)).toThrow();
    });

    it('throws on an over-bounds index', () => {
      const spiel = new Spiel();
      spiel.createNode();
      expect(() => spiel.removeNode(1)).toThrow();
    });

    it('removes a node', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'a');
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'b');
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'c');
      spiel.removeNode(1);
      spiel.moveTo(1);
      expect(spiel.hasNext).toBeFalsy();
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('c');
      spiel.movePrevious();
      expect(spiel.hasPrevious).toBeFalsy();
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('a');
    });
  });

  describe('removeCurrentNode()', () => {
    it('throws on an empty spiel', () => {
      const spiel = new Spiel();
      expect(() => spiel.removeCurrentNode()).toThrow();
    });

    it('removes a node', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'a');
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'b');
      spiel.createNode('BIFF', Emotion.NEUTRAL, 'c');
      spiel.moveTo(1);
      spiel.removeCurrentNode();
      expect(spiel.hasNext).toBeFalsy();
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('c');
      spiel.movePrevious();
      expect(spiel.hasPrevious).toBeFalsy();
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('a');
    });
  });
  
  describe('createNode()', () => {
    it('creates a node', () => {
      const spiel = new Spiel();
      spiel.createNode();
      expect(spiel.currentNode).not.toBeNull();
    });
    
    it('creates a node with a character', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF');
      expect(spiel.currentNode?.line?.character).toEqual('BIFF');
    });
    
    it('creates a node with an emotion', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.HAPPY);
      expect(spiel.currentNode?.line?.emotion).toEqual(Emotion.HAPPY);
    });
    
    it('creates a node with a line', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.HAPPY, 'a');
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('a');
    });
    
    it('creates a node after other nodes', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.HAPPY, 'a');
      spiel.createNode('BIFF', Emotion.HAPPY, 'b');
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('b');
    });

    it('creates a node inserted between other nodes', () => {
      const spiel = new Spiel();
      spiel.createNode('BIFF', Emotion.HAPPY, 'a');
      spiel.createNode('BIFF', Emotion.HAPPY, 'c');
      spiel.moveFirst();
      spiel.createNode('BIFF', Emotion.HAPPY, 'b');
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('b');
      spiel.moveNext();
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('c');
      spiel.moveNextLooped();
      expect(spiel.currentNode?.line?.dialogue[0]).toEqual('a');
    });
  });
});