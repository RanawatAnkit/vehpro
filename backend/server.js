const express = require("express");
const db = require("./db");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const multer = require("multer");
const AWS = require("aws-sdk");

const upload = multer({ storage: multer.memoryStorage() });

// ✅ NO IAM KEYS (Learner Lab)
AWS.config.update({
  region: "us-east-1"
});

const s3 = new AWS.S3();
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
app.post("/add-car", upload.single("image"), async (req, res) => {
  const { name, price, description, image_url } = req.body;
  let finalImageUrl = image_url; // default = URL

  try {
    // ✅ If file uploaded → upload to S3
    if (req.file) {
      const params = {
        Bucket: "vehpro-images-ankit",
        Key: Date.now() + "-" + req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      };

      const data = await s3.upload(params).promise();
      finalImageUrl = data.Location;
    }

    // ✅ Save in DB (either S3 or URL)
    db.query(
      "INSERT INTO cars (name, price, description, image_url) VALUES (?, ?, ?, ?)",
      [name, price, description, finalImageUrl],
      () => res.send("Car added")
    );

  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding car");
  }
});

// GET CARS
app.get("/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, result) => {
    res.json(result);
  });
});

app.listen(5000, () => console.log("Server running on 5000"));