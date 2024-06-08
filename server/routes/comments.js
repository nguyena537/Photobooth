const express = require('express');
const pool = require('../db');
const authorization = require('../middleware/authorization');

const router = express.Router();


// Get comments for a post
router.get('/:post_id', authorization, async (req, res) => {
    const { post_id } = req.params;
    const { parent_id } = req.query;

    try {

        let queryText = `
            SELECT 
                c.comment_id,
                c.post_id,
                c.user_id,
                c.date,
                c.comment,
                c.parent_id,
                u.user_username,
                u.user_image
            FROM 
                comments_photo c
            JOIN 
                users_photo u ON c.user_id = u.user_id
            WHERE 
                c.post_id = $1
        `;
        
        const queryParams = [post_id];
        
        if (parent_id) {
            queryText += ' AND c.parent_id = $2';
            queryParams.push(parent_id);
        } else {
            queryText += ' AND c.parent_id IS NULL';
        }
        
        queryText += ' ORDER BY c.date DESC';

        const result = await pool.query(queryText, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }

});



// Add a comment to a post
router.post('/:post_id', authorization, async (req, res) => {
    const { post_id } = req.params;
    const { comment, parent_id } = req.body;
    const user_id = req.user.id;

    try {
        const query = {
            text: 'INSERT INTO comments_photo (post_id, user_id, comment, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
            values: [post_id, user_id, comment, parent_id],
        };

        const result = await pool.query(query);
        const comment_id = result.rows[0].comment_id;

        // Fetch the comment along with the username
        const userCommentQuery = {
            text: `
                SELECT c.*, u.user_username 
                FROM comments_photo c
                JOIN users_photo u ON c.user_id = u.user_id
                WHERE c.comment_id = $1;
            `,
            values: [comment_id],
        };

        const userCommentResult = await pool.query(userCommentQuery);
        res.status(201).json(userCommentResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}); 
// Update a comment
router.put('/:comment_id', authorization, async (req, res) => {
    const { comment_id } = req.params;
    const { comment } = req.body;
    const user_id = req.user.id;

    try {
        const query = {
            text: 'UPDATE comments_photo SET comment = $1 WHERE comment_id = $2 AND user_id = $3 RETURNING *',
            values: [comment, comment_id, user_id],
        };

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found or unauthorized' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a comment
router.delete('/:comment_id', authorization, async (req, res) => {
    const { comment_id } = req.params;
    const user_id = req.user.id;

    try {
        const query = {
            text: 'UPDATE comments_photo SET user_id = $1, comment = $2 WHERE comment_id = $3 AND user_id = $4 RETURNING *',
            values: ['e161c6c4-32f4-4375-949d-8b19bb9abd8c','Comment is deleted', comment_id, user_id],
        };

        const result = await pool.query(query);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found or unauthorized' });
        }



        res.json({ message: 'Comment modified successfully' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;