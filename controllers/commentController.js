const { queryDb } = require("../utils/db");

function getComments(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const id_problem = data.id_problem;
    let sqlQuery;

    sqlQuery = "select * from Comments where problem_id=?;";

    queryDb(sqlQuery, [id_problem], (err, rows) => {
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

function addComment(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const data = JSON.parse(body);
    const content = data.content;
    const id_user = data.id_user;
    const id_problem = data.id_problem;
    let sqlQuery;

    sqlQuery =
      "insert into Comments (content,student_id,problem_id) values (?,?,?);";

    queryDb(sqlQuery, [content, id_user, id_problem], (err, rows) => {
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

module.exports = { addComment, getComments };
