// packages requirement
import express from 'express';
import cookieParser from 'cookie-parser'

// routes files
import solutionsRoutes from './routes/solutions';
import userRoutes from './routes/users'

// middlewares files
import errorResponse from './middlewares/errorRespose';

// init express
const app: express.Application = express();

// init dotenv
require('dotenv').config({path: `${__dirname}/config/.env`});

// init cookieParser
app.use(cookieParser())

// read body => req.body
app.use(express.json());

// routes api's
app.use(solutionsRoutes);
app.use(userRoutes);

// error handler
app.use(errorResponse);


// connect to server
let port = process.env.PORT || 5000;
app.listen(3000, () => console.log(`connect to port ${port}...`));