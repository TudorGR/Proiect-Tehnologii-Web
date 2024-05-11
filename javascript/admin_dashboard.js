document.addEventListener("DOMContentLoaded", async function () {
  const recentActivityList = document.getElementById("recentActivity");

  fetch("/api/recentActivity")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((activity) => {
        const listItem = document.createElement("li");
        listItem.textContent = activity;
        recentActivityList.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching recent activity:", error);
    });

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

function getNumarProbleme() {
  return fetch("/api/problems")
    .then((response) => response.json())
    .then((data) => {
      const numarProbleme = {
        usoare: data.filter((problem) => problem[3] === "usor").length,
        medii: data.filter((problem) => problem[3] === "mediu").length,
        grele: data.filter((problem) => problem[3] === "greu").length,
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

function handleViewProblem(problemNumber) {
  fetch("/api/problems")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((problem) => {
        if (problem[0] == problemNumber) {
          alert(
            "descriere: " +
              problem[2] +
              "\ndificultate: " +
              problem[3] +
              "\ncategorie: " +
              problem[4]
          );
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}
function handleViewUser(ID) {
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((user) => {
        if (user[0] == ID) {
          alert(
            "Email: " +
              user[2] +
              "\npassword: " +
              user[3] +
              "\nrole: " +
              user[4]
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

  fetch("/deleteProblem", {
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
function handleDeleteUser(ID) {
  const data = {
    ID: ID,
  };

  fetch("/deleteUser", {
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
function handleDeleteClass(ID) {
  const data = {
    ID: ID,
  };

  fetch("/deleteClass", {
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

        fetch("/addProblem", {
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
            getProblems();
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
          .then((data) => {
            getClasses();
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

function handleAddUser() {
  var ID = prompt("Introduceti id-ul userului:");
  var email = prompt("Introduce email-ul userului:");

  checkUserExists(ID, email)
    .then((exists) => {
      if (
        !isNaN(ID) &&
        ID !== "" &&
        ID !== undefined &&
        !exists &&
        email !== "" &&
        email !== undefined
      ) {
        var name = prompt("Introduceti numele userului:");
        var password = prompt("Introduce parola userului:");
        var role = prompt("Introduce rolul userului:");

        const data = {
          ID: ID,
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
          .then((data) => {
            getUsers();
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

function getClasses() {
  fetch("/api/classes")
    .then((response) => response.json())
    .then((data) => {
      displayClasses(data);
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}
function getProblems() {
  fetch("/api/problems")
    .then((response) => response.json())
    .then((data) => {
      displayProblems(data);
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });
}
function getUsers() {
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      displayUsers(data);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
}
function displayClasses(clas) {
  const container = document.getElementById("listaClase");

  container.textContent = "";

  clas.forEach((clas) => {
    const classRow = document.createElement("tr");

    const titleCell1 = document.createElement("td");
    titleCell1.textContent = clas[0];

    const titleCell2 = document.createElement("td");
    titleCell2.textContent = clas[1];

    classRow.appendChild(titleCell1);
    classRow.appendChild(titleCell2);

    const actionCell = document.createElement("td");

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteBtn");
    deleteButton.textContent = "Sterge";
    deleteButton.onclick = function () {
      handleDeleteClass(clas[0]);
    };

    actionCell.appendChild(deleteButton);

    classRow.appendChild(actionCell);

    container.appendChild(classRow);
  });
}
function displayProblems(problems) {
  const container = document.getElementById("listaProbleme");

  container.textContent = "";

  problems.forEach((problem) => {
    const problemRow = document.createElement("tr");

    const titleCell1 = document.createElement("td");
    titleCell1.textContent = problem[0];

    const titleCell2 = document.createElement("td");
    titleCell2.textContent = problem[1];

    problemRow.appendChild(titleCell1);
    problemRow.appendChild(titleCell2);

    const actionCell = document.createElement("td");
    const viewButton = document.createElement("button");
    viewButton.classList.add("viewBtn");
    viewButton.textContent = "Vizualizeaza";
    viewButton.onclick = function () {
      handleViewProblem(problem[0]);
    };
    actionCell.appendChild(viewButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteBtn");
    deleteButton.textContent = "Sterge";
    deleteButton.onclick = function () {
      handleDeleteProblem(problem[0]);
    };

    actionCell.appendChild(deleteButton);

    problemRow.appendChild(actionCell);

    container.appendChild(problemRow);
  });
}
function displayUsers(users) {
  const container = document.getElementById("listaUseri");

  container.textContent = "";

  users.forEach((user) => {
    const userRow = document.createElement("tr");

    const titleCell1 = document.createElement("td");
    titleCell1.textContent = user[0];

    const titleCell2 = document.createElement("td");
    titleCell2.textContent = user[2];

    userRow.appendChild(titleCell1);
    userRow.appendChild(titleCell2);

    const actionCell = document.createElement("td");
    const viewButton = document.createElement("button");
    viewButton.classList.add("viewBtn");
    viewButton.textContent = "Vizualizeaza";
    viewButton.onclick = function () {
      handleViewUser(user[0]);
    };
    actionCell.appendChild(viewButton);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteBtn");
    deleteButton.textContent = "Sterge";
    deleteButton.onclick = function () {
      handleDeleteUser(user[0]);
    };

    actionCell.appendChild(deleteButton);

    userRow.appendChild(actionCell);

    container.appendChild(userRow);
  });
}
function checkProblemExists(problemNumber) {
  return new Promise((resolve, reject) => {
    fetch("/api/problems")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((problem) => problem[0] == problemNumber);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking problem:", error);
        reject(error);
      });
  });
}
function checkClassExists(ID) {
  return new Promise((resolve, reject) => {
    fetch("/api/classes")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((clas) => clas[0] == ID);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking problem:", error);
        reject(error);
      });
  });
}
function checkUserExists(ID, email) {
  return new Promise((resolve, reject) => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((user) => user[0] == ID || user[2] == email);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking user:", error);
        reject(error);
      });
  });
}
