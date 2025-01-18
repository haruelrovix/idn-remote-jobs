import * as dotenv from 'dotenv';

// Load environment variables manually
dotenv.config();

export const SembojaConfig = {
  API_URL: process.env.SEMBOJA_API_URL,
  API_KEY: process.env.SEMBOJA_API_KEY,
};
