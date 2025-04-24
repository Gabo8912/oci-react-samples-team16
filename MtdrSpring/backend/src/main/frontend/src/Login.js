import React, { useState, useRef, useCallback } from "react";
import loginImage from "./Wallpaper.jpg"; // ✅ Asegúrate de tener esta imagen en tu carpeta src

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: credentials, 2: captcha
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const canvasRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (step === 1) {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setStep(2);
      } else {
        setError("Credenciales incorrectas");
      }
    }
    setLoading(false);
  };

  const handleCanvasClick = async (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check if click is within checkbox area
    if (clickX >= 10 && clickX <= 30 && clickY >= 10 && clickY <= 30) {
      setIsChecked(!isChecked);
      
      if (!isChecked) {
        setLoading(true);
        const response = await fetch("http://localhost:8081/auth/verify-captcha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            username, 
            clickX, 
            clickY 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("username", username);
          onLoginSuccess();
        } else {
          setError("Verificación fallida");
          setIsChecked(false);
        }
        setLoading(false);
      }
    }
  };

  const drawCaptcha = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw checkbox
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 20, 20);
    
    // Draw checkmark if checked
    if (isChecked) {
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(15, 17);
      ctx.lineTo(18, 20);
      ctx.lineTo(25, 13);
      ctx.stroke();
    }
    
    // Draw text
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('I am not a robot', 40, 25);
  }, [isChecked]);

  React.useEffect(() => {
    if (step === 2) {
      drawCaptcha();
    }
  }, [step, isChecked, drawCaptcha]);

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
          
          {step === 1 ? (
            <>
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
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                </div>
              ) : (
                <button type="submit" style={styles.button}>
                  Continuar
                </button>
              )}
            </>
          ) : (
            <div style={styles.captchaContainer}>
              <canvas
                ref={canvasRef}
                width={200}
                height={40}
                style={styles.canvas}
                onClick={handleCanvasClick}
              />
              {loading && (
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                </div>
              )}
            </div>
          )}
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
  captchaContainer: {
    marginBottom: "1rem",
  },
  canvas: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40px",
  },
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Login;
