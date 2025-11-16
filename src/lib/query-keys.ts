// Query key factory for consistent cache management
export const QueryKeys = {
  // Requests
  requests: () => ['requests'] as const,
  request: (id: string) => ['requests', id] as const,
  
  // Equipment
  equipment: () => ['equipment'] as const,
  equipmentItem: (id: string) => ['equipment', id] as const,
  
  // Songs  
  songs: () => ['songs'] as const,
  song: (id: string) => ['songs', id] as const,
  
  // Venues
  venues: () => ['venues'] as const,
  venue: (id: string) => ['venues', id] as const,
  
  // Items
  items: () => ['items'] as const,
  item: (id: string) => ['items', id] as const,
  
  // Status, Priority, Types (these change infrequently)
  statuses: () => ['statuses'] as const,
  priorities: () => ['priorities'] as const,
  requestTypes: () => ['request-types'] as const,
  
  // Comments/Notes
  requestComments: (requestId: string) => ['requests', requestId, 'comments'] as const,
  
  // Storage (for future image caching)
  storage: {
    bucket: (bucketName: string) => ['storage', bucketName] as const,
    file: (bucketName: string, filePath: string) => ['storage', bucketName, filePath] as const,
  },
} as const;

// Helper function to invalidate related queries
export const getInvalidationKeys = {
  onRequestUpdate: (requestId: string) => [
    QueryKeys.requests(),
    QueryKeys.request(requestId),
  ],
  onEquipmentUpdate: (equipmentId: string) => [
    QueryKeys.equipment(),
    QueryKeys.equipmentItem(equipmentId),
  ],
  onSongUpdate: (songId: string) => [
    QueryKeys.songs(),
    QueryKeys.song(songId),
  ],
  onVenueUpdate: (venueId: string) => [
    QueryKeys.venues(),
    QueryKeys.venue(venueId),
  ],
  onCommentAdd: (requestId: string) => [
    QueryKeys.requests(),
    QueryKeys.request(requestId),
    QueryKeys.requestComments(requestId),
  ],
};
