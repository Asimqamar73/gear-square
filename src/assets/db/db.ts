// import { fileURLToPath } from "url";
// import sqlite3 from "sqlite3";
// import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dbPath = `${__dirname}/gear-square.db`.replace("app.asar", "app.asar.unpacked");
// const db = new sqlite3.Database(dbPath);

// export default db;

// // Updated db.js file
// import { fileURLToPath } from "url";
// import sqlite3 from "sqlite3";
// import path from "path";
// import { app } from "electron";
// import fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Function to get the correct database path
// function getDatabasePath() {
//   if (app.isPackaged) {
//     // In production, use the extraResources path
//     return path.join(process.resourcesPath, 'db', 'gear-square.db');
//   } else {
//     // In development, use the relative path
//     return path.join(__dirname, 'gear-square.db');
//   }
// }

// const dbPath = getDatabasePath();
// console.log('Database path:', dbPath); // For debugging

// // Check if database file exists
// if (!fs.existsSync(dbPath)) {
//   console.error('Database file does not exist at:', dbPath);
//   console.error('Available files in directory:', fs.readdirSync(path.dirname(dbPath)));
// }

// const db = new sqlite3.Database(dbPath, (err) => {
//   if (err) {
//     console.error('Error opening database:', err.message);
//     console.error('Attempted path:', dbPath);
//   } else {
//     console.log('Database connected successfully');
//   }
// });

// export default db;

// Updated db.js file - Fixed version
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";
import fs from "fs";
import { create_users_table } from "./tables/users.js";
import { create_customers_table } from "./tables/customers.js";
import { create_products_table } from "./tables/products.js";
import { create_service_table } from "./tables/services.js";
import { create_service_items_table } from "./tables/serviceItems.js";
import { create_service_bill_table } from "./tables/serviceBill.js";
import { create_vehicles_table } from "./tables/vehicles.js";
import { createDeductProductQuantityTrigger } from "./triggers/triggers.js";
import { create_service_labor_charges_table } from "./tables/serviceLaborCharges.js";

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);
console.log(__filename)
console.log(_dirname)

// Function to get the correct database path
function getDatabasePath() {
  if (app.isPackaged) {
    // In production, use userData directory (writable)
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "gear-square.db");
  } else {
    // In development, use the relative path
    return path.join(_dirname, "gear-square.db");
  }
}

// Function to initialize database in user directory
function initializeDatabase() {
  const userDbPath = getDatabasePath();

  if (app.isPackaged && !fs.existsSync(userDbPath)) {
    // Copy template database from extraResources to userData
    const templateDbPath = path.join(process.resourcesPath, "db", "gear-square.db");

    // Ensure userData directory exists
    const userDataDir = path.dirname(userDbPath);
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }

    // Copy template database if it exists
    if (fs.existsSync(templateDbPath)) {
      fs.copyFileSync(templateDbPath, userDbPath);
      console.log("Database copied from template to:", userDbPath);
    } else {
      console.error("Template database not found at:", templateDbPath);
      // Create empty database file
      createEmptyDatabase(userDbPath);
    }
  }
  try {
    if (fs.existsSync(userDbPath)) {
      fs.chmodSync(userDbPath, 0o666); // Make file readable/writable
      console.log("File permissions updated: read/write");
    }
  } catch (chmodErr: any) {
    console.error("Failed to update file permissions:", chmodErr.message);
  }

  return userDbPath;
}

// Function to create empty database (tables will be created by your existing functions)
function createEmptyDatabase(dbPath: any) {
  // Just create an empty database file
  // Your existing table creation functions will handle the schema
  const tempDb = new sqlite3.Database(dbPath);
  tempDb.close();
  console.log("Empty database file created at:", dbPath);
}

const dbPath = initializeDatabase();
console.log("Final database path:", dbPath);

// Check if database file exists and is accessible
if (!fs.existsSync(dbPath)) {
  console.error("Database file does not exist at:", dbPath);
} else {
  // Check if file is writable
  try {
    fs.accessSync(dbPath, fs.constants.W_OK);
  } catch (err: any) {
    console.error("Database file is not writable:", err.message);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    console.error("Attempted path:", dbPath);
  } else {
    console.log("Database connected successfully at:", dbPath);
    // Initialize tables after successful connection
    initializeTables();
  }
});

// Function to initialize all tables
function initializeTables() {
  console.log("Initializing database tables...");

  // Call all your table creation functions here
  create_users_table();
  create_customers_table();
  create_products_table();
  create_vehicles_table();
  create_service_table();
  create_service_items_table();
  create_service_bill_table();
  create_service_labor_charges_table();
  createDeductProductQuantityTrigger();
  // Add all your other table creation functions

  console.log("Database tables initialized");
}

// Your table creation functions

// Add all your other table creation functions here...

export default db;
