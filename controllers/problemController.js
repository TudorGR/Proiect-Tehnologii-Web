const { queryDb } = require("../utils/db");

function exportProblemsCsv(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const problem_id = data.problem_id;

    queryDb(
      "SELECT * FROM Problems WHERE verified=1 and id=?",
      [problem_id],
      (err, rows) => {
        if (err) {
          res.writeHead(500);
          res.end("Database error");
          return;
        }

        if (rows.length === 0) {
          res.writeHead(200, { "Content-Type": "text/csv" });
          res.end("No verified problems found");
          return;
        }

        const headers = Object.keys(rows[0]).join(",");
        const csvData = rows
          .map((row) => Object.values(row).join(","))
          .join("\n");
        const csv = `${headers}\n${csvData}`;

        res.writeHead(200, {
          "Content-Disposition": 'attachment; filename="problems.csv"',
          "Content-Type": "text/csv",
        });
        res.end(csv);
      }
    );
  });
}

function getUnverifiedProblems(req, res) {
  queryDb("SELECT * FROM Problems where verified=0;", [], (err, rows) => {
    if (err) {
      res.writeHead(500);
      res.end("Database error");
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    }
  });
}

function getVerifiedProblems(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const categorie = data.categorie;
    let sqlQuery;
    let params = [];

    if (categorie === "All") {
      sqlQuery = "SELECT * FROM Problems WHERE verified=1;";
    } else {
      sqlQuery = "SELECT * FROM Problems WHERE verified=1 AND categorie=?;";
      params.push(categorie);
    }

    queryDb(sqlQuery, params, (err, rows) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows));
      }
    });
  });
}

function getProblems(req, res) {
  queryDb("SELECT * FROM Problems", [], (err, rows) => {
    if (err) {
      res.writeHead(500);
      res.end("Database error");
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    }
  });
}

function deleteProblem(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const ID = data.ID;

      if (!ID) {
        res.writeHead(400);
        res.end("ID is required in the request body");
        return;
      }

      const query = "DELETE FROM Problems WHERE ID = ?";
      queryDb(query, ID, (err) => {
        if (err) {
          console.error("Database error:", err);
          res.writeHead(500);
          res.end("Database error");
        } else {
          res.writeHead(200);
          res.end(
            JSON.stringify({
              message: `Problem with ID: ${ID} has been deleted.`,
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
    res.end("Error receiving request");
  });
}

function addProblem(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const { id, numeProblema, descriere, dificultate, categorie } = data;

      if (!numeProblema || !descriere || !dificultate || !categorie) {
        res.writeHead(400);
        res.end("All fields are required in the request body");
        return;
      }

      const query =
        "INSERT INTO Problems (id, titlu, descriere, dificultate, categorie, verified) VALUES (?, ?, ?, ?, ?, 0)";
      queryDb(
        query,
        [id, numeProblema, descriere, dificultate, categorie],
        (err) => {
          if (err) {
            console.error("Database error:", err);
            res.writeHead(500);
            res.end("Database error");
          } else {
            res.writeHead(200);
            res.end(
              JSON.stringify({
                message: `Problem with ID: has been added.`,
              })
            );
          }
        }
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400);
      res.end("Invalid JSON in request body");
    }
  });

  req.on("error", (error) => {
    console.error("Request error:", error);
    res.writeHead(400);
    res.end("Error receiving request");
  });
}

function getAttempts(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const problem_id = data.problem_id;
    const student_id = data.student_id;
    let sqlQuery;

    sqlQuery = "Select * from attempts where id_problema=? and id_user=?";

    queryDb(sqlQuery, [problem_id, student_id], (err, rows) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows));
      }
    });
  });
}

function evaluateAttempt(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const { student_id, problem_id, evaluare } = data;

      if (!student_id || !problem_id || !evaluare) {
        res.writeHead(400);
        res.end("All fields are required in the request body");
        return;
      }

      const query =
        "update Attempts set evaluare=? where id_user=? and id_problema=?;";
      queryDb(query, [evaluare, student_id, problem_id], (err) => {
        if (err) {
          console.error("Database error:", err);
          res.writeHead(500);
          res.end("Database error");
        } else {
          res.writeHead(200);
          res.end(
            JSON.stringify({
              message: `Evaluation added.`,
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
    res.end("Error receiving request");
  });
}

module.exports = {
  getUnverifiedProblems,
  getVerifiedProblems,
  deleteProblem,
  getProblems,
  addProblem,
  exportProblemsCsv,
  getAttempts,
  evaluateAttempt,
};
