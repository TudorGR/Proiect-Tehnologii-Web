document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("classChart");
  var ctx = canvas.getContext("2d");

  // input grafic
  var data = [20, 25, 15, 30, 10];
  var colors = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];
  var labels = ["Clasa A", "Clasa B", "Clasa C", "Clasa D", "Clasa E"];

  // Desenarea graficului
  var total = data.reduce(function (prev, curr) {
    return prev + curr;
  });

  var startAngle = -Math.PI / 2;
  data.forEach(function (value, i) {
    var sectorAngle = 2 * Math.PI * (value / total);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width, canvas.height) / 2,
      startAngle,
      startAngle + sectorAngle
    );
    ctx.fillStyle = colors[i];
    ctx.fill();
    startAngle += sectorAngle;
  });

  // Legend
  var legendX = 0;
  var legendY = 20;
  var legendWidth = 15;
  var legendSpacing = 5;
  ctx.font = "14px Arial";
  for (var i = 0; i < labels.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(legendX, legendY, legendWidth, legendWidth);
    ctx.fillStyle = "#000";
    ctx.fillText(
      labels[i],
      legendX + legendWidth + legendSpacing,
      legendY + legendWidth
    );
    legendY += legendWidth + legendSpacing;
  }
});
document.addEventListener("DOMContentLoaded", function () {
  var addClassForm = document.getElementById("addClassForm");
  var createClassForm = document.getElementById("createClassForm");

  addClassForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var classId = document.getElementById("classId").value;
    var studentIds = document.getElementById("studentIds").value.split(",");

    // adaugarea in clase, trimitere la server...

    alert(
      'Elevul cu ID-ul: "' +
        studentIds +
        '" a fost adaugat la clasa: "' +
        classId +
        '".'
    );
  });

  createClassForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var className = document.getElementById("className").value;

    // crearea clasei, trimitere la server...

    alert('Clasa cu numele: "' + className + '" a fost creata.');
  });
});
