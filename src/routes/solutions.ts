import express from 'express';
const router = express.Router();

// controllers files
import { 
    createNewSolution,
   /*  getOneSolution */ 
} from '../controller/solutions';



// @route: 'POST'  /api/v1/solutions/add
// @disc: add new solution
// @access: private(logged in user)
router.post('/api/v1/solutions/add', createNewSolution);

// @route: 'GET'  /api/v1/solutions/solutionId
// @disc: get one solution
// @access: private(logged in user)
// router.get('/api/v1/solutions/solutionId', getOneSolution)
export default router;