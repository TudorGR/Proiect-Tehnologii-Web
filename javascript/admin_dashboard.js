document.addEventListener("DOMContentLoaded", function () {
  // Grafic pentru probleme
  var problemCanvas = document.getElementById("problemChart");
  var problemCtx = problemCanvas.getContext("2d");

  var problemData = [20, 30, 15];
  var problemColors = ["lime", "orange", "red"];
  var problemLabels = ["Usoare", "Medii", "Grele"];

  drawChart(problemCtx, problemData, problemColors, problemLabels);

  var classReportCanvas = document.getElementById("classReportChart");
  var classReportCtx = classReportCanvas.getContext("2d");

  var classReportData = [25, 40];
  var classReportColors = ["#4bc0c0", "#9966ff"];
  var classReportLabels = ["Clase", "Rapoarte"];

  drawChart(
    classReportCtx,
    classReportData,
    classReportColors,
    classReportLabels
  );
});

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
    if (event.target.classList.contains("viewBtn")) {
      var username =
        event.target.parentElement.parentElement.cells[0].textContent;
      alert("Vizualizeaza detalii pentru utilizatorul: " + username);
    } else if (event.target.classList.contains("deleteBtn")) {
      // Butonul de stergere
      var row = event.target.parentElement.parentElement;
      var username = row.cells[0].textContent;
      if (confirm("Sigur doriti sa stergeti utilizatorul: " + username + "?")) {
        row.remove();
      }
    }
  });

document.getElementById("addUserBtn").addEventListener("click", function () {
  var username = prompt("Introduceti numele utilizatorului:");
  if (username) {
    // Creare un obiect utilizator
    var user = { name: username };
    addUserToTable(user);
  }
});

function addClassToTable(classInfo) {
  var table = document
    .getElementById("classTable")
    .getElementsByTagName("tbody")[0];
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.textContent = classInfo.name;
  cell2.innerHTML =
    '<button class="viewBtn">Vizualizeaza</button>' +
    '<button class="deleteBtn">Sterge</button>';
}

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
    if (event.target.classList.contains("viewBtn")) {
      // Butonul de vizualizare
      var className =
        event.target.parentElement.parentElement.cells[0].textContent;
      alert("Vizualizeaza detalii pentru clasa: " + className);
    } else if (event.target.classList.contains("deleteBtn")) {
      // Butonul de stergere
      var row = event.target.parentElement.parentElement;
      var className = row.cells[0].textContent;
      if (confirm("Sigur doriti sa stergeti clasa: " + className + "?")) {
        row.remove();
      }
    }
  });

document.getElementById("addClassBtn").addEventListener("click", function () {
  var className = prompt("Introduceti numele clasei:");
  if (className) {
    // Creare un obiect clasa
    var classInfo = { name: className };
    addClassToTable(classInfo);
  }
});

function handleViewProblem(problemNumber) {
  console.log(problemNumber);
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
function handleDeleteProblem(problemNumber) {
  console.log(problemNumber);

  const data = {
    problemNumber: problemNumber,
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
