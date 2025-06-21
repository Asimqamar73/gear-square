import db from "../db.js";

export const create_service_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_number TEXT,      
    make TEXT,                       
    model TEXT,          
    year INTEGER, 
    note TEXT,
    customer_id INTEGER,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    created_by INTEGER,
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    updated_by INTEGER,
    FOREIGN KEY(created_by) REFERENCES users(id),
    FOREIGN KEY(updated_by) REFERENCES users(id),
    FOREIGN KEY(customer_id) REFERENCES customers(id)
  )
`,
    (err: any) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Services table created or already exists.");
    }
  );
};

export function addService(data: any) {
  return new Promise((res, rej) => {
    console.log(data);
    const query = `INSERT INTO services (vehicle_number, make, model, year, note, created_by, updated_by, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    //@ts-ignore\
    db.run(
      query,
      [
        data.vehicle_number,
        data.make,
        data.model,
        data.year,
        data.note,
        data.createdBy,
        data.updatedBy,
        data.customerId,
      ],
      function (err: any, row: any) {
        console.log(row);
        console.log(err);
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
        services.*, customers.name, customers.phone_number, service_bill.amount_paid,service_bill.amount_due,service_bill.bill_status
        FROM services 
        JOIN customers ON customers.id=services.customer_id 
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
  console.log(customerId);
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT services.*,service_bill.bill_status FROM services 
        JOIN service_bill ON services.id=service_bill.service_id 
        where services.customer_id = ?`,
        [customerId],
        (err: any, rows: any) => {
          console.log(rows, "rows");
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
    const query =
      // "SELECT * FROM services JOIN customers ON customers.id=services.customer_id WHERE customers.name LIKE ? OR services.vehicle_number LIKE ? OR customers.phone_number LIKE ?";
      `SELECT 
        services.*, customers.name, customers.phone_number, service_bill.amount_paid,service_bill.amount_due,service_bill.bill_status
        FROM services 
        JOIN customers ON customers.id=services.customer_id 
        JOIN service_bill ON service_bill.service_id=services.id 
        WHERE services.vehicle_number LIKE ?
        ORDER BY services.id DESC`;
    const wildcardSearch = `%${search}%`; // Wrap search string with wildcards
    db.all(query, [wildcardSearch], (err: any, rows: any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export async function getServiceDetails(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.get(
        `SELECT services.*, customers.name,customers.phone_number FROM services 
        JOIN customers ON customers.id=services.customer_id
        where services.id = ?`,
        [id],
        (err: any, row: any) => {
          console.log("rows", row);
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
