const urlParams = new URLSearchParams(window.location.search);
const problem_id = urlParams.get("problem_id");
document.addEventListener("DOMContentLoaded", function () {
  var solutionForm = document.getElementById("solutionForm");
  displayAttempts();

  displayComments(problem_id);

  titlu = document.getElementById("titlu");
  descriere = document.getElementById("descriere");

  fetch("/api/problems")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((problem) => {
        if (problem.id == problem_id) {
          titlu.textContent = problem.titlu;
          descriere.textContent = problem.descriere;
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching problems:", error);
    });

  solutionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var solutionText = document.getElementById("solution").value;
    var studentID = localStorage.getItem("ID_user");

    const currentTime = new Date();
    const formattedTime = `${currentTime.getFullYear()}-${(
      currentTime.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentTime
      .getDate()
      .toString()
      .padStart(2, "0")} ${currentTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${currentTime
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    const data = {
      problem_id: problem_id,
      cod: solutionText,
      timp: formattedTime,
      ID: studentID,
    };

    fetch("/api/sendAttempt", {
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
        displayAttempts();
      })
      .catch((error) => {
        console.error("Eroare la actualizare:", error);
      });
    solutionForm.reset();
  });
});

async function fetchAttempts(student_id) {
  const data = {
    student_id: student_id,
    problem_id: problem_id,
  };

  try {
    const response = await fetch("/api/getAttempts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const attempt = await response.json();
    return attempt;
  } catch (error) {
    console.error("Error fetching attempt:", error);
    throw error;
  }
}

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

function handleAddComment() {
  var content = document.getElementById("description").value;
  var id_user = localStorage.getItem("ID_user");

  const data = {
    content: content,
    id_user: id_user,
    id_problem: id_problem,
  };

  fetch("/addComment", {
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
      document.getElementById("commentForm").reset();
      alert("Comentariu trimis!");
      return res.json();
    })
    .catch((error) => {
      console.error("Eroare la actualizare:", error);
    });
}
function displayComments(id_problem) {
  // Face o cerere GET către ruta API pentru a obține comentariile pentru problema dată

  const data = {
    id_problem: id_problem,
  };

  fetch("/api/getComments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((comments) => {
      const commentsSection = document.getElementById("comentarii");

      commentsSection.innerHTML = "";

      comments.forEach((comment) => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        const commentTitle = document.createElement("h3");
        const commentContent = document.createElement("p");

        commentTitle.textContent = `ID user: ${comment.student_id}`;
        commentContent.textContent = comment.content;

        commentDiv.appendChild(commentTitle);
        commentDiv.appendChild(commentContent);
        commentsSection.appendChild(commentDiv);
      });
    })
    .catch((error) => {
      console.error("Eroare la obținerea comentariilor:", error);
    });
}

function handleViewEvaluation(evaluare) {
  alert(evaluare);
}

function handleViewCode(cod) {
  document.getElementById("solution").textContent = cod;
  updateLineNumbers();
  autoResize();
}

async function displayAttempts() {
  const attemptList = document.getElementById("attempts");
  attemptList.innerHTML = "";

  const attempts = await fetchAttempts(localStorage.getItem("ID_user"));

  attempts.forEach((attempt) => {
    const listItem = document.createElement("li");
    listItem.id = `attempt`;
    listItem.innerHTML = `
        <h3>#${attempt.id_problema}&nbsp;${attempt.timp}${
      attempt.evaluare != 0
        ? `&nbsp;Evaluat <button class="viewEvaluation ${
            attempt.result == 1 ? "greenBg" : "redBg"
          }" onclick="handleViewEvaluation('${
            attempt.evaluare
          }')">View&nbsp;evaluation</button>`
        : ""
    }</h3>`;
    const viewExerciseButton = document.createElement("button");
    viewExerciseButton.textContent = "Vezi";
    viewExerciseButton.classList.add("viewBtn");
    viewExerciseButton.addEventListener("click", () => {
      handleViewCode(attempt.cod);
    });
    listItem.appendChild(viewExerciseButton);
    attemptList.appendChild(listItem);
  });
}

function displayComments(id_problem) {
  const data = {
    id_problem: id_problem,
  };

  fetch("/api/getComments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((comments) => {
      const commentsSection = document.getElementById("comentarii");

      commentsSection.innerHTML = "";

      comments.forEach((comment) => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        const commentTitle = document.createElement("h3");
        const commentContent = document.createElement("p");

        commentTitle.textContent = `ID user: ${comment.student_id}`;
        console.log(comment.content);
        commentContent.textContent = comment.content;

        commentDiv.appendChild(commentTitle);
        commentDiv.appendChild(commentContent);
        commentsSection.appendChild(commentDiv);
      });
    })
    .catch((error) => {
      console.error("Eroare la obținerea comentariilor:", error);
    });
}

function handleAddComment() {
  var content = document.getElementById("description").value;

  const data = {
    content: content,
    id_user: localStorage.getItem("ID_user"),
    id_problem: problem_id,
  };

  fetch("/api/addComment", {
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
      document.getElementById("commentForm").reset();
      displayComments(problem_id);
      return res.json();
    })
    .catch((error) => {
      console.error("Eroare la actualizare:", error);
    });
}
