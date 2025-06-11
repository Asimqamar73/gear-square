import db from "../db.js";

export const create_users_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    password TEXT

  )
`,
    (err:any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Users table created or already exists.");
    }
  );
};



export const login = async ({ username, password }: { username: string; password: string }) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password],
      (err:any, row:any) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else if (!row) {
          // No user found with matching credentials
          reject(new Error("Invalid username or password"));
        } else {
          resolve(row); // Return the user data
        }
      }
    );
  });
};


export function get_all_users() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err:any, rows:any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}