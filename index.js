const express = require("express");
const cors = require("cors");
const products = require("./products");
const app = express();
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const stripe = require("./routes/stripe");

app.use(express.json());
app.use(cors());
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Welcome to our online shop api...");
});

app.get("/products", (req, res) => {
  res.send(products);
});

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/stripe", stripe);

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;
app.listen(port, console.log(`Server is running on port ${port}`));

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo connected"))
  .catch(() => console.log("connection error"));
