import React, { useState } from "react";
import loginImage from "./Wallpaper.jpg";

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const ERROR_INVALID_CREDENTIALS = "Credenciales incorrectas";
const ERROR_USER_FETCH_FAILED = "No se pudo obtener los datos del usuario";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearAuthStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  const loginUser = async (username, password) => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error(ERROR_INVALID_CREDENTIALS);
    return response.json();
  };

  const fetchUserInfo = async (username, token) => {
    const response = await fetch(`${baseUrl}/auth/user/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(ERROR_USER_FETCH_FAILED);
    return response.json();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const authData = await loginUser(username, password);

      localStorage.setItem("token", authData.token);
      localStorage.setItem("role", authData.role);
      localStorage.setItem("username", username);

      const userData = await fetchUserInfo(username, authData.token);
      localStorage.setItem("userId", userData.id);

      onLoginSuccess();
    } catch (err) {
      setError(err.message);
      clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Left Side - Image */}
      <div style={styles.leftSide}>
        <img src={loginImage} alt="Login" style={styles.image} />
      </div>

      {/* Right Side - Form */}
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
          <button
            type="submit"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Estilos en JS
const styles = {
  pageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
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
    backgroundColor: "#E6D7C3",
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
