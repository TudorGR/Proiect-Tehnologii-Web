const { queryDb } = require("../utils/db");

function getHomeworkForClass(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const { class_id } = data;

      const query = "SELECT * FROM Homeworks where class_id=?;";
      queryDb(query, [class_id], (err) => {
        if (err) {
          console.error("Database error:", err);
          res.writeHead(500);
          res.end("Database error: " + err.message);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: `Merge.`,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400);
      res.end("Invalid JSON in request body");
    }
  });

  req.on("error", (error) => {
    console.error("Request error:", error);
    res.writeHead(400);
    res.end("Error receiving request: " + error.message);
  });
}

function getHomework(req, res) {
  queryDb("SELECT * FROM Homeworks;", [], (err, rows) => {
    if (err) {
      res.writeHead(500);
      res.end("Database error");
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    }
  });
}

function addHomework(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const { nume, problem_id, class_id } = data;

      const query =
        "INSERT INTO Homeworks (nume, problem_id,class_id) VALUES (?, ?,?)";
      queryDb(query, [nume, problem_id, class_id], (err) => {
        if (err) {
          console.error("Database error:", err);
          res.writeHead(500);
          res.end("Database error: " + err.message);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: `Homework added successfully for problem with ID ${data.problem_id}.`,
            })
          );
        }
      });
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400);
      res.end("Invalid JSON in request body");
    }
  });

  req.on("error", (error) => {
    console.error("Request error:", error);
    res.writeHead(400);
    res.end("Error receiving request: " + error.message);
  });
}

module.exports = { addHomework, getHomework, getHomeworkForClass };
