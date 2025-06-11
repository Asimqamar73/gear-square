import db from "../db.js";

export const create_customers_table = () => {
  db.run(
    `
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    address TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    created_by INTEGER,
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    updated_by INTEGER,
    FOREIGN KEY(created_by) REFERENCES users(id),
    FOREIGN KEY(updated_by) REFERENCES users(id)
);

`,
    (err:any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Client table created or already exists.");
    }
  );
};

export function addCustomerToDB({
  name,
  phoneNumber,
  email,
  address,
  createdBy,
  updatedBy,
}: {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  createdBy: number;
  updatedBy: number;
}) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO customers (name, phone_number, email, address, created_by,updated_by) VALUES (?, ?, ?, ?, ?, ?)`;
    //@ts-ignore\
    db.run(
      query,
      [name, phoneNumber, email, address, createdBy, updatedBy],
      function (err: any, row: any) {
        console.log(row)
        if (err) return rej(err);
        //@ts-ignore
        res(this.lastID);
      }
    );
  });
}

export function getAllCustomers() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM customers ORDER BY created_at DESC", [], (err: any, rows: any) => {
      console.log(rows)
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function searchCustomerByPhoneNumber(phoneNumber:number) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM customers WHERE phone_number = ?", [phoneNumber], (err: any, row: any) => {
      console.log(row)
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function getCustomerById(id:number) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM customers WHERE id = ? ", [id], (err: any, row: any) => {
      console.log("getCustomerById row", row)
      if (err) return reject(err);
      resolve(row);
    });
  });
}