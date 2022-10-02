import SpielNode, { duplicateSpielNode, repairSpielNode, INVALID_ID_MARKER } from '../SpielNode';
import Emotion from 'types/Emotion';
import SpielReply from 'types/SpielReply';
import SpielLine from 'types/SpielLine';

describe('SpielNode', () => {
  describe('duplicateSpielNode()', () => {
    it('duplicates a node', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const original = new SpielNode(33, line, [reply]);
      const duplicate = duplicateSpielNode(original);
      expect(duplicate).toEqual(original);
    });
  });
  
  describe('repairSpielNode()', () => {
    it('returns false if no repair needed', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const node = new SpielNode(33, line, [reply]);
      expect(repairSpielNode(node)).toBeFalsy();
    });
    
    it('does not change node if no repair needed', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const node = new SpielNode(33, line, [reply]);
      const expected = duplicateSpielNode(node);
      repairSpielNode(node);
      expect(node).toEqual(expected);
    });
    
    it('sets undefined ID to invalid marker value', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const replies = [new SpielReply(line, ['hi', 'hello'])];
      const node = { line, replies } as SpielNode;
      const expected = { id:INVALID_ID_MARKER, line, replies }; // as SpielNode;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });

    it('fixes undefined line', () => {
      const undefinedLine = undefined as unknown;
      const node = {id:3, line:undefinedLine, replies:[]} as SpielNode;
      const expected = new SpielNode(3, new SpielLine('',[]), []);
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });

    it('fixes invalid line', () => {
      const line = {character:'BUBBA', dialogue:['Howdy!', 'Hello!']} as SpielLine;
      const fixedLine = {character:'BUBBA', dialogue:['Howdy!', 'Hello!'], emotion:Emotion.NEUTRAL} as SpielLine;
      const replies = [new SpielReply(line, ['hi', 'hello'])];
      const node = { id:7, line, replies } as SpielNode;
      const expected = { id:7, line:fixedLine, replies } as SpielNode;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });
    
    it('fixes invalid reply', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const invalidReply = {line} as SpielReply;
      const fixedReply = {line, matchCriteria:[] as string[]} as SpielReply;
      const replies = [invalidReply];
      const fixedReplies = [fixedReply];
      const node = { id:7, line, replies } as SpielNode;
      const expected = { id:7, line, replies:fixedReplies } as SpielNode;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });
    
    it('fixes empty reply element', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = {line, matchCriteria:[] as string[]} as SpielReply;
      const replies = [undefined, reply, null];
      const fixedReplies = [reply];
      const node = { id:7, line, replies } as SpielNode;
      const expected = { id:7, line, replies:fixedReplies } as SpielNode;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });
  });
});