document.addEventListener("DOMContentLoaded", function () {
  var solutionForm = document.getElementById("solutionForm");

  //extragere numar problema din url
  const queryString = window.location.search;
  const parts = queryString.split("=");
  const problemNumber = parts[1];

  titlu = document.getElementById("titlu");
  descriere = document.getElementById("descriere");

  fetch("/api/problems")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((problem) => {
        if (problem[0] == problemNumber) {
          console.log("am gasit problema");
          titlu.textContent = problem[1];
          descriere.textContent = problem[2];
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });

  solutionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var solutionText = document.getElementById("solution").value;
    alert("Solutia trimisa catre server: " + solutionText);
    var studentID = document.getElementById("studentId").value;
    console.log(solutionText);

    var currentTime = new Date().toISOString();

    //trimitem codul si timpul la server
    const data = {
      problemNumber: problemNumber,
      cod: solutionText,
      timp: currentTime,
      ID: studentID,
    };

    fetch("/update_problem", {
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
        console.log("Actualizare reușită:", data);
      })
      .catch((error) => {
        console.error("Eroare la actualizare:", error);
      });
    solutionForm.reset();
  });
});
