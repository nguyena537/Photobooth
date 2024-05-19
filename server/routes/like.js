const express = require('express');
const router = express.Router();
const pool = require('../db'); 

const authorization = require('../middleware/authorization'); 


// like a post a .
/*     All or Nothing: Transactions ensure that either all operations within the transaction are executed successfully, or none of them are. If any operation fails, the entire transaction can be rolled back, leaving the database in a consistent state.
    Example: In the given context, when a user likes a post, we need to insert a record into the likes_photo table and increment the like count in the posts_photo table. Both operations should succeed together. If the increment operation fails after inserting the like, the like count would be incorrect without a transaction. */
router.post('/like', authorization, async (req, res) => {
    try {
        const { post_id } = req.body;

        const user_id = req.user.id;


        // Check if the user has already liked the post
        const checkLikeQuery = {
            text: 'SELECT * FROM likes_photo WHERE post_id = $1 AND user_id = $2',
            values: [post_id, user_id],
        };

        const checkLikeResult = await pool.query(checkLikeQuery);

        if (checkLikeResult.rows.length > 0) {
            return res.status(400).json({ error: 'User has already liked this post' });
        }

        // Begin transaction
        await pool.query('BEGIN');

        // Add like to the post
        const addLikeQuery = {
            text: 'INSERT INTO likes_photo (post_id, user_id) VALUES ($1, $2) RETURNING *',
            values: [post_id, user_id],
        };

        const addLikeResult = await pool.query(addLikeQuery);

        // Increment like count in posts_photo
        const incrementLikeQuery = {
            text: 'UPDATE posts_photo SET likes = likes + 1 WHERE post_id = $1 RETURNING *',
            values: [post_id],
        };

        const incrementLikeResult = await pool.query(incrementLikeQuery);

        // Commit transaction
        await pool.query('COMMIT');

        res.status(200).json({ 
            message: 'Post liked successfully', 
            like: addLikeResult.rows[0], 
            post: incrementLikeResult.rows[0]
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;