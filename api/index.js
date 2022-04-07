const express = require("express");
const app = express();
const cors = require("cors");
const client = require("./database");
const { validateEmail, validateName } = require("./modules/Validation.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

client.connect();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
// add newsletter email
app.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email cannot be blank" });
    }
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: "You should provide a valid email address" });
    }
    if (email.length > 30) {
      return res.status(400).json({ error: "Email length is too long" });
    }
    await client.query(
      "SELECT * FROM newsletter WHERE email = $1",
      [email],
      function (err, result) {
        if (result.rows.length != 0) {
          return res.status(409).json({ error: "You have subscribed before" });
        } else {
          const newEmail = client.query(
            "INSERT INTO newsletter (email) VALUES($1) RETURNING *",
            [email]
          );
          return res.status(201).json(newEmail);
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

// get all newsletter emails
app.get("/newsletter", async (req, res) => {
  try {
    const emails = await client.query("SELECT * FROM newsletter");
    res.json(emails.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// delete newsletter emails
app.delete("/newsletter", async (req, res) => {
  try {
    await client.query("DELETE FROM newsletter");
    res.json("Newsletter emails were deleted");
  } catch (error) {
    console.error(err.message);
  }
});

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
        const newUser = client.query(
          "INSERT INTO account (username, password, firstname, lastname, email, phone, country, address, postcode, taxcode, approved) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
          [
            username,
            hash,
            firstname,
            lastname,
            email.toLowerCase(),
            phone,
            country,
            address,
            postcode,
            taxcode,
            0,
          ]
        );
        const token = jwt.sign(
          { user_id: newUser.id, username },
          process.env.SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        return res.status(201).json({ token });
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

// messaging
app.post("/messaging/:id", async (req, res) => {
  try {
    const senderId = req.params.id;
    const { subject, receiver, message } = req.body;
    if (!receiver) {
      return res.status(400).json({ error: "Receiver cannot be blank" });
    }
    if (!message) {
      return res.status(400).json({ error: "Message cannot be blank" });
    }

    if (receiver.length > 30) {
      return res.status(400).json({ error: "Receiver's username is too long" });
    }
    if (message.length > 500) {
      return res.status(400).json({ error: "Message is too long" });
    }
    if (subject.length > 100) {
      return res.status(400).json({ error: "Subject is too long" });
    }
    await client.query(
      "SELECT * FROM account WHERE username = $1",
      [receiver],
      function (err, result) {
        if (result.rows.length != 0) {
          let receiverId = result.rows[0].id;
          const newMessage = client.query(
            "INSERT INTO message (subject, receiver, sender, text) VALUES($1, $2, $3, $4) RETURNING *",
            [subject, receiverId, senderId, message]
          );
          return res.status(201).json(newMessage);
        } else {
          return res.status(400).json({ error: "No such user exists" });
        }
      }
    );
  } catch (err) {
    console.error(err);
  }
});

app.get("/messaging/:id/inbox", async (req, res) => {
  try {
    const id = req.params.id;

    const received = await client.query(
      "SELECT * FROM message WHERE receiver = $1",
      [id]
    );
    res.json(received.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/messaging/:id/sent", async (req, res) => {
  try {
    const id = req.params.id;
    const sent = await client.query("SELECT * FROM message WHERE sender = $1", [
      id,
    ]);
    res.json(sent.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/message/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const message = await client.query("SELECT * FROM message WHERE id = $1", [
      id,
    ]);
    res.json(message.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// delete a message
app.delete("/messaging/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM message WHERE id = $1", [id]);
    res.json("Message was deleted");
  } catch (error) {
    console.error(err.message);
  }
});
app.listen(5000, () => {
  console.log("API listening at http://localhost:5000");
});
