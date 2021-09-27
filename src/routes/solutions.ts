import express from 'express';
const router = express.Router();

// controllers files
import { 
    createNewSolution,
    getOneSolution,
    editOneSolution,
    deleteOneSoluation
} from '../controller/solutions';



// @route: 'POST'  /api/v1/solutions/add
// @disc: add new solution
// @access: private(logged in user)
router.post('/api/v1/solutions/add', createNewSolution);

// @route: 'GET'  /api/v1/solutions/:solutionId
// @disc: get one solution
// @access: private(logged in user)
router.get('/api/v1/solutions/:solutionId', getOneSolution)

// @route: 'PUT'  /api/v1/solutions/:solutionId
// @disc: edit one solution
// @access: private(logged in user)
router.put('/api/v1/solutions/:solutionId', editOneSolution)

// @route: 'DELETE'  /api/v1/solutions/:solutionId
// @disc: delete one solution
// @access: private(logged in user)
router.delete('/api/v1/solutions/:solutionId', deleteOneSoluation);
export default router;