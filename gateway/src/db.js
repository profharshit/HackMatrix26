const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataFolder = path.join(__dirname, "..", "..", "data");
const databaseFilePath = path.join(dataFolder, "intel.db");
const schemaFilePath = path.join(dataFolder, "schema.sql");

// Opens the shared database file and makes sure all tables exist.
function openDatabase() {
  const database = new Database(databaseFilePath);
  const schemaText = fs.readFileSync(schemaFilePath, "utf8");
  database.exec(schemaText);
  return database;
}

module.exports = { openDatabase };