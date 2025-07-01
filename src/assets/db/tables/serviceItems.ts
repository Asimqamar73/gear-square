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
    FOREIGN KEY(service_id) REFERENCES services(id) ON DELETE CASCADE
  )
`,
    (err: any) => {
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

      stmt.finalize((err: any) => {
        if (err) {
          db.run("ROLLBACK");
          return rej(err);
        }
        db.run("COMMIT", (commitErr: any) => {
          if (commitErr) return rej(commitErr);
          res({ message: `${dataArray.length} records inserted` });
        });
      });
    });
  });
}

// export function updateServiceItems(
//   data: { insert: any[]; update: any[]; delete: number[] },
//   service_id: number
// ) {
//   console.log(data.insert)
//   return new Promise((res, rej) => {
//     const insertQuery = `INSERT INTO service_items (item, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;
//     const updateQuery = `UPDATE service_items SET quantity = ?, subtotal = ? WHERE id = ?`;
//     const deleteQuery = `DELETE FROM service_items WHERE id = ?`;

//     db.serialize(() => {
//       // Begin Transaction
//       db.run("BEGIN TRANSACTION");

//       // Handle Insert
//       const insertStmt = db.prepare(insertQuery);
//       for (const dataItem of data.insert) {
//         insertStmt.run([dataItem.product.id, service_id, dataItem.quantity, dataItem.subtotal]);
//       }

//       // Handle Update
//       const updateStmt = db.prepare(updateQuery);
//       for (const dataItem of data.update) {
//         updateStmt.run([dataItem.quantity, dataItem.subtotal, dataItem.id]);
//       }

//       // Handle Delete
//       const deleteStmt = db.prepare(deleteQuery);
//       for (const id of data.delete) {
//         deleteStmt.run([id]);
//       }

//       // Finalize all queries
//       insertStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej(err);
//         }
//       });

//       updateStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej(err);
//         }
//       });

//       deleteStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej(err);
//         }
//       });

//       // Commit the transaction
//       db.run("COMMIT", (commitErr: any) => {
//         if (commitErr) {
//           return rej(commitErr);
//         }
//         res({
//           message: `${data.insert.length} records inserted, ${data.update.length} records updated, ${data.delete.length} records deleted`,
//         });
//       });
//     });
//   });
// }
// export function updateServiceItems(
//   data:  any[] , // Only insert items
//   service_id: number
// ) {
//   return new Promise((res, rej) => {
//     const insertQuery = `INSERT INTO service_items (item, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;
//     const deleteQuery = `DELETE FROM service_items WHERE service_id = ?`;

//     db.serialize(() => {
//       // Begin Transaction
//       db.run("BEGIN TRANSACTION");

//       // Handle Delete: Remove all previous items for the service_id
//       const deleteStmt = db.prepare(deleteQuery);
//       deleteStmt.run([service_id], (err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej(err);
//         }
//       });

//       // Handle Insert: Add new items
//       const insertStmt = db.prepare(insertQuery);
//       for (const dataItem of data) {
//         insertStmt.run(
//           [dataItem.product.id, service_id, dataItem.quantity, dataItem.subtotal],
//           (err: any) => {
//             if (err) {
//               db.run("ROLLBACK");
//               return rej(err);
//             }
//           }
//         );
//       }

//       // Finalize all queries
//       insertStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej(err);
//         }
//       });

//       deleteStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej(err);
//         }
//       });

//       // Commit the transaction
//       db.run("COMMIT", (commitErr: any) => {
//         if (commitErr) {
//           return rej(commitErr);
//         }
//         res({
//           message: `${data.length} records inserted, all previous items for service ${service_id} deleted.`,
//         });
//       });
//     });
//   });
// }

export function updateServiceItems(
  data: { items: any[]; payment_status: string; subtotal: number; total: number }, // Frontend sends this structure
  service_id: number
) {
  return new Promise((res, rej) => {
    const insertQuery = `INSERT INTO service_items (item, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;
    const deleteQuery = `DELETE FROM service_items WHERE service_id = ?`;
    const updateServiceBillQuery = `UPDATE service_bill 
                                   SET bill_status = ?, subtotal = ?, total = ? 
                                   WHERE service_id = ?`;

    db.serialize(() => {
      // Begin Transaction
      db.run("BEGIN TRANSACTION");

      // Handle Delete: Remove all previous items for the service_id
      const deleteStmt = db.prepare(deleteQuery);
      deleteStmt.run([service_id], (err: any) => {
        if (err) {
          db.run("ROLLBACK");
          return rej(err);
        }
      });

      // Handle Insert: Add new items
      const insertStmt = db.prepare(insertQuery);
      for (const dataItem of data.items) {
        insertStmt.run(
          [dataItem.product.id, service_id, dataItem.quantity, dataItem.subtotal],
          (err: any) => {
            if (err) {
              db.run("ROLLBACK");
              return rej(err);
            }
          }
        );
      }

      // Finalize all queries
      insertStmt.finalize((err: any) => {
        if (err) {
          db.run("ROLLBACK");
          return rej(err);
        }
      });

      deleteStmt.finalize((err: any) => {
        if (err) {
          db.run("ROLLBACK");
          return rej(err);
        }
      });

      // After all items have been inserted and deleted, update the serviceBill with data from frontend
      const updateServiceBillStmt = db.prepare(updateServiceBillQuery);
      updateServiceBillStmt.run(
        [data.payment_status, data.subtotal, data.total, service_id],
        (err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej(err);
          }
        }
      );

      // Finalize the update for serviceBill
      updateServiceBillStmt.finalize((err: any) => {
        if (err) {
          db.run("ROLLBACK");
          return rej(err);
        }
      });

      // Commit the transaction
      db.run("COMMIT", (commitErr: any) => {
        if (commitErr) {
          return rej(commitErr);
        }
        res({
          message: `${data.items.length} records inserted, all previous items for service ${service_id} deleted, and serviceBill updated.`,
        });
      });
    });
  });
}

export async function getServiceItems(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
        service_items.*,
        products.name,
        products.image,
        products.retail_price
        FROM service_items 
        JOIN products 
        ON products.id = service_items.item 
        where service_id = ?`,
        [id],
        (err: any, rows: any) => {
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

export async function getServiceItemsDetials(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT 
        service_items.quantity,
        service_items.subtotal,
        service_items.item,
        service_items.id,
        products.*
        FROM service_items 
        JOIN products 
        ON products.id = service_items.item 
        WHERE service_id = ?`,
        [id],
        (err: any, rows: any) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
    //@ts-ignore
    const formattedRows = rows.map((row: any) => ({
      product: {
        id: row.id,
        name: row.name,
        description: row.description, // Include other product fields as needed
        // Add more product fields as required
      },
      quantity: row.quantity,
      subtotal: row.subtotal,
      item: row.item,
    }));

    return formattedRows;
  } catch (error) {
    throw error;
  }
}
