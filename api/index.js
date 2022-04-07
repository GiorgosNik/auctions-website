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
  } catch (error) {
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
  } catch (error) {
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

// Category
app.post("/category", async (req, res) => {
  try {
    const { name } = req.body;

    ////////////////// validate input //////////////////
    if (!name) {
      return res.status(400).json({ error: "Category Name cannot be blank" });
    }
    if (name.length > 30) {
      return res
        .status(400)
        .json({ error: "Category Name length is too long" });
    }
    const getCategories = () =>
      client.query("SELECT * FROM category WHERE name = $1", [name]);
    const { rows } = await getCategories();
    if (rows.length != 0) {
      return res.status(409).json({
        error: "Category exists already. Please type an other category name",
      });
    } else {
      const newCat = await client.query(
        "INSERT INTO category (name) VALUES($1) RETURNING *",
        [name]
      );
      console.log(newCat.rows[0]);
      return res.status(201).json(newCat.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/category", async (req, res) => {
  try {
    const categories = await client.query("SELECT * FROM category");
    res.json(categories.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/category/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const category = await client.query(
      "SELECT * FROM category WHERE id =  $1",
      [id]
    );
    res.json(category.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/category", async (req, res) => {
  try {
    await client.query("DELETE FROM category");
    res.json("Categories Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

app.delete("/category/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await client.query("DELETE FROM category WHERE id =  $1", [
      id,
    ]);
    res.json("Deleted Category");
  } catch (err) {
    console.error(err.message);
  }
});

//Auction
app.post("/auction", async (req, res) => {
  try {
    const {
      item_name,
      account_id,
      description,
      category,
      price_start,
      price_inst,
      started,
      ends,
    } = req.body;

    ////////////////// validate input //////////////////
    if (!item_name) {
      return res.status(400).json({ error: "Product Name cannot be blank" });
    }
    if (item_name.length > 30) {
      return res.status(400).json({ error: "Product Name length is too long" });
    }
    if (!account_id) {
      return res.status(400).json({ error: "Account Id cannot be blank" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description cannot be blank" });
    }
    if (description.length > 500) {
      return res.status(400).json({ error: "Description length is too long" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category list cannot be blank" });
    }
    if (!price_start) {
      return res.status(400).json({ error: "Price cannot be blank" });
    }
    if (!started) {
      return res.status(400).json({ error: "Start time cannot be blank" });
    }
    if (!ends) {
      return res.status(400).json({ error: "Start time cannot be blank" });
    }

    //Check Categories Exist
    for (let i = 0; i < category.length; i++) {
      try {
        const categories = await client.query(
          "SELECT * FROM category WHERE name = $1",
          [category[i]]
        );
        if (categories.rows.length == 0) {
          return res.status(409).json({ error: "Category does not exist" });
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [account_id]);
    const { rows } = await getUser();
    if (rows.length == 0) {
      return res.status(409).json({ error: "No such user" });
    } else {
      const newAuction = await client.query(
        "INSERT INTO auction (item_name,account_id,description,price_start,price_curr,price_inst,num_of_bids,started,ends) VALUES($1,$2,$3,$4,$4,$5,$6,$7,$8) RETURNING *",
        [
          item_name,
          account_id,
          description,
          price_start,
          price_inst,
          0,
          started,
          ends,
        ]
      );
      newAuction.rows[0]["category"] = category;
      for (let i = 0; i < category.length; i++) {
        try {
          const categories = await client.query(
            "SELECT * FROM category WHERE name = $1",
            [category[i]]
          );
          try {
            await client.query(
              "INSERT INTO auction_category (auction_id,category_id) VALUES($1,$2)",
              [newAuction.rows[0]["id"], categories.rows[0]["id"]]
            );
          } catch (err) {
            console.error(err.message);
          }
        } catch (err) {
          console.error(err.message);
        }
      }
      console.log(newAuction.rows[0]);
      return res.status(201).json(newAuction.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/auction", async (req, res) => {
  try {
    const auctions = await client.query("SELECT * FROM auction");
    res.json(auctions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/auction/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const auction = await client.query("SELECT * FROM auction WHERE id =  $1", [
      id,
    ]);
    res.json(auction.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/auction/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM auction WHERE id =  $1", [id]);
    res.json("Auction Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/auction", async (req, res) => {
  try {
    await client.query("DELETE FROM auction");
    res.json("Auctions Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

//Bid
app.post("/bid", async (req, res) => {
  try {
    const { account_id, auction_id, time, amount } = req.body;

    ////////////////// validate input //////////////////
    if (!account_id) {
      return res.status(400).json({ error: "account_id cannot be blank" });
    }
    if (!auction_id) {
      return res.status(400).json({ error: "auction_id cannot be blank" });
    }
    if (!time) {
      return res.status(400).json({ error: "Start time cannot be blank" });
    }
    if (!amount) {
      return res.status(400).json({ error: "amount cannot be blank" });
    }
    if (amount <= 0) {
      return res
        .status(400)
        .json({ error: "amount must be a positibe number" });
    }

    const getUser = () =>
      client.query("SELECT * FROM account WHERE id = $1", [account_id]);
    const user = await getUser();
    const getAuction = () =>
      client.query("SELECT * FROM auction WHERE id = $1", [auction_id]);
    const auction = await getAuction();
    if (user.rows.length == 0) {
      return res.status(409).json({ error: "No such user" });
    } else if (auction.rows.length == 0) {
      return res.status(409).json({ error: "No such auction" });
    } else if (auction.rows[0]["price_curr"] >= amount) {
      return res.status(409).json({ error: "Offer lower than current price" });
    } else {
      console.log(auction.rows[0]["price_curr"]);
      const newBid = await client.query(
        "INSERT INTO bid (account_id,auction_id,amount,time) VALUES($1,$2,$3,$4) RETURNING *",
        [account_id, auction_id, amount, time]
      );
      await client.query("UPDATE auction SET price_curr = $1, num_of_bids = $2 WHERE id = $3", [
        amount,
        auction.rows[0]["num_of_bids"]+1,
        auction_id,
      ]);
      console.log(newBid.rows[0]);
      return res.status(201).json(newBid.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/bid", async (req, res) => {
  try {
    await client.query("DELETE FROM bid");
    res.json("Bids Deleted");
  } catch (error) {
    console.error(err.message);
  }
});

app.delete("/bid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await client.query("DELETE FROM bid WHERE id =  $1", [id]);
    res.json("Bid Deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/bid", async (req, res) => {
  try {
    const bids = await client.query("SELECT * FROM bid");
    res.json(bids.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/bid/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const bid = await client.query("SELECT * FROM bid WHERE id =  $1", [id]);
    res.json(bid.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("API listening at http://localhost:5000");
});
