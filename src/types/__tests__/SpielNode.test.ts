import SpielNode, { duplicateSpielNode, repairSpielNode } from '../SpielNode';
import Emotion from 'types/Emotion';
import SpielReply from 'types/SpielReply';
import SpielLine from 'types/SpielLine';

describe('SpielNode', () => {
  describe('duplicateSpielNode()', () => {
    it('duplicates a node', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const original = new SpielNode(line, [reply]);
      const duplicate = duplicateSpielNode(original);
      expect(duplicate).toEqual(original);
    });
  });
  
  describe('repairSpielNode()', () => {
    it('returns false if no repair needed', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const node = new SpielNode(line, [reply]);
      expect(repairSpielNode(node)).toBeFalsy();
    });
    
    it('does not change node if no repair needed', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, ['hi', 'hello']);
      const node = new SpielNode(line, [reply]);
      const expected = duplicateSpielNode(node);
      repairSpielNode(node);
      expect(node).toEqual(expected);
    });

    it('fixes undefined line', () => {
      const undefinedLine = (undefined as unknown) as SpielLine;
      const expected = new SpielNode(new SpielLine('',['']), []);
      const node = duplicateSpielNode(expected);
      node.line = undefinedLine;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });

    it('fixes invalid line', () => {
      const line = {character:'BUBBA', dialogue:['Howdy!', 'Hello!']} as SpielLine;
      const fixedLine = {character:'BUBBA', dialogue:['Howdy!', 'Hello!'], emotion:Emotion.NEUTRAL} as SpielLine;
      const replies = [new SpielReply(line, ['hi', 'hello'])];
      const node = { line, replies } as SpielNode;
      const expected = { line:fixedLine, replies } as SpielNode;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });
    
    it('fixes invalid reply', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const invalidReply = {line} as SpielReply;
      const fixedReply = {line, matchCriteria:[] as string[]} as SpielReply;
      const replies = [invalidReply];
      const fixedReplies = [fixedReply];
      const node = { line, replies } as SpielNode;
      const expected = { line, replies:fixedReplies } as SpielNode;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });
    
    it('fixes empty reply element', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = {line, matchCriteria:[] as string[]} as SpielReply;
      const replies = [undefined, reply, null];
      const fixedReplies = [reply];
      const node = { line, replies } as SpielNode;
      const expected = { line, replies:fixedReplies } as SpielNode;
      expect(repairSpielNode(node)).toBeTruthy();
      expect(node).toEqual(expected);
    });
  });

  describe('nextDialogue()', () => {
    it('returns same text every time when only one dialogue text', () => {
      const line = new SpielLine('BUBBA', ['Howdy!'], Emotion.HAPPY);
      const node = new SpielNode(line, []);
      for(let i = 0; i < 100; ++i) {
        expect(node.nextDialogue()).toEqual('Howdy!');
      }
    });

    it('returns alternating text when there are 2 texts', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const node = new SpielNode(line, []);
      let lastText = node.nextDialogue(); 
      for(let i = 0; i < 100; ++i) {
        const text = node.nextDialogue();
        expect(text !== lastText);
        lastText = text;
      }
    });

    it('returns non-repeating text when there are 3 texts', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!', 'Hi!'], Emotion.HAPPY);
      const node = new SpielNode(line, []);
      let lastText = node.nextDialogue();
      for(let i = 0; i < 100; ++i) {
        const text = node.nextDialogue();
        expect(text !== lastText);
        lastText = text;
      }
    });
  });
});