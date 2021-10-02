import { PoolClient } from "pg";

// Create tags if not found in database
export const createTag = async (tag: string, cliant: PoolClient) => {
    try{
        const result = await cliant.query('INSERT INTO tags(title) VALUES ($1) RETURNING tag_id',
        [tag]);

        return result;
    } catch (error) {
        throw error;
    }
};

// Connect tag with problem
export const connectTagAndSolution = async (tagId: number, solution_id: number | string, cliant: PoolClient) => {
    await cliant.query('INSERT INTO tag_solution(tag_id, solution_id) VALUES ($1, $2)',
    [tagId, solution_id]);
}

// find one tag
export const findTag = async (tagTitle: string, cliant: PoolClient) => {
    const result = await cliant.query('SELECT tag_id FROM tags WHERE title = $1',
    [tagTitle]);

    return result;
}

// Find and create tags
export const findCreateTags = async (tags: string[], solutionId: number | string, cliant: PoolClient) => {
    try {
        // Save tags of solution
        for (let i = 0; i < tags.length; i++) {
            // find tag in database
            let tag = await findTag(tags[i], cliant);
    
            // Create tag if not found
            if (tag.rows.length === 0) {
            tag = await createTag(tags[i], cliant);
            }
    
            await connectTagAndSolution(tag.rows[0].tag_id, solutionId, cliant);
        }
    } catch (error) {
        throw error;
    }
};