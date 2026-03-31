const api = "http://127.0.0.1:5000";

function showResult(msg, error = false) {
  alert((error ? "⚠️ " : "✅ ") + msg);
}

async function register() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value;
  if (!user || !pass) return showResult("User and password are required.", true);

  const res = await fetch(api + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pwd: pass }),
  });
  const data = await res.json();

  if (!res.ok || !data.success) return showResult(data.error || data.message || "Registration failed", true);
  showResult(data.message || "Registered successfully.");
}

async function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value;
  if (!user || !pass) return showResult("User and password are required.", true);

  const res = await fetch(api + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pwd: pass }),
  });
  const data = await res.json();

  if (!res.ok || !data.success) return showResult("Invalid username or password", true);
  localStorage.setItem("cipherUser", user);
  showResult("Login successful.");
  window.location.href = "index.html";
}
