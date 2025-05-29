import React, { useState } from "react";
import loginImage from "./Wallpaper.jpg"; 

const baseUrl = process.env.REACT_APP_BACKEND_URL;

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
      // 1. First authenticate
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const authData = await loginResponse.json();
      
      // 2. Store auth data
      localStorage.setItem("token", authData.token);
      localStorage.setItem("role", authData.role);
      localStorage.setItem("username", username);

      // 3. Fetch user details to get ID
      const userResponse = await fetch(`${baseUrl}/auth/user/${username}`, {
        headers: {
          "Authorization": `Bearer ${authData.token}`
        }
      });

      if (!userResponse.ok) {
        throw new Error("No se pudo obtener los datos del usuario");
      }

      const userData = await userResponse.json();
      localStorage.setItem("userId", userData.id);

      // 4. Complete login
      onLoginSuccess();
      
    } catch (err) {
      setError(err.message);
      // Clear any partial auth data
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