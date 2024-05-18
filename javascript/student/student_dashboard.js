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

function rateSolution(solutionName) {
  // marcarea unei solutii cu stele
  alert("Ai marcat cu stele solutia: " + solutionName);
}

function displayAttempts(attempts) {
  var attemptList = document.getElementById("attemptList");
  attemptList.innerHTML = "";

  attempts.forEach(function (attempt) {
    var attemptDiv = document.createElement("div");
    attemptDiv.classList.add("attempt");

    var attemptInfo = document.createElement("p");
    attemptInfo.classList.add("attemptText");
    attemptInfo.textContent = "ID Problema: " + attempt.id_problema;

    var attemptInfo2 = document.createElement("p");
    attemptInfo2.classList.add("attemptText2");
    attemptInfo2.textContent = " Timp: " + attempt.timp;

    var viewCodeBtn = document.createElement("button");
    viewCodeBtn.textContent = "View code";
    viewCodeBtn.classList.add("viewCodeBtn");

    var commentCodeBtn = document.createElement("button");
    commentCodeBtn.textContent = "Comment code";
    commentCodeBtn.classList.add("commentCodeBtn");

    attemptDiv.appendChild(attemptInfo);
    attemptDiv.appendChild(attemptInfo2);
    attemptDiv.appendChild(viewCodeBtn);
    attemptDiv.appendChild(commentCodeBtn);
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
