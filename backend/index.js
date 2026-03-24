const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");

const db = require("./db");
const auth = require("./middleware");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// S3 CONFIG
const s3 = new AWS.S3({
  accessKeyId: "YOUR_KEY",
  secretAccessKey: "YOUR_SECRET",
  region: "ap-south-1"
});


// ================= AUTH =================

// Register
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash],
    (err) => {
      if (err) return res.send(err);
      res.send("User registered");
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.send(err);
    if (result.length === 0) return res.send("User not found");

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.send("Wrong password");

    const token = jwt.sign({ id: user.id }, "SECRET123");

    res.json({ token });
  });
});


// ================= CARS =================

// Add car (protected)
app.post("/add-car", auth, upload.single("image"), async (req, res) => {
  const { name, price } = req.body;
  const file = req.file;

  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: "YOUR_BUCKET_NAME",
    Key: Date.now() + "-" + file.originalname,
    Body: fileContent
  };

  try {
    const data = await s3.upload(params).promise();

    db.query(
      "INSERT INTO cars (name, price, image, user_id) VALUES (?, ?, ?, ?)",
      [name, price, data.Location, req.user.id],
      (err) => {
        if (err) return res.send(err);
        res.send("Car added");
      }
    );
  } catch (err) {
    res.send(err);
  }
});

// Get cars
app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

app.listen(5000, () => console.log("Server running"));