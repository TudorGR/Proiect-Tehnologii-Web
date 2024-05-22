const urlParams = new URLSearchParams(window.location.search);
const class_id = urlParams.get("class_id");
const problem_id = urlParams.get("problem_id");
const class_name = urlParams.get("class_name");
var student_id = null;

document.addEventListener("DOMContentLoaded", () => {
  fetchAttempts(1);
  fetchStudentsClass(class_id);

  document.getElementById(
    "navigation"
  ).innerHTML = `<ul><li><a href='/pages/class.html?class=${class_id}&nume=${class_name}'>Inapoi</a></li></ul>`;
});

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

function handleViewAttempt(attempt) {
  document.getElementById("solution").textContent = attempt.cod;
  updateLineNumbers();
  autoResize();
}

async function displayStudents(students) {
  const studentsList = document.getElementById("studentsList");
  studentsList.innerHTML = "";
  document.getElementById(
    "studentsCount"
  ).textContent = `Lista de Studenti: ${students.length}`;

  for (const student of students) {
    try {
      // Asteptam ca fetchAttempts sa returneze datele
      const attempts = await fetchAttempts(student.id);
      const solutions = attempts.length;

      const liItem = document.createElement("li");
      liItem.classList.add("student-item");
      const listItem = document.createElement("h3");
      listItem.textContent = `ID: ${student.id} Nume: ${student.name}`;
      const listItem2 = document.createElement("p");
      listItem2.classList.add("attemptP");
      listItem2.textContent = `Solutii: ${solutions}`;
      const listItem4 = document.createElement("div");
      listItem4.classList.add("problems");

      Object.keys(attempts).forEach((attemptKey) => {
        const divItem = document.createElement("div");

        const item = document.createElement("p");
        item.textContent = `Timp: ${attempts[attemptKey].timp}${
          attempts[attemptKey].evaluare != 0 ? " [Evaluat]" : ""
        }`;

        const btn = document.createElement("button");
        btn.classList.add("evalBtn");
        btn.onclick = () => {
          student_id = student.id;
          handleViewAttempt(attempts[attemptKey]);
        };
        btn.textContent = "Vezi codul";

        const btn2 = document.createElement("button");
        btn2.classList.add("evalBtn");
        btn2.onclick = () => {
          alert(attempts[attemptKey].evaluare);
        };
        btn2.textContent = "Vezi evaluare";

        divItem.appendChild(item);
        divItem.appendChild(btn);
        divItem.appendChild(btn2);
        listItem4.appendChild(divItem);
      });

      listItem.onclick = () => {
        listItem4.classList.toggle("show");
      };
      listItem2.onclick = () => {
        listItem4.classList.toggle("show");
      };

      liItem.appendChild(listItem);
      liItem.appendChild(listItem2);
      liItem.appendChild(listItem4);
      studentsList.appendChild(liItem);
    } catch (error) {
      console.error(
        `Error fetching attempts for student ID ${student.id}:`,
        error
      );
      const liItem = document.createElement("li");
      liItem.classList.add("student-item");
      liItem.textContent = `ID: ${student.id} Nume: ${student.name} - Eroare la încărcarea soluțiilor`;
      studentsList.appendChild(liItem);
    }
  }
}

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

function handleSendEvaluation() {
  if (student_id == null) {
    alert("Selecteaza 'Vezi codul' la un elev.");
    return;
  }

  const evalText = document.getElementById("evaluation").value;

  if (evalText == "") {
    alert("Evaluare goala.");
    return;
  }

  const data = {
    student_id: student_id,
    problem_id: problem_id,
    evaluare: evalText,
  };
  fetch("/api/evaluateAttempt", {
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
      console.log("Evaluare reușită:", data);
    })
    .catch((error) => {
      console.error("Eroare la evaluare:", error);
    });
}
