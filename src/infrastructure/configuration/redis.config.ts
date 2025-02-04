import * as dotenv from 'dotenv';

// Load environment variables manually
dotenv.config();

export const RedisConfig = {
  REDIS_URL: process.env.REDIS_URL,
  IS_SEARCH_ENABLED: process.env.REDIS_SEARCH_ENABLED === 'true',
  CACHE_TTL: Number(process.env.REDIS_CACHE_TTL ?? '600'), // 10 minutes in seconds
};
