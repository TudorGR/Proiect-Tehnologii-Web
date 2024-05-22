const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get("class");
const nume = urlParams.get("nume");

document.addEventListener("DOMContentLoaded", () => {
  fetchStudentsClass(ID);
  fetchProblems("All");
  injectHomeworks(ID);

  document.getElementById("classInfo").textContent =
    "ID Clasa: " + ID + " Nume: " + nume;

  //crearea temei
  document
    .getElementById("createHwBtn")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const name = document.getElementById("homeworkName").value;
      const problemIds = document
        .getElementById("problemIds")
        .value.split(",")
        .map((id) => id.trim());

      for (const id of problemIds) {
        try {
          const problemExists = await checkProblemExists(id);
          if (!problemExists) {
            alert(`Problem with ID ${id} does not exist.`);
            continue; // Skip adding homework for non-existing problem
          }

          const response = await fetch("/api/addHomework", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              problem_id: id,
              class_id: ID,
            }),
          });

          if (!response.ok) {
            throw new Error(response);
          }

          const result = await response.json();
        } catch (error) {
          console.error("Error adding homework:", error);
          alert("Failed to create/add (to) homework.");
        }
      }
      injectHomeworks(ID);
    });
});

async function handleDeleteHomework(class_id, name, elementId) {
  const data = {
    class_id: class_id,
    name: name,
  };

  try {
    const response = await fetch("/api/deleteHomework", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to delete homework");
    }

    // Ștergerea temei din DOM
    // const element = document.getElementById(elementId);
    // if (element) {
    //   element.remove();
    // }
    injectHomeworks(ID);
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the homework.");
  }
}

async function fetchHomeworks() {
  try {
    const response = await fetch("/api/getHomework");
    if (!response.ok) {
      throw new Error("Failed to fetch homeworks");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching homeworks:", error);
    return [];
  }
}

async function injectHomeworks(class_id) {
  const homeworkList = document.getElementById("homeworkList");
  homeworkList.innerHTML = "";
  const homeworks = await fetchHomeworks();

  const filteredData = homeworks.filter((item) => item.class_id == class_id);

  const groupedByNume = filteredData.reduce((acc, cur) => {
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
    homeworkTitle.innerHTML = `<p>Tema: ${homework}</p> <button id="deleteHomeworkBtn" onclick="handleDeleteHomework(${class_id}, '${homework}', '${homeworkId}')">Sterge</button>`;
    homeworkList.appendChild(homeworkTitle);

    const homeworkProblems = document.createElement("div");
    homeworkProblems.classList.add("homeworkProblems");
    homeworkTitle.appendChild(homeworkProblems);

    groupedByNume[homework].forEach((problem) => {
      const homeworkItem = document.createElement("li");

      // Adăugăm problemele în aceeași listă
      const exerciseItem = document.createElement("p");
      exerciseItem.textContent = `ID Problemă: ${problem}`;
      homeworkItem.appendChild(exerciseItem);

      const viewExerciseButton = document.createElement("button");
      viewExerciseButton.textContent = "Vezi";
      viewExerciseButton.classList.add("viewBtn");
      viewExerciseButton.addEventListener("click", () => {
        handleViewProblem(problem);
      });
      homeworkItem.appendChild(viewExerciseButton);

      homeworkProblems.appendChild(homeworkItem);
    });
  });
}

function handleViewProblem(problem_id) {
  window.location.href = `/pages/problem.html?class_id=${ID}&problem_id=${problem_id}&class_name=${nume}`;
}

function checkProblemExists(ID) {
  return new Promise((resolve, reject) => {
    fetch("/api/problems")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((problem) => problem.id == ID);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking problem:", error);
        reject(error);
      });
  });
}

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
        Export as CSV
      </button><button type="button" class="viewBtn" data-description="${problem.descriere}">View Problem</button>
      `;
    problemList.appendChild(listItem);
  });

  document.querySelectorAll(".viewBtn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const description = event.target.getAttribute("data-description");
      showPopup(description);
    });
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

async function fetchStudentsClass(class_id) {
  const data = {
    class_id: class_id,
  };
  try {
    const response = await fetch("/api/getStudentsClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const students = await response.json();
    displayStudents(students);
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

function displayStudents(students) {
  const studentsList = document.getElementById("studentsList");
  studentsList.innerHTML = "";
  document.getElementById(
    "studentsCount"
  ).textContent = `Lista de Studenti: ${students.length}`;

  students.forEach((student) => {
    const liItem = document.createElement("li");
    const listItem = document.createElement("p");
    listItem.textContent = `ID:${student.id}`;
    const listItem2 = document.createElement("p");
    listItem2.textContent = `Nume:${student.name}`;
    const listItem3 = document.createElement("p");
    listItem3.textContent = `Email:${student.email}`;
    liItem.appendChild(listItem);
    liItem.appendChild(listItem2);
    liItem.appendChild(listItem3);
    studentsList.appendChild(liItem);
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
