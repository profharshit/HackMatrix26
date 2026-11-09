const { openDatabase } = require("./db");

// Lets you create the database by hand to check that the schema works.
function createDatabase() {
  const database = openDatabase();
  const tableNames = database
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
    .all();
  console.log("Tables ready:", tableNames.map((table) => table.name).join(", "));
  database.close();
}

createDatabase();