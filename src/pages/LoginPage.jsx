import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../main.css";
import { config } from "../data/config";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${config.BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Backend bisa kirim text, jadi kita parse aman
      const text = await response.text();

      let data = null;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn("JSON parse error:", err);
      }

      if (!response.ok) {
        alert(data?.message || "Email atau password salah!");
        setLoading(false);
        return;
      }

      // Simpan token dari backend
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      alert(data?.message || "Login berhasil");
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      alert("Tidak dapat terhubung ke server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">OB</div>
          <div>
            <h3 className="brand-title">OBE System</h3>
            <p className="brand-subtitle">Outcome-Based Education Platform</p>
          </div>
        </div>

        <h1 className="welcome-title">Selamat datang di OBE System</h1>
        <p className="welcome-text">
          Masuk untuk mengelola capaian pembelajaran, matriks kurikulum, dan laporan.
          Masukkan Gmail dan kata sandi Anda untuk melanjutkan.
        </p>

        <div className="feature-boxes">
          <div className="feature-box analytics">Analytics</div>
          <div className="feature-box curriculum">Curriculum</div>
          <div className="feature-box reports">Reports</div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Masuk ke OBE System</h2>

          <form onSubmit={handleLogin}>
            <label>Gmail</label>
            <input
              type="email"
              placeholder="nama@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Kata sandi</label>
            <input
              type="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="remember-row">
              <label>
                <input type="checkbox" /> Ingat saya
              </label>
              <a href="#">Lupa kata sandi?</a>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Memproses..." : "Masuk"}
            </button>
            <p className="register-link">
              Belum punya akun?{" "}
              <span onClick={() => navigate("/register")}>
                Daftar di sini
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
