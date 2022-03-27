const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES

// create user
app.post("/user", async(req, res) => {
    try {
        console.log(req.body);
        const { user } = req.body;
        const newUser = await pool.query("INSERT INTO user (user) VALUES($1)",[user]);
        res.json(newUser);
    } catch (err) {
        console.error(err.message);
    }
})

// get users
app.get("/users", async(req, res) => {
    try {
        const users = await pool.query("SELECT * FROM user");
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// get a user
app.get("/users/:id", async(req, res) => {
    try {
        console.log(req.params);
        const { id } = req.params;
        const user = await pool.query("SELECT * FROM user WHERE id =  $1", [id]);
        res.json(user.rows);
    } catch (error) {
        console.error(err.message);
    } 
})

// update a user
app.put("/users/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { user } = req.body;
        const updateUser = await pool.query("UPDATE user SET user = $1 WHERE id = $2", [user, id]);
        res.json("User was updated");
    } catch (error) {
        console.error(err.message);
    } 
})

// delete a user
app.delete("/users/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query("DELETE FROM user WHERE id = $1", [id]);
        res.json("User was deleted");
    } catch (error) {
        console.error(err.message);
    } 
})


app.listen(3000, () => {
    console.log("API listening at http://localhost:3000")
});