import Spiel from 'types/Spiel';
import SpielNode from 'types/SpielNode';

export function replaceNode(spiel:Spiel, newNode:SpielNode, replaceIndex:number) {
  const nodeCount = spiel.nodes.length;
  for(let nodeI = 0; nodeI < nodeCount; ++nodeI) {
    if (nodeI === replaceIndex) {
      spiel.nodes[nodeI] = newNode;
      return;
    }
  }
}

export function removeNode(spiel:Spiel, removeIndex:number) {
  spiel.nodes = spiel.nodes.filter((node, nodeIndex) => removeIndex !== nodeIndex);
}