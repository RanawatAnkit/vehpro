const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const AWS = require("aws-sdk");

// CONFIGURATION (Hardcoded as requested)
const DB_HOST = "44.195.107.128";
const DB_USER = "admin";
const DB_PASS = "password123";
const DB_NAME = "carsdb";
const JWT_SECRET = "vehpro_secret_key_2026";
const AWS_REGION = "us-east-1";
const S3_BUCKET = "vehpro-images-ankit";
const AWS_ACCESS_KEY_ID = "YOUR_ACCESS_KEY_HERE";
const AWS_SECRET_ACCESS_KEY = "YOUR_SECRET_KEY_HERE";
const PORT = 5000;

// Database Connection
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
});

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// AWS Config
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});
const s3 = new AWS.S3();
const SECRET = JWT_SECRET;

// AUTH MIDDLEWARE
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token provided");

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");
    req.user = decoded;
    next();
  });
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).send("Admin access required");
  next();
};

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).send("Email and password required");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, role || "user"],
      (err) => {
        if (err) return res.status(500).send("Registration failed");
        res.send("User registered");
      }
    );
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err || result.length === 0) return res.status(401).send("Invalid credentials");

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1d" });
    res.json({ token, role: user.role, email: user.email });
  });
});

// GET CARS (with Search & Filter)
app.get("/cars", (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  let query = "SELECT * FROM cars WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (name LIKE ? OR brand LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  if (minPrice) {
    query += " AND CAST(REPLACE(REPLACE(price, '$', ''), ',', '') AS UNSIGNED) >= ?";
    params.push(minPrice);
  }
  if (maxPrice) {
    query += " AND CAST(REPLACE(REPLACE(price, '$', ''), ',', '') AS UNSIGNED) <= ?";
    params.push(maxPrice);
  }

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).send("Error fetching cars");
    res.json(result);
  });
});

// ADD CAR (ADMIN)
app.post("/add-car", authenticate, adminOnly, upload.single("image"), async (req, res) => {
  const { name, brand, price, description, year, mileage, fuel_type, transmission, image_url } = req.body;
  let finalImageUrl = image_url;

  try {
    if (req.file) {
      const params = {
        Bucket: S3_BUCKET,
        Key: Date.now() + "-" + req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };
      const data = await s3.upload(params).promise();
      finalImageUrl = data.Location;
    }

    db.query(
      "INSERT INTO cars (name, brand, price, year, mileage, fuel_type, transmission, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, brand, price, year, mileage, fuel_type, transmission, description, finalImageUrl],
      (err) => {
        if (err) return res.status(500).send("Error adding car");
        res.send("Car added");
      }
    );
  } catch (err) {
    res.status(500).send("Upload error");
  }
});

// UPDATE CAR (ADMIN)
app.put("/cars/:id", authenticate, adminOnly, (req, res) => {
  const { name, brand, price, year, mileage, fuel_type, transmission, description } = req.body;
  db.query(
    "UPDATE cars SET name=?, brand=?, price=?, year=?, mileage=?, fuel_type=?, transmission=?, description=? WHERE id=?",
    [name, brand, price, year, mileage, fuel_type, transmission, description, req.params.id],
    (err) => {
      if (err) return res.status(500).send("Update error");
      res.send("Car updated");
    }
  );
});

// DELETE CAR (ADMIN)
app.delete("/cars/:id", authenticate, adminOnly, (req, res) => {
  db.query("DELETE FROM cars WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Delete error");
    res.send("Car deleted");
  });
});

// PRICE PREDICTION (Simple Heuristic Regression)
app.post("/predict", (req, res) => {
  const { brand, year, mileage, fuel_type } = req.body;
  
  // Base prices per brand (simplified)
  const basePrices = {
    "Tesla": 40000, "BMW": 35000, "Toyota": 20000, "Honda": 18000, 
    "Mercedes": 38000, "Audi": 36000, "Ford": 22000, "Porsche": 90000,
    "Others": 15000
  };

  let price = basePrices[brand] || basePrices["Others"];
  
  // Depreciation by year (assume car loses 5% per year)
  const currentYear = new Date().getFullYear();
  const age = currentYear - parseInt(year);
  price = price * Math.pow(0.95, age);

  // Depreciation by mileage (assume -0.5% per 1000 miles)
  const mileageFactor = (parseInt(mileage) / 1000) * 0.005;
  price = price * (1 - mileageFactor);

  // Fuel Type Multiplier
  if (fuel_type === "Electric") price *= 1.2;
  if (fuel_type === "Hybrid") price *= 1.1;
  if (fuel_type === "Diesel") price *= 0.9;

  res.json({ predicted_price: Math.max(2000, Math.round(price)) });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));