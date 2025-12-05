import db from "../db.js";

export const create_vehicles_table = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_number TEXT NOT NULL UNIQUE,
    make TEXT,
    model TEXT,
    chassis_number TEXT UNIQUE,
    year INTEGER,
    customer_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    created_by INTEGER,
    updated_at TEXT DEFAULT (datetime('now','localtime')),
    updated_by INTEGER,
    FOREIGN KEY(created_by) REFERENCES users(id),
    FOREIGN KEY(updated_by) REFERENCES users(id),
    FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
  )`,
    (err: any) => {
      if (err) console.error("Error creating vehicles table:", err.message);
      console.log("Vehicle table created or already exists.");
    }
  );
};

export function insertVehicleToDatabase({
  vehicle_number,
  make,
  model,
  year,
  chassis_number,
  customer_id,
  createdBy,
  updatedBy,
}: {
  vehicle_number: string;
  make: string;
  model: number;
  year: string;
  chassis_number: string;
  customer_id: number;
  createdBy: number;
  updatedBy: number;
}) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO vehicles (vehicle_number, make, model, year, chassis_number, customer_id, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
    //@ts-ignore\
    db.run(
      query,
      [vehicle_number, make, model, year, chassis_number, customer_id, createdBy, updatedBy],
      function (err: any, row: any) {
        if (err) return rej(err);
        res(row);
      }
    );
  });
}

export function deleteVehicleFromDatabase(vehicle_id: number) {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM vehicles WHERE id = ?`;
    //@ts-ignore
    db.run(query, [vehicle_id], function (err: any) {
      if (err) return reject(err);
      resolve({ success: true, changes: this.changes });
    });
  });
}

export function updateVehicleInDatabase({
  id,
  vehicle_number,
  make,
  model,
  year,
  chassis_number,
  customer_id,
  updatedBy,
}: {
  id: number;
  vehicle_number?: string;
  make?: string;
  model?: string;
  year?: number;
  chassis_number?: string;
  customer_id?: number;
  updatedBy: number;
}) {
  return new Promise((resolve, reject) => {
    // Build dynamic query
    const fields: string[] = [];
    const values: any[] = [];

    if (vehicle_number !== undefined) {
      fields.push("vehicle_number = ?");
      values.push(vehicle_number);
    }
    if (make !== undefined) {
      fields.push("make = ?");
      values.push(make);
    }
    if (model !== undefined) {
      fields.push("model = ?");
      values.push(model);
    }
    if (year !== undefined) {
      fields.push("year = ?");
      values.push(year);
    }
    if (chassis_number !== undefined) {
      fields.push("chassis_number = ?");
      values.push(chassis_number);
    }
    if (customer_id !== undefined) {
      fields.push("customer_id = ?");
      values.push(customer_id);
    }

    // Always update updated_by and updated_at
    fields.push("updated_by = ?");
    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(updatedBy);

    // Add WHERE clause
    const query = `UPDATE vehicles SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    //@ts-ignore
    db.run(query, values, function (err: any) {
      if (err) {
        console.error("Error updating vehicle:", err.message);
        return reject(err);
      }
      resolve({ success: true, changes: this.changes });
    });
  });
}

export function updateProductDetails({
  name,
  description,
  cost_price,
  retail_price,
  sku,
  part_number,
  quantity,
  filePath,
  updatedBy,
  id,
}: {
  name: string;
  description: string;
  cost_price: number;
  retail_price: number;
  sku: number;
  part_number: string;
  quantity: number;
  filePath: string;
  updatedBy: number;
  id: number;
}) {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE products
      SET
        name = ?,
        description = ?,
        cost_price = ?,
        retail_price = ?,
        part_number = ?,
        quantity = ?,
        sku = ?,
        image = ?,
        updated_by = ?
      WHERE id = ?;
    `;
    db.run(
      query,
      [
        name,
        description,
        cost_price,
        retail_price,
        part_number,
        quantity,
        sku,
        filePath,
        updatedBy,
        id,
      ],
      //@ts-ignore
      function (err: any, row: any) {
        if (err) {
          console.error("Error updating product:", err.message);
          return reject(err);
        }
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

export function getAllVehicles() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM vehicles", [], (err: any, rows: any) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
export function getVehicleById(id: number) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
      customers.name,
      customers.id as customer_id,
      customers.phone_number,
      customers.company_name,
      customers.company_phone_number,
      customers.email,
      customers.address,
      vehicles.id,
      vehicles.vehicle_number,
      vehicles.make,
      vehicles.model,
      vehicles.year,
      vehicles.chassis_number
      FROM vehicles
      JOIN customers ON vehicles.customer_id = customers.id
      WHERE vehicles.id = ?`,
      [id],
      (err: any, row: any) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

export function getVehiclesCustomerId(id: number) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM vehicles WHERE customer_id = ?", [id], (err: any, row: any) => {
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
