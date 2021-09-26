// packages requirement
import express from 'express';

// routes files
import solutionsRoutes from './routes/solutions'

// init express
const app: express.Application = express();

// init dotenv
require('dotenv').config({path: `${__dirname}/config/.env`});

// read body => req.body
app.use(express.json());

// routes api's
app.use(solutionsRoutes);


// connect to server
let port = process.env.PORT || 5000;
app.listen(3000, () => console.log(`connect to port ${port}...`));