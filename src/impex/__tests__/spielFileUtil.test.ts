import {exportSpielFile, importSpielFile} from "../spielFileUtil";
import Spiel from "../../types/Spiel";
import SpielNode from "../../types/SpielNode";
import SpielLine from "../../types/SpielLine";
import SpielReply from "../../types/SpielReply";
import emptySpielText from "../__snapshots__/emptySpiel";
import fullSpielText from "../__snapshots__/fullSpiel";
import Emotion from "../../types/Emotion";

describe('spielFileUtil', () => { // TODO  fix failing tests
  describe('exportSpielFile()', () => {
    it('creates text for an empty spiel', () => {
      const spiel = new Spiel();
      const text = exportSpielFile(spiel);
      expect(text).toEqual(emptySpielText);
    });
  
    it('creates text for a populated spiel', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(new SpielLine('BIFF', ['Hey.'], Emotion.AMUSED), [
        new SpielReply(new SpielLine('BIFF', ['Hey hey!']), ['hey', 'hay'])
      ]);
      const node2 = new SpielNode(new SpielLine('BIFF', ['ho']), []);
      spiel.nodes = [node1, node2];
      spiel.defaultCharacter = 'BIFF';
      spiel.rootReplies = [new SpielReply(new SpielLine('BIFF', ['Calm down!'], Emotion.AFRAID), ['shut up'])]
      const text = exportSpielFile(spiel);
      expect(text).toEqual(fullSpielText);
    });
  });

  describe('importSpielFile()', () => {
    it('creates empty spiel', () => {
      const expected = { nodes: [], rootReplies: [], currentNodeIndex: 0, matchManager:null, defaultCharacter: '' };
      const spiel = importSpielFile(emptySpielText);
      expect(spiel).toEqual(expected);
    });
  });

  it('creates a populated spiel', () => {
    const expected = {
      nodes:[{
        line:{character:"BIFF",dialogue:["Hey."],emotion:Emotion.AMUSED,lastDialogueNo:0,speechIds:['39f3']},
        replies:[{
          line:{character:"BIFF",dialogue:["Hey hey!"],emotion:Emotion.NEUTRAL,lastDialogueNo:0,speechIds:['f2a8']},
          matchCriteria:["hey","hay"]
        }]
      },{
      line:{character:"BIFF",dialogue:["ho"],emotion:Emotion.NEUTRAL,lastDialogueNo:0,speechIds:['757a']},
        replies:[]
      }],
      rootReplies:[{
        line:{
          character:"BIFF",
          dialogue:["Calm down!"],
          emotion:Emotion.AFRAID,
          lastDialogueNo:0,
          speechIds:['81f8']
        },
        matchCriteria:["shut up"]
      }],
      defaultCharacter:"BIFF",
      currentNodeIndex: 0, 
      matchManager:null,
    };
    const spiel = importSpielFile(fullSpielText);
    expect(spiel).toEqual(expected);
  });
});