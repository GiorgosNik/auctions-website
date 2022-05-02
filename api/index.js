const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const auction = require("./modules/Auction");
const auth = require("./modules/Auth");
const bid = require("./modules/Bid");
const category = require("./modules/Category");
const message = require("./modules/Message");
const newsletter = require("./modules/Newsletter");

app.use(cors());
app.use(express.json());

app.use("/auction", auction);
app.use("/auth", auth);
app.use("/bid", bid);
app.use("/category", category);
app.use("/messaging", message);
app.use("/newsletter", newsletter);
app.use("/images", express.static(path.join(__dirname, "./images")));

app.listen(5000, () => {
  console.log("API listening at http://localhost:5000");
});
