import { CENTRAL_NODE_SIZE, MAX_LINK_THICKNESS } from "./map-constants";
import { calculateIS } from "./is-calculator";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { PLConfig } from "./pl-generator";
import { MapLink, MapNode } from "../node.model";
import { MapAutID } from "@api/models/map.model";

export const linkWidth = (node: LinkObject<MapNode, MapLink>) => {
  return (node.is / 100) * MAX_LINK_THICKNESS;
};

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

export function cloneGraphData(
  data: GraphData<MapNode, LinkObject<MapNode, MapLink>>
): GraphData<MapNode, LinkObject<MapNode, MapLink>> {
  const nodesCopy = data.nodes.map(
    (node: NodeObject<MapNode>) =>
      new MapNode({
        ...node,
        img: node.img instanceof Image ? node.img : undefined
      } as MapNode)
  );
  const linksCopy = data.links.map((link) => ({ ...link }));
  return { nodes: nodesCopy, links: linksCopy } as GraphData<
    MapNode,
    LinkObject<MapNode, MapLink>
  >;
}

function generateNodes(
  plValues: PLConfig[],
  centralNode: NodeObject<MapNode>
): NodeObject<MapNode>[] {
  const nodes: NodeObject<MapNode>[] = [centralNode];

  plValues.forEach((pl) => {
    const usersInLevel = pl.members;
    const angleIncrement = 360 / Math.max(1, usersInLevel.length);

    usersInLevel.forEach((user: MapNode, index) => {
      const userLevel = pl.level;
      const angle = angleIncrement * index;
      const { x, y } = polarToCartesian(0, 0, pl.radius, angle);
      const minPercentage = 0.5;
      const maxPercentage = 0.7;

      const numberOfLevels = plValues.length;
      const decrementStep =
        (maxPercentage - minPercentage) /
        (numberOfLevels > 1 ? numberOfLevels - 1 : 1);

      let nodeSizePercentage: number;
      if (userLevel >= 1 && userLevel <= numberOfLevels) {
        nodeSizePercentage = maxPercentage - decrementStep * (userLevel - 1);
      } else {
        nodeSizePercentage = 1;
      }
      const node = new MapNode({
        ...user,
        x,
        y,
        pl: userLevel,
        size: CENTRAL_NODE_SIZE * nodeSizePercentage,
        color: `hsl(${(pl.level - 1) * 120}, 100%, 70%)`
      } as MapNode);
      nodes.push(node);
    });
  });

  return nodes;
}

function generateLinks(
  centralNode: NodeObject<MapNode>,
  nodes: NodeObject<MapNode>[]
): LinkObject<MapNode, MapLink>[] {
  const linksToCentral: LinkObject<MapNode, MapLink>[] = nodes
    .filter((node) => node.id !== centralNode.id)
    .map((node) => ({
      source: centralNode.id,
      target: node.id,
      is:
        (calculateIS(node, centralNode, centralNode) / 100) *
        MAX_LINK_THICKNESS,
      speed: particleSpeed(centralNode, node, node.pl)
    }));

  const interNodeLinks: LinkObject<MapNode, MapLink>[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].id !== centralNode.id && nodes[j].id !== centralNode.id) {
        const interactionStrength = calculateIS(
          nodes[i],
          nodes[j],
          centralNode
        );
        if (interactionStrength > 0) {
          interNodeLinks.push({
            is: (interactionStrength / 100) * MAX_LINK_THICKNESS,
            source: nodes[i].id,
            target: nodes[j].id,
            speed: particleSpeed(
              nodes[i],
              nodes[j],
              Math.max(nodes[i].pl, nodes[j].pl)
            )
          });
        }
      }
    }
  }

  return [...linksToCentral, ...interNodeLinks];
}

function particleSpeed(
  sourceNode: NodeObject<MapNode>,
  targetNode: NodeObject<MapNode>,
  plLevel: number,
  generalSpeedMultiplier: number = 0.5
): number {
  const baseSpeed = 0.001;
  const isCentral = sourceNode.pl === 0 || targetNode.pl === 0;
  const orthogonal = sourceNode.pl !== targetNode.pl;
  let speed = baseSpeed * generalSpeedMultiplier;

  if (isCentral) {
    speed *= 2;
    speed *= 1 + (3 - plLevel);
  } else {
    speed *= 0.7;
    speed *= 1 + (3 - plLevel);
  }

  if (!orthogonal) {
    speed *= 1.2;
  }

  return Math.min(Math.max(speed, baseSpeed), baseSpeed * 10);
}

export function getParticleColor(link: LinkObject<MapNode, MapLink>): string {
  const source: NodeObject<MapNode> = link.source as NodeObject<MapNode>;
  const target: NodeObject<MapNode> = link.target as NodeObject<MapNode>;
  if (source.pl === 0 || target.pl === 0) {
    return "yellow";
  } else if (source.pl === target.pl) {
    return "cyan";
  } else {
    return "orange";
  }
}

// function generateLinks(
//   centralNode: NodeObject<MapNode>,
//   nodes: NodeObject<MapNode>[]
// ): LinkObject<MapNode, MapLink>[] {
//   const linksToCentral: LinkObject<MapNode, MapLink>[] = nodes
//     .filter((node) => node.id !== centralNode.id)
//     .map((node) => ({
//       source: centralNode.id,
//       target: node.id,
//       is:
//         (calculateIS(node, centralNode, centralNode) / 100) * MAX_LINK_THICKNESS
//     }));

//   const interNodeLinks: LinkObject<MapNode, MapLink>[] = [];
//   for (let i = 0; i < nodes.length; i++) {
//     for (let j = i + 1; j < nodes.length; j++) {
//       if (nodes[i].id !== centralNode.id && nodes[j].id !== centralNode.id) {
//         const interactionStrength = calculateIS(
//           nodes[i],
//           nodes[j],
//           centralNode
//         );

//         if (interactionStrength === 0) {
//           continue;
//         }

//         interNodeLinks.push({
//           is: (interactionStrength / 100) * MAX_LINK_THICKNESS,
//           source: nodes[i].id,
//           target: nodes[j].id
//         });
//       }
//     }
//   }
//   return [...linksToCentral, ...interNodeLinks];
// }

export const generateGraphData = (
  centralAutId: MapAutID,
  plValues: PLConfig[]
): {
  graphData: GraphData<MapNode, LinkObject<MapNode, MapLink>>;
  centralNode: NodeObject<MapNode>;
} => {
  const centralNode = new MapNode({
    ...centralAutId,
    size: CENTRAL_NODE_SIZE,
    color: "red",
    pl: 0,
    x: 0,
    y: 0
  } as MapNode);

  const nodes = generateNodes(plValues, centralNode);
  const links = generateLinks(centralNode, nodes);

  return {
    graphData: { nodes, links },
    centralNode
  };
};
