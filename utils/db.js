const sqlite3 = require("sqlite3").verbose();

function queryDb(query, params, callback) {
  const db = new sqlite3.Database("./server.db", (err) => {
    if (err) {
      console.error("Could not connect to database", err);
      callback(err);
    }
  });

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error running query", err);
      callback(err);
    } else {
      callback(null, rows);
    }
  });

  db.close((err) => {
    if (err) {
      console.error("Could not close database connection", err);
    }
  });
}

module.exports = { queryDb };
