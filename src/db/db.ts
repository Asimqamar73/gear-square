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

export const create_service_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    note TEXT,
    vehicle_number TEXT,
    phone_number TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY(created_by) REFERENCES users(id)


  )
`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("services table created or already exists.");
    }
  );
};
export const create_service_items_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS service_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item INTEGER,
    service_id INTEGER,
    quantity INTEGER,
    subtotal DOUBLE,
    FOREIGN KEY(item) REFERENCES products(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  )
`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Service items table created or already exists.");
    }
  );
};

export const create_service_bill_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS service_bill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subtotal DOUBLE,
    service_id INTEGER,
    discount DOUBLE,
    total DOUBLE,
    FOREIGN KEY(service_id) REFERENCES services(id)
  )
`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Service items table created or already exists.");
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
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else if (!row) {
          // No user found with matching credentials
          reject(new Error("Invalid username or password"));
        } else {
          console.log("row: ", row);
          resolve(row); // Return the user data
        }
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
  name,
  description,
  basePrice,
  sku,
  barcode,
  quantity,
  filePath,
}: {
  name: string;
  description: string;
  basePrice: number;
  sku: number;
  barcode: number;
  quantity: number;
  filePath: string;
}) {
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
}

export function addService(data: any) {
  console.log("data", data);
  return new Promise((res, rej) => {
    const query = `INSERT INTO services (name, note, vehicle_number, phone_number,created_by) VALUES (?, ?, ?, ?, ?)`;
    //@ts-ignore\
    db.run(
      query,
      [data.name, data.note, data.vehicle_number, data.phone_number, data.created_at],
      function (err: any, row: any) {
        console.log("row: ", row);
        if (err) return rej(err);
        //@ts-ignore
        res(this.lastID);
      }
    );
  });
}

// export function addServiceItems(data: any, service_id: number) {
//   return new Promise((res, rej) => {
//     const query = `INSERT INTO service_items (item, service_id, quantity, subTotal) VALUES (?, ?, ?, ?)`;
//     //@ts-ignore\
//     db.run(
//       query,
//       [data.item, service_id, data.quantity, data.subTotal],
//       function (err: any, row: any) {
//         console.log(row);
//         if (err) return rej(err);
//         res(row);
//       }
//     );
//   });
// }

export function addServiceItems(dataArray: any[], service_id: number) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO service_items (item, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      const stmt = db.prepare(query);

      for (const data of dataArray) {
        stmt.run([data.product.id, service_id, data.quantity, data.subtotal]);
      }

      stmt.finalize((err) => {
        if (err) {
          db.run("ROLLBACK");
          return rej(err);
        }
        db.run("COMMIT", (commitErr) => {
          if (commitErr) return rej(commitErr);
          res({ message: `${dataArray.length} records inserted` });
        });
      });
    });
  });
}


export function createDeductProductQuantityTrigger() {
  const createTriggerSQL = `
    CREATE TRIGGER IF NOT EXISTS deduct_product_quantity
    AFTER INSERT ON service_items
    FOR EACH ROW
    BEGIN
      UPDATE products
      SET quantity = quantity - NEW.quantity
      WHERE id = NEW.item;
    END;
  `;

  db.run(createTriggerSQL, (err) => {
    if (err) {
      console.error("Error creating trigger:", err);
    } else {
      console.log("Trigger 'deduct_product_quantity' created successfully.");
    }
  });
}

// Function to add items and also deduct quantity 

// export function addServiceItems(dataArray: any[], service_id: number) {
//   return new Promise((res, rej) => {
//     const query = `INSERT INTO service_items (item, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;

//     db.serialize(() => {
//       db.run("BEGIN TRANSACTION");

//       const stmt = db.prepare(query);

//       // Loop through the dataArray to insert each service item
//       for (const data of dataArray) {
//         stmt.run([data.product.id, service_id, data.quantity, data.subtotal], function (err) {
//           if (err) {
//             db.run("ROLLBACK");
//             return rej(err);
//           }

//           // Deduct the product quantity after inserting the service item
//           const updateQuantityQuery = `
//             UPDATE products
//             SET quantity = quantity - ?
//             WHERE id = ?
//           `;
//           db.run(updateQuantityQuery, [data.quantity, data.product.id], function (updateErr) {
//             if (updateErr) {
//               db.run("ROLLBACK");
//               return rej(updateErr);
//             }
//           });
//         });
//       }

//       stmt.finalize((err) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej(err);
//         }

//         db.run("COMMIT", (commitErr) => {
//           if (commitErr) {
//             db.run("ROLLBACK");
//             return rej(commitErr);
//           }
//           res({ message: `${dataArray.length} records inserted and quantities updated` });
//         });
//       });
//     });
//   });
// }

export function addServiceBill(data: any, service_id: number) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO service_bill (service_id, subtotal, total, discount) VALUES (?, ?, ?, ?)`;

    db.run(
      query,
      [service_id, data.subtotal, data.total, data.discount],
      function (err: any, row: any) {
        console.log("row: ", row);
        if (err) return rej(err);
        //@ts-ignore
        res(this.lastID);
      }
    );
  });
}

export async function getAllInvoices() {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM services", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
}

export function searchInvoice(search: string) {
  console.log(search);
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM services WHERE name LIKE ? OR vehicle_number LIKE ? OR phone_number LIKE ?";
    const wildcardSearch = `%${search}%`; // Wrap search string with wildcards
    db.all(query, [wildcardSearch, wildcardSearch, wildcardSearch], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function getServiceDetails(id: number) {
  console.log("id", id);
  try {
    const rows = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM services where id = ?", [id], (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function getServiceItems(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        "SELECT service_items.*,products.name,products.image,products.base_price FROM service_items JOIN products ON products.id = service_items.item where service_id = ?",
        [id],
        (err, rows) => {
          if (err) return reject(err);
          console.log(rows);
          resolve(rows);
        }
      );
    });
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function getServiceBill(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM service_bill where service_id = ?", [id], (err, rows) => {
        if (err) return reject(err);
        console.log(rows);
        resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
}
