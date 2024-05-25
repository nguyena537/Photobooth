const express = require('express');
const router = express.Router();
const pool = require("../db");

const authorization = require('../middleware/authorization');
// Add Friend

router.post('/addfriend', authorization, async (req, res) => {
    try {
        const { user_0_id } = req.body;

        // Check if users are already friends


        const query = {
            text: 'SELECT * FROM friends_photo WHERE (user_0_id = $1 AND user_1_id = $2) OR (user_0_id = $2 AND user_1_id = $1)',
            values: [user_0_id, req.user.id],
        };

        const result = await pool.query(query);

        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'Users are already friends' });
        }

        // Add friendship
        const addQuery = {
            text: 'INSERT INTO friends_photo (user_0_id, user_1_id) VALUES ($1, $2)',
            values: [user_0_id, req.user.id],
        };

        await pool.query(addQuery);
        
        res.status(200).json({ message: 'Friend added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove Friend
router.post('/removefriend', authorization, async (req, res) => {
    try {
        const { user_0_id } = req.body;

        // Check if friendship exists
        const query = {
            text: 'SELECT * FROM friends_photo WHERE (user_0_id = $1 AND user_1_id = $2) OR (user_0_id = $2 AND user_1_id = $1)',
            values: [user_0_id, req.user.id],
        };

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Friendship not found' });
        }

        // Remove friendship
        const removeQuery = {
            text: 'DELETE FROM friends_photo WHERE (user_0_id = $1 AND user_1_id = $2) OR (user_0_id = $2 AND user_1_id = $1)',
            values: [user_0_id, req.user.id],
        };

        await pool.query(removeQuery);
        
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get friends w.

router.get('/getfriends', authorization, async (req, res) => {
    try {
        const query = {
            text: `
                SELECT u.user_id, u.user_username, u.user_email, u.user_image
                FROM friends_photo f
                JOIN users_photo u ON (f.user_0_id = u.user_id OR f.user_1_id = u.user_id)
                WHERE (f.user_0_id = $1 OR f.user_1_id = $1) AND u.user_id != $1
            `,
            values: [req.user.id],
        };

        
        const result = await pool.query(query);
        
        const friends = result.rows.map(row => ({
            user_id: row.user_id,
            user_name: row.user_name,
            user_email: row.user_email,
            user_image: row.user_image
        }));

        res.status(200).json({ friends });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
