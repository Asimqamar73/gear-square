import db from "../db.js";

export const dailyProfit = (): Promise<{ total_profit: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM((products.retail_price - products.cost_price) * service_items.quantity), 0), 2) AS total_profit
      FROM services
      JOIN service_items 
        ON services.id = service_items.service_id
      JOIN products 
        ON products.id = service_items.item
      WHERE DATE(services.created_at) = DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_profit: number }) => {
      if (err) {
        console.error("Error fetching daily profit:", err);
        return reject(err);
      }
      resolve(row);
    });
  });
};

export const last7DaysProfit = (): Promise<{ total_profit: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM((products.retail_price - products.cost_price) * service_items.quantity), 0), 2) AS total_profit
      FROM services
      JOIN service_items 
        ON services.id = service_items.service_id
      JOIN products 
        ON products.id = service_items.item
      WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-7 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_profit: number }) => {
      if (err) {
        console.error("Error fetching last 7 days profit:", err);
        return reject(err);
      }
      resolve(row);
    });
  });
};

export const dailyDueAmount = (): Promise<{ total_due_amount: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM(service_bill.amount_due), 0), 2) AS total_due_amount
      FROM services
      JOIN service_bill 
        ON service_bill.service_id = services.id
      WHERE DATE(services.created_at) = DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_due_amount: number }) => {
      if (err) {
        console.error("Error fetching daily due amount:", err);
        return reject(err);
      }

      resolve(row);
    });
  });
};

export const last7DaysDueAmount = (): Promise<{ total_due_amount: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM(service_bill.amount_due), 0), 2) AS total_due_amount
      FROM services
      JOIN service_bill 
        ON service_bill.service_id = services.id
      WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-7 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_due_amount: number }) => {
      if (err) {
        console.error("Error fetching last 7 days due amount:", err);
        return reject(err);
      }

      resolve(row);
    });
  });
};

export const todayServicesCount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT count(*) as services_count FROM services
      WHERE DATE(services.created_at) = DATE('now', 'localtime')`,
      [],
      (err: any, row: any) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

export const last7DaysServicesCount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT count(*) as services_count FROM services
        WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-7 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')`,
      [],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

export const last30DaysProfit = (): Promise<{ total_profit: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM((products.retail_price - products.cost_price) * service_items.quantity), 0), 2) AS total_profit
      FROM services
      JOIN service_items 
        ON services.id = service_items.service_id
      JOIN products 
        ON products.id = service_items.item
      WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-30 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_profit: number }) => {
      if (err) {
        console.error("Error fetching last 30 days profit:", err);
        return reject(err);
      }
      resolve(row);
    });
  });
};

export const last30DaysServicesCount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT count(*) as services_count FROM services
        WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-30 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')`,
      [],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

export const last30DaysDueAmount = (): Promise<{ total_due_amount: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM(service_bill.amount_due), 0), 2) AS total_due_amount
      FROM services
      JOIN service_bill 
        ON service_bill.service_id = services.id
      WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-30 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_due_amount: number }) => {
      if (err) {
        console.error("Error fetching last 30 days due amount:", err);
        return reject(err);
      }

      resolve(row);
    });
  });
};

export const last365DaysProfit = (): Promise<{ total_profit: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM((products.retail_price - products.cost_price) * service_items.quantity), 0), 2) AS total_profit
      FROM services
      JOIN service_items 
        ON services.id = service_items.service_id
      JOIN products 
        ON products.id = service_items.item
      WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-365 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_profit: number }) => {
      if (err) {
        console.error("Error fetching last 365 days profit:", err);
        return reject(err);
      }
      resolve(row);
    });
  });
};

export const last365DaysServicesCount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT count(*) as services_count FROM services
        WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-365 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')`,
      [],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

export const last365DaysDueAmount = (): Promise<{ total_due_amount: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM(service_bill.amount_due), 0), 2) AS total_due_amount
      FROM services
      JOIN service_bill 
        ON service_bill.service_id = services.id
      WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-365 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_due_amount: number }) => {
      if (err) {
        console.error("Error fetching last 365 days due amount:", err);
        return reject(err);
      }

      resolve(row);
    });
  });
};

export const timelineSummary = (
  timeline: { startDate: string | Date; endDate: string | Date }
): Promise<{
  services_count: number;
  total_due_amount: number;
  total_profit: number;
}> => {
  return new Promise((resolve, reject) => {
    const start = new Date(timeline.startDate);
    const end = new Date(timeline.endDate);

    const fromDate = start < end ? start : end;
    const toDate = start < end ? end : start;

    // Format as ISO without time zone for SQLite (YYYY-MM-DD HH:MM:SS)
    const from = fromDate.toISOString().slice(0, 19).replace("T", " ");
    const to = toDate.toISOString().slice(0, 19).replace("T", " ");

    const query = `
      WITH
        service_data AS (
          SELECT COUNT(id) AS services_count
          FROM services
          WHERE DATETIME(created_at) >= DATETIME(?)
            AND DATETIME(created_at) < DATETIME(?, '+1 day')
        ),
        due_data AS (
          SELECT ROUND(COALESCE(SUM(amount_due), 0), 2) AS total_due_amount
          FROM service_bill
          WHERE service_id IN (
            SELECT id FROM services
            WHERE DATETIME(created_at) >= DATETIME(?)
              AND DATETIME(created_at) < DATETIME(?, '+1 day')
          )
        ),
        profit_data AS (
          SELECT ROUND(COALESCE(SUM((p.retail_price - p.cost_price) * si.quantity), 0), 2) AS total_profit
          FROM service_items si
          JOIN products p ON p.id = si.item
          JOIN services s ON s.id = si.service_id
          WHERE DATETIME(s.created_at) >= DATETIME(?)
            AND DATETIME(s.created_at) < DATETIME(?, '+1 day')
        )
      SELECT
        (SELECT services_count FROM service_data) AS services_count,
        (SELECT total_due_amount FROM due_data) AS total_due_amount,
        (SELECT total_profit FROM profit_data) AS total_profit;
    `;

    db.get(
      query,
      [from, to, from, to, from, to],
      (err: Error | null, row: {
        services_count: number;
        total_due_amount: number;
        total_profit: number;
      }) => {
        if (err) {
          console.error("Error fetching timeline summary:", err);
          return reject(err);
        }
        console.log(row);
        resolve(row);
      }
    );
  });
};



export const timelineServicesCount = () => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT count(*) as services_count FROM services
        WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-365 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')`,
      [],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

export const timelineDueAmount = (): Promise<{ total_due_amount: number }> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ROUND(COALESCE(SUM(service_bill.amount_due), 0), 2) AS total_due_amount
      FROM services
      JOIN service_bill 
        ON service_bill.service_id = services.id
      WHERE DATE(services.created_at) >= DATE('now', 'localtime', '-365 days')
        AND DATE(services.created_at) < DATE('now', 'localtime')
    `;

    db.get(query, [], (err: Error | null, row: { total_due_amount: number }) => {
      if (err) {
        console.error("Error fetching last 365 days due amount:", err);
        return reject(err);
      }

      resolve(row);
    });
  });
};
