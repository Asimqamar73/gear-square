// import { IProduct } from "@/types/product";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("square-gear2.sql");

export const create_users_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Users table created or already exists.");
    }
  );
};

export const create_products_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    image TEXT,
    base_price DOUBLE,
    sku TEXT,
    barcode TEXT,
    quantity INTEGER
  )
`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Products table created or already exists.");
    }
  );
};

// export const get_all_users = (callback: Function) => {
//   db.serialize(() => {
//     create_users_table();
//     //@ts-ignore
//     db.all("SELECT * FROM users", (err, data) => {
//       if (err) {
//         return null;
//       } else {
//         callback(data);
//       }
//     });
//   });
// };

export const login = async ({ username, password }: { username: string; password: string }) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password],
      (err, row) => {
        console.log(err)
        if (err) reject(err);
        resolve(row);
        console.log(row)
      }
    );
  });
};

export function get_all_users() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function getAllProducts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function searchProduct(search: string) {
  console.log(search);
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM products WHERE name LIKE ?";
    const wildcardSearch = `%${search}%`; // Wrap search string with wildcards
    db.all(query, [wildcardSearch], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
//@ts-ignore
export function insertProductToDatabase({
  //@ts-ignore
  name,description,basePrice,sku,barcode,quantity,filePath,}) {
  console.log(filePath);
  return new Promise((res, rej) => {
    const query = `INSERT INTO products (name, description, base_price, sku, barcode, quantity, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    //@ts-ignore\
    db.run(
      query,
      [name, description, basePrice, sku, barcode, quantity, filePath],
      function (err: any, row: any) {
        console.log(row);
        if (err) return rej(err);
        res(row);
      }
    );
  });
  // db.close((err) => {
  //   if (err) {
  //     console.error('Error closing database', err.message);
  //   }
  // });
}
// db.close();
