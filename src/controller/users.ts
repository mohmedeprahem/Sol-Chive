import axios from 'axios';
import { pool } from '../config/db';
import express, {application, Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

// config folder
import {getGoogleAuthURL, getToken} from '../config/googleAuth';

// util folder
import { findUser, findOrInsertUser } from '../util/user';

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
    
    // find or Create new user if not sign up before
    const userInfo = await findOrInsertUser(googleUser.email, googleUser.name, googleUser.picture, cliant);
    
    cliant.release();
    
    // login user
    // save user info by jwt
    const token = jwt.sign({ 
      user: {
        id: userInfo.rows[0].user_id,
      } 
    }, process.env.SECRET_KEY_JWT!, { expiresIn: '90d' });

    //connect jwt with coockiess
    res.cookie('user_jwt', token, {
      maxAge: 1000 * 60 * 60 * 24 * 90,
      secure: process.env.NODE_ENV === 'production'? true: false
    });

    // return successfully response
    return res.status(200).json({
      success: true,
      message: "user loged in successfully."
    });
  } catch (error) {
    next(error)
  }
};