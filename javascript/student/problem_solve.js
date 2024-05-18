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
    var studentID = localStorage.getItem("ID_user");
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

function updateLineNumbers() {
  const textarea = document.getElementById("solution");
  const lineNumbers = document.querySelector(".line-numbers");

  const lines = textarea.value.split("\n").length;
  let lineNumberHtml = "";
  for (let i = 1; i <= lines; i++) {
    lineNumberHtml += i + "<br>";
  }

  lineNumbers.innerHTML = lineNumberHtml;
}

function syncScroll() {
  const textarea = document.getElementById("solution");
  const lineNumbers = document.querySelector(".line-numbers");
  lineNumbers.scrollTop = textarea.scrollTop;
}

function autoResize() {
  const textarea = document.getElementById("solution");
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

document.addEventListener("DOMContentLoaded", (event) => {
  updateLineNumbers();
});
