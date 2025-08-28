// Mock catalogs for demo. Replace with API calls later.
export const equipmentCatalog = [
  { id: "eq1", name: "Camera A", available: true },
  { id: "eq2", name: "Tripod", available: false },
  { id: "eq3", name: "Mic Wireless", available: true },
  { id: "eq4", name: "Lighting Kit", available: true },
] as const;

export const songsCatalog = [
  { id: "s1", title: "Song Alpha", artist: "Band X", available: true },
  { id: "s2", title: "Song Beta", artist: "Band Y", available: true },
  { id: "s3", title: "Song Gamma", artist: "Band Z", available: false },
] as const;
