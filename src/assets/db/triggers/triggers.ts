import db from "../db.js";

export const createDeductProductQuantityTrigger = () => {
  const createTriggerSQL = `
    CREATE TRIGGER IF NOT EXISTS deduct_product_quantity
    AFTER INSERT ON service_items
    FOR EACH ROW
    BEGIN
      UPDATE products
      SET quantity = quantity - NEW.quantity
      WHERE id = NEW.product_id;
    END;
  `;

  db.run(createTriggerSQL, (err: any) => {
    if (err) {
      console.error("Error creating trigger:", err);
    } else {
      console.log("Trigger 'deduct_product_quantity' created successfully.");
    }
  });
};
