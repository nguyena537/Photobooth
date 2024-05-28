const express = require('express');
const router = express.Router();
const pool = require('../db'); 

const authorization = require('../middleware/authorization'); 
// like or unlike a post

/*     All or Nothing: Transactions ensure that either all operations within the transaction are executed successfully, or none of them are. If any operation fails, the entire transaction can be rolled back, leaving the database in a consistent state.
    Example: In the given context, when a user likes a post, we need to insert a record into the likes_photo table and increment the like count in the posts_photo table. Both operations should succeed together. If the increment operation fails after inserting the like, the like count would be incorrect without a transaction. */
router.post('/', authorization, async (req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.user.id;

        // Check if the user has already liked the post
        const checkLikeQuery = {
            text: 'SELECT * FROM likes_photo WHERE post_id = $1 AND user_id = $2',
            values: [post_id, user_id],
        };

        const checkLikeResult = await pool.query(checkLikeQuery);

        // Begin transaction
        await pool.query('BEGIN');

        let message;
        let likeResult;
        let postResult;


        
        if (checkLikeResult.rows.length > 0) {
            // User has already liked the post, so remove the like
            const removeLikeQuery = {
                text: 'DELETE FROM likes_photo WHERE post_id = $1 AND user_id = $2 RETURNING *',
                values: [post_id, user_id],
            };
            likeResult = await pool.query(removeLikeQuery);

            // Decrement like count in posts_photo
            const decrementLikeQuery = {
                text: 'UPDATE posts_photo SET likes = likes - 1 WHERE post_id = $1 RETURNING *',
                values: [post_id],
            };
            postResult = await pool.query(decrementLikeQuery);

            message = 'Post unliked successfully';
        } else {
            // User has not liked the post yet, so add the like
            const addLikeQuery = {
                text: 'INSERT INTO likes_photo (post_id, user_id) VALUES ($1, $2) RETURNING *',
                values: [post_id, user_id],
            };
            likeResult = await pool.query(addLikeQuery);

            // Increment like count in posts_photo
            const incrementLikeQuery = {
                text: 'UPDATE posts_photo SET likes = likes + 1 WHERE post_id = $1 RETURNING *',
                values: [post_id],
            };
            postResult = await pool.query(incrementLikeQuery);

            message = 'Post liked successfully';
        }

        // Commit transaction
        await pool.query('COMMIT');

        res.status(200).json({ 
            message: message, 
            like: likeResult.rows[0], 
            post: postResult.rows[0]
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;