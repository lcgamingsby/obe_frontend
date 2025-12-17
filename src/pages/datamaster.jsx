import axios from "axios";
import { config } from "../data/config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/sidebardashboard";
import DataMasterModal from "../component/tambahdatamaster";
import "../css/datamaster.css";
import "../css/sidebar.css";

export default function DataMaster() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("fakultas");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // tambah | edit
  const [selectedData, setSelectedData] = useState([]);
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
    setSelectedData(null);
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

  const handleDelete = async (row) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      let endpoint = "";
      let key = "";

      if (activeTab === "fakultas") {
        endpoint = "/fakultas";
        key = row.id;
      }
      if (activeTab === "prodi") {
        endpoint = "/prodi";
        key = row.id;
      }
      if (activeTab === "dosen") {
        endpoint = "/dosen";
        key = row.nip;
      }
      if (activeTab === "kaprodi") {
        endpoint = "/kaprodi";
        key = row.nip_nik;
      }
      //console.log("ROW KAPRODI:", row);
      //console.log("DELETE KAPRODI ID:", row.id);
      //console.log("DELETE KAPRODI NIP:", row.nip_nik);


      await axios.delete(`${config.BACKEND_URL}${endpoint}/${key}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Data berhasil dihapus!");
      fetchData();
    } catch (err) {
      console.error(err);
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
            rows={filteredFakultas.map((d) => ({
              view: [d.id, d.fakultas, d.universitas],
              raw: d,
            }))}
            searchPlaceholder="Cari Fakultas..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => {
              setModalMode("tambah");
              setSelectedData(null);
              setShowModal(true);
            }}
            onEdit={(row) => {
              setModalMode("edit");
              setSelectedData(row);
              setShowModal(true);
            }}
            onDelete={(row) => handleDelete(row)}
          />

        );

      case "prodi":
        return (
          <DataTable
            title="Data Program Studi"
            headers={["ID", "Prodi", "Fakultas", "Universitas", "Action"]}
            rows={filteredProdi.map((d) => ({
              view: [d.id, d.prodi, d.fakultas, d.universitas],
              raw: d,
            }))}
            searchPlaceholder="Cari prodi..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => {
              setModalMode("tambah");
              setSelectedData(null);
              setShowModal(true);
            }}
            onEdit={(row) => {
              setModalMode("edit");
              setSelectedData(row);
              setShowModal(true);
            }}
            onDelete={(row) => handleDelete(row)}
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
              "Prodi",
              "Action",
            ]}
            rows={filteredDosen.map((d) => ({
              view: [
                d.nip,
                d.nama,
                d.nidn,
                d.email,
                d.prodi,
              ],
              raw: d,
            }))}

            searchPlaceholder="Cari dosen..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => {
              setModalMode("tambah");
              setSelectedData(null);
              setShowModal(true);
            }}
            onEdit={(row) => {
              setModalMode("edit");
              setSelectedData(row);
              setShowModal(true);
            }}
            onDelete={(row) => handleDelete(row)}
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
            rows={filteredKaprodi.map((d) => ({
              view: [
                d.fakultas,
                d.prodi,
                d.tahun,
                d.nama_kaprodi,
                d.nip_nik,
              ],
              raw: d,
            }))}

            searchPlaceholder="Cari kaprodi..."
            searchValue={search}
            onSearch={setSearch}
            onAdd={() => {
              setModalMode("tambah");
              setSelectedData(null);
              setShowModal(true);
            }}
            onEdit={(row) => {
              setModalMode("edit");
              setSelectedData(row);
              setShowModal(true);
            }}
            onDelete={(row) => handleDelete(row)}
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
        <DataMasterModal
          entity={activeTab}        // fakultas | prodi | dosen | kaprodi
          mode={modalMode}          // tambah | edit
          initialData={selectedData}
          onClose={() => setShowModal(false)}
          onSuccess={handleAddData}
        />
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
  onEdit,
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
            rows.map((row, i) => (
              <tr key={i}>
                {row.view.map((v, j) => <td key={j}>{v}</td>)}
                <td>
                  <button className="edit-btn" onClick={() => onEdit(row.raw)}>
                    EDIT
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(row.raw)}>
                    DELETE
                  </button>
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
