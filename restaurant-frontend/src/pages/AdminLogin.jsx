import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8080";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Send login request to backend and store token
  const handleLogin = () => {
    fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // Save token in memory (sessionStorage so it clears on tab close)
          sessionStorage.setItem("adminToken", data.token);
          navigate("/admin");
        } else {
          setError("Usuario o contraseña incorrectos");
        }
      })
      .catch(() => setError("Error al conectar con el servidor"));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "sans-serif",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>⚙️ Admin</h1>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "16px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        {/* Show error message if login fails */}
        {error && (
          <p style={{ color: "red", fontSize: "13px", marginBottom: "12px" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;