document.addEventListener("DOMContentLoaded", function () {
  // Grafic pentru probleme
  var problemCanvas = document.getElementById("problemChart");
  var problemCtx = problemCanvas.getContext("2d");

  var problemData = [20, 30, 15];
  var problemColors = ["lime", "orange", "red"];
  var problemLabels = ["Usoare", "Medii", "Grele"];

  drawChart(problemCtx, problemData, problemColors, problemLabels);

  // Grafic pentru clase si rapoarte
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

// Functie pentru desenarea unui grafic cu bare
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

  // Desenarea legendei
  var legendStartX = 10;
  var legendStartY = 10;
  for (var i = 0; i < labels.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(legendStartX, legendStartY + i * 20, 10, 10);
    ctx.fillStyle = "#000";
    ctx.fillText(labels[i], legendStartX + 20, legendStartY + 10 + i * 20);
  }
}

// Adaugarea utilizatorilor in tabel
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

// Butoanele de vizualizare si stergere
document
  .getElementById("userTable")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("viewBtn")) {
      // Butonul de vizualizare
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

// Butonul de adaugare utilizator
document.getElementById("addUserBtn").addEventListener("click", function () {
  var username = prompt("Introduceti numele utilizatorului:");
  if (username) {
    // Creare un obiect utilizator
    var user = { name: username };
    // Apelarea functiei pentru adaugarea utilizatorului in tabel
    addUserToTable(user);
  }
});
// Functionalitate pentru adaugarea unei probleme in tabel
function addProblemToTable(problem) {
  var table = document
    .getElementById("problemTable")
    .getElementsByTagName("tbody")[0];
  var row = table.insertRow();
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.textContent = problem.name;
  cell2.innerHTML =
    '<button class="viewBtn">Vizualizeaza</button>' +
    '<button class="deleteBtn">Sterge</button>';
}

// Functionalitate pentru adaugarea unei clase in tabel
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

// Butoanele de vizualizare si stergere
document
  .getElementById("problemTable")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("viewBtn")) {
      // Butonul de vizualizare
      var problemName =
        event.target.parentElement.parentElement.cells[0].textContent;
      alert("Vizualizeaza detalii pentru problema: " + problemName);
    } else if (event.target.classList.contains("deleteBtn")) {
      // Butonul de stergere
      var row = event.target.parentElement.parentElement;
      var problemName = row.cells[0].textContent;
      if (confirm("Sigur doriti sa stergeti problema: " + problemName + "?")) {
        row.remove();
      }
    }
  });

// Butonul de adaugare problema
document.getElementById("addProblemBtn").addEventListener("click", function () {
  var problemName = prompt("Introduceti numele problemei:");
  if (problemName) {
    // Creare un obiect problema
    var problem = { name: problemName };
    // Apelarea functiei pentru adaugarea problemei in tabel
    addProblemToTable(problem);
  }
});

// Adaugarea evenimentelor pentru butoanele de vizualizare si stergere pentru clase
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

// Adaugarea evenimentului pentru butonul de adaugare clasa
document.getElementById("addClassBtn").addEventListener("click", function () {
  var className = prompt("Introduceti numele clasei:");
  if (className) {
    // Creare un obiect clasa
    var classInfo = { name: className };
    // Apelarea functiei pentru adaugarea clasei in tabel
    addClassToTable(classInfo);
  }
});
