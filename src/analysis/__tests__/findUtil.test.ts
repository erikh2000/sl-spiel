import {
  findAdjacentNode,
  findCharacterWithMostLines
} from "../findUtil";
import Spiel from 'types/Spiel';
import SpielLine from 'types/SpielLine';
import SpielNode from 'types/SpielNode';

describe('findUtil', () => {
  describe('findAdjacentNode', () => {
    it('throws if spiel is empty', () => {
      const spiel = new Spiel();
      expect(() => findAdjacentNode(spiel, 7)).toThrow();
    });

    it('returns null if only one node in spiel', () => {
      const spiel = new Spiel();
      const node = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const expected = null;
      spiel.nodes = [node];
      const adjacentNode = findAdjacentNode(spiel, 0);
      expect(adjacentNode).toEqual(expected);
    });

    it('returns next node if first node in spiel with multiple nodes', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const expected = node2;
      spiel.nodes = [node1, node2];
      const adjacentNode = findAdjacentNode(spiel, 0);
      expect(adjacentNode).toEqual(expected);
    });

    it('returns next node if middle node in spiel with multiple nodes', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const expected = node3;
      spiel.nodes = [node1, node2, node3];
      const adjacentNode = findAdjacentNode(spiel, 1);
      expect(adjacentNode).toEqual(expected);
    });

    it('returns previous node if last node in spiel with multiple nodes', () => {
      const spiel = new Spiel();
      const node1 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node2 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const node3 = new SpielNode(new SpielLine('BOB', ['Hey!']), []);
      const expected = node2;
      spiel.nodes = [node1, node2, node3];
      const adjacentNode = findAdjacentNode(spiel, 2);
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
      const nodes = [new SpielNode(new SpielLine('BOB', ['Hey!']), [])];
      const expected = 'BOB';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    it('returns character for 2 nodes with same character', () => {
      const nodes = [
        new SpielNode(new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(new SpielLine('BOB', ['Hey!']), []),
      ];
      const expected = 'BOB';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    it('returns character w/most lines for 3 nodes with 2 characters', () => {
      const nodes = [
        new SpielNode(new SpielLine('JERRY', ['Hey!']), []),
        new SpielNode(new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(new SpielLine('BOB', ['Hey!']), []),
      ];
      const expected = 'BOB';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    it('returns character w/most lines for nodes with 3 characters', () => {
      const nodes = [
        new SpielNode(new SpielLine('JERRY', ['Hey!']), []),
        new SpielNode(new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(new SpielLine('JERRY', ['Hey!']), []),
        new SpielNode(new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(new SpielLine('BOB', ['Hey!']), []),
        new SpielNode(new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(new SpielLine('ANNIE', ['Hey!']), []),
        new SpielNode(new SpielLine('BOB', ['Hey!']), [])
      ];
      const expected = 'ANNIE';
      const character = findCharacterWithMostLines(nodes);
      expect(character).toEqual(expected);
    });

    // No tests for behavior of ties (e.g. 1 Bob, 1 Jerry) as it's not part of contract.
  });
});