const { queryDb } = require("../utils/db");

function getClasses(req, res) {
  queryDb("SELECT * FROM Classes;", [], (err, rows) => {
    if (err) {
      res.writeHead(500);
      res.end("Database error");
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    }
  });
}

function addClass(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    const { id, nume, prof_id } = data;

    const query = "INSERT INTO Classes (id, nume, prof_id) VALUES (?, ?, ?)";
    queryDb(query, [id, nume, prof_id], (err) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        res.writeHead(200);
        res.end(
          JSON.stringify({ message: `Class with ID: ${id} has been added.` })
        );
      }
    });
  });
}

function deleteClass(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    const { ID } = data;

    const deleteClassQuery = "DELETE FROM Classes WHERE ID=?";
    const deleteStudentsClassesQuery =
      "DELETE FROM Students_Classes WHERE class_id=?";

    queryDb("BEGIN TRANSACTION", [], (err) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error: Unable to start transaction");
        return;
      }

      queryDb(deleteStudentsClassesQuery, [ID], (err) => {
        if (err) {
          queryDb("ROLLBACK", [], () => {
            res.writeHead(500);
            res.end("Database error: Unable to delete students from class");
          });
          return;
        }

        queryDb(deleteClassQuery, [ID], (err) => {
          if (err) {
            queryDb("ROLLBACK", [], () => {
              res.writeHead(500);
              res.end("Database error: Unable to delete class");
            });
            return;
          }
        });

        if (err) {
          res.writeHead(500);
          res.end("Database error: Unable to commit transaction");
        } else {
          res.writeHead(200);
          res.end(
            JSON.stringify({
              message: `Class with ID: ${ID} has been deleted along with its students.`,
            })
          );
        }
      });
    });
  });
}

function getClassStudentCounts(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const { prof_id } = data;

    queryDb(
      "SELECT Classes.id, Classes.nume, COUNT(Students_Classes.student_id) as student_count FROM Classes LEFT JOIN Students_Classes ON Classes.id = Students_Classes.class_id WHERE Classes.prof_id = ? GROUP BY Classes.id;",
      [prof_id],
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
  });
}

function getStudentsClass(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const { class_id } = data;

    queryDb(
      "SELECT * FROM Users JOIN Students_Classes ON users.id = Students_Classes.student_id WHERE Students_Classes.class_id = ?;",
      [class_id],
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
  });
}

module.exports = {
  getClasses,
  addClass,
  deleteClass,
  getClassStudentCounts,
  getStudentsClass,
};
