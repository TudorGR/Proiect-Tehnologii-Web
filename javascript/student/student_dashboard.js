function solveProblem(problemName) {
  window.location.href = "/pages/student/problem_solve.html";
}

function commentSolution(solutionName) {
  // adaugarea unui comentariu la solutie
  alert("Ai comentat la solutia: " + solutionName);
}

function rateSolution(solutionName) {
  // marcarea unei solutii cu stele
  alert("Ai marcat cu stele solutia: " + solutionName);
}
document.addEventListener("DOMContentLoaded", function () {
  var stars = document.querySelectorAll(".star");

  // butoanele stea
  stars.forEach(function (star) {
    star.addEventListener("click", function () {
      stars.forEach(function (s) {
        s.classList.remove("selected");
      });

      var value = parseInt(star.value);
      for (var i = 0; i < value; i++) {
        stars[i].classList.add("selected");
      }

      // trimiterea la server
      console.log("Dificultatea selectata: " + value);
    });
  });
});
