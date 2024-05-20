const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {
        const user = await pool.query("select * from shoppingList where user_id = $1", [req.user.id]);
        const list = [];
        user.rows.forEach((row) => {
            list.push(row);
        })
        res.json(list);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }


});


// input: lis user_id, ingredient, amount, pric.


router.post("/", authorization, async (req, res) => {
try {
    console.log(req.body);
    const list = req.body;
    
    for(const item of list){
        await pool.query(
        "INSERT INTO shoppingList (ingredient, amount, price, user_id) VALUES ($1, $2, $3, $4)",
        [item.ingredient, item.amount, item.price, req.user.id]
    );}
    

    res.json(req.body);
} catch (err) {
    console.error(err.message);
}
});



//delete all items with id.

router.delete("/", authorization, async (req, res) => {

try {
    const deleteTodo = await pool.query(
    "DELETE FROM shoppingList WHERE user_id = $1",
    [req.user.id]
    );


    res.json("Todo was deleted");
} catch (err) {
    console.error(err.message);
}
});

module.exports = router;
