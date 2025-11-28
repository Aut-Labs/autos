import { MapAutID, MapData } from "@api/models/map.model";
import { NodeObject } from "react-force-graph-2d";

const PROXIMITY_LEVEL_DETAILS = [
  {
    name: "Same Roles",
    description: "Members with the same role as you."
  },
  {
    name: "Same Hubs",
    description: "Members within the same Hub as you."
  }
  // {
  //   name: "Market",
  //   description: "Members within the same market but different Hubs."
  // },
  // {
  //   name: "Āut Network",
  //   description: "Members from different Hubs across various markets."
  // }
];

export interface PLConfig {
  members: MapAutID[];
  name: string;
  description: string;
  level: number;
  radius: number;
}

export const getProximityLevels = (
  mapData: MapData
): {
  proximityLevels: PLConfig[];
  centralAutId: MapAutID;
} => {
  const centralAutId: MapAutID = mapData.centralNode;
  const autIds: MapAutID[] = mapData.members.filter(
    (member) => member.properties.address !== centralAutId.properties.address
  );
  const rolesMap = new Map<string, MapAutID[]>();
  const hubsMap = new Map<string, MapAutID[]>();
  const processedMembers = new Set<MapAutID>();

  centralAutId.properties.hubs.forEach((hub) => {
    if (!hubsMap.has(hub.name)) {
      hubsMap.set(hub.name, []);
    }
    const autIdHubState = centralAutId.joinedHub(hub.properties.address);
    const roleName = hub.roleName(autIdHubState.role as number);
    if (!rolesMap.has(roleName)) {
      rolesMap.set(roleName, []);
    }
  });

  const { sameRolesMembers, sameHubsDifferentRoles } = autIds.reduce(
    (acc, autId) => {
      if (
        centralAutId.properties.address === autId.properties.address ||
        processedMembers.has(autId)
      ) {
        return acc;
      }

      const existsInAnyOfItsHubsRoles = autId.properties.hubs.some((hub) => {
        const autIdHubState = centralAutId.joinedHub(hub.properties.address);
        if (!autIdHubState) return false;
        const roleName = hub.roleName(autIdHubState.role as number);
        if (rolesMap.has(roleName)) {
          rolesMap.get(roleName).push(autId);
          processedMembers.add(autId);
        }
        return rolesMap.has(roleName);
      });

      if (existsInAnyOfItsHubsRoles) {
        acc.sameRolesMembers.push(autId);
      } else {
        const existsInAnyOfItsHubs = autId.properties.hubs.some((hub) => {
          if (hubsMap.has(hub.name)) {
            hubsMap.get(hub.name).push(autId);
          }
          return hubsMap.has(hub.name);
        });
        if (existsInAnyOfItsHubs) {
          acc.sameHubsDifferentRoles.push(autId);
          processedMembers.add(autId);
        }
      }
      return acc;
    },
    {
      sameRolesMembers: [],
      sameHubsDifferentRoles: []
    }
  );

  const rolesNames = Array.from(rolesMap.keys()).filter(
    (key) => rolesMap.get(key).length > 0
  );
  const sameRolesDescription = `Members with the same roles as you: ${rolesNames.join(", ")}`;
  const hubNames = Array.from(hubsMap.keys()).filter(
    (key) => hubsMap.get(key).length > 0
  );
  const sameHubsDescription = `Members within the same Hubs as you: ${hubNames.join(", ")}`;

  // Assign proximity levels
  const plArrays = [
    {
      members: sameRolesMembers,
      name: PROXIMITY_LEVEL_DETAILS[0]?.name,
      description: sameRolesDescription
    },
    {
      members: sameHubsDifferentRoles,
      name: PROXIMITY_LEVEL_DETAILS[1]?.name,
      description: sameHubsDescription
    }
  ];
  const plValues: PLConfig[] = plArrays.map((plConfig, index) => ({
    level: index + 1,
    radius: (index + 1) * 100,
    ...plConfig
  }));

  return { proximityLevels: plValues, centralAutId };
};

export function calculatePLCircleCentersAndRadii(nodes: NodeObject<any>[]) {
  const circles = {};

  nodes.forEach((node) => {
    if (node.pl > 0) {
      if (!circles[node.pl]) {
        circles[node.pl] = {
          pl: node.pl,
          radius: 0,
          centerX: 0,
          centerY: 0,
          memberCount: 0
        };
      }

      circles[node.pl].radius += Math.sqrt(node.x * node.x + node.y * node.y);
      circles[node.pl].centerX += node.x;
      circles[node.pl].centerY += node.y;
      circles[node.pl].memberCount++;
    }
  });

  Object.keys(circles).forEach((pl) => {
    circles[pl].radius /= circles[pl].memberCount;
    circles[pl].centerX /= circles[pl].memberCount;
    circles[pl].centerY /= circles[pl].memberCount;
  });

  return circles;
}
