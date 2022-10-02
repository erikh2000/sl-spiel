import {
  findAdjacentNode,
  findCharacterWithMostLines,
  findFirstNode,
  findHighestNodeId
} from "../findUtil";
import Spiel, {duplicateSpiel} from 'types/Spiel';
import SpielLine from 'types/SpielLine';
import SpielNode from 'types/SpielNode';

describe('findUtil', () => {
  describe('findAdjacentNode', () => {
    it('throws if spiel is empty', () => {
      const spiel = new Spiel();
      expect(() => findAdjacentNode(spiel, 7)).toThrow();
    });

    it('throws if spiel does not contain matching node', () => {
      const spiel = new Spiel();
      const node = new SpielNode(6, new SpielLine('BOB', ['Hey!']), []);
      spiel.nodes = [node];
      expect(() => findAdjacentNode(spiel, 7)).toThrow();
    });

    it('returns null if matching node is only node in spiel', () => {
      const spiel = new Spiel();
      const node = new SpielNode(6, new SpielLine('BOB', ['Hey!']), []);
      const expected = null;
      spiel.nodes = [node];
      const adjacentNode = findAdjacentNode(spiel, 6);
      expect(adjacentNode).toEqual(expected);
    });

    it('returns next node if first node in spiel with multiple nodes', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(6, new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(7, new SpielLine('BOB', ['Hey!']), []);
      const expected = node2;
      spiel.nodes = [node1, node2];
      const adjacentNode = findAdjacentNode(spiel, 6);
      expect(adjacentNode).toEqual(expected);
    });

    it('returns next node if middle node in spiel with multiple nodes', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(6, new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(7, new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(8, new SpielLine('BOB', ['Hey!']), []);
      const expected = node3;
      spiel.nodes = [node1, node2, node3];
      const adjacentNode = findAdjacentNode(spiel, 7);
      expect(adjacentNode).toEqual(expected);
    });

    it('returns previous node if last node in spiel with multiple nodes', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(6, new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(7, new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(8, new SpielLine('BOB', ['Hey!']), []);
      const expected = node2;
      spiel.nodes = [node1, node2, node3];
      const adjacentNode = findAdjacentNode(spiel, 8);
      expect(adjacentNode).toEqual(expected);
    });
  });

  describe('findCharacterWithMostLines', () => {
    it('returns null for no nodes', () => {
      const nodes:SpielNode[] = [];
      const expected = null;
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    it('returns character for one node', () => {
      const nodes = [new SpielNode(1, new SpielLine('BOB', ['Hey!']), [])];
      const expected = 'BOB';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    it('returns character for 2 nodes with same character', () => {
      const nodes = [
        new SpielNode(1, new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(2, new SpielLine('BOB', ['Hey!']), []),
      ];
      const expected = 'BOB';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    it('returns character w/most lines for 3 nodes with 2 characters', () => {
      const nodes = [
        new SpielNode(1, new SpielLine('JERRY', ['Hey!']), []),
        new SpielNode(2, new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(3, new SpielLine('BOB', ['Hey!']), []),
      ];
      const expected = 'BOB';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    it('returns character w/most lines for nodes with 3 characters', () => {
      const nodes = [
        new SpielNode(1, new SpielLine('JERRY', ['Hey!']), []),
        new SpielNode(2, new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(3, new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(4, new SpielLine('JERRY', ['Hey!']), []),
        new SpielNode(5, new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(6, new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(7, new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(8, new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(9, new SpielLine('BOB', ['Hey!']), [])
      ];
      const expected = 'ANNIE';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    // No tests for behavior of ties (e.g. 1 Bob, 1 Jerry) as it's not part of contract.
  });

  describe('findFirstNode', () => {
    it('returns null for spiel with no nodes', () => {
      const spiel = new Spiel();
      const firstNode = findFirstNode(spiel);
      expect(firstNode).toBeNull();
    });

    it('returns first node for spiel', () => {
      const spiel = new Spiel();
      const node = new SpielNode(3, new SpielLine('BUBBA', ['Hi!']), []);
      spiel.nodes = [node];
      const firstNode = findFirstNode(spiel);
      expect(firstNode).toEqual(node);
    });
  });

  describe('findHighestNodeId', () => {
    it('returns -1 if node array is empty', () => {
      const nodes:SpielNode[] = [];
      expect(findHighestNodeId(nodes)).toEqual(-1);
    });

    it('returns ID of first node when first node is highest', () => {
      const nodes:SpielNode[] = [
        new SpielNode(2, new SpielLine('BUBBA', ['Hi!']), []),
        new SpielNode(1, new SpielLine('BUBBA', ['Hi!']), [])
      ];
      expect(findHighestNodeId(nodes)).toEqual(2);
    });

    it('returns ID of second node when first node is highest', () => {
      const nodes:SpielNode[] = [
        new SpielNode(1, new SpielLine('BUBBA', ['Hi!']), []),
        new SpielNode(2, new SpielLine('BUBBA', ['Hi!']), [])
      ];
      expect(findHighestNodeId(nodes)).toEqual(2);
    });
  });
});