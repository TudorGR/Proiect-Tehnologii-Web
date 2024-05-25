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

function getHomeworksForStudent(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const { student_id } = data;

      const query = `
        SELECT h.name, h.problem_id, h.class_id
        FROM Students_Classes sc
        JOIN Homeworks h ON sc.class_id = h.class_id
        WHERE sc.student_id = ?;
      `;

      queryDb(query, [student_id], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          res.writeHead(500);
          res.end("Database error: " + err.message);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(results));
        }
      });
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400);
      res.end("Invalid JSON in request body");
    }
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
      const { name, problem_id, class_id } = data;

      if (!name || !problem_id || !class_id) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing required fields" }));
        return;
      }

      // Verificam daca problema exista deja pentru acel name
      const checkQuery =
        "SELECT * FROM Homeworks WHERE name = ? AND problem_id = ?";
      queryDb(checkQuery, [name, problem_id], (checkErr, results) => {
        if (checkErr) {
          console.error("Database error:", checkErr);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Database error" }));
        } else if (results.length > 0) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error:
                "Duplicate entry: This problem already exists for the specified name",
            })
          );
        } else {
          // Daca nu exista, introducem noua tema
          const insertQuery =
            "INSERT INTO Homeworks (name, problem_id, class_id) VALUES (?, ?, ?)";
          queryDb(insertQuery, [name, problem_id, class_id], (insertErr) => {
            if (insertErr) {
              console.error("Database error:", insertErr);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Database error" }));
            } else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: `Homework added successfully for problem with ID ${data.problem_id}.`,
                })
              );
            }
          });
        }
      });
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "Invalid JSON in request body or missing fields",
        })
      );
    }
  });

  req.on("error", (error) => {
    console.error("Request error:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "Error receiving request: " + error.message })
    );
  });
}

function deleteHomework(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const { class_id, name } = data;

      const query = "DELETE FROM Homeworks where class_id=? and name=?";
      queryDb(query, [class_id, name], (err) => {
        if (err) {
          console.error("Database error:", err);
          res.writeHead(500);
          res.end("Database error: " + err.message);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: `Homework deleted successfully.`,
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

module.exports = {
  addHomework,
  getHomework,
  getHomeworkForClass,
  deleteHomework,
  getHomeworksForStudent,
};
