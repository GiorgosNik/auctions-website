const express = require("express");
const app = express();
const cors = require("cors");
const client = require("./database");
const { encode } = require('./modules/Hashing.js');
const { validateEmail, validatePhoneNumber, validateName } = require('./modules/Validation.js');
const jwt = require("jsonwebtoken");

client.connect();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
// add newsletter email
app.post("/newsletter", async(req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Field cannot be blank' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'You should provide a valid email address' });
        }
        if (email.length > 20) {
            return res.status(400).json({ error: 'Email length is too long' });
        }
        await client.query("SELECT * FROM newsletter WHERE email = $1", [email], function(err, result) {
            if (result.rows.length != 0) {
                return res.status(409).json({ error: 'You have subscribed before' });
            } else {
                const newEmail = client.query("INSERT INTO newsletter (email) VALUES($1) RETURNING *", [email]);
                return res.status(201).json(newEmail);
            }
        });
    } catch (err) {
        console.error(err);
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
        const { username, 
                password, 
                firstname, 
                lastname,
                email,
                phone,
                country,
                address,
                postcode,
                taxcode,
                visitor
            } = req.body;

        if (!(username && password && firstname && lastname && email && phone && country && address && postcode && taxcode && visitor)) {
            res.status(400).send("Fields cannot be blank");
        }
        if (!(validateEmail(email) && validateName(firstname) && validateName(lastname) && validatePhoneNumber(phone))) {
            res.status(400).send("Invalid input");
        }

        await client.query("SELECT * FROM account WHERE username = $1)", [username], function(err, result) {
            if (result.rows.length != 0) {
                return res.status(409).send("Username taken. Please type an other username");
            } else {
                const newUser = client.query("INSERT INTO account (username, password, firstname, lastname, email, phone, country, address, postcode, taxcode, visitor, approved) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",[username, password, firstname, lastname, email.toLowerCase(), phone, country, address, postcode, taxcode, visitor, 0]);
                const token = jwt.sign(
                    { user_id: newUser.id, username },
                    process.env.SECRET_KEY,
                    {
                      expiresIn: "2h",
                    }
                );
                newUser.token = token;
                
                res.status(201).json(newUser.rows[0]);
            }
        });
    } catch (err) {
        console.error(err.message);
    }
})

// login
app.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) {
            res.status(400).send("Fields cannot be blank");
        }
        
        const user = await client.query("SELECT * FROM account WHERE username = $1 AND password = $2)", [username, encode(password)], function(err, result) {
            if (result.rows.length != 0) {
                const token = jwt.sign(
                    { user_id: user.id, username },
                    process.env.SECRET_KEY,
                    {
                      expiresIn: "2h",
                    }
                );
                user.token = token;
                res.status(200).json(user);
            } else {
                res.status(400).send("Invalid Credentials");
            }
        });
        await client.query("SELECT * FROM account WHERE username = $1 AND password = $2)", [username, encode(password)]);
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

// delete accounts
app.delete("/users", async(req, res) => {
    try {
        await client.query("DELETE FROM account");
        res.json("Accounts were deleted");
    } catch (error) {
        console.error(err.message);
    } 
})


app.listen(5000, () => {
    console.log("API listening at http://localhost:5000")
});