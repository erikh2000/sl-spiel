import {loadSpielFromText} from "../fountainUtil";
import emptyFountainText from "../__snapshots__/emptyFountain";
import fullFountainText from "../__snapshots__/fullFountain";
import Emotion from 'types/Emotion';
import SpielNode from "types/SpielNode";
import SpielLine from "types/SpielLine";

describe('fountainUtil', () => {
  describe('loadSpielFromText()', () => {
    it('loads an empty spiel', () => {
      const expected = {
        nodes: [],
        rootReplies: [],
        nextNodeId: 0,
        defaultCharacter: ''
      };
      const spiel = loadSpielFromText(emptyFountainText);
      expect(spiel).toEqual(expected);
    });
    
    it('loads a full spiel', () => {
      const line0 = new SpielLine('BIFF', ["Hey."], Emotion.AMUSED);
      const line1 = new SpielLine('BIFF', ["ho"]);
      const expected = {
        nodes:[
          new SpielNode(0, line0, []),
          new SpielNode(1, line1, [])
        ],
        rootReplies:[],
        nextNodeId:2,
        defaultCharacter:"BIFF"
      };
      const spiel = loadSpielFromText(fullFountainText);
      expect(spiel).toEqual(expected);
    });
  });
});