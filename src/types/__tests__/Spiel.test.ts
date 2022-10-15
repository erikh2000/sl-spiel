import Spiel, {duplicateSpiel, repairSpiel} from '../Spiel';
import Emotion from 'types/Emotion';
import SpielNode from 'types/SpielNode';
import SpielReply from 'types/SpielReply';
import SpielLine from 'types/SpielLine';

describe('Spiel', () => {
  describe('duplicateSpiel()', () => {
    it('duplicates a spiel', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const node = new SpielNode(line, [reply]);
      const original = new Spiel();
      original.nodes = [node];
      original.rootReplies = [reply];
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
      spiel.nodes = [new SpielNode(new SpielLine('',['']), [])];
      const expected = duplicateSpiel(spiel);
      repairSpiel(spiel);
      expect(spiel).toEqual(expected);
    });

    it('fixes invalid node', () => {
      const spiel = new Spiel();
      const invalidNode = {} as SpielNode;
      const fixedNode = new SpielNode(new SpielLine('',[]), []);
      spiel.nodes = [invalidNode];
      const expected = new Spiel();
      expected.nodes = [fixedNode];
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
    
    it('fixes missing default character', () => {
      const spiel = new Spiel();
      const empty = undefined as unknown;
      spiel.defaultCharacter = empty as string;
      expect(repairSpiel(spiel)).toBeTruthy();
      expect(spiel.defaultCharacter).toEqual('');
    });
  });
});