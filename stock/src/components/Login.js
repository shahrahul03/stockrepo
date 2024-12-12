import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For error messages
  const [success, setSuccess] = useState(""); // For success messages

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before making request
    setSuccess(""); // Reset success message before making request

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/home";
      }, 1500); // Wait before redirecting
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login failed", err);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.registerSection}>
          <p style={styles.registerText}>Don't have an account?</p>
          <Link to="/register" style={styles.link}>
            <button style={styles.button}>Register Here</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "1rem",
    fontSize: "24px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#28a745", // Green color for button
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "#e74c3c", // Red for error
    fontSize: "14px",
  },
  success: {
    color: "#2ecc71", // Green for success
    fontSize: "14px",
  },
  registerSection: {
    marginTop: "10px", // Keeps it directly below the login button
    textAlign: "center",
  },
  registerText: {
    marginBottom: "8px", // Small space between the text and button
  },
  link: {
    textDecoration: "none",
  },
};

export default Login;
