document.addEventListener("DOMContentLoaded", function () {
  fetchStudentCounts();

  var addClassForm = document.getElementById("addClassForm");
  var createClassForm = document.getElementById("createClassForm");

  addClassForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var classId = document.getElementById("classId").value;
    var studentIds = document.getElementById("studentIds").value.split(",");
  });

  createClassForm.addEventListener("submit", function (event) {
    event.preventDefault();
  });
});

function handleAddClass() {
  var prof_id = localStorage.getItem("ID_user");

  var nume = document.getElementById("className").value;
  document.getElementById("createClassForm").reset();

  const data = {
    nume: nume,
    prof_id: Number(prof_id),
  };

  fetch("/addClass", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    alert('Clasa cu numele: "' + nume + '" a fost creata.');
    return res.json();
  });
  document.getElementById("createClassForm").reset();
}

function fetchStudentCounts() {
  const prof_id = localStorage.getItem("ID_user");
  fetch("/api/getClassStudentCounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prof_id: Number(prof_id) }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        const tbody = document.querySelector("#results-table tbody");
        tbody.innerHTML = "";

        data.forEach((classInfo) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                  <td>${classInfo.id}</td>
                  <td>${classInfo.nume}</td>
                  <td>${classInfo.student_count}</td>
                  <td>
                      <button class="viewBtn" onclick="handleViewClass(${classInfo.id})">View Class</button>
                      <button class="deleteBtn" onclick="handleDeleteClass(${classInfo.id})">Delete Class</button>
                  </td>
              `;
          tbody.appendChild(row);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

function handleDeleteClass(ID) {
  const data = {
    ID: ID,
  };

  fetch("/api/deleteClass", {
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
      console.log("Stergere reușită:", data);
    })
    .catch((error) => {
      console.error("Eroare la actualizare:", error);
    });
}

function handleViewClass(ID) {
  window.location.href = `/pages/class.html?class=${ID}`;
}

function handleAddStudentToClass() {
  const studentIds = document.getElementById("studentIds").value.split(",");
  const class_id = document.getElementById("classId").value;
  document.getElementById("addClassForm").reset();

  checkClassExists(class_id).then((exists) => {
    if (exists) {
      studentIds.forEach((student_id) => {
        checkUserExists(student_id).then((userExists) => {
          if (userExists) {
            checkUserClass(student_id, class_id).then((userInClass) => {
              if (!userInClass) {
                const data = {
                  student_id: Number(student_id),
                  class_id: class_id,
                };
                fetch("/api/addStudentToClass", {
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
                  .then(() => {
                    alert(
                      `Studentul cu ID-ul: ${student_id} a fost adaugat la clasa: ${class_id}`
                    );
                  })
                  .catch((error) => {
                    console.error("Error adding student to class:", error);
                  });
                document.getElementById("addClassForm").reset();
              } else {
                alert(
                  `Studentul cu ID-ul: "${student_id}" deja exista in clasa: "${class_id}".`
                );
                document.getElementById("addClassForm").reset();
              }
            });
          } else {
            alert(`Studentul cu ID-ul: "${student_id}" nu exista.`);
          }
          document.getElementById("addClassForm").reset();
        });
      });
    } else {
      alert(`Clasa cu ID-ul: "${class_id}" nu exista.`);
    }
    document.getElementById("addClassForm").reset();
  });
}

function checkClassExists(ID) {
  return new Promise((resolve, reject) => {
    fetch("/api/classes")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((clas) => clas.id == ID);
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking class:", error);
        reject(error);
      });
  });
}

function checkUserExists(ID) {
  return new Promise((resolve, reject) => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some(
          (user) => user.id == ID && user.role == "student"
        );
        resolve(exists);
      })
      .catch((error) => {
        console.error("Error checking user:", error);
        reject(error);
      });
  });
}

function checkUserClass(student_id, class_id) {
  return new Promise((resolve, reject) => {
    const data = { student_id: Number(student_id), class_id: class_id };

    fetch("/api/checkUserClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data.exists);
      })
      .catch((error) => {
        console.error("Error checking user class:", error);
        reject(error);
      });
  });
}

document
  .getElementById("results-table")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteBtn")) {
      // Butonul de stergere
      var row = event.target.parentElement.parentElement;
      row.remove();
    }
  });

function handleAddProblem() {
  var numeProblema = document.getElementById("problemName").value;
  var descriere = document.getElementById("description").value;
  var dificultate = document.getElementById("difficulty").value;
  var categorie = document.getElementById("category").value;
  document.getElementById("addProblemForm").reset();

  const data = {
    numeProblema: numeProblema,
    descriere: descriere,
    dificultate: dificultate,
    categorie: categorie,
  };

  fetch("/api/addProblem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      alert("Problema trimisa pentru evaluare.");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      console.error("Eroare la actualizare:", error);
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
