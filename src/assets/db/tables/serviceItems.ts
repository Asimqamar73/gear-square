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
    FOREIGN KEY(product_id) REFERENCES products(id),
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


// export function updateServiceByServiceId(
//   data: {
//     items: any[];
//     payment_status: number;
//     subtotal: number;
//     total: number;
//     vat_amount: number;
//     discount_percentage: number;
//     discount_amount: number;
//     amount_paid: number;
//     labor_cost: number;
//     service_note: string;
//     service_id: number;
//     updated_by: number;
//   }
// ) {
//   return new Promise((res, rej) => {
//     const { service_id, updated_by } = data;
    
//     const insertQuery = `INSERT INTO service_items (product_id, service_id, quantity, subtotal) 
//                          VALUES (?, ?, ?, ?)`;
    
//     const deleteQuery = `DELETE FROM service_items WHERE service_id = ?`;
    
//     const updateServiceBillQuery = `UPDATE service_bill 
//                                     SET bill_status = ?, 
//                                         subtotal = ?, 
//                                         total = ?,
//                                         vat_amount = ?,
//                                         discount = ?,
//                                         amount_paid = ?
//                                     WHERE service_id = ?`;
    
//     const updateServiceQuery = `UPDATE services 
//                                 SET labor_cost = ?,
//                                     note = ?,
//                                     updated_at = datetime('now','localtime'),
//                                     updated_by = ?
//                                 WHERE id = ?`;

//     db.serialize(() => {
//       // Begin Transaction
//       db.run("BEGIN TRANSACTION");

//       // 1. Delete all previous service items for this service_id
//       const deleteStmt = db.prepare(deleteQuery);
//       deleteStmt.run([service_id], (err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej({ error: "Failed to delete previous items", details: err });
//         }
//       });
//       deleteStmt.finalize();

//       // 2. Insert new service items
//       const insertStmt = db.prepare(insertQuery);
//       for (const dataItem of data.items) {
//         // Skip items without a valid product
//         if (!dataItem.product || !dataItem.product.id) {
//           continue;
//         }
        
//         insertStmt.run(
//           [dataItem.product.id, service_id, dataItem.quantity, dataItem.subtotal],
//           (err: any) => {
//             if (err) {
//               db.run("ROLLBACK");
//               return rej({ error: "Failed to insert item", details: err });
//             }
//           }
//         );
//       }
      
//       insertStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej({ error: "Failed to finalize insert", details: err });
//         }
//       });

//       // 3. Update service_bill with all financial data
//       const updateServiceBillStmt = db.prepare(updateServiceBillQuery);
//       updateServiceBillStmt.run(
//         [
//           data.payment_status,
//           data.subtotal,
//           data.total,
//           data.vat_amount,
//           data.discount_percentage, // Store actual discount amount, not percentage
//           data.amount_paid,
//           service_id
//         ],
//         (err: any) => {
//           if (err) {
//             db.run("ROLLBACK");
//             return rej({ error: "Failed to update service bill", details: err });
//           }
//         }
//       );
      
//       updateServiceBillStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej({ error: "Failed to finalize service bill update", details: err });
//         }
//       });

//       // 4. Update services table with labor cost and note
//       const updateServiceStmt = db.prepare(updateServiceQuery);
//       updateServiceStmt.run(
//         [
//           data.labor_cost,
//           data.service_note,
//           updated_by,
//           service_id
//         ],
//         (err: any) => {
//           if (err) {
//             db.run("ROLLBACK");
//             return rej({ error: "Failed to update service", details: err });
//           }
//         }
//       );
      
//       updateServiceStmt.finalize((err: any) => {
//         if (err) {
//           db.run("ROLLBACK");
//           return rej({ error: "Failed to finalize service update", details: err });
//         }
//       });

//       // 5. Commit the transaction
//       db.run("COMMIT", (commitErr: any) => {
//         if (commitErr) {
//           db.run("ROLLBACK");
//           return rej({ error: "Failed to commit transaction", details: commitErr });
//         }
        
//         res({
//           success: true,
//           message: `Invoice updated successfully: ${data.items.length} items processed, service bill and service details updated.`,
//           service_id: service_id,
//           items_count: data.items.length
//         });
//       });
//     });
//   });
// }

export function updateServiceByServiceId(data: {
  items: any[];
  labor_item: { labour_type: string; description?: string; amount: number }[];
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
    const { service_id, updated_by } = data;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // ----------- 1. DELETE ALL PREVIOUS SERVICE ITEMS -----------
      db.run("DELETE FROM service_items WHERE service_id = ?", [service_id], (err: any) => {
        if (err) {
          db.run("ROLLBACK");
          return rej({ error: "Failed to delete previous service items", details: err });
        }

        // ----------- 2. INSERT NEW SERVICE ITEMS -----------
        const insertItemStmt = db.prepare(
          "INSERT INTO service_items (product_id, service_id, quantity, subtotal) VALUES (?, ?, ?, ?)"
        );
        for (const item of data.items) {
          if (!item.product || !item.product.id) continue;
          insertItemStmt.run(item.product.id, service_id, item.quantity, item.subtotal);
        }
        insertItemStmt.finalize((err: any) => {
          if (err) {
            db.run("ROLLBACK");
            return rej({ error: "Failed to insert service items", details: err });
          }

          // ----------- 3. DELETE ALL PREVIOUS LABOUR CHARGES -----------
          db.run("DELETE FROM labour_charges WHERE service_id = ?", [service_id], (err: any) => {
            if (err) {
              db.run("ROLLBACK");
              return rej({ error: "Failed to delete previous labour charges", details: err });
            }

            // ----------- 4. INSERT NEW LABOUR CHARGES -----------
            const insertLabourStmt = db.prepare(
              "INSERT INTO labour_charges (service_id, labour_type, description, amount) VALUES (?, ?, ?, ?)"
            );
            for (const labour of data.labor_item) {
              insertLabourStmt.run(
                service_id,
                labour.labour_type,
                labour.description || null,
                labour.amount
              );
            }
            insertLabourStmt.finalize((err: any) => {
              if (err) {
                db.run("ROLLBACK");
                return rej({ error: "Failed to insert labour charges", details: err });
              }

              // ----------- 5. UPDATE SERVICE BILL -----------
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

                  // ----------- 6. UPDATE SERVICES TABLE -----------
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

                      // ----------- 7. COMMIT TRANSACTION -----------
                      db.run("COMMIT", (commitErr: any) => {
                        if (commitErr) {
                          db.run("ROLLBACK");
                          return rej({ error: "Failed to commit transaction", details: commitErr });
                        }

                        res({
                          success: true,
                          message: `Invoice updated successfully. All previous items and labour charges replaced.`,
                          service_id,
                        });
                      });
                    }
                  );
                }
              );
            });
          });
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
