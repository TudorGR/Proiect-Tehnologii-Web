document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const parts = queryString.split("=");
  const ID = parts[1];
  document.getElementById("classID").textContent = "Class ID: " + ID;
});
