document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    //cont admin
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password != confirmPassword) {
      alert("parole diferite.");
      return;
    }

    if (email == "admin" && password == "admin") {
      window.location.href = "/pages/admin_dashboard.html";
    } else {
      checkUser(email, password)
        .then((result) => {
          if (!result.exists) {
            const data = {
              name: "nume",
              email: email,
              password: password,
              role: "student",
            };

            fetch("/api/addUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }).then((res) => {
              if (!res.ok) {
                throw new Error("Network response was not ok");
              }
              window.location.href = "/pages/login.html";
              return res.json();
            });
          } else {
            alert("Nume de utilizator/Email exista deja!");
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
