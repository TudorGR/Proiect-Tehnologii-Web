const { queryDb } = require("../utils/db");

function getRecentActivity(req, res) {
  queryDb(
    "SELECT * FROM RecentActivity ORDER BY description DESC LIMIT 3;",
    [],
    (err, rows) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows));
      }
    }
  );
}

module.exports = { getRecentActivity };
