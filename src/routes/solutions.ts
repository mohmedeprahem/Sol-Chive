import express from 'express';
const router = express.Router();

// middlewares folder
import {userAuthoAfterLogedIn} from '../middlewares/authorization'

// controllers files
import { 
    createNewSolution,
    getOneSolution,
    editOneSolution,
    deleteOneSolution,
    getAllSolutions
} from '../controller/solutions';



// @route: 'POST'  /api/v1/solutions/add
// @disc: add new solution
// @access: private(logged in user)
router.post('/api/v1/solutions/add', userAuthoAfterLogedIn, createNewSolution);

// @route: 'GET'  /api/v1/solutions/:solutionId
// @disc: get one solution
// @access: private(logged in user)
router.get('/api/v1/solutions/:solutionId', userAuthoAfterLogedIn, getOneSolution)

// @route: 'PUT'  /api/v1/solutions/:solutionId
// @disc: edit one solution
// @access: private(logged in user)
router.put('/api/v1/solutions/:solutionId', userAuthoAfterLogedIn, editOneSolution)

// @route: 'DELETE'  /api/v1/solutions/:solutionId
// @disc: delete one solution
// @access: private(logged in user)
router.delete('/api/v1/solutions/:solutionId', userAuthoAfterLogedIn, deleteOneSolution);

// @route: 'GET'  /api/v1/solutions
// @disc: list all solutions
// @access: private(logged in user)
router.get('/api/v1/solutions', userAuthoAfterLogedIn, getAllSolutions);
export default router;