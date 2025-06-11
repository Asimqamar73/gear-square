import db from "../db.js";

export const create_products_table = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      cost_price DECIMAL(10, 2),
      retail_price DECIMAL(10, 2),
      sku TEXT UNIQUE,
      barcode TEXT UNIQUE,
      quantity INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      created_by INTEGER,
      updated_at TEXT DEFAULT (datetime('now','localtime')),
      updated_by INTEGER,
      FOREIGN KEY(created_by) REFERENCES users(id),
      FOREIGN KEY(updated_by) REFERENCES users(id)
    )`,
    (err: any) => {
      if (err) console.error("Error creating products table:", err.message);
    }
  );
};

export function insertProductToDatabase({
  name,
  description,
  costPrice,
  retailPrice,
  sku,
  barcode,
  quantity,
  filePath,
  createdBy,
  updatedBy,
}: {
  name: string;
  description: string;
  costPrice: number;
  retailPrice: number;
  sku: number;
  barcode: number;
  quantity: number;
  filePath: string;
  createdBy: number;
  updatedBy: number;
}) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO products (name, description, cost_price,retail_price, sku, barcode, quantity, image,created_by,updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    //@ts-ignore\
    db.run(
      query,
      [
        name,
        description,
        costPrice,
        retailPrice,
        sku,
        barcode,
        quantity,
        filePath,
        createdBy,
        updatedBy,
      ],
      function (err: any, row: any) {
        console.log("err", err);
        console.log("err", row);
        if (err) return rej(err);
        res(row);
      }
    );
  });
}

export function updateProductDetails({
  name,
  description,
  cost_price,
  retail_price,
  sku,
  barcode,
  quantity,
  filePath,
  updatedBy,
}: {
  name: string;
  description: string;
  cost_price: number;
  retail_price: number;
  sku: number;
  barcode: number;
  quantity: number;
  filePath: string;
  updatedBy: number;
}) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET
        name = ?,
        description = ?,
        cost_price = ?,
        retail_price = ?,
        barcode = ?,
        quantity = ?,
        image = ?,
        updated_by = ?
      WHERE sku = ?;
    `;
    db.run(
      query,
      [name, description, cost_price, retail_price, barcode, quantity, filePath, updatedBy, sku],
      function (err: any) {
        if (err) {
          console.error("Error updating product:", err.message);
          return reject(err);
        }
        //@ts-ignore
        console.log(`Rows updated: ${this.changes}`);
        //@ts-ignore
        resolve(this.changes);
      }
    );
  });
}

export function updateProductStock({ quantity, id }: { quantity: number; id: number }) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET
        quantity = ?
      WHERE id = ?;
    `;
    db.run(query, [quantity, id], (err: any, rows: any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function getAllProducts() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM products", [], (err: any, rows: any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
export function getproductById(id: number) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM products WHERE id = ?", [id], (err: any, row: any) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function searchProduct(search: string) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM products WHERE name LIKE ?";
    const wildcardSearch = `%${search}%`; // Wrap search string with wildcards
    db.all(query, [wildcardSearch], (err: any, rows: any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
