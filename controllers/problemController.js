const { queryDb } = require("../utils/db");

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

module.exports = {
  getUnverifiedProblems,
  getVerifiedProblems,
  deleteProblem,
  getProblems,
  addProblem,
};
