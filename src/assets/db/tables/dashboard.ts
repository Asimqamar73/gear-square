import db from "../db.js";

export const dailyProfit = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT 
  SUM((products.retail_price - products.cost_price) * service_items.quantity) AS total_profit
FROM services
JOIN service_items ON services.id = service_items.service_id
JOIN products ON products.id = service_items.item
WHERE DATE(services.created_at) = DATE('now', 'localtime')`,
      [],
      (err: any, row: any) => {
        console.log("getCustomerById row", row);
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

export const dailyDueAmount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT SUM(service_bill.amount_due) AS total_due_amount
FROM services
JOIN service_bill ON service_bill.service_id = services.id
WHERE DATE(services.created_at) = DATE('now', 'localtime')`,
      [],
      (err: any, row: any) => {
        console.log("getCustomerById row", row);
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

export const todayServicesCount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT count(*) as services_count FROM services
WHERE DATE(services.created_at) = DATE('now', 'localtime')`,
      [],
      (err: any, row: any) => {
        console.log(row);
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};
