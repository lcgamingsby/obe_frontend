import { useState, useEffect } from "react";
import { config } from "../data/config";
import "../css/tambahdata.css";

export default function TambahProdiModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    id: "",
    prodi: "",
    fakultas: "",
    universitas: "",
  });

  const [listFakultas, setListFakultas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${config.BACKEND_URL}/fakultas`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setListFakultas(data))
      .catch(() => alert("Gagal memuat fakultas"));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/prodi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        alert(data?.message || "Gagal menambah data");
        return;
      }

      alert("Prodi berhasil ditambahkan");
      onSuccess?.();
      onClose?.();

    } catch {
      alert("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Tambah Data Program Studi</h2>

        <form onSubmit={handleSubmit} className="form-container">

          <div className="form-group">
            <label>ID</label>
            <input name="id" value={formData.id} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nama Prodi</label>
            <input name="prodi" value={formData.prodi} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Fakultas</label>
            <select
              name="fakultas"
              value={formData.fakultas}
              onChange={(e) => {
                const selected = listFakultas.find(f => f.fakultas === e.target.value);
                setFormData({
                  ...formData,
                  fakultas: selected.fakultas,
                  universitas: selected.universitas,
                });
              }}
              required
            >
              <option value="">-- Pilih Fakultas --</option>
              {listFakultas.map((f) => (
                <option key={f.id} value={f.fakultas}>{f.fakultas}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Universitas</label>
            <input name="universitas" value={formData.universitas} readOnly required />
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>Batal</button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
