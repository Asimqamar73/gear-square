import db from "../db.js";

export const create_service_items_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS service_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item INTEGER,
    service_id INTEGER,
    quantity INTEGER,
    subtotal DECIMAL(10, 2),
    FOREIGN KEY(item) REFERENCES products(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  )
`,
    (err:any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Service items table created or already exists.");
    }
  );
};




export function addServiceItems(dataArray: any[], service_id: number) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO service_items (item, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      const stmt = db.prepare(query);

      for (const data of dataArray) {
        stmt.run([data.product.id, service_id, data.quantity, data.subtotal]);
      }

      stmt.finalize((err:any) => {
        if (err) {
          db.run("ROLLBACK");
          return rej(err);
        }
        db.run("COMMIT", (commitErr:any) => {
          if (commitErr) return rej(commitErr);
          res({ message: `${dataArray.length} records inserted` });
        });
      });
    });
  });
}


export async function getServiceItems(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        "SELECT service_items.*,products.name,products.image,products.retail_price FROM service_items JOIN products ON products.id = service_items.item where service_id = ?",
        [id],
        (err:any, rows:any) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
    return rows;
  } catch (error) {
    throw error;
  }
}