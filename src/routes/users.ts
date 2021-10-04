import express from 'express';
const router = express.Router();

// middlewares folder
import { 
    userAuthoAfterLogedIn, 
    userAuthoLogedOut
} from '../middlewares/authorization'

import {
    getGoogleAuthPage,
    getUserInfoGoogleAuth,
    getUserInfo,
    logout
} from '../controller/users'

// @disc: get google auth url page
// @route: POST /api/v1/google-oauth
// @access: private(lgeed out user)
router.get('/api/v1/google-oauth', userAuthoLogedOut, getGoogleAuthPage);

// @disc: get user info from google api
// @route: POST /auth/google
// @access: private(lgeed out user)
router.get('/auth/google', userAuthoLogedOut, getUserInfoGoogleAuth);


// @disc: get user info from database
// @route: GET '/api/v1/user'
// @access: private(logged in user)
router.get('/api/v1/user', userAuthoAfterLogedIn, getUserInfo)

// @disc: logout
// @route: DELETE /api/v1/logout
// @access: private(logged in user)
router.delete('/api/v1/logout', userAuthoAfterLogedIn, logout);

export default router;