import Spiel, {duplicateSpiel, repairSpiel} from '../Spiel';
import Emotion from 'types/Emotion';
import SpielNode, {INVALID_ID_MARKER} from 'types/SpielNode';
import SpielReply from 'types/SpielReply';
import SpielLine from 'types/SpielLine';

describe('Spiel', () => {
  describe('duplicateSpiel()', () => {
    it('duplicates a spiel', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const node = new SpielNode(33, line, [reply]);
      const original = new Spiel();
      original.nodes = [node];
      original.rootReplies = [reply];
      original.nextNodeId = 78;
      const duplicate = duplicateSpiel(original);
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
      const expected = duplicateSpiel(spiel);
      repairSpiel(spiel);
      expect(spiel).toEqual(expected);
    });

    it('fixes invalid node', () => {
      const spiel = new Spiel();
      const invalidNode = {id:3} as SpielNode;
      const fixedNode = new SpielNode(3, new SpielLine('',[]), []);
      spiel.nodes = [invalidNode];
      spiel.nextNodeId = 4;
      const expected = new Spiel();
      expected.nodes = [fixedNode];
      expected.nextNodeId = 4;
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
      spiel.nodes = [missingElement] as SpielNode[];
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
    
    it('fixes duplicate node IDs', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(4, new SpielLine('BIFF', ['hey']), []);
      const node2 = new SpielNode(4, new SpielLine('BIFF', ['ho']), []);
      spiel.nodes = [node1, node2];
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.nodes[0].id !== spiel.nodes[1].id);
    });

    it('fixes missing node ID', () => {
      const spiel = new Spiel();
      const line = new SpielLine('BIFF', ['hey']);
      const replies:SpielReply[] = [];
      const node = { line, replies } as SpielNode;
      spiel.nodes = [node];
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.nodes[0].id !== INVALID_ID_MARKER);
    });
    
    it('fixes next node ID that is too low', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(4, new SpielLine('BIFF', ['hey']), []);
      const node2 = new SpielNode(5, new SpielLine('BIFF', ['ho']), []);
      spiel.nodes = [node1, node2];
      spiel.nextNodeId = 3;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.nextNodeId).toEqual(6);
    });
    
    it('fixes missing default character', () => {
      const spiel = new Spiel();
      const empty = undefined as unknown;
      spiel.defaultCharacter = empty as string;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.defaultCharacter).toEqual('');
    });
  });
});