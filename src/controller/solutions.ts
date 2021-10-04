import express, {application, Request, Response, NextFunction} from 'express';
import { pool } from '../config/db';
import joiValSolution from '../models/solutions'
import { ErrorMessage } from '../util/errorHandler';

// util folder
import { findCreateTags, createTag, connectTagAndSolution, findTag} from '../util/tags'

// @route: 'POST'  /api/v1/solutions/add
// @disc: add new solution
// @access: private(logged in user)
export const createNewSolution = async (req: Request, res: Response, next: NextFunction) => {
  try {  
    // Validate req.body
    const body = req.body;
    if (!body.problem) throw new ErrorMessage(400, 'invalid data');

    const value = await joiValSolution.validate({
      title : body.problem.title,
      link: body.problem.link, 
      source: body.problem.source, 
      my_solution: body.mySolution
    });

    // Throw error if req.body invalid
    if (value.error) {
      throw new ErrorMessage(400, 'invalid data');
    }

        
    // connect to database
    const cliant = await pool.connect();

    // Create new problem by push it to database
    const solution = await cliant.query('INSERT INTO solutions(title, link, source, my_solution, perfect_solution, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING solution_id', 
    [body.problem.title, body.problem.link, body.problem.source, body.mySolution, body.perfectSolution, req.user!.id]);
    
    // Save tags of solution
    await findCreateTags(body.problem.tags, solution.rows[0].solution_id, cliant);

    // disconnect to database
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

    // Get soluction from database
    const result = await cliant.query('SELECT solution_id, title, link, source, my_solution, perfect_solution, created_at FROM solutions WHERE solution_id = $1 LIMIT 1', [req.params.solutionId])

    // Check if there result
    if (result.rows.length === 0) throw new ErrorMessage(400, 'invalid id')


    // Get tags of soluction
    const tags = await cliant.query('SELECT title FROM tag_solution INNER JOIN tags ON tag_solution.solution_id = $1 AND tag_solution.tag_id = tags.tag_id', [req.params.solutionId]);
    console.log(tags)
    cliant.release()

    
    // Shape data response
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

    // update solution
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
    await findCreateTags(req.body.problem.tags, req.params.solutionId, cliant);

    // Return successfuly response
    return res.status(200).json({
      success: true,
      message: "solution updated successfully"
    });
  } catch (error) {
    console.log(error)
    next(error)
  }
};

// @route: 'DELETE'  /api/v1/solutions/:solutionId
// @disc: delete one solution
// @access: private(logged in user)
export const deleteOneSolution = async (req: Request, res: Response, next: NextFunction) => {
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
};

// @route: 'GET'  /api/v1/solutions
// @disc: list all solutions
// @access: private(logged in user)
export const getAllSolutions = async (req: Request, res: Response, next: NextFunction) => {
  // connect to database
  const cliant = await pool.connect();

  // get all solutions
  const result = await cliant.query("SELECT s.solution_id AS _id, json_build_object('title', s.title, 'tags', ARRAY_AGG(t.title), 'link', s.link, 'source', s.source) problem, s.my_solution AS mySolution, s.created_at AS createdAt, json_build_object('isExist', CASE WHEN (perfect_solution IS NULL OR perfect_solution = '') THEN false ELSE true END) perfectSolution FROM solutions s LEFT JOIN tag_solution ts ON s.user_id = $1 AND s.solution_id = ts.solution_id LEFT JOIN tags t ON ts.tag_id = t.tag_id GROUP BY s.solution_id", 
  [req.user!.id]);
  
  // disconnect to databse
  cliant.release();

  // return successfuly response
  return res.status(200).json(result.rows);
}