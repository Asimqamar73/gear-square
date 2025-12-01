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

export async function getAllInvoices() {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT
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
        order by services.id DESC`,
        [],
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
            console.log(vatAmount);
            // 3️⃣ Calculate bill totals with VAT before discount
            const billSubtotal = itemsSubtotal + vehicleDetails.laborCost;
            const totalBeforeDiscount = Number(billSubtotal) + Number(vatAmount);
            console.log("totalBeforeDiscount");
            console.log(totalBeforeDiscount);

            const discountAmount = discountPercent
              ? (totalBeforeDiscount * discountPercent) / 100
              : 0;
            const total = totalBeforeDiscount - discountAmount;
            console.log("discountAmount");
            console.log(discountAmount);
            console.log("total");
            console.log(total);
            // 4️⃣ Insert Service Bill
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
        }
      );
    });
  });
}
