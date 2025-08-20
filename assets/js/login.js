document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (user === "admin" && pass === "admin123") {
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("loginError").style.display = "block";
  }
});