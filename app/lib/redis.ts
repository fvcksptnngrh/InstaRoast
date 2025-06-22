import { Redis } from '@upstash/redis'

// Mock Redis client for development when env vars aren't set
const createMockRedis = () => ({
  get: async () => null,
  set: async () => 'OK',
  incr: async () => 1,
  expire: async () => 1,
  del: async () => 1,
  zrange: async () => [],
  zadd: async () => 1,
  zremrangebyscore: async () => 1,
  pipeline: () => ({
    incr: () => ({ incr: () => ({}) }),
    set: () => ({ set: () => ({}) }),
    exec: async () => [1, 'OK'],
  }),
});

// Create Redis client or mock based on environment variables
export const redis = (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) 
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : createMockRedis() as any;