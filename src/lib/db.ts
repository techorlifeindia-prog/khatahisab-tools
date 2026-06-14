import { Pool } from 'pg';

// Using the local database discovered in the user's workspace
const pool = new Pool({
  connectionString: 'postgresql://postgres:HxgMvYd6u992@127.0.0.1:5432/smart_db'
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
