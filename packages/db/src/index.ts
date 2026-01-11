import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

// Create database instance
export const db = drizzle(client, { schema });

// Export schema
export * from './schema';

// Export types
export type Database = typeof db;
