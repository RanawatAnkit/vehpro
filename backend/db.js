const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "car-db.cjyhkhxut1mz.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "password123",
  database: "carsdb"
});

module.exports = db;