import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/sidebardashboard";
import "../css/maindashboard.css";
import "../css/sidebar.css";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <header
        className="dashboard-header"
        style={{
          marginLeft: sidebarOpen ? "230px" : "70px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <h1 style={{ color: "#0369a1" }}>OBE System Dashboard</h1>
        <button
          className="logout-btn"
          style={{
            backgroundColor: "#ef4444",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Keluar
        </button>
      </header>

      <main
        className={`dashboard-content ${
          sidebarOpen ? "with-sidebar" : "sidebar-closed"
        }`}
      >
        <div
          className="info-card"
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "20px",
            maxWidth: "800px",
            margin: "50px auto",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            borderLeft: "5px solid red",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Selamat Datang pada OBE System</h2>
          <p>Silakan pilih menu di sebelah kiri untuk mengelola data OBE</p>
        </div>
      </main>
    </div>
  );
}
