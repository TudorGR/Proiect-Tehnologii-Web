document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const parts = queryString.split("=");
  const ID = parts[1];

  fetchProblems("All");
  injectHomeworks(ID);

  document.getElementById("classID").textContent = "Class ID: " + ID;

  //crearea temei
  document
    .getElementById("createHomeworkForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const nume = document.getElementById("themeName").value;
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
              nume: nume,
              problem_id: id,
              class_id: ID,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to add homework");
          }

          const result = await response.json();
          alert(`Homework added successfully for problem with ID: ${id}`);
        } catch (error) {
          console.error("Error adding homework:", error);
          alert("Failed to add homework for problem with ID: " + id);
        }
      }
    });
});

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
  const homeworkList = document.getElementById("themesList");
  const homeworks = await fetchHomeworks();

  const filteredData = homeworks.filter((item) => item.class_id == class_id);

  const groupedByNume = filteredData.reduce((acc, cur) => {
    if (!acc[cur.nume]) {
      acc[cur.nume] = [];
    }
    acc[cur.nume].push(cur.problem_id);
    return acc;
  }, {});

  Object.keys(groupedByNume).forEach((homework) => {
    const homeworkTitle = document.createElement("h2");
    homeworkTitle.textContent = `Tema: ${homework}`;
    homeworkList.appendChild(homeworkTitle);

    const homeworkProblems = document.createElement("div");
    homeworkProblems.classList.add("homeworkProblems");
    homeworkList.appendChild(homeworkProblems);

    ////
    groupedByNume[homework].forEach((problem) => {
      const homeworkItem = document.createElement("li");
      const itemTitle = document.createElement("h3");
      itemTitle.textContent = problem;
      homeworkItem.appendChild(itemTitle);

      // Adăugăm problemele în aceeași listă
      const exerciseItem = document.createElement("p");
      exerciseItem.textContent = `ID Problemă: ${problem}`;
      homeworkItem.appendChild(exerciseItem);

      const viewExerciseButton = document.createElement("button");
      viewExerciseButton.textContent = "Vezi Exercițiu";
      viewExerciseButton.addEventListener("click", () => {
        // Acțiunea când se apasă butonul "Vezi Exercițiu"
        alert(`Detalii exercițiu pentru tema: ${homework.nume}`);

        ///
      });
      homeworkItem.appendChild(viewExerciseButton);

      homeworkProblems.appendChild(homeworkItem);
    });
  });
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

  problems.forEach((problem, index) => {
    const listItem = document.createElement("li");
    listItem.id = `problem`;
    var difColor;
    if (problem.dificultate == "usor") difColor = "usor";
    else if (problem.dificultate == "mediu") difColor = "mediu";
    else difColor = "greu";
    listItem.innerHTML = `
        <strong class="${difColor}">#${problem.id} ${problem.titlu}</strong> (Dificultate: ${problem.dificultate}) (Categorie: ${problem.categorie})
        <button type="button" class="viewBtn" data-description="${problem.descriere}">View Problem</button>
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
