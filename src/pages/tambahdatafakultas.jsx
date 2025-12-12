import "../css/tambahdata.css";
import { useState } from "react";
import { config } from "../data/config";

export default function TambahFakultasModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    id: "",
    fakultas: "",
    universitas: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.id || !formData.fakultas || !formData.universitas) {
      alert("Harap isi semua field!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.BACKEND_URL}/fakultas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch (e) {}

      if (!response.ok) {
        alert(data?.message || "Gagal menyimpan data!");
        return;
      }

      alert(data?.message || "Fakultas berhasil ditambahkan!");

      onSuccess?.();
      onClose?.();

    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tambah Data Fakultas</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Kode Fakultas</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nama Fakultas</label>
            <input
              type="text"
              name="fakultas"
              value={formData.fakultas}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Universitas</label>
            <input
              type="text"
              name="universitas"
              value={formData.universitas}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
