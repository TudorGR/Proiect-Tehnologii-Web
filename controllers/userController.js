const { queryDb } = require("../utils/db");

function getUsers(req, res) {
  queryDb("SELECT * FROM Users;", [], (err, rows) => {
    if (err) {
      res.writeHead(500);
      res.end("Database error");
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    }
  });
}

function addUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    const { ID, name, email, password, role } = data;

    const query =
      "INSERT INTO Users (ID, name, email, password, role) VALUES (?, ?, ?, ?, ?)";
    queryDb(query, [ID, name, email, password, role], (err) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        res.writeHead(200);
        res.end(
          JSON.stringify({ message: `User with ID: ${ID} has been added.` })
        );
      }
    });
  });
}

function addStudentToClass(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    const { student_id, class_id } = data;

    const query =
      "INSERT INTO Students_Classes (student_id, class_id) VALUES (?, ?)";
    queryDb(query, [student_id, class_id], (err) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        res.writeHead(200);
        res.end(
          JSON.stringify({
            message: `User with ID: ${student_id} has been added to class with ID: ${class_id}.`,
          })
        );
      }
    });
  });
}

function checkUserClass(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    const { student_id, class_id } = data;

    const query =
      "SELECT 1 FROM Students_Classes WHERE student_id = ? AND class_id = ?";
    queryDb(query, [student_id, class_id], (err, rows) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        const exists = rows && rows.length > 0;
        res.end(JSON.stringify({ exists }));
      }
    });
  });
}

function deleteUser(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const data = JSON.parse(body);
    const ID = data.ID;

    const query = "DELETE FROM Users WHERE ID = ?";
    queryDb(query, ID, (err) => {
      if (err) {
        res.writeHead(500);
        res.end("Database error");
      } else {
        res.writeHead(200);
        res.end(
          JSON.stringify({ message: `User with ID: ${ID} has been deleted.` })
        );
      }
    });
  });
}

module.exports = {
  getUsers,
  addUser,
  deleteUser,
  addStudentToClass,
  checkUserClass,
};
