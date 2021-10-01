import express from 'express';
const router = express.Router();

import {
    getGoogleAuthPage,
    getUserInfo
} from '../controller/users'

// @disc: get google auth url page
// @route: POST /api/v1/google-oauth
// @access: private(logged in user)
router.get('/api/v1/google-oauth', getGoogleAuthPage);

// @disc: get user info from google api
// @route: POST /auth/google
// @access: private(logged in user)
router.get('/auth/google', getUserInfo); 

export default router;