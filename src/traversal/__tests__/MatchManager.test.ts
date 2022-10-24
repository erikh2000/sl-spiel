import MatchManager from "../MatchManager";
import Spiel from "../../types/Spiel";

// Functionality is tested through Spiel.checkForMatch(). Test below is getting code coverage on
// on a debug error safeguard.

describe('MatchManager', () => {
  describe('setNode', () => {
    it('throws when set to non-existent node', () => {
      const spiel = new Spiel();
      const matchManager = new MatchManager(spiel);
      expect(() => matchManager.setNode(1)).toThrow();
    });
  });
});