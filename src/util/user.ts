import {Pool, PoolClient} from 'pg';

// get user info in database
export const findUser = async (email: string, cliant: PoolClient, id?: number | string) => {
  try {
    // find user
    const result = await cliant.query('SELECT * FROM users WHERE email = $1', [email]);
    
    // return user info
    return result;
  } catch (error) {
    throw error;
  }
}

// Find or Insert new user if not found by email
export const findOrInsertUser = async (email: string, name: string, picture: string, cliant: PoolClient) => {
  try {
    //find or insert new user in database
    const result = await cliant.query('INSERT INTO users(email, name, picture) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET email  = EXCLUDED.email RETURNING *', [email, name, picture]);

    // return user info
    return result;
  } catch(error) {
    throw error;
  }
  
};