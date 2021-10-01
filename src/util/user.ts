import {PoolClient} from 'pg';

// get user info in database
export const findUser = async (email: string, cliant: PoolClient, id?: number | string) => {
  try {
    // find user
    const result = await cliant.query('INSERT INTO users(email, name, picture) VALUES ("mohmedeprahem2014@gmail.com", "mohamed", ":(")');

    // return user info
  } catch (error) {
    console.log(error)
  }
}