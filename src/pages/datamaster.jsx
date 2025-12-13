import axios from "axios";
import { config } from "../data/config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/sidebardashboard";
import TambahFakultasModal from "./tambahdatafakultas";
import TambahProdiModal from "./tambahdataprodi";
import TambahDosenModal from "./tambahdatadosen";
import TambahDataKaprodi from "./tambahdatakaprodi";
import "../css/datamaster.css";
import "../css/sidebar.css";

export default function DataMaster() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("fakultas");
  const [showModal, setShowModal] = useState(false);

  const [dataFakultas, setDataFakultas] = useState([]);
  const [dataProdi, setDataProdi] = useState([]);
  const [dataDosen, setDataDosen] = useState([]);
  const [dataKaprodi, setDataKaprodi] = useState([]);
  const [search, setSearch] = useState("");


  const filterData = (data) => {
    if (!search) return data;

    return data.filter((item) =>
      Object.values(item).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  };
  const filteredKaprodi = filterData(dataKaprodi);
  const filteredProdi = filterData(dataProdi);
  const filteredDosen = filterData(dataDosen);
  const filteredFakultas = filterData(dataFakultas);

  const handleAddData = async () => {
    setShowModal(false);
    fetchData();
  };
  
  useEffect(() => {
    fetchData();
    setSearch("");
  }, [activeTab]);


  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      let endpoint = "";

      if (activeTab === "fakultas") endpoint = "/fakultas";
      if (activeTab === "prodi") endpoint = "/prodi";
      if (activeTab === "dosen") endpoint = "/dosen";
      if (activeTab === "kaprodi") endpoint = "/kaprodi";

      const res = await axios.get(`${config.BACKEND_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

    if (activeTab === "fakultas") setDataFakultas(Array.isArray(res.data) ? res.data : []);
    if (activeTab === "prodi") setDataProdi(Array.isArray(res.data) ? res.data : []);
    if (activeTab === "dosen") setDataDosen(Array.isArray(res.data) ? res.data : []);
    if (activeTab === "kaprodi") setDataKaprodi(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      let endpoint = "";
      let id = "";

      if (activeTab === "fakultas") {
        id = dataFakultas[index].id;
        endpoint = "/fakultas";
      }

      if (activeTab === "prodi") {
        id = dataProdi[index].id;
        endpoint = "/prodi";
      }

      if (activeTab === "dosen") {
        id = dataDosen[index].id;
        endpoint = "/dosen";
      }

      if (activeTab === "kaprodi") {
        id = dataKaprodi[index].id;
        endpoint = "/kaprodi";
      }

      await axios.delete(`${config.BACKEND_URL}${endpoint}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Data berhasil dihapus!");
      fetchData();

    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus data");
    }
  };

  const renderTable = () => {
    switch (activeTab) {
      case "fakultas":
        return (
          <DataTable
            title="Data Fakultas"
            headers={["ID", "Fakultas", "Universitas", "Action"]}
            rows={filteredFakultas.map((d) => [d.id, d.fakultas, d.universitas])}
            searchPlaceholder="Cari Fakultas..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => setShowModal(true)}
            onDelete={handleDelete}
          />
        );

      case "prodi":
        return (
          <DataTable
            title="Data Program Studi"
            headers={["ID", "Prodi", "Fakultas", "Universitas", "Action"]}
            rows={filteredProdi.map((d) => [
              d.id,
              d.prodi,
              d.fakultas,
              d.universitas,
            ])}
            searchPlaceholder="Cari prodi..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => setShowModal(true)}
            onDelete={handleDelete}
          />
        );

      case "dosen":
        return (
          <DataTable
            title="Data Dosen"
            headers={[
              "NIP/NIK",
              "Nama Dosen",
              "NIDN",
              "Email",
              "Action",
            ]}
            rows={filteredDosen.map((d) => [
              d.nip,
              d.nama,
              d.nidn,
              d.email,
            ])}
            searchPlaceholder="Cari dosen..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => setShowModal(true)}
            onDelete={handleDelete}
          />
        );

      case "kaprodi":
        return (
          
          <DataTable
            title="Data Kaprodi"
            headers={[
              "Fakultas",
              "Prodi",
              "Tahun",
              "Nama Kaprodi",
              "NIP",
              "Action",
            ]}
            rows={filteredKaprodi.map((d) => [
              d.fakultas,
              d.prodi,
              d.tahun,
              d.nama_kaprodi,
              d.nip_nik,
            ])}
            searchPlaceholder="Cari kaprodi..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => setShowModal(true)}
            onDelete={handleDelete}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <header className={`dashboard-header ${sidebarOpen ? "open" : "closed"}`}>
        <div>
          <h2>Pengaturan › Data Master</h2>
          <p>Kelola data dasar fakultas, prodi, dosen, dan kaprodi</p>
        </div>
        <button className="logout-btn" onClick={() => navigate("/")}>
          Keluar
        </button>
      </header>

      <main className={`dashboard-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="data-master-card">
          <div className="tab-nav">
            {["fakultas", "prodi", "dosen", "kaprodi"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {renderTable()}
        </div>
      </main>

      {showModal && (
        <>
          {activeTab === "fakultas" && (
            <TambahFakultasModal onClose={() => setShowModal(false)} onSuccess={handleAddData} />
          )}
          {activeTab === "prodi" && (
            <TambahProdiModal onClose={() => setShowModal(false)} onSuccess={handleAddData} />
          )}
          {activeTab === "dosen" && (
            <TambahDosenModal onClose={() => setShowModal(false)} onSuccess={handleAddData} />
          )}
          {activeTab === "kaprodi" && (
            <TambahDataKaprodi onClose={() => setShowModal(false)} onSuccess={handleAddData} />
          )}
        </>
      )}
    </div>
  );
}


// TABEL
function DataTable({ title,
  headers,
  rows,
  searchPlaceholder,
  searchValue,
  onSearch,
  onAdd,
  onDelete, }) {
  return (
    <>
      <div className="table-header">
        <h3>{title}</h3>
        <div className="table-controls">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />

          <button className="add-btn" onClick={onAdd}>Tambah</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="no-data">Tidak ada data</td></tr>
          ) : (
            rows.map((cols, i) => (
              <tr key={i}>
                {cols.map((v, j) => <td key={j}>{v}</td>)}
                <td>
                  <button className="edit-btn">EDIT</button>
                  <button className="delete-btn" onClick={() => onDelete(i)}>DELETE</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <p>Menampilkan {rows.length} dari {rows.length} entri</p>
        <div>
          <button className="prev-btn">Previous</button>
          <button className="next-btn">Next</button>
        </div>
      </div>
    </>
  );
}
