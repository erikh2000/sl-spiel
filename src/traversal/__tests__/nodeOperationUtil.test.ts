import {
  removeNode,
} from "../nodeOperationUtil";
import Spiel, {duplicateSpiel} from 'types/Spiel';
import SpielLine from 'types/SpielLine';
import SpielNode from 'types/SpielNode';

describe('spielUtil', () => {
  describe('removeNodes', () => {
    it('does not change spiel when spiel has no nodes', () => {
      const spiel = new Spiel();
      spiel.nodes = [];
      const expected = duplicateSpiel(spiel);
      removeNode(spiel, 6);
      expect(spiel).toEqual(expected);
    });

    it('does not change spiel when spiel contains no matching nodes', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(6, new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(7, new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(8, new SpielLine('BOB', ['Hey!']), []);
      spiel.nodes = [node1, node2, node3];
      const expected = duplicateSpiel(spiel);
      removeNode(spiel, 5);
      expect(spiel).toEqual(expected);
    });

    it('removes a node that matches', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(6, new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(7, new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(8, new SpielLine('BOB', ['Hey!']), []);
      spiel.nodes = [node1, node2, node3];
      const expected = new Spiel();
      expected.nodes = [node1, node3];
      removeNode(spiel, 7);
      expect(spiel).toEqual(expected);
    });
  });
});