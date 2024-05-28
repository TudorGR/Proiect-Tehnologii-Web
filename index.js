const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const {
  getClasses,
  addClass,
  deleteClass,
  getClassStudentCounts,
  getStudentsClass,
} = require("./controllers/classController");
const {
  getUsers,
  addUser,
  deleteUser,
  addStudentToClass,
  checkUserClass,
  changeUserRole,
} = require("./controllers/userController");
const {
  getUnverifiedProblems,
  getVerifiedProblems,
  deleteProblem,
  getProblems,
  addProblem,
  exportProblemsCsv,
  importProblemsCsv,
  getAttempts,
  evaluateAttempt,
  getDescription,
  setVerified,
  sendAttempt,
} = require("./controllers/problemController");
const { getRecentActivity } = require("./controllers/utilityController");
const { addComment, getComments } = require("./controllers/commentController");
const {
  addHomework,
  getHomework,
  getHomeworkForClass,
  deleteHomework,
  getHomeworksForStudent,
} = require("./controllers/homeworkController");

// Helper function to serve static files
function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

// HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Serve static files
  if (pathname.startsWith("/pages/")) {
    const filePath = path.join(__dirname, pathname);
    serveStaticFile(res, filePath, "text/html");
  } else if (pathname.startsWith("/css/")) {
    const filePath = path.join(__dirname, pathname);
    serveStaticFile(res, filePath, "text/css");
  } else if (pathname.startsWith("/javascript/")) {
    const filePath = path.join(__dirname, pathname);
    serveStaticFile(res, filePath, "application/javascript");
  } else if (pathname === "/") {
    serveStaticFile(
      res,
      path.join(__dirname, "pages", "index.html"),
      "text/html"
    );
  } else if (pathname === "/api/addComment") {
    addComment(req, res);
  } else if (pathname === "/api/getComments") {
    getComments(req, res);
  } else if (pathname === "/api/getHomeworksForStudent") {
    getHomeworksForStudent(req, res);
  } else if (pathname === "/api/getHomeworkForClass") {
    getHomeworkForClass(req, res);
  } else if (pathname === "/api/getHomework") {
    getHomework(req, res);
  } else if (pathname === "/api/addHomework") {
    addHomework(req, res);
  } else if (pathname === "/api/deleteHomework") {
    deleteHomework(req, res);
  } else if (pathname === "/api/getStudentsClass") {
    getStudentsClass(req, res);
  } else if (pathname === "/api/deleteClass") {
    deleteClass(req, res);
  } else if (pathname === "/api/classes") {
    getClasses(req, res);
  } else if (pathname === "/api/getClassStudentCounts") {
    getClassStudentCounts(req, res);
  } else if (pathname === "/api/importProblems/csv") {
    importProblemsCsv(req, res);
  } else if (pathname === "/api/exportProblems/csv") {
    exportProblemsCsv(req, res);
  } else if (pathname === "/api/getDescription") {
    getDescription(req, res);
  } else if (pathname === "/api/unverifiedProblems") {
    getUnverifiedProblems(req, res);
  } else if (pathname === "/api/setVerified") {
    setVerified(req, res);
  } else if (pathname === "/api/verifiedProblems") {
    getVerifiedProblems(req, res);
  } else if (pathname === "/api/addProblem") {
    addProblem(req, res);
  } else if (pathname === "/api/sendAttempt") {
    sendAttempt(req, res);
  } else if (pathname === "/api/evaluateAttempt") {
    evaluateAttempt(req, res);
  } else if (pathname === "/api/getAttempts") {
    getAttempts(req, res);
  } else if (pathname === "/api/problems") {
    getProblems(req, res);
  } else if (pathname === "/api/deleteProblem") {
    deleteProblem(req, res);
  } else if (pathname === "/api/changeUserRole") {
    changeUserRole(req, res);
  } else if (pathname === "/api/users") {
    getUsers(req, res);
  } else if (pathname === "/api/checkUserClass") {
    checkUserClass(req, res);
  } else if (pathname === "/api/deleteUser") {
    deleteUser(req, res);
  } else if (pathname === "/api/addStudentToClass") {
    addStudentToClass(req, res);
  } else if (pathname === "/api/recentActivity") {
    getRecentActivity(req, res);
  } else if (pathname === "/api/studentAttempts" && req.method === "POST") {
  } else if (pathname === "/addClass" && req.method === "POST") {
    addClass(req, res);
  } else if (pathname === "/api/addUser") {
    addUser(req, res);
  }
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(
    `Server running at http://127.0.0.1:${PORT}/ (Press CTRL+C to quit)`
  );
});
