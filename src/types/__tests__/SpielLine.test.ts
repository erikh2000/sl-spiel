import SpielLine, {duplicateSpielLine, repairSpielLine} from '../SpielLine';
import Emotion from '../Emotion';

describe('SpielLine', () => {
  describe('duplicateSpielLine()', () => {
    it('duplicates a line', () => {
      const original = new SpielLine('BUBBA', ['Howdy!', 'Hey!'], Emotion.HAPPY)
      const duplicate = duplicateSpielLine(original);
      expect(duplicate).toEqual(original);
    });
  });
  
  describe('repairSpielLine()', () => {
    it('returns false if no repair needed', () => {
      const line = new SpielLine('BIFF', ['Hi', 'Howdy']);
      expect(repairSpielLine(line)).toBeFalsy();
    });

    it('does not change line if no repair needed', () => {
      const line = new SpielLine('BIFF', ['Hi', 'Howdy']);
      const expected = duplicateSpielLine(line);
      repairSpielLine(line);
      expect(line).toEqual(expected);
    });
    
    it('fixes missing character', () => {
      const line = { dialogue:['Hey'], emotion:Emotion.NEUTRAL } as SpielLine;
      const expected = { character:'', dialogue:['Hey'], emotion:Emotion.NEUTRAL } as SpielLine;
      expect(repairSpielLine(line)).toBeTruthy();
      expect(line).toEqual(expected);
    });

    it('fixes undefined dialogue', () => {
      const line = { character:'BIFF', emotion:Emotion.NEUTRAL } as SpielLine;
      const expected = { character:'BIFF', dialogue:[''], emotion:Emotion.NEUTRAL } as SpielLine;
      expect(repairSpielLine(line)).toBeTruthy();
      expect(line).toEqual(expected);
    });

    it('fixes empty dialogue array', () => {
      const line = { character:'BIFF', dialogue:[], emotion:Emotion.NEUTRAL } as SpielLine;
      const expected = { character:'BIFF', dialogue:[''], emotion:Emotion.NEUTRAL } as SpielLine;
      expect(repairSpielLine(line)).toBeTruthy();
      expect(line).toEqual(expected);
    });

    it('fixes empty dialogue element', () => {
      const line = { character:'BIFF', dialogue:['a', null, 'b'], emotion:Emotion.NEUTRAL } as SpielLine;
      const expected = { character:'BIFF', dialogue:['a', 'b'], emotion:Emotion.NEUTRAL } as SpielLine;
      expect(repairSpielLine(line)).toBeTruthy();
      expect(line).toEqual(expected);
    });

    it('fixes missing emotion', () => {
      const line = { character:'BIFF', dialogue:['Hey'] } as SpielLine;
      const expected = { character:'BIFF', dialogue:['Hey'], emotion:Emotion.NEUTRAL } as SpielLine;
      expect(repairSpielLine(line)).toBeTruthy();
      expect(line).toEqual(expected);
    });
  });
});