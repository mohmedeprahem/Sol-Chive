import { Pool } from 'pg';

// init database
export const pool = new Pool({
    connectionString:
    "postgresql://postgres:mysecretpassword@localhost:5432/sol_chive",
});