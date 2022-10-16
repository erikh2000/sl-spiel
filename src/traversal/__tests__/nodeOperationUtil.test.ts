import { removeNode, replaceNode } from "../nodeOperationUtil";
import Spiel from 'types/Spiel';
import SpielLine from 'types/SpielLine';
import SpielNode from 'types/SpielNode';

describe('spielUtil', () => {
  describe('removeNode', () => {
    it('does not change spiel when spiel has no nodes', () => {
      const spiel = new Spiel();
      spiel.nodes = [];
      const expected = spiel.duplicate();
      removeNode(spiel, 6);
      expect(spiel).toEqual(expected);
    });

    it('does not change spiel when remove index is OOB', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      spiel.nodes = [node1, node2, node3];
      const expected = spiel.duplicate();
      removeNode(spiel, 5);
      expect(spiel).toEqual(expected);
    });

    it('removes a node', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      spiel.nodes = [node1, node2, node3];
      const expected = new Spiel();
      expected.nodes = [node1, node3];
      removeNode(spiel, 1);
      expect(spiel).toEqual(expected);
    });
  });
  
  describe('replaceNode', () => {
    it('replaces a node with another node', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(new SpielLine('BAWB', ['Hay!']), []);
      spiel.nodes = [node1, node2];
      const expected = spiel.duplicate();
      expected.nodes[1] = node3;
      replaceNode(spiel, node3, 1);
      expect(spiel).toEqual(expected);
    });
  });
});