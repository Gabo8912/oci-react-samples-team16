import React, { useState } from "react";
import loginImage from "./Wallpaper.jpg";
import config from "./config";

const baseUrl = config.backendUrl;

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const authData = await loginResponse.json();
      localStorage.setItem("token", authData.token);
      localStorage.setItem("role", authData.role);
      localStorage.setItem("username", username);

      const userResponse = await fetch(`${baseUrl}/auth/user/${username}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("No se pudo obtener los datos del usuario");
      }

      const userData = await userResponse.json();
      localStorage.setItem("userId", userData.id);

      onLoginSuccess();
    } catch (err) {
      setError(err.message);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.leftSide}>
        <img src={loginImage} alt="Login" style={styles.image} />
      </div>

      <div style={styles.rightSide}>
        <form onSubmit={handleLogin} style={styles.form}>
          <h2 style={styles.title}>Sign In!</h2>
          <div style={styles.formContent}>
            {error && <p style={styles.error}>{error}</p>}
            <input
              type="text"
              placeholder="User"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    backgroundColor: "#ffffff",
    padding: "30px 40px 40px",
    width: "100%",
    maxWidth: "400px",
    minHeight: "400px",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    position: "relative",
    paddingTop: "80px", // más espacio arriba para el título
  },
  title: {
    position: "absolute",
    top: "45px",
    left: "0",
    right: "0",
    textAlign: "center",
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333",
  },
  formContent: {
    marginTop: "40px", // espacio entre título y contenido
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginTop: "14px",
    marginBottom: "14px",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    backgroundColor: "white",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
    textAlign: "center",
    marginTop: "30px", // se baja un poco por el título fijo
  },
  button: {
    marginTop: "50px",
    padding: "14px",
    fontSize: "18px",
    background: "linear-gradient(to right, #b31217, #e52d27)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Login;
