import { NodeObject } from "react-force-graph-2d";
import { MapNode } from "../node.model";

interface Interaction {
  name: string;
  status: string;
}

const getCompletedInteractions = (node: NodeObject<MapNode>): string[] => {
  return node.properties.interactions
    .filter((interaction: Interaction) => interaction.status === "Complete")
    .map((interaction: Interaction) => interaction.name);
};

const getSharedInteractions = (
  sourceInteractions: string[],
  targetInteractions: string[]
): string[] => {
  return sourceInteractions.filter((interaction) =>
    targetInteractions.includes(interaction)
  );
};
export const calculateIS = (
  source: NodeObject<MapNode>,
  target: NodeObject<MapNode>,
  centralNode: NodeObject<MapNode>
): number => {
  const centralNodeInteractions = getCompletedInteractions(centralNode);
  // if (centralNodeInteractions.length === 0) {
  //   return 0;
  // }

  const sourceInteractions = getCompletedInteractions(source);
  const targetInteractions = getCompletedInteractions(target);

  // Get only same name/type interactions that both source and target have completed
  const sharedInteractions = getSharedInteractions(
    sourceInteractions,
    targetInteractions
  );

  // Get only interactions that are shared with central node
  const sharedWithCentralNodeInteractions = getSharedInteractions(
    sharedInteractions,
    centralNodeInteractions
  );

  return (
    (sharedWithCentralNodeInteractions.length /
      centralNodeInteractions.length) *
    100
  );
};
