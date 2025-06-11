// db.js
const sql = require("mssql");

const config = {
  user: "SA",
  password: "Secret@12",
  server: "localhost", // or your SQL Server hostname
  database: "gear-square",
  options: {
    encrypt: false, // For Azure or if required
    trustServerCertificate: true, // Change to false in production
  },
};

async function queryDatabase(query) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("Database error:", err);
    return null;
  }
}

async function login(data) {
  try {
    let pool = await sql.connect(config);
    const query = `Select * from users where username = '${data.username}' AND password = '${data.password}'`;
    let result = await pool.request().query(query);
    if (result.recordset.length === 0) {
      return { statusCode: 401, message: "Invalid credentials" };
    }
    return { result: result.recordset, success: "success" };
  } catch (err) {
    console.error("Database error:", err);
    return { message: "Invalid credentials", error: err };
  }
}

module.exports = { queryDatabase, login };
