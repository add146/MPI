import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Create connection pool
const connectionString = process.env.DATABASE_URL!;
const pool = mysql.createPool(connectionString);

// Create database instance
export const db = drizzle(pool, { schema, mode: 'default' });

// Export schema
export * from './schema';

// Export types
export type Database = typeof db;
