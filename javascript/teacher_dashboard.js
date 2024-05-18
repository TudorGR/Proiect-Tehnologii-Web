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

    var className = document.getElementById("className").value;

    // crearea clasei, trimitere la server...

    //alert('Clasa cu numele: "' + className + '" a fost creata.');
  });
});

function handleAddClass() {
  var ID = document.getElementById("classID").value;
  var prof_id = localStorage.getItem("ID_user");

  checkClassExists(ID)
    .then((exists) => {
      if (!isNaN(ID) && ID !== "" && ID !== undefined && !exists) {
        var nume = document.getElementById("className").value;

        const data = {
          ID: ID,
          nume: nume,
          prof_id: prof_id,
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
      } else {
        alert("ID exista deja.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function checkClassExists(ID) {
  return new Promise((resolve, reject) => {
    fetch("/api/classes")
      .then((response) => response.json())
      .then((data) => {
        const exists = data.some((clas) => clas[0] == ID);
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
          (user) => user[0] == ID && user[4] == "student"
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

    fetch("/checkUserClass", {
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

function handleAddStudentToClass() {
  const studentIds = document.getElementById("studentIds").value.split(",");
  const class_id = document.getElementById("classId").value;

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

                fetch("/addStudentToClass", {
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
              } else {
                alert(
                  `Studentul cu ID-ul: "${student_id}" deja exista in clasa: "${class_id}".`
                );
              }
            });
          } else {
            alert(`Studentul cu ID-ul: "${student_id}" nu exista.`);
          }
        });
      });
    } else {
      alert(`Clasa cu ID-ul: "${class_id}" nu exista.`);
    }
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
function handleDeleteClass(ID) {
  const data = {
    ID: ID,
  };

  fetch("/deleteClass", {
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
function fetchStudentCounts() {
  const profId = localStorage.getItem("ID_user");
  fetch("/api/classStudentCounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prof_id: Number(profId) }),
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
                  <td>${classInfo.name}</td>
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
function handleViewClass(ID) {
  window.location.href = `/pages/class.html?class=${ID}`;
}
