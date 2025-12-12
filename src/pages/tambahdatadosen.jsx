import { useState } from "react";
import { config } from "../data/config";
import "../css/tambahdata.css";

export default function TambahDosenModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    nidn: "",
    email: "",
    universitas: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${config.BACKEND_URL}/dosen`, {
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
        alert(data?.message || "Gagal menambah data dosen");
        return;
      }

      alert("Data dosen berhasil ditambahkan!");

      onSuccess?.(); // refresh tabel di DataMaster
      onClose?.();   // tutup modal

    } catch {
      alert("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Tambah Data Dosen</h2>

        <form onSubmit={handleSubmit} className="form-container">

          <div className="form-group">
            <label>NIP / NIK</label>
            <input name="nip" value={formData.nip} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nama Dosen</label>
            <input name="nama" value={formData.nama} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>NIDN</label>
            <input name="nidn" value={formData.nidn} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Universitas</label>
            <input name="universitas" value={formData.universitas} onChange={handleChange} required />
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
