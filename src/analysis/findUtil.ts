import Spiel from 'types/Spiel';
import SpielNode from 'types/SpielNode';

export function findFirstNode(spiel:Spiel):SpielNode|null {
  if (!spiel.nodes.length) return null;
  return spiel.nodes[0];
}

export function findAdjacentNode(spiel:Spiel, nodeId:number):SpielNode | null {
  if (!spiel.nodes.length) throw Error('Spiel is empty.');

  const nodeCount = spiel.nodes.length;
  for(let nodeI = 0; nodeI < nodeCount; ++nodeI) {
    if (spiel.nodes[nodeI].id === nodeId) {
      if (nodeI < nodeCount - 1) return spiel.nodes[nodeI+1];
      return nodeI > 0 ? spiel.nodes[nodeI - 1] : null;
    }
  }
  throw Error('Could not find node in spiel.');
}

export function findHighestNodeId(nodes:SpielNode[]):number {
  let highest = -1;
  nodes.forEach(node => { if (node.id > highest) highest = node.id });
  return highest;
}

export function doNodesContainInvalidIds(nodes:SpielNode[]):boolean {
  const count = nodes.length;
  for(let i = 0; i < count; ++i) {
    const id = nodes[i].id;
    if (id < 0) return true;
    for(let j = i + 1; j < count; ++j) {
      if (nodes[j].id === id) return true; // Duplicate.
    }
  }
  return false;
}

export function findCharacterWithMostLines(nodes:SpielNode[]):string | null {
  const lineCounts:any = {};
  let mostLineCount = 0;
  let mostLineCharacter = null;
  nodes.forEach(node => {
    const lineCount:any = lineCounts[node.line.character];
    const newLineCount = lineCount === undefined ? 1 : lineCount + 1;
    lineCounts[node.line.character] = newLineCount;
    if (newLineCount > mostLineCount) {
      mostLineCount = newLineCount;
      mostLineCharacter = node.line.character;
    }
  });
  return mostLineCharacter;
}