import db from "../db.js";

export const create_service_table = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      note TEXT,
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
    const query = `INSERT INTO services (vehicle_id, note, created_by, updated_by) VALUES (?, ?, ?, ?)`;
    //@ts-ignore\
    db.run(
      query,
      [data.vehicle_id, data.note, data.createdBy, data.updatedBy],
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
