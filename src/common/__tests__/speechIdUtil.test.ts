import { assignSpeechIds } from "../speechIdUtil";
import Spiel from "../../types/Spiel";
import Emotion from "../../types/Emotion";


describe('speechIdUtil', () => {
  describe('assignSpeechIds()', () => {
    let spiel:Spiel|null = null;
    
    beforeEach(() => {
      spiel = new Spiel();
      spiel.createNode('BOB', Emotion.HAPPY, ['Hey!']);
      spiel.createNode('BOB', Emotion.SAD, ['Hey!']);
      spiel.createNode('BOB', Emotion.SAD, ['Hey!', 'Jam on it!']);
      spiel.addReply('huh', ['What?', 'Who?', 'Hey!']);
      spiel.addRootReply('yay', ['Yay!']);
      spiel.addRootReply('hey', ['Hey!', 'Hey!'], 'BOB', Emotion.HAPPY);
      assignSpeechIds(spiel);
    });
    
    it('assigns speech IDs to nodes', () => {
      expect(spiel?.nodes[0].line.speechIds.length).toEqual(1);
      expect(spiel?.nodes[1].line.speechIds.length).toEqual(1);
      expect(spiel?.nodes[2].line.speechIds.length).toEqual(2);
    });
    
    it('assigns speech IDs to replies', () => {
      expect(spiel?.nodes[2].replies[0].line.speechIds.length).toEqual(3);
    });
    
    it('assigns speech IDs to root replies', () => {
      expect(spiel?.rootReplies[0].line.speechIds.length).toEqual(1);
      expect(spiel?.rootReplies[1].line.speechIds.length).toEqual(2);
    });
  });
});