import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'scripts', '.env') });

// Validate that the DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTableQuery = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT,
    email_provider TEXT NOT NULL,
    team_size TEXT NOT NULL,
    email_volume TEXT NOT NULL,
    pain_points TEXT[] NOT NULL,
    other_challenge TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now()
  );
`;

const alterTableQuery = `
  ALTER TABLE submissions ADD COLUMN IF NOT EXISTS other_challenge TEXT;
`;

async function migrateDatabase() {
  let client;
  try {
    client = await pool.connect();
    await client.query(createTableQuery);
    console.log('Table "submissions" created or already exists.');
    await client.query(alterTableQuery);
    console.log('Ensured "other_challenge" column exists.');
  } catch (err) {
    console.error('Error during database migration:', err);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

migrateDatabase();