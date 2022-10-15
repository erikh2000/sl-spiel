import {exportSpielFile, importSpielFile} from "../spielFileUtil";
import Spiel from "types/Spiel";
import SpielNode from "types/SpielNode";
import SpielLine from "types/SpielLine";
import SpielReply from "types/SpielReply";
import emptySpielText from "../__snapshots__/emptySpiel";
import fullSpielText from "../__snapshots__/fullSpiel";
import Emotion from "../../types/Emotion";

describe('spielFileUtil', () => {
  describe('exportSpielFile()', () => {
    it('creates text for an empty spiel', () => {
      const spiel = new Spiel();
      const text = exportSpielFile(spiel);
      expect(text).toEqual(emptySpielText);
    });
  
    it('creates text for a populated spiel', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(4, new SpielLine('BIFF', ['Hey.'], Emotion.AMUSED), [
        new SpielReply(new SpielLine('BIFF', ['Hey hey!']), ['hey', 'hay'])
      ]);
      const node2 = new SpielNode(5, new SpielLine('BIFF', ['ho']), []);
      spiel.nodes = [node1, node2];
      spiel.nextNodeId = 6;
      spiel.defaultCharacter = 'BIFF';
      spiel.rootReplies = [new SpielReply(new SpielLine('BIFF', ['Calm down!'], Emotion.AFRAID), ['shut up'])]
      const text = exportSpielFile(spiel);
      expect(text).toEqual(fullSpielText);
    });
  });

  describe('importSpielFile()', () => {
    it('creates empty spiel', () => {
      const expected = { nodes: [], rootReplies: [], nextNodeId: 0, defaultCharacter: '' };
      const spiel = importSpielFile(emptySpielText);
      expect(spiel).toEqual(expected);
    });
  });

  it('creates a populated spiel', () => {
    const expected = {
      nodes:[{
        line:{character:"BIFF",dialogue:["Hey."],emotion:Emotion.AMUSED},
        replies:[{
          line:{character:"BIFF",dialogue:["Hey hey!"],emotion:Emotion.NEUTRAL},
          matchCriteria:["hey","hay"]
        }],
        id:0
      },{
      line:{character:"BIFF",dialogue:["ho"],emotion:Emotion.NEUTRAL},
        replies:[],
        id:1
      }],
      rootReplies:[{
        line:{
          character:"BIFF",
          dialogue:["Calm down!"],
          emotion:Emotion.AFRAID
        },
        matchCriteria:["shut up"]
      }],
      nextNodeId:2,
      defaultCharacter:"BIFF"
    };
    const spiel = importSpielFile(fullSpielText);
    expect(spiel).toEqual(expected);
  });
});