import { useState, useEffect } from "react";
import Sidebar from "../component/sidebardashboard";
import { useNavigate } from "react-router-dom";
import { config } from "../data/config";
import "../css/daftarpengguna.css";
import "../css/sidebar.css";
import "../main.css";
import "../css/tambahdata.css";

export default function DaftarPengguna() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    email: "",
    nama: "",
    hakAkses: "",
    prodi: "",
    status: "Aktif",
    password: "",
  });

  const navigate = useNavigate();

  // ======================================================
  // FETCH USERS
  // ======================================================
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${config.BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Gagal memuat pengguna:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ======================================================
  // HANDLE FORM INPUT
  // ======================================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ======================================================
  // OPEN ADD MODAL
  // ======================================================
  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      id: "",
      email: "",
      nama: "",
      hakAkses: "",
      prodi: "",
      status: "Aktif",
      password: "",
    });
    setShowModal(true);
  };

  // ======================================================
  // OPEN EDIT MODAL
  // ======================================================
  const openEditModal = (user) => {
    setIsEdit(true);
    setFormData({
      id: user.id,
      email: user.email,
      nama: user.nama,
      hakAkses: user.hakAkses,
      prodi: user.prodi,
      status: user.status,
      password: "", // password kosong, user isi kalau mau ganti
    });
    setShowModal(true);
  };

  // ======================================================
  // SUBMIT FORM
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = `${config.BACKEND_URL}/users`;
      let method = "POST";

      let payload = { ...formData };

      // Kalau EDIT & password kosong → jangan kirim password
      if (isEdit && formData.password === "") {
        delete payload.password;
      }

      if (isEdit) {
        url = `${config.BACKEND_URL}/users/${formData.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = null;

      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        alert(data?.message || "Gagal menyimpan data");
        return;
      }

      alert(isEdit ? "Pengguna berhasil diperbarui!" : "Pengguna berhasil ditambahkan!");
      setShowModal(false);
      fetchUsers();

    } catch (err) {
      console.error("Error submit:", err);
      alert("Gagal terhubung ke server");
    }
  };

  // ======================================================
  // DELETE USER
  // ======================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengguna ini?")) return;

    try {
      const res = await fetch(`${config.BACKEND_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) {
        alert("Gagal menghapus pengguna");
        return;
      }

      alert("Pengguna berhasil dihapus!");
      fetchUsers();

    } catch (err) {
      console.error("Delete Error:", err);
      alert("Gagal menghubungi server");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* HEADER */}
      <header className={`dashboard-header ${sidebarOpen ? "open" : "closed"}`}>
        <div>
          <h2>Pengaturan › Pengguna</h2>
          <p>Daftar registrasi pengguna terdaftar di sistem</p>
        </div>
        <button className="logout-btn" onClick={() => navigate("/")}>
          Keluar
        </button>
      </header>

      {/* MAIN */}
      <main
        className={`dashboard-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <div className="user-table-card">
          <div className="user-table-header">
            <h3>Daftar Registrasi Pengguna</h3>

            <div className="header-actions">
              <input type="text" placeholder="Cari pengguna..." />
              <button className="tambah-btn-green" onClick={openAddModal}>
                + Tambah
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nama Lengkap</th>
                  <th>Hak Akses</th>
                  <th>Prodi</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      Tidak ada data pengguna
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.nama}</td>
                      <td>{u.hakAkses}</td>
                      <td>{u.prodi}</td>
                      <td>{u.status}</td>

                      <td className="action-buttons">
                        <button className="detail-btn" onClick={() => openEditModal(u)}>
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(u.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <p>
              Menampilkan {users.length} dari {users.length} entri
            </p>
            <div>
              <button className="prev-btn">Previous</button>
              <button className="next-btn">Next</button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>{isEdit ? "Edit Pengguna" : "Tambah Pengguna"}</h2>

            <form onSubmit={handleSubmit} className="form-container">

              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email"
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Nama Lengkap</label>
                <input type="text" name="nama"
                  value={formData.nama} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Hak Akses</label>
                <select name="hakAkses" value={formData.hakAkses} onChange={handleChange} required>
                  <option value="">-- Pilih Hak Akses --</option>
                  <option value="Admin">Admin</option>
                  <option value="Prodi">Prodi</option>
                  <option value="Fakultas">Fakultas</option>
                </select>
              </div>

              <div className="form-group">
                <label>Program Studi</label>
                <input type="text" name="prodi"
                  value={formData.prodi} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEdit}
                  placeholder={isEdit ? "Kosongkan jika tidak ingin mengganti" : ""}
                />
              </div>

              <div className="form-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Batal
                </button>

                <button type="submit" className="save-btn">
                  {isEdit ? "Update" : "Simpan"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
