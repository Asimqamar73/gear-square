// import { fileURLToPath } from "url";
// import sqlite3 from "sqlite3";
// import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dbPath = `${__dirname}/gear-square.db`.replace("app.asar", "app.asar.unpacked");
// const db = new sqlite3.Database(dbPath);

// export default db;




// Updated db.js file
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import path from "path";
import { app } from "electron";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get the correct database path
function getDatabasePath() {
  if (app.isPackaged) {
    // In production, use the extraResources path
    return path.join(process.resourcesPath, 'db', 'gear-square.db');
  } else {
    // In development, use the relative path
    return path.join(__dirname, 'gear-square.db');
  }
}

const dbPath = getDatabasePath();
console.log('Database path:', dbPath); // For debugging

// Check if database file exists
if (!fs.existsSync(dbPath)) {
  console.error('Database file does not exist at:', dbPath);
  console.error('Available files in directory:', fs.readdirSync(path.dirname(dbPath)));
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.error('Attempted path:', dbPath);
  } else {
    console.log('Database connected successfully');
  }
});

export default db;