/**
 * Simple in-memory cache with TTL (time-to-live)
 * Reduces RPC calls by caching frequently accessed data
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  /**
   * Get cached data if still valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Cache expired
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Set cache with TTL in milliseconds
   */
  set<T>(key: string, data: T, ttlMs: number = 30000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }
  
  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Invalidate all cache entries matching a prefix
   */
  invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton cache instance
export const cache = new SimpleCache();

// Cache keys
export const CACHE_KEYS = {
  ALL_LISTINGS: 'listings:all',
  ALL_RESALE_LISTINGS: 'listings:resale:all',
  PLATFORM_CONFIG: 'platform:config',
  LISTING: (id: string) => `listing:${id}`,
  PAYOUT_POOL: (id: string) => `payout:${id}`,
  USER_OWNED: (wallet: string) => `user:owned:${wallet}`,
  USER_CREATED: (wallet: string) => `user:created:${wallet}`,
};

// Cache TTLs (in milliseconds)
export const CACHE_TTL = {
  LISTINGS: 30 * 1000,      // 30 seconds - listings change infrequently
  PAYOUT_POOL: 60 * 1000,   // 60 seconds - payout pools change rarely
  PLATFORM_CONFIG: 5 * 60 * 1000,  // 5 minutes - almost never changes
  USER_DATA: 15 * 1000,     // 15 seconds - user-specific data
};

/**
 * Invalidate all listing-related caches
 * Call this after create, buy, resale, etc.
 */
export function invalidateListingCaches(): void {
  cache.invalidatePrefix('listings:');
  cache.invalidatePrefix('listing:');
  cache.invalidatePrefix('user:');
}

/**
 * Invalidate user-specific caches
 */
export function invalidateUserCaches(wallet: string): void {
  cache.invalidate(CACHE_KEYS.USER_OWNED(wallet));
  cache.invalidate(CACHE_KEYS.USER_CREATED(wallet));
}


