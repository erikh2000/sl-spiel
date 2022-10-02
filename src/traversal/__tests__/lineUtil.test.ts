import SpielLine from "types/SpielLine";
import { getRandomLineDialogue } from "../lineUtil";

describe('lineUtil', () => {
  describe('getRandomLineDialogue', () => {
    it('returns empty string for line with no dialogue', () => {
      const spielLine = new SpielLine('BUBBA', []);
      const expected = '';
      expect(getRandomLineDialogue(spielLine)).toEqual(expected);
    });
  
    it('returns text for line with dialogue', () => {
      const spielLine = new SpielLine('BUBBA', ['apple','banana']);
      for(let i = 0; i < 100; ++i) {
        const dialogue = getRandomLineDialogue(spielLine);
        expect(dialogue === 'apple' || dialogue === 'banana').toBeTruthy();
      }
    });
  });
});