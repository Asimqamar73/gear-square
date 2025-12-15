import db from "../db.js";

export const create_service_items_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS service_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    service_id INTEGER,
    quantity INTEGER,
    subtotal DECIMAL(10, 2),
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
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
    const query = `INSERT INTO service_items (product_id, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)`;

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


export function updateServiceByServiceId(data: {
  items: any[];
  labor_item: { labour_type: string; description?: string; amount: number }[];
  items_changes: {
    added: any[];
    updated: any[];
    deleted: any[];
  };
  labor_changes: {
    added: any[];
    updated: any[];
    deleted: any[];
  };
  payment_status: number;
  subtotal: number;
  total: number;
  vat_amount: number;
  discount_percentage: number;
  discount_amount: number;
  amount_paid: number;
  labor_cost: number;
  service_note: string;
  service_id: number;
  updated_by: number;
}) {
  return new Promise((res, rej) => {
    const { service_id, updated_by, items_changes, labor_changes } = data;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // ----------- 1. HANDLE SERVICE ITEMS CHANGES -----------
      
      // 1a. Delete removed items
      if (items_changes.deleted.length > 0) {
        const deleteItemStmt = db.prepare("DELETE FROM service_items WHERE id = ?");
        for (const itemId of items_changes.deleted) {
          deleteItemStmt.run(itemId);
        }
        deleteItemStmt.finalize((err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to delete service items", details: err });
          }
        });
      }

      // 1b. Insert new items
      if (items_changes.added.length > 0) {
        const insertItemStmt = db.prepare(
          "INSERT INTO service_items (product_id, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)"
        );
        for (const item of items_changes.added) {
          insertItemStmt.run(item.product_id, service_id, item.quantity, item.subtotal);
        }
        insertItemStmt.finalize((err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to insert new service items", details: err });
          }
        });
      }

      // 1c. Update existing items
      if (items_changes.updated.length > 0) {
        const updateItemStmt = db.prepare(
          "UPDATE service_items SET product_id = ?, quantity = ?, subtotal = ? WHERE id = ?"
        );
        for (const item of items_changes.updated) {
          updateItemStmt.run(item.product_id, item.quantity, item.subtotal, item.id);
        }
        updateItemStmt.finalize((err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to update service items", details: err });
          }
        });
      }

      // ----------- 2. HANDLE LABOUR CHARGES CHANGES -----------
      
      // 2a. Delete removed labour items
      if (labor_changes.deleted.length > 0) {
        const deleteLabourStmt = db.prepare("DELETE FROM labour_charges WHERE id = ?");
        for (const labourId of labor_changes.deleted) {
          deleteLabourStmt.run(labourId);
        }
        deleteLabourStmt.finalize((err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to delete labour charges", details: err });
          }
        });
      }

      // 2b. Insert new labour items
      if (labor_changes.added.length > 0) {
        const insertLabourStmt = db.prepare(
          "INSERT INTO labour_charges (service_id, labour_type, description, amount) VALUES (?, ?, ?, ?)"
        );
        for (const labour of labor_changes.added) {
          insertLabourStmt.run(
            service_id,
            labour.labor_type,
            labour.description || null,
            labour.amount
          );
        }
        insertLabourStmt.finalize((err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to insert new labour charges", details: err });
          }
        });
      }

      // 2c. Update existing labour items
      if (labor_changes.updated.length > 0) {
        const updateLabourStmt = db.prepare(
          "UPDATE labour_charges SET labour_type = ?, description = ?, amount = ? WHERE id = ?"
        );
        for (const labour of labor_changes.updated) {
          updateLabourStmt.run(
            labour.labor_type,
            labour.description || null,
            labour.amount,
            labour.id
          );
        }
        updateLabourStmt.finalize((err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to update labour charges", details: err });
          }
        });
      }

      // ----------- 3. UPDATE SERVICE BILL -----------
      const updateServiceBillQuery = `UPDATE service_bill 
                                      SET bill_status = ?, 
                                          subtotal = ?, 
                                          total = ?,
                                          vat_amount = ?,
                                          discount = ?,
                                          amount_paid = ?
                                      WHERE service_id = ?`;
      db.run(
        updateServiceBillQuery,
        [
          data.payment_status,
          data.subtotal,
          data.total,
          data.vat_amount,
          data.discount_amount,
          data.amount_paid,
          service_id,
        ],
        (err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to update service bill", details: err });
          }

          // ----------- 4. UPDATE SERVICES TABLE -----------
          const updateServiceQuery = `UPDATE services 
                                      SET labor_cost = ?,
                                          note = ?,
                                          updated_at = datetime('now','localtime'),
                                          updated_by = ?
                                      WHERE id = ?`;
          db.run(
            updateServiceQuery,
            [data.labor_cost, data.service_note, updated_by, service_id],
            (err: any) => {
              if (err) {
                db.run("ROLLBACK");
                return rej({ error: "Failed to update service", details: err });
              }

              // ----------- 5. COMMIT TRANSACTION -----------
              db.run("COMMIT", (commitErr: any) => {
                if (commitErr) {
                  db.run("ROLLBACK");
                  return rej({ error: "Failed to commit transaction", details: commitErr });
                }

                const changesSummary = {
                  items: {
                    added: items_changes.added.length,
                    updated: items_changes.updated.length,
                    deleted: items_changes.deleted.length,
                  },
                  labour: {
                    added: labor_changes.added.length,
                    updated: labor_changes.updated.length,
                    deleted: labor_changes.deleted.length,
                  },
                };

                res({
                  success: true,
                  message: `Invoice updated successfully.`,
                  service_id,
                  changes: changesSummary,
                });
              });
            }
          );
        }
      );
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
        ON products.id = service_items.product_id
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
        service_items.product_id,
        service_items.id,
        products.*
        FROM service_items 
        JOIN products 
        ON products.id = service_items.product_id 
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
