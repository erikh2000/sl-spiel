import {importFountain} from "../fountainUtil";
import emptyFountainText from "../__snapshots__/emptyFountain";
import fullFountainText from "../__snapshots__/fullFountain";
import Emotion from '../../types/Emotion';
import SpielNode from "../../types/SpielNode";
import SpielLine from "../../types/SpielLine";

describe('fountainUtil', () => {
  describe('loadSpielFromText()', () => {
    it('loads an empty spiel', () => {
      const expected = {
        nodes: [],
        rootReplies: [],
        defaultCharacter: '',
        currentNodeIndex: 0, 
        matchManager:null,
      };
      const spiel = importFountain(emptyFountainText);
      expect(spiel).toEqual(expected);
    });
    
    it('loads a full spiel', () => {
      const line0 = new SpielLine('BIFF', ["Hey."], Emotion.AMUSED);
      const line1 = new SpielLine('BIFF', ["ho"]);
      const expected = {
        nodes:[
          new SpielNode(line0, []),
          new SpielNode(line1, [])
        ],
        rootReplies:[],
        defaultCharacter:"BIFF",
        currentNodeIndex: 0, 
        matchManager:null,
      };
      const spiel = importFountain(fullFountainText);
      expect(spiel).toEqual(expected);
    });
  });
});