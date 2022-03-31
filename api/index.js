const express = require("express");
const app = express();
const cors = require("cors");
const client = require("./database");
client.connect();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
// add newsletter email
app.post("/newsletter", async(req, res) => {
    try {
        const email = req.body.email;
        const newEmail = await client.query("INSERT INTO newsletter (email) VALUES($1) RETURNING *", [email]);
        res.json(newEmail.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

// get all newsletter emails
app.get("/newsletter", async(req, res) => {
    try {
        const emails = await client.query("SELECT * FROM newsletter");
        res.json(emails.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// delete newsletter emails
app.delete("/newsletter", async(req, res) => {
    try {
        await client.query("DELETE FROM newsletter");
        res.json("Newsletter emails were deleted");
    } catch (error) {
        console.error(err.message);
    } 
})

// create user
app.post("/register", async(req, res) => {
    try {
        const account = req.body;
        const username = account.username;
        const password = account.password;
        const firstname = account.firstname;
        const lastname = account.lastname;
        const email = account.email;
        const phone = account.phone;
        const country = account.country;
        const address = account.address;
        const postcode = account.postcode;
        const taxcode = account.taxcode;
        const visitor = account.visitor;
        const approved = account.approved;

        const newUser = await client.query("INSERT INTO account (username, password, firstname, lastname, email, phone, country, address, postcode, taxcode, visitor, approved) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) RETURNING *",[username, password, firstname, lastname, email, phone, country, address, postcode, taxcode, visitor, approved]);
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

// login
app.post("/login", async(req, res) => {
    try {
        const account = req.body;
        const username = account.username;
        const password = account.password;

        await client.query("SELECT * FROM account WHERE username = $1 AND password = $2)", [username, password]);
        res.json("User is logged in");
    } catch (err) {
        console.error(err.message);
    }
})
// get users
app.get("/users", async(req, res) => {
    try {
        const users = await client.query("SELECT * FROM account");
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// get a user
app.get("/users/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const user = await client.query("SELECT * FROM account WHERE id =  $1", [id]);
        res.json(user.rows);
    } catch (err) {
        console.error(err.message);
    } 
})

// delete a user
app.delete("/users/:id", async(req, res) => {
    try {
        const id = req.params.id;
        await client.query("DELETE FROM account WHERE id = $1", [id]);
        res.json("User was deleted");
    } catch (error) {
        console.error(err.message);
    } 
})


app.listen(5000, () => {
    console.log("API listening at http://localhost:5000")
});