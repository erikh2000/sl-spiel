import SpielReply, { duplicateSpielReply, repairSpielReply } from '../SpielReply';
import SpielLine from 'types/SpielLine';
import Emotion from 'types/Emotion';
import SpielNode from "../SpielNode";

describe('SpielReply', () => {
  describe('duplicateSpielReply()', () => {
    it('duplicates a reply', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hey!'], Emotion.HAPPY)
      const original = new SpielReply(line, ['hi', 'hello']);
      const duplicate = duplicateSpielReply(original);
      expect(duplicate).toEqual(original);
    });
  });
  
  describe('repairSpielReply', () => {
    describe('', () => {
      it('returns false if no repair needed', () => {
        const line = new SpielLine('BIFF', ['Hi', 'Howdy']);
        const reply = new SpielReply(line, ['hi', 'hello']);
        expect(repairSpielReply(reply)).toBeFalsy();
      });

      it('does not change reply if no repair needed', () => {
        const line = new SpielLine('BIFF', ['Hi', 'Howdy']);
        const reply = new SpielReply(line, ['hi', 'hello']);
        const expected = duplicateSpielReply(reply);
        repairSpielReply(reply);
        expect(reply).toEqual(expected);
      });
      
      it('fixes an invalid line', () => {
        const lineObject = { dialogue:['Hey'], emotion:Emotion.NEUTRAL }; // as SpielLine;
        const line = lineObject as SpielLine;
        const reply = new SpielReply(line, ['hi', 'hello']);
        const expected = { 
          line:{ character:'', dialogue:['Hey'], emotion:Emotion.NEUTRAL },
          matchCriteria: ['hi', 'hello']
        } as SpielReply;
        expect(repairSpielReply(reply)).toBeTruthy();
        expect(reply).toEqual(expected);
      });

      it('fixes undefined match criteria', () => {
        const line = new SpielLine('BIFF', ['Hi', 'Howdy']);
        const expected = new SpielReply(line, []);
        const reply = duplicateSpielReply(expected);
        reply.matchCriteria = (undefined as unknown) as string[];
        expect(repairSpielReply(reply)).toBeTruthy();
        expect(reply).toEqual(expected);
      });

      it('fixes empty match criteria element', () => {
        const line = new SpielLine('BIFF', ['Hi', 'Howdy']);
        const reply = { line, matchCriteria: ['a', null, 'b'] } as SpielReply;
        const expected = { line, matchCriteria: ['a', 'b'] } as SpielReply;
        expect(repairSpielReply(reply)).toBeTruthy();
        expect(reply).toEqual(expected);
      });
    })
  });

  describe('nextDialogue()', () => {
    it('returns same text every time when only one dialogue text', () => {
      const line = new SpielLine('BUBBA', ['Howdy!'], Emotion.HAPPY);
      const reply = new SpielReply(line, []);
      for(let i = 0; i < 100; ++i) {
        expect(reply.nextDialogue()).toEqual('Howdy!');
      }
    });

    it('returns alternating text when there are 2 texts', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!'], Emotion.HAPPY);
      const reply = new SpielReply(line, []);
      let lastText = reply.nextDialogue();
      for(let i = 0; i < 100; ++i) {
        const text = reply.nextDialogue();
        expect(text !== lastText);
        lastText = text;
      }
    });

    it('returns non-repeating text when there are 3 texts', () => {
      const line = new SpielLine('BUBBA', ['Howdy!', 'Hello!', 'Hi!'], Emotion.HAPPY);
      const reply = new SpielReply(line, []);
      let lastText = reply.nextDialogue();
      for(let i = 0; i < 100; ++i) {
        const text = reply.nextDialogue();
        expect(text !== lastText);
        lastText = text;
      }
    });
  });
});