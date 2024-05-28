const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

const { s3Uploadv2 } = require("../utils/s3");


router.get("/", authorization, async (req, res) => {
    try {
        const userId = req.user.id;

        // Query to get posts from friends sorted by created_at
        const friendsPostsQuery = 
        
        `
            SELECT p.*, u.user_username, u.user_image, 
            EXISTS (SELECT 1 FROM likes_photo l WHERE l.post_id = p.post_id AND l.user_id = $1) AS liked
            FROM posts_photo p
            JOIN friends_photo f ON (p.user_id = f.user_0_id OR p.user_id = f.user_1_id)
            JOIN users_photo u ON p.user_id = u.user_id
            WHERE (f.user_0_id = $1 OR f.user_1_id = $1) AND p.user_id != $1
            ORDER BY p.created_at DESC
            LIMIT 100;
        `;
        const friendsPostsResult = await pool.query(friendsPostsQuery, [userId]);

        // Calculate the number of remaining posts needed
        const remainingPostsCount = 100 - friendsPostsResult.rows.length;

        let allPosts = friendsPostsResult.rows;

        if (remainingPostsCount > 0) {
            // Query to get random posts excluding the user's own posts and friends' posts
            const randomPostsQuery = `
                SELECT p.*, u.user_username, u.user_image, 
                EXISTS (SELECT 1 FROM likes_photo l WHERE l.post_id = p.post_id AND l.user_id = $1) AS liked
                FROM posts_photo p
                LEFT JOIN friends_photo f ON (p.user_id = f.user_0_id OR p.user_id = f.user_1_id) AND (f.user_0_id = $1 OR f.user_1_id = $1)
                JOIN users_photo u ON p.user_id = u.user_id
                WHERE p.user_id != $1 AND f.user_0_id IS NULL AND f.user_1_id IS NULL
                ORDER BY RANDOM()
                LIMIT $2;
            `;
            const randomPostsResult = await pool.query(randomPostsQuery, [userId, remainingPostsCount]);

            // Combine friends' posts and random posts
            allPosts = allPosts.concat(randomPostsResult.rows);
        }

        res.json(allPosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



// Endpoint to get posts by user ID
router.get("/user/:id", authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Query to get posts by user ID
        const userPostsQuery = `
            SELECT p.*, u.user_username, u.user_image, 
            EXISTS (SELECT 1 FROM likes_photo l WHERE l.post_id = p.post_id AND l.user_id = $1) AS liked
            FROM posts_photo p
            JOIN users_photo u ON p.user_id = u.user_id
            WHERE p.user_id = $2
            ORDER BY p.created_at DESC;
        `;
        
        const userPostsResult = await pool.query(userPostsQuery, [userId, id]);

        // Respond with the user's posts
        res.json(userPostsResult.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



router.post("/", authorization, async (req, res) => {
    try {
        // Check if image file is provided
        if (!req.files) {
            return res.status(400).json({ error: "Image file is required" });
        }

        // Retrieve the authenticated user
        const user = await pool.query("SELECT * FROM users_photo WHERE user_id = $1", [req.user.id]);

        // Process the image file
        const imageFile = req.files[0];
        imageFile.originalname = `posts_photo/${user.rows[0].user_id}_${imageFile.originalname}`;
        const imgURL = `https://jwt-postgre-tes.s3.amazonaws.com/${imageFile.originalname}`;

        // Upload the image file to S3
        const result = await s3Uploadv2([imageFile]);
        console.log(result);

        // Get the description from the form data
        const { description } = req.body;

        // Insert post data into posts_photo table
        const newPost = await pool.query(
            "INSERT INTO posts_photo (user_id, post_image, description) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, imgURL, description]
        );

        // Respond with the new post data
        return res.json({ status: "success", post: newPost.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


//delete a favorite

router.delete("/:id", authorization, async (req, res) => {
try {
    let deleteTodo={};
    const { id } = req.params;
    if(req.user.role === "admin"){
        deleteTodo = await pool.query(
        "DELETE FROM posts_photo WHERE post_id = $1 RETURNING *",
        [id]
        );
    }
    else{
        deleteTodo = await pool.query(
        "DELETE FROM posts_photo WHERE post_id = $1 AND user_id = $2 RETURNING *",
        [id, req.user.id]
        );
    }

    if (deleteTodo.rows.length === 0) {
    return res.json("nothing to delete.");
    }

    res.json("post was delete.");
} catch (err) {
    console.error(err.message);
}
});




router.get("/:id", authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Query to get post details along with user name and image
        const postQuery = `
            SELECT p.*, u.user_username, u.user_image, 
            EXISTS (SELECT 1 FROM likes_photo l WHERE l.post_id = p.post_id AND l.user_id = $1) AS liked
            FROM posts_photo p
            JOIN users_photo u ON p.user_id = u.user_id
            WHERE p.post_id = $2;
        `;
        
        const postResult = await pool.query(postQuery, [userId, id]);

        // Check if the post exists
        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Respond with the post details and user information
        res.json(postResult.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



module.exports = router;