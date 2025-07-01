import db from "../db.js";

export const create_service_bill_table = () => {
  db.run(
    `
  CREATE TABLE IF NOT EXISTS service_bill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subtotal DECIMAL(10, 2) NOT NULL,
    service_id INTEGER NOT NULL,
    discount DECIMAL(10, 2),
    total DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2),
    amount_due DECIMAL(10, 2) GENERATED ALWAYS AS (total - amount_paid) STORED,
    bill_status INTEGER,
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

export function addServiceBill(data: any, service_id: number) {
  return new Promise((res, rej) => {
    const query = `INSERT INTO service_bill 
    (service_id, 
    subtotal,
    total,
    discount,
    amount_paid,
    bill_status) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(
      query,
      [service_id, data.subtotal, data.total, data.discount, data.amountPaid, data.billStatus],
      function (err: any) {
        if (err) return rej(err);
        //@ts-ignore
        res(this.lastID);
      }
    );
  });
}

export async function getServiceBill(id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM service_bill where service_id = ?", [id], (err: any, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
}

export async function UpdateServiceBillPayment(amountPaid: number, billStatus: number, id: number) {
  try {
    const rows = await new Promise((resolve, reject) => {
      const query = `
      UPDATE service_bill
      SET
    amount_paid = ?,
    bill_status = ?
      WHERE id = ?;
    `;
      db.run(query, [amountPaid, billStatus, id], (err: any, rows: any) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
}
