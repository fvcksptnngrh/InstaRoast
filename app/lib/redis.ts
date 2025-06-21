import { Redis } from '@upstash/redis'

if (!process.env.KV_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error('KV_URL and KV_REST_API_TOKEN environment variables are not set')
}

export const redis = new Redis({
  url: process.env.KV_URL,
  token: process.env.KV_REST_API_TOKEN,
}) 