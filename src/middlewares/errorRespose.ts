import { Request, Response, NextFunction } from "express";
import {ErrnoException, ErrorMessage} from '../util/errorHandler';

const errorHandler = (error: ErrnoException & ErrorMessage,req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  if (error.code == '23502') {
    error.status = 400;
    error.message = 'invaild data';
  };

  return res.status(error.status || 503).json({
    saccess: false,
    message: error.message || "Server error"
  })
};

export default errorHandler;