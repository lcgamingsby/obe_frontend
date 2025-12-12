import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../data/config";
import "../css/tambahdata.css";

export default function TambahDataKaprodi({ onClose, onSuccess }) {
  const [listProdi, setListProdi] = useState([]);
  const [listDosen, setListDosen] = useState([]);

  const [form, setForm] = useState({
    prodi: "",
    fakultas: "",
    tahun: new Date().getFullYear(),
    nama_kaprodi: "",
    nip_nik: ""
  });

  // =============================
  // FETCH PRODI & DOSEN
  // =============================
  useEffect(() => {
    fetchProdi();
    fetchDosen();
  }, []);

  const fetchProdi = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/prodi`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setListProdi(res.data);
    } catch (err) {
      console.error("Error fetch prodi:", err);
    }
  };

  const fetchDosen = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/dosen`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setListDosen(res.data);
    } catch (err) {
      console.error("Error fetch dosen:", err);
    }
  };

  // =============================
  // HANDLE CHANGE FORM
  // =============================
  const handleSelectProdi = (e) => {
    const id = e.target.value;
    const chosen = listProdi.find((p) => p.id == id);

    if (chosen) {
      setForm({
        ...form,
        prodi: chosen.prodi,
        fakultas: chosen.fakultas
      });
    }
  };

  const handleSelectDosen = (e) => {
    const nip = e.target.value;
    const chosen = listDosen.find((d) => d.nip == nip);

    if (chosen) {
      setForm({
        ...form,
        nama_kaprodi: chosen.nama,
        nip_nik: chosen.nip
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(
        `${config.BACKEND_URL}/kaprodi`,
        form,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
            }
        }
        );

        alert("Data kaprodi berhasil ditambahkan!");
        onSuccess(); // opsional
        onClose();

    } catch (err) {
        console.error("Gagal tambah kaprodi:", err);
        alert("Gagal menambahkan kaprodi!");
    }
    };
    ;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Tambah Data Kaprodi</h2>

        <form onSubmit={handleSubmit} className="form-container">

          {/* PRODI */}
          <div className="form-group">
            <label>Prodi</label>
            <select onChange={handleSelectProdi} required>
              <option value="">-- Pilih Prodi --</option>
              {listProdi.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.prodi}, {p.fakultas}
                </option>
              ))}
            </select>
          </div>

          {/* TAHUN */}
          <div className="form-group">
            <label>Tahun</label>
            <input
              type="number"
              min="2000"
              max="2100"
              value={form.tahun}
              onChange={(e) => setForm({ ...form, tahun: e.target.value })}
              required
            />
          </div>

          {/* NAMA KAPRODI */}
          <div className="form-group">
            <label>Nama Kaprodi</label>
            <select onChange={handleSelectDosen} required>
              <option value="">-- Pilih Dosen --</option>
              {listDosen.map((d) => (
                <option key={d.nip} value={d.nip}>
                  {d.nama} (NIP.{d.nip})
                </option>
              ))}
            </select>
          </div>

          {/* BUTTONS */}
          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="save-btn">
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
