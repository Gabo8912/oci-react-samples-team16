import React, { useState } from "react";
import loginImage from "./Wallpaper.jpg"; // ✅ Asegúrate de tener esta imagen en tu carpeta src

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8081/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username); // Store username for Dashboard
      onLoginSuccess();
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* 📌 Mitad Izquierda - Imagen */}
      <div style={styles.leftSide}>
        <img src={loginImage} alt="Login" style={styles.image} />
      </div>

      {/* 📌 Mitad Derecha - Formulario */}
      <div style={styles.rightSide}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ Estilos en JS
const styles = {
  pageContainer: {
    position: "absolute",
    top: "0px",
    left: "0px",
    display: "flex",
    width: "100vw",
    height: "100vh",
  },
  leftSide: {
    width: "50%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  rightSide: {
    width: "50%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    maxWidth: "350px",
  },
  input: {
    margin: "10px 0",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    backgroundColor: "E6D7C3",
  },
  button: {
    padding: "12px",
    fontSize: "18px",
    backgroundColor: "#FE141C",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default Login;
