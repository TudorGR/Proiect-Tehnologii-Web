document.addEventListener("DOMContentLoaded", function () {
  fetchUsers();
  fetchUnverifiedProblems();
});

function fetchUsers() {
  fetch("/api/users")
    .then((response) => response.json())
    .then((data) => {
      const usersTableBody = document.querySelector("#users-table tbody");
      usersTableBody.innerHTML = "";
      data.forEach((user) => {
        const row = document.createElement("tr");
        row.dataset.id = user.id;
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <select onchange="changeUserRole(${user.id}, this.value)">
              <option value="student" ${
                user.role === "student" ? "selected" : ""
              }>Student</option>
              <option value="teacher" ${
                user.role === "teacher" ? "selected" : ""
              }>Teacher</option>
              <option value="admin" ${
                user.role === "admin" ? "selected" : ""
              }>Admin</option>
            </select>
          </td>
          <td>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
        usersTableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching users:", error));
}

function deleteUser(userId) {
  fetch(`/api/deleteUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ID: userId }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`User deleted: ${data}`);
      // Remove the user from the table
      const userRow = document.querySelector(
        `#users-table tr[data-id='${userId}']`
      );
      userRow.remove();
    })
    .catch((error) => console.error("Error deleting user:", error));
}

function fetchUnverifiedProblems() {
  fetch("/api/unverifiedProblems")
    .then((response) => response.json())
    .then((data) => {
      const problemsTableBody = document.querySelector(
        "#unverified-problems-table tbody"
      );
      problemsTableBody.innerHTML = "";
      data.forEach((problem) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${problem.id}</td>
          <td>${problem.titlu}</td>
          <td>${problem.dificultate}</td>
          <td>${problem.categorie}</td>
          <td class="actions">
            <button onclick="viewProblem('${problem.id}')">View</button>
            <button onclick="verifyProblem(${problem.id})">Verify</button>
            <button onclick="handleDeleteProblem(${problem.id})">Delete</button>
          </td>
        `;
        problemsTableBody.appendChild(row);
      });
    })
    .catch((error) =>
      console.error("Error fetching unverified problems:", error)
    );
}

function changeUserRole(user_id, newRole) {
  fetch(`/api/changeUserRole`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id, role: newRole }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`User role updated: ${data}`);
      fetchUsers();
    })
    .catch((error) => console.error("Error updating user role:", error));
}

function viewProblem(problem_id) {
  fetch(`/api/getDescription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ problem_id: problem_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("popup-description").textContent =
        data[0].descriere;
      const popup = document.getElementById("popup");
      popup.style.display = "block";
      setTimeout(() => {
        popup.classList.add("show");
      }, 10);
    })
    .catch((error) => console.error("Error updating user role:", error));
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");
  setTimeout(() => {
    popup.style.display = "none";
  }, 100);
}

function handleDeleteProblem(ID) {
  const data = {
    ID: ID,
  };

  fetch("/api/deleteProblem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    fetchUnverifiedProblems();
    return res.json();
  });
}

function verifyProblem(problem_id) {
  fetch(`/api/setVerified`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ problem_id: problem_id }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`Problem verified: ${data}`);
      fetchUnverifiedProblems();
    })
    .catch((error) => console.error("Error verifying problem:", error));
}
