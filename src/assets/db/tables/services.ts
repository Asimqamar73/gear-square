import db from "../db.js";

export const create_service_table = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER,
    note TEXT,
    labor_cost DECIMAL(10, 2) DEFAULT 0.00, 
    created_at TEXT DEFAULT (datetime('now','localtime')),
    created_by INTEGER,
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    updated_by INTEGER,
    FOREIGN KEY(created_by) REFERENCES users(id),
    FOREIGN KEY(updated_by) REFERENCES users(id),
    FOREIGN KEY(vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
)`,
    (err: any) => {
      if (err) {
        console.error("Error creating services table:", err.message); // ✅ Correct message
      } else {
        console.log("Services table created or already exists."); // ✅ Correct table name
      }
    }
  );
};

export function addService(data: any) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO services (vehicle_id, note, labor_cost, created_by, updated_by) VALUES (?, ?, ?, ?, ?)`;
    //@ts-ignore\
    db.run(
      query,
      [data.vehicle_id, data.note, data.laborCost, data.createdBy, data.updatedBy],
      function (err: any) {
        if (err) return rej(err);
        //@ts-ignore
        res(this.lastID);
      }
    );
  });
}

export function deleteService(serviceId: number) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM services WHERE id = ?`;
    
    db.run(query, [serviceId], function (err: any) {
      if (err) {
        console.error("Error deleting service:", err.message);
        return reject(err);
      }
      
      // this.changes tells us how many rows were affected
      if (this.changes === 0) {
        console.warn(`Service with ID ${serviceId} not found`);
      } else {
        console.log(`Service ${serviceId} deleted successfully (${this.changes} row(s) affected)`);
      }
      
      resolve(this.changes);
    });
  });
}





export function getAllInvoices(
  limit: number,
  offset: number,
  search: string = "",
  bill_status: number | null = null
) {
  return new Promise((resolve, reject) => {
    const conditions: string[] = [];
    const params: any[] = [];

    // 🔍 SEARCH FILTER
    if (search && search.trim() !== "") {
      const like = `%${search}%`;
      conditions.push(`
        (
          customers.name LIKE ? OR
          customers.phone_number LIKE ? OR
          customers.company_name LIKE ? OR
          vehicles.vehicle_number LIKE ? OR
          vehicles.chassis_number LIKE ? OR
          services.id LIKE ?
        )
      `);
      params.push(like, like, like, like, like, like);
    }

    // 🧾 BILL STATUS FILTER (Tabs)
    if (bill_status !== null && bill_status !== undefined) {
      conditions.push(`service_bill.bill_status = ?`);
      params.push(bill_status);
    }

    // Build WHERE clause safely
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const baseQuery = `
      FROM services 
      JOIN vehicles ON vehicles.id = services.vehicle_id 
      JOIN customers ON customers.id = vehicles.customer_id 
      JOIN service_bill ON service_bill.service_id = services.id
      ${whereClause}
    `;

    // 📄 DATA QUERY
    const query = `
      SELECT
        services.id AS invoice_id, 
        services.created_at, 
        vehicles.vehicle_number, 
        vehicles.chassis_number, 
        vehicles.id AS vehicle_id, 
        customers.name, 
        customers.phone_number,
        customers.company_name,
        customers.company_phone_number,
        service_bill.amount_paid,
        service_bill.amount_due,
        service_bill.total,
        service_bill.bill_status
      ${baseQuery}
      ORDER BY services.id DESC
      LIMIT ? OFFSET ?
    `;

    // ➕ pagination params
    const dataParams = [...params, limit, offset];

    // 🔢 COUNT QUERY
    const countQuery = `
      SELECT COUNT(*) AS total
      ${baseQuery}
    `;

    // 1️⃣ Get total count
    db.get(countQuery, params, (countErr: any, countRow: any) => {
      if (countErr) return reject(countErr);

      const total = countRow?.total ?? 0;

      // 2️⃣ Get rows
      db.all(query, dataParams, (err: any, rows: any[]) => {
        if (err) return reject(err);

        resolve({ rows, total });
      });
    });
  });
}



export async function getServicesById(customerId: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT services.*,service_bill.bill_status FROM services 
        JOIN service_bill ON services.id=service_bill.service_id 
        where services.customer_id = ?`,
        [customerId],
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

export async function getServicesByVehicleId(vehicleId: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT services.*,service_bill.* FROM services 
        JOIN service_bill ON services.id=service_bill.service_id 
        where services.vehicle_id = ?`,
        [vehicleId],
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

export function searchInvoice(search: string) {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
       services.id as invoice_id, 
        services.created_at, 
        vehicles.vehicle_number, 
        vehicles.chassis_number, 
        vehicles.id as vehicle_id, 
        customers.name, 
        customers.phone_number,
        customers.company_name,
        customers.company_phone_number,
        service_bill.amount_paid,
        service_bill.amount_due,
        service_bill.bill_status
        FROM services 
        JOIN vehicles ON vehicles.id=services.vehicle_id 
        JOIN customers ON customers.id=vehicles.customer_id 
        JOIN service_bill ON service_bill.service_id=services.id 
        WHERE vehicles.vehicle_number LIKE ? 
        OR vehicles.chassis_number LIKE ?
        OR services.id LIKE ?
        ORDER BY vehicles.id DESC`;
    const wildcardSearch = `%${search}%`; // Wrap search string with wildcards
    db.all(query, [wildcardSearch, wildcardSearch, wildcardSearch], (err: any, rows: any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function getServiceDetails(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.get(
        `SELECT 
        vehicles.*, 
        services.*, 
        customers.name,
        customers.phone_number,
        customers.company_name,
        customers.company_phone_number,
        customers.trn
        FROM services 
        JOIN vehicles ON vehicles.id=services.vehicle_id
        JOIN customers ON customers.id=vehicles.customer_id
        where services.id = ?`,
        [id],
        (err: any, row: any) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
    return rows;
  } catch (error) {
    throw error;
  }
}



export function generateInvoice(
  vehicleDetails: any,
  items: any[],
  laborItems: any[],
  discountPercent: number,
  vatAmount: number,
  amountPaid: number,
  billStatus: number
) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // 1️⃣ Insert Service
      const insertServiceQuery = `
        INSERT INTO services (vehicle_id, note, labor_cost, created_by, updated_by)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(
        insertServiceQuery,
        [
          vehicleDetails.vehicle_id,
          vehicleDetails.note,
          vehicleDetails.laborCost,
          vehicleDetails.createdBy,
          vehicleDetails.updatedBy,
        ],
        function (err: any) {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }

          const service_id = this.lastID;

          // 2️⃣ Insert Service Items and calculate items subtotal
          let itemsSubtotal = 0;
          const insertItemQuery = `
            INSERT INTO service_items (product_id, service_id, quantity, subtotal)
            VALUES (?, ?, ?, ?)
          `;
          const stmt = db.prepare(insertItemQuery);

          for (const item of items) {
            const itemSubtotal = item.quantity * item.product.retail_price;
            itemsSubtotal += itemSubtotal;
            stmt.run([item.product.id, service_id, item.quantity, itemSubtotal]);
          }

          stmt.finalize((err2: any) => {
            if (err2) {
              db.run("ROLLBACK");
              return reject(err2);
            }

            // 3️⃣ Insert Labour Charges and calculate total labor amount
            let labourCostTotal = 0;
            if (laborItems && laborItems.length) {
              const insertLabourQuery = `
                INSERT INTO labour_charges (service_id, labour_type, description, amount)
                VALUES (?, ?, ?, ?)
              `;
              const labourStmt = db.prepare(insertLabourQuery);

              for (const labour of laborItems) {
                const amount = Number(labour.amount) || 0;
                labourCostTotal += amount;
                labourStmt.run([service_id, labour.labour_type, labour.description, amount]);
              }

              labourStmt.finalize((errLabour: any) => {
                if (errLabour) {
                  db.run("ROLLBACK");
                  return reject(errLabour);
                }

                // 4️⃣ Calculate bill totals with VAT before discount
                const billSubtotal = itemsSubtotal + labourCostTotal;
                const totalBeforeDiscount = Number(billSubtotal) + Number(vatAmount);
                const discountAmount = discountPercent ? discountPercent : 0;
                const total = totalBeforeDiscount - discountAmount;

                // 5️⃣ Insert Service Bill
                const insertBillQuery = `
                  INSERT INTO service_bill
                  (service_id, subtotal, discount, vat_amount, total, amount_paid, bill_status)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                db.run(
                  insertBillQuery,
                  [service_id, billSubtotal, discountPercent, vatAmount, total, amountPaid, billStatus],
                  function (err3: any) {
                    if (err3) {
                      db.run("ROLLBACK");
                      return reject(err3);
                    }

                    db.run("COMMIT", (commitErr: any) => {
                      if (commitErr) return reject(commitErr);
                      resolve(service_id);
                    });
                  }
                );
              });
            } else {
              // If no labour items, proceed normally
              const billSubtotal = itemsSubtotal + vehicleDetails.laborCost;
              const totalBeforeDiscount = Number(billSubtotal) + Number(vatAmount);
              const discountAmount = discountPercent ? discountPercent : 0;
              const total = totalBeforeDiscount - discountAmount;

              const insertBillQuery = `
                INSERT INTO service_bill
                (service_id, subtotal, discount, vat_amount, total, amount_paid, bill_status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
              `;
              db.run(
                insertBillQuery,
                [service_id, billSubtotal, discountPercent, vatAmount, total, amountPaid, billStatus],
                function (err3: any) {
                  if (err3) {
                    db.run("ROLLBACK");
                    return reject(err3);
                  }

                  db.run("COMMIT", (commitErr: any) => {
                    if (commitErr) return reject(commitErr);
                    resolve(service_id);
                  });
                }
              );
            }
          });
        }
      );
    });
  });
}
