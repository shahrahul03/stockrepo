import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Unauthorized", err);
        window.location.href = "/login";
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Inline styles
  const styles = {
    profileContainer: {
      maxWidth: "600px",
      margin: "50px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Arial', sans-serif",
    },
    profileHeader: {
      fontSize: "2rem",
      marginBottom: "20px",
      textAlign: "center",
      color: "#333",
    },
    profileInfo: {
      marginBottom: "20px",
      fontSize: "1.1rem",
    },
    profileItem: {
      margin: "10px 0",
      color: "#555",
    },
    logoutBtn: {
      padding: "10px 20px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
      width: "100%",
    },
    logoutBtnHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    user && (
      <div style={styles.profileContainer}>
        <h2 style={styles.profileHeader}>Profile</h2>
        <div style={styles.profileInfo}>
          <p style={styles.profileItem}>
            <strong>Username:</strong> {user.username}
          </p>
          <p style={styles.profileItem}>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <button
          style={styles.logoutBtn}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor =
              styles.logoutBtnHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.logoutBtn.backgroundColor)
          }
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    )
  );
};

export default Profile;
