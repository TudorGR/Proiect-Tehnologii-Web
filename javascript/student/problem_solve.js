document.addEventListener("DOMContentLoaded", function () {
  var solutionForm = document.getElementById("solutionForm");
  solutionForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var solutionText = document.getElementById("solution").value;
    alert("Solutia trimisa catre server: " + solutionText);
    solutionForm.reset();
  });
});
