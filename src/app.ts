import express from 'express';
import { pool } from './config/db';

// init express
const app: express.Application = express();

// init dotenv
require('dotenv').config({path:`${__dirname}/config/.env`})

// read body => req.body
app.use(express.json());



// connect to server
let port = process.env.PORT || 5000;
app.listen(3000, () => console.log(`connect to port ${port}...`));