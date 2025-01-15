import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Define types for environment variables
const host: string = process.env.REDIS_HOST || 'localhost';
const port: number = parseInt(process.env.REDIS_PORT || '6379', 10);
const password: string | undefined = process.env.REDIS_PASSWORD;

// Enable TLS/SSL if Redis is hosted in a secure environment
const tlsOptions = process.env.REDIS_TLS_ENABLED === 'true' ? { tls: {} } : {};

// Initialize Redis client with TypeScript types
const redisClient = new Redis({
  host: host,
  port: port,
  db: 0,
  password: password,
  ...tlsOptions,
});

// Handle connection to server
redisClient.on('connect', () => {
  console.log('Connected to Redis server!');
});

// Handle ready events
redisClient.on('ready', () => {
  console.log('Redis client ready!');
});

// Handle connection errors
redisClient.on('error', (err: Error) => {
  console.error('Redis client error', err.message, err.stack);
});

export default redisClient;


// Set cache with TTL
export const setCache = async (key: string, value: string, ttl: number): Promise<void> => {
  try {
    // TTL (Time To Live) in seconds
    await redisClient.setex(key, ttl, value);
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error instanceof Error ? error.message : error);
  }
};

// Get cache by key
export const getCache = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error instanceof Error ? error.message : error);
    return null;
  }
};