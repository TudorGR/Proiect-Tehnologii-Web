document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    //cont admin
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email == "admin" && password == "admin") {
      window.location.href = "/pages/admin_dashboard.html";
    } else {
      checkUser(email, password)
        .then((result) => {
          if (!result.exists) {
            alert("Nume de utilizator sau parola incorecta!");
          } else {
            localStorage.setItem("ID_user", result.ID);
            if (result.role == "student") {
              window.location.href = "/pages/student/student_dashboard.html";
            } else if (result.role == "teacher") {
              window.location.href = "/pages/teacher_dashboard.html";
            } else if (result.role == "admin") {
              window.location.href = "/pages/admin_dashboard.html";
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });

function checkUser(email, password) {
  return new Promise((resolve, reject) => {
    fetch("/api/users") // Change to match your route
      .then((response) => response.json())
      .then((data) => {
        let userID = null;
        let role = null;
        const exists = data.some((user) => {
          if (user.email === email && user.password === password) {
            // Assuming email and password are in the JSON response
            userID = user.id;
            role = user.role;
            return true;
          }
          return false;
        });

        if (exists) {
          resolve({ exists: true, ID: userID, role: role });
        } else {
          resolve({ exists: false });
        }
      })
      .catch((error) => {
        console.error("Error checking user:", error);
        reject(error);
      });
  });
}
