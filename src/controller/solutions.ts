import { Console } from 'console';
import express, {application, Request, Response, NextFunction} from 'express';
import { pool } from '../config/db';
import joiValSolution from '../models/solutions'
import { ErrorMessage } from '../util/errorHandler';

// @route: 'POST'  /api/v1/solutions/add
// @disc: add new solution
// @access: private(logged in user)
export const createNewSolution = async (req: Request, res: Response, next: NextFunction) => {
  const user = {
      id: 1
  };
  try {  
    // validate req.body
    if (!req.body.problem) throw new ErrorMessage(400, 'invalid data');

    const value = await joiValSolution.validate({
      title : req.body.problem.title,
      link: req.body.problem.link, 
      source: req.body.problem.source, 
      my_solution: req.body.mySolution
    });

    if (value.error) {
      throw new ErrorMessage(400, 'invalid data');
    }

    const cliant = await pool.connect();

    // Create new problem by push it to database
    const result = await cliant.query('INSERT INTO solutions(title, link, source, my_solution, perfect_solution, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING solution_id', 
    [req.body.problem.title, req.body.problem.link, req.body.problem.source, req.body.mySolution, req.body.perfectSolution, user.id]);
    console.log(1)
    findTags(req.body.problem.tags, result.rows[0].solution_id);

    // Find ids of tags
    async function findTags(tags: string[], solution_id: number) {

      for (let i = 0; i < tags.length; i++) {
        // Find id of tag
        const result = await cliant.query('SELECT tag_id FROM tags WHERE title = $1',
        [tags[i]]);

        let tagId;

        // Create tag if not found
        if (result.rows.length === 0) {
            tagId = await createTag(tags[i]);
        } else {
            tagId = result.rows[0].tag_id
        }

        // Connect tag with problem
        await cliant.query('INSERT INTO tag_solution(tag_id, solution_id) VALUES ($1, $2)',
        [tagId, solution_id]);
      }
    };

    // Create tags if not found in database
    const createTag = async (tag: string) => {
      const result = await cliant.query('INSERT INTO tags(title) VALUES ($1) RETURNING tag_id',
      [tag]);
      console.log(result.rows[0].tag_id)
      return result.rows[0].tag_id;
    };

    cliant.release();
    
    // Send succesfully respons
    return res.status(201).json({
      success: true,
      message: 'solution has created successfully'
    });
  } catch (err) {
    next(err)
  }
};

// @route: 'GET'  /api/v1/solutions/:solutionId
// @disc: get one solution
// @access: private(logged in user)
export const getOneSolution = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // connect to database

    const cliant = await pool.connect();

    // SELECT solutions.solution_id, solutions.title AS Stilte, tags.title AS Ttilte, link, source, my_solution, perfect_solution FROM solutions LEFT JOIN tag_solution ON solutions.solution_id = $1 AND solutions.solution_id = tag_solution.solution_id LEFT JOIN tags ON tag_solution.tag_id = tags.tag_id LIMIT 5

    // Get soluction from database
    const result = await cliant.query('SELECT solution_id, title, link, source, my_solution, perfect_solution, created_at FROM solutions WHERE solution_id = $1 LIMIT 1', [req.params.solutionId])

    // Check if there result
    if (result.rows.length === 0) throw new ErrorMessage(400, 'invalid id')


    // Get tags of soluction
    const tags = await cliant.query('SELECT title FROM tag_solution INNER JOIN tags ON tag_solution.solution_id = $1 AND tag_solution.tag_id = tags.tag_id', [req.params.solutionId]);
    console.log(tags)
    cliant.release()

    
    // Shape data
    let tag:string[] = []; 

    for(let i = 0; i < tags.rows.length; i++) {
      console.log(tags.rows[i]);
      tag.push(tags.rows[i].title);
    }

    // Send successfuly response
    return res.status(200).json({
      "_id": result.rows[0].solution_id,
      "createdAt": result.rows[0].created_at,
      "problem": {
        "title": result.rows[0].title,
        "link": result.rows[0].link,
        "source": result.rows[0].source,
        "tags": tag
      },
      "mySolution": result.rows[0].my_solution,
      "perfectSolution": {
        "isExist": result.rows[0].perfect_solution ? true : false,
        "code": result.rows[0].perfect_solution ? result.rows[0].perfect_solution : ""
      }
      
    })
    
  } catch (error) {
    next(error)
  }
}

// @route: 'PUT'  /api/v1/solutions/:solutionId
// @disc: edit one solution
// @access: private(logged in user)
export const editOneSolution = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate req.body
    if (!req.body.problem) throw new ErrorMessage(400, 'invalid data');

    const value = await joiValSolution.validate({
      title : req.body.problem.title,
      link: req.body.problem.link, 
      source: req.body.problem.source, 
      my_solution: req.body.mySolution
    });
    
    if (value.error) {
      throw new ErrorMessage(400, 'invalid data');
    };

    // connect to database
    const cliant = await pool.connect();

    // update problem and solutions
    const result = await cliant.query('UPDATE solutions SET title = $1, link = $2, source = $3, my_solution = $4, perfect_solution = $5 WHERE solution_id = $6', 
      [
        req.body.problem.title,
        req.body.problem.link,
        req.body.problem.source,
        req.body.mySolution,
        req.body.perfectSolution,
        req.params.solutionId
      ]
    )

    // delete old tags
    await cliant.query('DELETE FROM tag_solution WHERE solution_id = $1', [req.params.solutionId]);

    // add new tags
    findTags(req.body.problem.tags, req.params.solutionId);

    // Return successfuly response
    return res.status(200).json({
      success: true,
      message: "solution updated successfully"
    })

    // Find ids of tags
    async function findTags(tags: string[], solution_id: number | string) {
      for (let i = 0; i < tags.length; i++) {
        // Find id of tag
        const result = await cliant.query('SELECT tag_id FROM tags WHERE title = $1',
        [tags[i]]);

        let tagId;

        // Create tag if not found
        if (result.rows.length === 0) {
            tagId = await createTag(tags[i]);
        } else {
            tagId = result.rows[0].tag_id
        }

        // Connect tag with problem
        await cliant.query('INSERT INTO tag_solution(tag_id, solution_id) VALUES ($1, $2)',
        [tagId, solution_id]);
      }
    };

    // Create tags if not found in database
    async function createTag(tag: string) {
      const result = await cliant.query('INSERT INTO tags(title) VALUES ($1) RETURNING tag_id',
      [tag]);
      console.log(result.rows[0].tag_id)
      return result.rows[0].tag_id;
    };

  } catch (error) {
    console.log(error)
    next(error)
  }
};

// @route: 'DELETE'  /api/v1/solutions/:solutionId
// @disc: delete one solution
// @access: private(logged in user)
export const deleteOneSoluation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // connect to database
    const cliant = await pool.connect();

    // delete solution
    const result = await cliant.query('DELETE FROM solutions WHERE solution_id = $1', 
    [req.params.solutionId]
    );
    
    if (result.rowCount === 0) throw new ErrorMessage(400, 'invalid id')

    cliant.release();

    // return successfuly response
    return res.status(200).json({
      success: true,
      message: "solution deleted successfully"
    })
  } catch (error) {
    next(error);
  }
}