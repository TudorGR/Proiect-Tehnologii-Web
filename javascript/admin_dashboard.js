document.addEventListener("DOMContentLoaded", async function () {
  getUsers();
  getVerifiedProblems();
  getUnverifiedProblems();
  getClasses();

  // Grafic pentru probleme
  var problemCanvas = document.getElementById("problemChart");
  var problemCtx = problemCanvas.getContext("2d");

  var numarProbleme = await getNumarProbleme();

  var problemData = [
    numarProbleme.usoare * 10,
    numarProbleme.medii * 10,
    numarProbleme.grele * 10,
  ];
  var problemColors = ["lime", "orange", "red"];
  var problemLabels = ["Usoare", "Medii", "Grele"];

  drawChart(problemCtx, problemData, problemColors, problemLabels);

  var classReportCanvas = document.getElementById("classReportChart");
  var classReportCtx = classReportCanvas.getContext("2d");

  var nrUtilizatori = await getNumarUtilizatori();
  var nrClase = await getNumarClase();

  var classReportData = [nrUtilizatori * 10, nrClase * 10];
  var classReportColors = ["#4bc0c0", "#9966ff"];
  var classReportLabels = ["Useri", "Clase"];

  drawChart(
    classReportCtx,
    classReportData,
    classReportColors,
    classReportLabels
  );
});

function getUsers() {
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      injectUsersIntoTable(data);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}

function getVerifiedProblems() {
  fetch("/api/verifiedProblems")
    .then((response) => response.json())
    .then((data) => {
      injectVerifiedProblemsIntoTable(data);
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}

function getUnverifiedProblems() {
  fetch("/api/unverifiedProblems")
    .then((response) => response.json())
    .then((data) => {
      injectUnverifiedProblemsIntoTable(data);
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}

function getClasses() {
  fetch("/api/classes")
    .then((response) => response.json())
    .then((data) => {
      injectClassesIntoTable(data);
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}

function injectUsersIntoTable(users) {
  const tableBody = document.getElementById("listaUseri");

  users.forEach((user) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = user.id;

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;

    const actionCell = document.createElement("td");

    const viewButton = document.createElement("button");
    viewButton.textContent = "Vizualizeaza";
    viewButton.classList.add("viewBtn");
    viewButton.addEventListener("click", function () {
      handleViewUser(user.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Sterge";
    deleteButton.classList.add("deleteBtn");
    deleteButton.addEventListener("click", function () {
      handleDeleteUser(user.id);
    });

    actionCell.appendChild(viewButton);
    actionCell.appendChild(deleteButton);

    row.appendChild(idCell);
    row.appendChild(emailCell);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

function injectVerifiedProblemsIntoTable(problems) {
  const tableBody = document.getElementById("listaProbleme");

  problems.forEach((problem) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = problem.id;

    const nameCell = document.createElement("td");
    nameCell.textContent = problem.titlu;

    const actionCell = document.createElement("td");

    const viewButton = document.createElement("button");
    viewButton.textContent = "Vizualizeaza";
    viewButton.classList.add("viewBtn");
    viewButton.addEventListener("click", function () {
      handleViewProblem(problem.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Sterge";
    deleteButton.classList.add("deleteBtn");
    deleteButton.addEventListener("click", function () {
      handleDeleteProblem(problem.id);
    });

    actionCell.appendChild(viewButton);
    actionCell.appendChild(deleteButton);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

function injectUnverifiedProblemsIntoTable(problems) {
  const container = document.getElementById("problems");

  problems.forEach((problem) => {
    const problemDiv = document.createElement("div");
    problemDiv.classList.add("problem");

    const labelProblemDiv = document.createElement("div");
    labelProblemDiv.classList.add("labelProblem");

    const titleHeader = document.createElement("h3");
    titleHeader.textContent = `${problem.titlu} [${problem.id}]`;

    const difficultyParagraph = document.createElement("p");
    difficultyParagraph.textContent = `Dificultate: ${problem.dificultate}`;

    const categoryParagraph = document.createElement("p");
    categoryParagraph.textContent = `Categorie: ${problem.categorie}`;

    labelProblemDiv.appendChild(titleHeader);
    labelProblemDiv.appendChild(difficultyParagraph);
    labelProblemDiv.appendChild(categoryParagraph);

    const viewButton = document.createElement("button");
    viewButton.textContent = "Vezi";
    viewButton.classList.add("solve-btn");
    viewButton.addEventListener("click", function () {
      handleViewProblem(problem.id);
    });

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirma";
    confirmButton.classList.add("viewBtn");
    confirmButton.addEventListener("click", function () {
      confirmProblem(problem[0]);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Sterge";
    deleteButton.classList.add("deleteBtn");
    deleteButton.addEventListener("click", function () {
      handleDeleteProblem(problem.id);
    });

    problemDiv.appendChild(labelProblemDiv);
    problemDiv.appendChild(viewButton);
    problemDiv.appendChild(confirmButton);
    problemDiv.appendChild(deleteButton);

    container.appendChild(problemDiv);
  });
}

function injectClassesIntoTable(classes) {
  const tableBody = document.getElementById("listaClase");

  classes.forEach((clas) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = clas.id;

    const nameCell = document.createElement("td");
    nameCell.textContent = clas.nume;

    const actionCell = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Sterge";
    deleteButton.classList.add("deleteBtn");
    deleteButton.addEventListener("click", function () {
      handleDeleteClass(clas.id);
    });

    actionCell.appendChild(deleteButton);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

function getNumarProbleme() {
  return fetch("/api/verifiedProblems")
    .then((response) => response.json())
    .then((data) => {
      const numarProbleme = {
        usoare: data.filter((problem) => problem.dificultate === "usor").length,
        medii: data.filter((problem) => problem.dificultate === "mediu").length,
        grele: data.filter((problem) => problem.dificultate === "greu").length,
      };
      return numarProbleme;
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
      return { usoare: 0, medii: 0, grele: 0 };
    });
}
function getNumarUtilizatori() {
  return fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      return data.length;
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      return 0;
    });
}
function getNumarClase() {
  return fetch("/api/classes")
    .then((response) => response.json())
    .then((data) => {
      return data.length;
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      return 0;
    });
}
function drawChart(ctx, data, colors, labels) {
  var barWidth = 70;
  var startX = 20;
  var startY = 140;
  var spacing = 100;

  for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(startX + i * spacing, startY - data[i], barWidth, data[i] * 5);
    ctx.fillStyle = "#000";
    ctx.fillText(labels[i], startX + i * spacing, startY + 20);
  }

  var legendStartX = 10;
  var legendStartY = 10;
  for (var i = 0; i < labels.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(legendStartX, legendStartY + i * 20, 10, 10);
    ctx.fillStyle = "#000";
    ctx.fillText(labels[i], legendStartX + 20, legendStartY + 10 + i * 20);
  }
}
function addUserToTable(user) {
  var table = document
    .getElementById("userTable")
    .getElementsByTagName("tbody")[0];
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.textContent = user.name;
  cell2.innerHTML =
    '<button class="viewBtn">Vizualizeaza</button>' +
    '<button class="deleteBtn">Sterge</button>';
}

function handleAddUser() {
  var email = prompt("Introduce email-ul userului:");

  checkUserExists(email)
    .then((exists) => {
      if (!exists && email !== "" && email !== undefined) {
        var name = prompt("Introduceti numele userului:");
        var password = prompt("Introduce parola userului:");
        var role = prompt("Introduce rolul userului:");

        const data = {
          name: name,
          email: email,
          password: password,
          role: role,
        };

        fetch("/addUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .catch((error) => {
            console.error("Eroare la actualizare:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function handleViewUser(ID) {
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((user) => {
        if (user.id == ID) {
          alert(
            "Email: " +
              user.email +
              "\npassword: " +
              user.password +
              "\nrole: " +
              user.role
          );
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}

function handleDeleteUser(ID) {
  const data = {
    ID: ID,
  };

  fetch("/api/deleteUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Stergere reușită:", data);
    })
    .catch((error) => {
      console.error("Eroare la actualizare:", error);
    });
}

function checkUserExists(email) {
  return new Promise((resolve, reject) => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((user) => user.email == email);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking user:", error);
        reject(error);
      });
  });
}

function handleViewProblem(problemNumber) {
  fetch("/api/problems")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((problem) => {
        if (problem.id == problemNumber) {
          alert(
            "descriere: " +
              problem.descriere +
              "\ndificultate: " +
              problem.dificultate +
              "\ncategorie: " +
              problem.categorie
          );
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}

function handleDeleteProblem(ID) {
  const data = {
    ID: ID,
  };

  fetch("/api/deleteProblem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Stergere reușită:", data);
    })
    .catch((error) => {
      console.error("Eroare la actualizare:", error);
    });
}

function handleAddProblem() {
  var ID = prompt("Introduceti id-ul problemei:");

  checkProblemExists(ID)
    .then((exists) => {
      if (!isNaN(ID) && ID !== "" && ID !== undefined && !exists) {
        var numeProblema = prompt("Introduceti numele problemei:");
        var descriere = prompt("Introduce descrierea problemei:");
        var dificultate = prompt(
          "Introduce dificultatea problemei(usor/mediu/greu):"
        );
        var categorie = prompt("Introduce categoria problemei:");

        const data = {
          ID: ID,
          numeProblema: numeProblema,
          descriere: descriere,
          dificultate: dificultate,
          categorie: categorie,
        };
        console.log(data);

        fetch("/api/addProblem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .catch((error) => {
            console.error("Eroare la actualizare:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function checkProblemExists(problemNumber) {
  return new Promise((resolve, reject) => {
    fetch("/api/problems")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((problem) => problem.id == problemNumber);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking problem:", error);
        reject(error);
      });
  });
}

document
  .getElementById("userTable")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteBtn")) {
      // Butonul de stergere
      var row = event.target.parentElement.parentElement;
      var username = row.cells[0].textContent;
      row.remove();
    }
  });

document
  .getElementById("problemTable")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteBtn")) {
      // Butonul de stergere
      var row = event.target.parentElement.parentElement;
      var problemName = row.cells[0].textContent;
      row.remove();
    }
  });

document
  .getElementById("classTable")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteBtn")) {
      // Butonul de stergere
      var row = event.target.parentElement.parentElement;
      var className = row.cells[0].textContent;
      row.remove();
    }
  });

function checkClassExists(ID) {
  return new Promise((resolve, reject) => {
    fetch("/api/classes")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((clas) => clas.id == ID);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking problem:", error);
        reject(error);
      });
  });
}

function handleAddClass() {
  var ID = prompt("Introduceti id-ul clasei:");

  checkClassExists(ID)
    .then((exists) => {
      if (!isNaN(ID) && ID !== "" && ID !== undefined && !exists) {
        var nume = prompt("Introduceti numele clasei:");

        const data = {
          ID: ID,
          nume: nume,
        };

        fetch("/addClass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .catch((error) => {
            console.error("Eroare la actualizare:", error);
          });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function handleDeleteClass(ID) {
  const data = {
    ID: ID,
  };

  fetch("/api/deleteClass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Stergere reușită:", data);
    })
    .catch((error) => {
      console.error("Eroare la actualizare:", error);
    });
}
