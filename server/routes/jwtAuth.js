const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

const jwtGenerator = require("../utils/jwtGenerator");
//registe:


router.post("/register", async (req, res) => {
    try {
        const { username, name, email, password } = req.body;
        const user = await pool.query("select * from users_photo where user_email = $1",[email]);
        if(user.rows.length !==0){
            return res.status(401).send("User already exists");
        }
        const role = "user";
        const salt = await bcrypt.genSalt(10);
        const bcryptPwd = await bcrypt.hash(password, salt);
        const newUser = await pool.query("insert into users_photo (user_name, role, user_email, user_password, user_username) values ($1, $2, $3, $4, $5) returning *", [name, role, email, bcryptPwd, username]);
        const token = jwtGenerator(newUser.rows[0].user_id, role);
        //json.sign return a token, which is a string, pass it as a json object.
        res.json({token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("select * from users_photo where user_email = $1",[email]);
        if(user.rows.length === 0){
            return res.status(401).send("Password or Email is incorrect");
        }
        const valid = await bcrypt.compare(password, user.rows[0].user_password);
        if(!valid){
            return res.status(401).send("Password or Email is incorrect")
        }
        const token = jwtGenerator(user.rows[0].user_id, user.rows[0].role);
        res.json({token});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//in case store token in local storage and refresh page?
//no token: 401
//expired token: 403.
router.post("/verify", require("../middleware/authorization"), async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



module.exports = router;