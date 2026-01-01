let counter = 0;

/**
 * Generates deterministic temporary IDs for optimistic updates
 * Uses a counter to ensure uniqueness within the same session
 */
export function generateTempId(): string {
    return `temp-${++counter}`;
}

/**
 * Generates timestamps only on the client side to avoid hydration mismatches
 */
export function getClientTimestamp(): number {
    if (typeof window === 'undefined') {
        return 0; // Return consistent value on server
    }
    return Date.now();
}
