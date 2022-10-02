import Spiel from 'types/Spiel';
import SpielNode from 'types/SpielNode';

export function replaceNode(spiel:Spiel, newNode:SpielNode) {
  const nodeCount = spiel.nodes.length;
  for(let nodeI = 0; nodeI < nodeCount; ++nodeI) {
    if (spiel.nodes[nodeI].id === newNode.id) {
      spiel.nodes[nodeI] = newNode;
      return;
    }
  }
}

export function removeNode(spiel:Spiel, nodeId:number) {
  spiel.nodes = spiel.nodes.filter(node => node.id !== nodeId);
}

export function reassignNodeIds(spiel:Spiel) {
  spiel.nextNodeId = 0;
  spiel.nodes.forEach(node => node.id = spiel.nextNodeId++);
}