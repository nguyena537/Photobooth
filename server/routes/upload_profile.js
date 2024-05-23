const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

const { s3Uploadv2 } = require("../utils/s3");


router.post("/", async (req, res) => {
    try{
        const user = await pool.query("SELECT * FROM users_photo WHERE user_id = $1", [req.user.id]);
        //just for 1 file a.
        req.files[0].originalname = `photo_profile/${user.rows[0].user_id}_${req.files[0].originalname}`
        const img = `https://jwt-postgre-tes.s3.amazonaws.com/${req.files[0].originalname}`;

        await pool.query("UPDATE users_photo SET user_image = $1 WHERE user_id = $2", [img, req.user.id]);

        const result = await s3Uploadv2(req.files);
        console.log(result);

        return res.json({ status: "success", name: img });
    }catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;