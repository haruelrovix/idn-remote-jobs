import * as dotenv from 'dotenv';

// Load environment variables manually
dotenv.config();

export const RedisConfig = {
  REDIS_URL: process.env.REDIS_URL,
};
