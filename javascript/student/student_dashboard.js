var student_id = localStorage.getItem("ID_user");

document.addEventListener("DOMContentLoaded", function () {
  fetchProblems("All");
  injectHomeworks(student_id);
});

async function fetchProblems(categorie) {
  const data = {
    categorie: categorie,
  };

  try {
    const response = await fetch("/api/verifiedProblems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const problems = await response.json();
    displayProblems(problems);
    return problems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw error;
  }
}

function displayProblems(problems) {
  const problemList = document.querySelector(".problem-list ul");
  problemList.innerHTML = "";

  document.getElementById(
    "problemsCount"
  ).textContent = `Lista de probleme: ${problems.length}`;

  problems.forEach((problem, index) => {
    const listItem = document.createElement("li");
    listItem.id = `problem`;
    var difColor;
    if (problem.dificultate == "usor") difColor = "usor";
    else if (problem.dificultate == "mediu") difColor = "mediu";
    else difColor = "greu";
    listItem.innerHTML = `
        <strong class="${difColor}">#${problem.id} ${problem.titlu}</strong> (Dificultate: ${problem.dificultate}) (Categorie: ${problem.categorie})
        <button id="exportCsvButton" onclick="{exportCsv(${problem.id})}">
        Export CSV
      </button><button type="button" class="viewBtn" problem_id="${problem.id}">Solve</button>
      `;
    problemList.appendChild(listItem);
  });

  document.querySelectorAll(".viewBtn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const problem_id = event.target.getAttribute("problem_id");
      window.location.href = `/pages/student/problem_solve.html?problem_id=${problem_id}`;
    });
  });
}

function exportCsv(problem_id) {
  const data = {
    problem_id: problem_id,
  };
  fetch("/api/exportProblems/csv", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "problem.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
function showPopup(description) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
      <div class="popup-content">
        <span class="close-button">&times;</span>
        <p>${description}</p>
      </div>
    `;
  document.body.appendChild(popup);

  popup.querySelector(".close-button").addEventListener("click", () => {
    document.body.removeChild(popup);
  });
}

async function injectHomeworks(student_id) {
  const homeworkList = document.getElementById("homeworkList");
  homeworkList.innerHTML = "";
  const homeworks = await fetchHomeworks(student_id);

  const groupedByNume = homeworks.reduce((acc, cur) => {
    if (!acc[cur.name]) {
      acc[cur.name] = [];
    }
    acc[cur.name].push(cur.problem_id);
    return acc;
  }, {});

  document.getElementById("homeworksCount").textContent = `Lista de teme: ${
    Object.keys(groupedByNume).length
  }`;

  Object.keys(groupedByNume).forEach((homework, index) => {
    const homeworkId = `homework-${index}`;

    const homeworkTitle = document.createElement("div");
    homeworkTitle.setAttribute("id", homeworkId);
    homeworkTitle.innerHTML = `<p class="homeworkName">Tema: ${homework}</p>`;
    homeworkList.appendChild(homeworkTitle);

    const homeworkProblems = document.createElement("div");
    homeworkProblems.classList.add("homeworkProblems");
    homeworkTitle.appendChild(homeworkProblems);

    groupedByNume[homework].forEach((problem) => {
      const homeworkItem = document.createElement("li");

      // Adaugam problemele in aceeasi lista
      const exerciseItem = document.createElement("p");
      exerciseItem.textContent = `ID Problemă: ${problem}`;
      homeworkItem.appendChild(exerciseItem);

      const viewExerciseButton = document.createElement("button");
      viewExerciseButton.textContent = "Solve";
      viewExerciseButton.classList.add("viewBtn");
      viewExerciseButton.addEventListener("click", () => {
        window.location.href = `/pages/student/problem_solve.html?problem_id=${problem}`;
      });
      homeworkItem.appendChild(viewExerciseButton);

      homeworkProblems.appendChild(homeworkItem);
    });
  });
}

async function fetchHomeworks(student_id) {
  const data = {
    student_id: student_id,
  };
  try {
    const response = await fetch("/api/getHomeworksForStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch homeworks: ${response.status} ${response.statusText}`
      );
    }
    const homeworks = await response.json();
    return homeworks;
  } catch (error) {
    console.error("Error fetching homeworks:", error);
    return [];
  }
}
