import { Redis } from '@upstash/redis';

// Initialize Redis client
// Get these from https://console.upstash.com/
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Cache TTL in seconds
export const CACHE_TTL = {
  LISTINGS: 30,        // Primary listings - 30 seconds
  RESALE: 30,          // Resale listings - 30 seconds
  SINGLE_LISTING: 15,  // Individual listing - 15 seconds
  CREATOR: 60,         // Creator profile - 1 minute
};

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Get data from cache
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get<CachedData<T>>(key);
    if (cached) {
      return cached.data;
    }
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set data in cache with TTL
 */
export async function setInCache<T>(key: string, data: T, ttlSeconds: number): Promise<void> {
  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    await redis.set(key, cacheData, { ex: ttlSeconds });
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

/**
 * Invalidate cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export default redis;

