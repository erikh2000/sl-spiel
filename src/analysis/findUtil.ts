import Spiel from '../types/Spiel';
import SpielNode from '../types/SpielNode';

export function findAdjacentNode(spiel:Spiel, nodeIndex:number):SpielNode | null {
  if (!spiel.nodes.length) throw Error('Spiel is empty.');
  const nodeCount = spiel.nodes.length;
  if (nodeIndex < nodeCount - 1) return spiel.nodes[nodeIndex+1];
  return nodeIndex > 0 ? spiel.nodes[nodeIndex - 1] : null;
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