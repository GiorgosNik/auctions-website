const express = require("express");
const app = express.Router();
const client = require("../database.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateEmail, validateName } = require("./Validation.js");

// create user
app.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      firstname,
      lastname,
      email,
      phone,
      country,
      city,
      address,
      postcode,
      taxcode,
      confirm,
    } = req.body;

    ////////////////// validate input //////////////////
    if (!username) {
      return res.status(400).json({ error: "Username cannot be blank" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password cannot be blank" });
    }
    if (!firstname) {
      return res.status(400).json({ error: "Firstname cannot be blank" });
    }
    if (!lastname) {
      return res.status(400).json({ error: "Lastname cannot be blank" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email cannot be blank" });
    }
    if (!phone) {
      return res.status(400).json({ error: "Phone number cannot be blank" });
    }
    if (!country) {
      return res.status(400).json({ error: "Country cannot be blank" });
    }
    if (!city) {
      return res.status(400).json({ error: "City cannot be blank" });
    }
    if (!address) {
      return res.status(400).json({ error: "Address cannot be blank" });
    }
    if (!postcode) {
      return res.status(400).json({ error: "Postcode cannot be blank" });
    }
    if (!taxcode) {
      return res.status(400).json({ error: "Tax code cannot be blank" });
    }

    if (password !== confirm) {
      return res.status(400).json({ error: "Passwords should match" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (!validateName(firstname)) {
      return res.status(400).json({ error: "Invalid firstname" });
    }
    if (!validateName(lastname)) {
      return res.status(400).json({ error: "Invalid lastname" });
    }

    if (email.length > 30) {
      return res.status(400).json({ error: "Email length is too long" });
    }
    if (username.length > 30) {
      return res.status(400).json({ error: "Username length is too long" });
    }
    if (password.length > 30) {
      return res.status(400).json({ error: "Password length is too long" });
    }
    if (password.length < 5) {
      return res.status(400).json({ error: "Password is too weak" });
    }
    if (firstname.length > 30) {
      return res.status(400).json({ error: "Firstname length is too long" });
    }
    if (lastname.length > 30) {
      return res.status(400).json({ error: "Lastname length is too long" });
    }
    if (phone.length > 15) {
      return res.status(400).json({ error: "Phone number is too long" });
    }
    if (country.length > 30) {
      return res.status(400).json({ error: "Country name is too long" });
    }
    if (city.length > 30) {
      return res.status(400).json({ error: "City name is too long" });
    }
    if (address.length > 30) {
      return res.status(400).json({ error: "Address length is too long" });
    }
    if (postcode.length > 5) {
      return res.status(400).json({ error: "Postcode length is too long" });
    }
    if (taxcode.length > 15) {
      return res.status(400).json({ error: "Tax code length is too long" });
    }

    const getAccounts = () =>
      client.query("SELECT * FROM account WHERE username = $1", [username]);
    const { rows } = await getAccounts();

    if (rows.length != 0) {
      return res
        .status(409)
        .json({ error: "Username taken. Please type an other username" });
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        client.query(
          "INSERT INTO account (username, password, firstname, lastname, email, phone, country, city, address, postcode, taxcode, approved, messagecount) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
          [
            username,
            hash,
            firstname,
            lastname,
            email.toLowerCase(),
            phone,
            country,
            city,
            address,
            postcode,
            taxcode,
            0,
            0,
          ],
          function (err, newUser) {
            const token = jwt.sign(
              { user_id: newUser.rows[0].id, username },
              process.env.SECRET_KEY,
              {
                expiresIn: "2h",
              }
            );
            return res.status(201).json({ token });
          }
        );
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username cannot be blank" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password cannot be blank" });
    }

    await client.query(
      "SELECT * FROM account WHERE username = $1",
      [username],
      function (err, result) {
        const user = result.rows[0];
        if (result.rowCount != 0) {
          bcrypt.compare(
            password,
            result.rows[0].password,
            function (err, compare) {
              if (compare == true) {
                const token = jwt.sign(
                  { user_id: user.id, username },
                  process.env.SECRET_KEY,
                  {
                    expiresIn: "2h",
                  }
                );
                return res.status(200).json({ token });
              } else {
                return res.status(401).json({ error: "Wrong password" });
              }
            }
          );
        } else {
          return res.status(401).json({ error: "Wrong username" });
        }
      }
    );
  } catch (err) {
    console.error(err.message);
  }
});

// get users
app.get("/users", async (req, res) => {
  try {
    const users = await client.query("SELECT * FROM account");
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get users
app.get("/locations", async (req, res) => {
  try {
    const users = await client.query(
      "SELECT address,city,country FROM account"
    );
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a user
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await client.query("SELECT * FROM account WHERE id =  $1", [
      id,
    ]);
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update a user
app.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("UPDATE account SET approved = true WHERE id = $1;", [
      id,
    ]);
    res.json("User was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// update a user
app.put("/users/:id/messages", async (req, res) => {
  try {
    const id = req.params.id;
    const { receivedLength } = req.body;
    await client.query("UPDATE account SET messageCount = $1 WHERE id = $2", [
      receivedLength,
      id,
    ]);
    res.json("User was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM account WHERE id = $1", [id]);
    res.json("User was deleted");
  } catch (error) {
    console.error(err.message);
  }
});

// delete accounts
app.delete("/users", async (req, res) => {
  try {
    await client.query("DELETE FROM account");
    res.json("Accounts were deleted");
  } catch (error) {
    console.error(err.message);
  }
});

app.put("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "You have been logged out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
});

module.exports = app;
