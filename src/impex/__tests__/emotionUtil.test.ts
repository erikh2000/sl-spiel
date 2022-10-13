import {emotionToParenthetical, parentheticalToEmotion} from "../emotionUtil";
import Emotion from "types/Emotion";

describe('emotionUtil', () => {
  describe('parentheticalToEmotion', () => {
    it('returns neutral for empty string', () => {
      const parenthetical = '';
      const expected = Emotion.NEUTRAL;
      const emotion = parentheticalToEmotion(parenthetical);
      expect(emotion).toEqual(expected);
    });

    it('returns neutral for string with no matching keywords', () => {
      const parenthetical = 'dog buddy';
      const expected = Emotion.NEUTRAL;
      const emotion = parentheticalToEmotion(parenthetical);
      expect(emotion).toEqual(expected);
    });

    it('returns emotion that matches single-word parenthetical', () => {
      const parenthetical = 'happy';
      const expected = Emotion.HAPPY;
      const emotion = parentheticalToEmotion(parenthetical);
      expect(emotion).toEqual(expected);
    });

    it('returns emotion that matches first of multi-word parenthetical', () => {
      const parenthetical = 'happy but with tension';
      const expected = Emotion.HAPPY;
      const emotion = parentheticalToEmotion(parenthetical);
      expect(emotion).toEqual(expected);
    });

    it('returns emotion that matches last of multi-word parenthetical', () => {
      const parenthetical = 'extremely happy';
      const expected = Emotion.HAPPY;
      const emotion = parentheticalToEmotion(parenthetical);
      expect(emotion).toEqual(expected);
    });

    it('returns emotion that matches a middle word of multi-word parenthetical', () => {
      const parenthetical = 'extremely happy now';
      const expected = Emotion.HAPPY;
      const emotion = parentheticalToEmotion(parenthetical);
      expect(emotion).toEqual(expected);
    });

    it('matches are case-insensitive', () => {
      const parenthetical = 'hApPy';
      const expected = Emotion.HAPPY;
      const emotion = parentheticalToEmotion(parenthetical);
      expect(emotion).toEqual(expected);
    });
  });
  
  describe('emotionToParenthetical()', () => {
    it('returns text for an emotion', () => {
      const parenthetical = emotionToParenthetical(Emotion.CONFUSED);
      const expected = 'confused';
      expect(parenthetical).toEqual(expected);
    });
  });
});