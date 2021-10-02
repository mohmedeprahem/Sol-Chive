import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export const userAutho = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // check cookie
    if (!req.cookies || !req.cookies.user_jwt) 
    return res.status(401).json({
      success: false,
      message: 'user unauthanticated'
    })

    // check jwt
    const user = jwt.verify(req.cookies.user_jwt, process.env.SECRET_KEY_JWT!);
    // req.user = 'user';

    // return success
    next();
  } catch (error) {
    next(error)
  }
}