import express from 'express';
const router = express.Router();

// middlewares folder
import {userAutho} from '../middlewares/authorization'

import {
    getGoogleAuthPage,
    getUserInfoGoogleAuth
} from '../controller/users'

// @disc: get google auth url page
// @route: POST /api/v1/google-oauth
// @access: private(logged in user)
router.get('/api/v1/google-oauth', getGoogleAuthPage);

// @disc: get user info from google api
// @route: POST /auth/google
// @access: private(logged in user)
router.get('/auth/google', getUserInfoGoogleAuth); 

export default router;