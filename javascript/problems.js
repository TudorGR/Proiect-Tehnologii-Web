document.addEventListener("DOMContentLoaded", () => {
  async function fetchProblems() {
    try {
      const response = await fetch("/api/verifiedProblems");
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const problems = await response.json();
      displayProblems(problems);
    } catch (error) {
      console.error("Error fetching problems:", error);
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
          <strong class="${difColor}">#${index + 1} ${
        problem.titlu
      }</strong> (Dificultate: ${problem.dificultate}) (Categorie: ${
        problem.categorie
      })
          <button type="button" class="viewBtn" data-description="${
            problem.descriere
          }">View Problem</button>
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

  fetchProblems();
});
