document.addEventListener("DOMContentLoaded", function () {
  loadAttempts();
});

function solveProblem(problemId) {
  window.location.href = `/pages/student/problem_solve.html?problem=${problemId}`;
}

function commentSolution(solutionName) {
  // adaugarea unui comentariu la solutie
  alert("Ai comentat la solutia: " + solutionName);
}

function displayAttempts(attempts) {
  var attemptList = document.getElementById("attemptList");
  attemptList.innerHTML = "";

  attempts.forEach(function (attempt) {
    var attemptDiv = document.createElement("div");
    attemptDiv.classList.add("attempt");

    var attemptInfo = document.createElement("p");
    attemptInfo.classList.add("attemptText");
    attemptInfo.textContent = "ID: " + attempt.id_problema;

    var attemptInfo2 = document.createElement("p");
    attemptInfo2.classList.add("attemptText2");
    attemptInfo2.textContent = " Timp: " + attempt.timp;

    var viewCodeBtn = document.createElement("button");
    viewCodeBtn.textContent = "View code";
    viewCodeBtn.classList.add("viewCodeBtn");
    viewCodeBtn.onclick = () => {
      viewCode(attempt.id_problema);
    };

    attemptDiv.appendChild(attemptInfo);
    attemptDiv.appendChild(attemptInfo2);
    attemptDiv.appendChild(viewCodeBtn);
    attemptList.appendChild(attemptDiv);
  });
}

function loadAttempts() {
  fetch("/api/studentAttempts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: localStorage.getItem("ID_user"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Eroare:", data.error);
        return;
      }
      displayAttempts(data);
    })
    .catch((error) => {
      console.error("Eroare de rețea:", error);
    });
}

function viewCode(problemId) {
  fetch("/api/getProblemCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_user: localStorage.getItem("ID_user"),
      id_problema: problemId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Eroare:", data.error);
        return;
      }
      showCodePopup(data.code);
    })
    .catch((error) => {
      console.error("Eroare de rețea:", error);
    });
}

function showCodePopup(code) {
  // Create the popup elements
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  const closeButton = document.createElement("span");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "&times;";
  closeButton.onclick = function () {
    document.body.removeChild(popup);
  };

  const codeBlock = document.createElement("pre");
  codeBlock.textContent = code;

  // Append elements to the popup
  popupContent.appendChild(closeButton);
  popupContent.appendChild(codeBlock);
  popup.appendChild(popupContent);

  // Append popup to the body
  document.body.appendChild(popup);
}
