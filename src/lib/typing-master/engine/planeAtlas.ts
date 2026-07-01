export const PLANE_ATLAS_SVG_PATH = "/game-assets/atlas/planes.svg";

export const PLANE_ATLAS_VIEWBOX = "0 0 1059.6961 705.90293";

export const PLANE_ATLAS_GROUP_IDS = [
  "g13823",
  "g13829",
  "g13841",
  "g13873",
  "g13903",
] as const;

export type PlaneAtlasGroupId = (typeof PLANE_ATLAS_GROUP_IDS)[number];

export const pickRandomPlaneAtlasGroupId = (): PlaneAtlasGroupId => {
  const index = Math.floor(Math.random() * PLANE_ATLAS_GROUP_IDS.length);
  return PLANE_ATLAS_GROUP_IDS[index];
};
