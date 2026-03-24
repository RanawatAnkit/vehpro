const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "YOUR_RDS_ENDPOINT",
  user: "admin",
  password: "YOUR_PASSWORD",
  database: "vehpro"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("Connected to RDS");
});

module.exports = db;