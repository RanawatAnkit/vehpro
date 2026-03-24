const express = require("express");
const db = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "secret123";

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (result.length === 0) return res.send("Invalid");

      const user = result[0];
      const token = jwt.sign(user, SECRET);

      res.json({ token, role: user.role });
    }
  );
});

// ADD CAR (ADMIN)
app.post("/add-car", (req, res) => {
  const { name, price, description, image_url } = req.body;

  db.query(
    "INSERT INTO cars (name, price, description, image_url) VALUES (?, ?, ?, ?)",
    [name, price, description, image_url],
    () => res.send("Car added")
  );
});

// GET CARS
app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, result) => {
    res.json(result);
  });
});

app.listen(5000, () => console.log("Server running on 5000"));