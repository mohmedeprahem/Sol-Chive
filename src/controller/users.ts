import axios from 'axios';
import express, {application, Request, Response, NextFunction} from 'express';

// config folder
import {getGoogleAuthURL, getToken} from '../config/googleAuth';

export const getGoogleAuthPage = async (req: Request, res: Response, next: NextFunction) => {
    return res.send(getGoogleAuthURL());
}

export const getUserInfo =  async (req: Request, res: Response, next: NextFunction) => {
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
      ).then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
    console.log(googleUser)
    res.send(googleUser)
};