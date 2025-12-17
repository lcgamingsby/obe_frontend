import "../css/tambahdata.css";
import { useEffect, useState } from "react";
import { config } from "../data/config";

export default function TambahPenggunaModal({ onClose, onSuccess }) {
  const [prodiList, setProdiList] = useState([]);

  const [form, setForm] = useState({
    id: "",
    nama: "",
    email: "",
    password: "",
    prodi: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    const fetchProdi = async () => {
      try {
        const res = await fetch(`${config.BACKEND_URL}/prodi`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const text = await res.text();
        let data = [];
        try {
          data = JSON.parse(text);
        } catch {}

        setProdiList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProdi();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.id || !form.nama || !form.email || !form.password) {
      alert("Harap isi semua field wajib!");
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_URL}/pengguna`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const txt = await res.text();
      let data = null;
      try {
        data = JSON.parse(txt);
      } catch {}

      if (!res.ok) {
        alert(data?.message || "Gagal menambahkan akun!");
        return;
      }

      alert(data?.message || "Akun berhasil ditambahkan.");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      alert("Kesalahan koneksi ke server!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tambah Akun Pengguna</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          <div className="form-group">
            <label>ID</label>
            <input name="id" value={form.id} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Nama</label>
            <input name="nama" value={form.nama} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Prodi</label>
            <select name="prodi" value={form.prodi} onChange={handleChange}>
              <option value="">-- pilih prodi --</option>
              {prodiList.map((p) => (
                <option key={p.id} value={p.prodi}>
                  {p.prodi}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="">-- pilih role --</option>
              <option value="admin">admin</option>
              <option value="kaprodi">kaprodi</option>
              <option value="dosen">dosen</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="">-- pilih status --</option>
              <option value="aktif">aktif</option>
              <option value="nonaktif">nonaktif</option>
            </select>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSubmit}>Simpan</button>
          <button className="btn-cancel" onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  );
}
