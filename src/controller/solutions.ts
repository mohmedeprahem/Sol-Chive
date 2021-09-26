import express, {application, Request, Response, NextFunction} from 'express';
import { pool } from '../config/db';

// @route: 'POST'  /api/v1/solutions/add
// @disc: add new solution
// @access: private(logged in user)
export const createNewSolution = async (req: Request, res: Response, next: NextFunction) => {
    const user = {
        id: 1
    };

    // valid data

    try {
        const cliant = await pool.connect();
    
        // push new problem in database
        async function createSolutions() {
            try {
                const result = await cliant.query('INSERT INTO solutions(title, link, source, my_solution, perfect_solution, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING solution_id', 
                [req.body.problem.title, req.body.problem.link, req.body.problem.source, req.body.mySolution, req.body.perfectSolution, user.id]
                );
                findTags(req.body.problem.tags, result.rows[0].solution_id);
            } catch (err) {
                console.log(err)
            }

        }
    
        // find ids of tags
        async function findTags(tags: string[], solution_id: number) {
            for (let i = 0; i < tags.length; i++) {
                // find id of tag
                const result = await cliant.query('SELECT tag_id FROM tags WHERE title = $1',
                [tags[i]]);
    
                let tagId;
    
                // create tag if not found
                if (result.rows.length === 0) {
                    tagId = await createTag(tags[i]);
                } else {
                    tagId = result.rows[0].tag_id
                }
    
                // connect tag with problem
                await cliant.query('INSERT INTO tag_solution(tag_id, solution_id) VALUES ($1, $2)',
                [tagId, solution_id]);
            }
            cliant.release();
        };
    
        // create tags if not found in database
        const createTag = async (tag: string) => {
            const result = await cliant.query('INSERT INTO tags(title) VALUES ($1) RETURNING tag_id',
            [tag]);
            console.log(result.rows[0].tag_id)
            return result.rows[0].tag_id;
        };
        
        createSolutions();
    
        // send succesfully respons
        res.status(201).json({
            success: true,
            message: 'solution has created successfully'
        });
    } catch (err) {
        console.log(err)
    }
    
};

// @route: 'GET'  /api/v1/solutions/solutionId
// @disc: get one solution
// @access: private(logged in user)
// export const getOneSolution = async (req: Request, res: Response, next: NextFunction) => {

// }