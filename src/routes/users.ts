import express from 'express';
const router = express.Router();

import {
    getGoogleAuthPage,
    getUserInfo
} from '../controller/users'

router.get('/api/v1/google-oauth', getGoogleAuthPage);

// @disc: get user info
//
router.get('/auth/google', getUserInfo); 

export default router;