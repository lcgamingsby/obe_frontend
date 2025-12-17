import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../data/config";
import "../main.css";
import "../css/register.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
        nama: "",
        email: "",
        hakAkses: "",
        universitas: "",
        fakultas: "",
        password: "",
        password2: "",
    });

    const [listUniversitas, setListUniversitas] = useState([]);
    const [listFakultas, setListFakultas] = useState([]);

    useEffect(() => {
    fetchFakultas();
    }, []);

    const fetchFakultas = async () => {
    try {
            const res = await fetch(`${config.BACKEND_URL}/public/fakultas`);

            if (!res.ok) {
            setListFakultas([]);
            setListUniversitas([]);
            return;
            }

            const data = await res.json();
            const fakultasData = Array.isArray(data) ? data : [];

            setListFakultas(fakultasData);

            // 🔥 AMBIL UNIVERSITAS UNIK
            const universitasUnik = [
            ...new Set(fakultasData.map((f) => f.universitas))
            ];

            setListUniversitas(universitasUnik);

        } catch (err) {
            console.error("Fetch fakultas error:", err);
            setListFakultas([]);
            setListUniversitas([]);
        }
    };



    const fakultasFiltered = listFakultas.filter(
        (f) => f.universitas === form.universitas
    );



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      alert("Password tidak sama");
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nama: form.nama,
            email: form.email,
            hakAkses: form.hakAkses,
            universitas: form.universitas,
            fakultas: form.fakultas,
            status: "Nonaktif",
            password: form.password,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal mendaftar");
        return;
      }

      alert("Akun berhasil dibuat, silakan login");
      navigate("/");

    } catch (err) {
      alert("Gagal terhubung ke server");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Daftar Akun</h2>

        <form onSubmit={handleRegister}>
          <label>Nama Lengkap</label>
          <input name="nama" onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />

          <label>Sebagai</label>
          <select name="hakAkses" onChange={handleChange} required>
            <option value="">-- Pilih --</option>
            <option value="Admin">Dosen</option>
            <option value="Fakultas">Operator Fakultas</option>
            <option value="Prodi">Operator Prodi</option>
          </select>

          <label>Universitas</label>
            <select name="universitas" onChange={handleChange} required>
            <option value="">-- Pilih Universitas --</option>
            {listUniversitas.map((u, i) => (
                <option key={i} value={u}>{u}</option>
            ))}
            </select>

            <label>Fakultas</label>
            <select name="fakultas" onChange={handleChange} required>
            <option value="">-- Pilih Fakultas --</option>
            {fakultasFiltered.map((f) => (
                <option key={f.id} value={f.fakultas}>
                {f.fakultas}
                </option>
            ))}
            </select>


          <label>Password</label>
          <input type="password" name="password" onChange={handleChange} required />

          <label>Password (ulang)</label>
          <input type="password" name="password2" onChange={handleChange} required />

          <button type="submit" className="btn-primary">
            Daftar
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Kembali ke Login
          </button>
        </form>
      </div>
    </div>
  );
}
