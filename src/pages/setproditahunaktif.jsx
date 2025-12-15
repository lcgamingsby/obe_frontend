import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../data/config";
import Sidebar from "../component/sidebardashboard";
import "../css/datamaster.css";
import "../css/sidebar.css";

export default function SetProdiTahunAktif() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [universitas, setUniversitas] = useState("");
  const [fakultas, setFakultas] = useState("");
  const [prodi, setProdi] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [isConfigured, setIsConfigured] = useState(false);
    const [listUniversitas, setListUniversitas] = useState([]);
    const [allFakultas, setAllFakultas] = useState([]);

  //const [listFakultas, setListFakultas] = useState([]);
  const [listProdi, setListProdi] = useState([]);

  const checkStatus = async () => {
    try {
        const res = await axios.get(
        `${config.BACKEND_URL}/set-prodi-aktif`,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );

        // jika backend mengembalikan data
        if (res.data) {
        setIsConfigured(true);
        setUniversitas(res.data.universitas);
        setFakultas(res.data.fakultas);
        setProdi(res.data.prodi);
        setTahun(res.data.tahun);
        } else {
        setIsConfigured(false);
        }
    } catch (err) {
        setIsConfigured(false);
    }
    };


  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    fetchFakultas();
    checkStatus();
  }, []);

  useEffect(() => {
    if (fakultas) {
        fetchProdi();
    } else {
        setListProdi([]);
        setProdi("");
    }
    }, [fakultas]);


  const fetchFakultas = async () => {
    try {
        const res = await axios.get(`${config.BACKEND_URL}/fakultas`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        });

        setAllFakultas(res.data);

        // ambil universitas unik
        const uniqUniversitas = [
        ...new Set(res.data.map((f) => f.universitas)),
        ];

        setListUniversitas(uniqUniversitas);
        } catch (err) {
            console.error("Gagal fetch fakultas", err);
        }
    };

    const filteredFakultas = allFakultas.filter(
    (f) => f.universitas === universitas
    );



  const fetchProdi = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/prodi`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const filtered = res.data.filter((p) => p.fakultas === fakultas);
      setListProdi(filtered);
    } catch (err) {
      console.error("Gagal fetch prodi", err);
    }
  };

  

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async () => {
    if (!universitas || !fakultas || !prodi || !tahun) {
        setIsConfigured(true);
        alert("Lengkapi semua data!");
      return;
    }

    try {
      await axios.post(
        `${config.BACKEND_URL}/set-prodi-aktif`,
        {
          universitas,
          fakultas,
          prodi,
          tahun,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Prodi dan tahun aktif berhasil disimpan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };


  return (
    <div className="dashboard">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <header className={`dashboard-header ${sidebarOpen ? "open" : "closed"}`}>
        <div>
          <h2>Pengaturan › Set Prodi dan Tahun Aktif</h2>
          <p>Tentukan prodi dan tahun yang akan dikelola</p>
        </div>
        <button className="logout-btn" onClick={() => navigate("/")}>
          Keluar
        </button>
      </header>

      <main
        className={`dashboard-main ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {!isConfigured && (
        <div className="alert-danger">
            <strong>⚠ Prodi yang akan dilihat atau dikelola</strong>
            <p>
            Saat ini prodi dan tahun yang akan dikelola belum di-set,
            silakan set prodi terlebih dahulu!
            </p>
        </div>
        )}
        <div className="data-master-card">
          <div className="form-container">

            {/* UNIVERSITAS */}
            <div className="form-group">
            <label>Universitas</label>
            <select
                value={universitas}
                onChange={(e) => {
                setUniversitas(e.target.value);
                setFakultas("");
                setProdi("");
                }}
            >
                <option value="">-- Pilih Universitas --</option>
                {listUniversitas.map((u, i) => (
                <option key={i} value={u}>
                    {u}
                </option>
                ))}
            </select>
            </div>

            {/* FAKULTAS */}
            <div className="form-group">
            <label>Fakultas</label>
            <select
                value={fakultas}
                onChange={(e) => setFakultas(e.target.value)}
                disabled={!universitas}
            >
                <option value="">-- Pilih Fakultas --</option>
                {filteredFakultas.map((f) => (
                <option key={f.id} value={f.fakultas}>
                    {f.fakultas}
                </option>
                ))}
            </select>
            </div>

            {/* PRODI */}
            <div className="form-group">
              <label>Program Studi</label>
              <select
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
              >
                <option value="">-- Pilih Prodi --</option>
                {listProdi.map((p) => (
                  <option key={p.id} value={p.prodi}>
                    {p.prodi}
                  </option>
                ))}
              </select>
            </div>

            {/* TAHUN */}
            <div className="form-group">
              <label>Tahun Kurikulum</label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              />
            </div>

            <div className="form-buttons">
              <button className="save-btn" onClick={handleSubmit}>
                Set Prodi dan Tahun Aktif
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
