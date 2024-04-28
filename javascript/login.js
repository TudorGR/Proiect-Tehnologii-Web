document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // autentificare
    if (username === "admin" && password === "admin") {
      // redirectare bazat pe tipul de cont folosit
      window.location.href = "admin_dashboard.html";
    } else if (username === "teacher" && password === "teacher") {
      window.location.href = "teacher_dashboard.html";
    } else if (username === "student" && password === "student") {
      window.location.href = "/pages/student/student_dashboard.html";
    } else {
      alert("Nume de utilizator sau parola incorecta!");
    }
  });
