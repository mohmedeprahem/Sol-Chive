import axios from 'axios';
import { pool } from '../config/db';
import express, {application, Request, Response, NextFunction} from 'express';

// config folder
import {getGoogleAuthURL, getToken} from '../config/googleAuth';

// @disc: get google auth url page
// @route: POST /api/v1/google-oauth
// @access: private(logged in user)
export const getGoogleAuthPage = async (req: Request, res: Response, next: NextFunction) => {
    return res.send(getGoogleAuthURL());
}

// @disc: get user info from google api
// @route: POST /auth/google
// @access: private(logged in user)
export const getUserInfo =  async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string;

    const { id_token, access_token } = await getToken({
      code,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: `${process.env.SERVER_ROOT_URI}/auth/google`,
    })

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

    const cliant = await pool.connect();
    
    // Find user in database
    const result = await cliant.query('INSERT INTO users(email, name, picture) VALUES ($1, $2, $3)', ["mohmedeprahem2014@gmail.com", "mohamed", ":("]);
    // Create new user if not sign up before

    await cliant.release();

    // login user
    // save user info by jwt 

    //connect jwt with coockies

    // return successfully response
  } catch (error) {
    console.log(error)
  }
};