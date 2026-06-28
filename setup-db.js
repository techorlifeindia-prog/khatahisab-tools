const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:HxgMvYd6u992@127.0.0.1:5432/smart_db'
});

async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dynamic_qrs (
        id SERIAL PRIMARY KEY,
        short_id TEXT UNIQUE NOT NULL,
        destination_url TEXT NOT NULL,
        qr_type TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scan_analytics (
        id SERIAL PRIMARY KEY,
        qr_id INTEGER REFERENCES dynamic_qrs(id) ON DELETE CASCADE,
        scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_agent TEXT,
        referer TEXT
      );
    `);

    // SaaS Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        plan TEXT DEFAULT 'free',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS connected_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        provider TEXT NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        business_profile_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Database tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    pool.end();
  }
}

setup();
