import axios from "axios";
import { config } from "../data/config";
import { useState, useEffect } from "react";
import Sidebar from "../component/sidebardashboard";
import ModalKurikulum from "../component/tambahdatakurikulum";
import "../css/kurikulumdata.css";
import "../css/sidebar.css";

export default function KurikulumData() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("pl");
  const [search, setSearch] = useState("");

  const [dataPL, setDataPL] = useState([]);
  const [dataCPL, setDataCPL] = useState([]);
  const [dataIndikator, setDataIndikator] = useState([]);
  const [dataBK, setDataBK] = useState([]);
  const [dataMK, setDataMK] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("tambah");

  /* ======================
     FILTER
  ====================== */
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

  /* ======================
     FETCH DATA
  ====================== */
  useEffect(() => {
    fetchData();
    setSearch("");
  }, [activeTab]);

  const fetchData = async () => {
    try {
      let endpoint = "";

      if (activeTab === "pl") endpoint = "/pl";
      if (activeTab === "cpl") endpoint = "/cpl";
      if (activeTab === "indikator") endpoint = "/indikator-cpl";
      if (activeTab === "bk") endpoint = "/bahan-kajian";
      if (activeTab === "mk") endpoint = "/mata-kuliah";

      const res = await axios.get(`${config.BACKEND_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (activeTab === "pl") setDataPL(res.data || []);
      if (activeTab === "cpl") setDataCPL(res.data || []);
      if (activeTab === "indikator") setDataIndikator(res.data || []);
      if (activeTab === "bk") setDataBK(res.data || []);
      if (activeTab === "mk") setDataMK(res.data || []);
    } catch (err) {
      console.error("Gagal fetch data kurikulum:", err);
    }
  };

  /* ======================
     DOWNLOAD TEMPLATE
  ====================== */
  const downloadTemplate = (type) => {
    let headers = [];
    let filename = "";

    switch (type) {
        case "pl":
        headers = ["Kode_Profil", "Deskripsi_Profil"];
        filename = "template_pl.csv";
        break;

        case "cpl":
        headers = ["Kode_CPL", "Deskripsi_CPL"];
        filename = "template_cpl.csv";
        break;

        case "indikator":
        headers = [
            "Kode_CPL_Indikator",
            "Deskripsi_CPL_Indikator",
            "Bobot(%)",
            "Kode_CPL",
        ];
        filename = "template_indikator_cpl.csv";
        break;

        case "bk":
        headers = ["Kode_BK", "Nama_BK", "Deskripsi_BK"];
        filename = "template_bahan_kajian.csv";
        break;

        case "mk":
        headers = ["Kode_MK", "Nama_MK", "Deskripsi_MK", "Jenis_MK"];
        filename = "template_mata_kuliah.csv";
        break;

        default:
        return;
    }

    // 🔑 PENTING: join dengan koma
    const csvContent = headers.map(h => `"${h}"`).join(";") + "\n";

    

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    };


  /* ======================
     RENDER TABLE
  ====================== */
  const renderTable = () => {
    const tableProps = {
      search,
      setSearch,
      onAdd: (mode) => {
        setModalMode(mode);
        setShowModal(true);
      },
      onDownload: () => downloadTemplate(activeTab),
    };

    switch (activeTab) {
      case "pl":
        return (
          <DataTable
            title="Profil Lulusan (PL)"
            headers={["Kode PL", "Deskripsi", "Prodi", "Action"]}
            rows={filterData(dataPL).map((d) => [
              d.kode_pl,
              d.deskripsi,
              d.prodi,
            ])}
            {...tableProps}
          />
        );

      case "cpl":
        return (
          <DataTable
            title="CPL Prodi"
            headers={["Kode CPL", "Deskripsi", "Prodi", "Action"]}
            rows={filterData(dataCPL).map((d) => [
              d.kode_cpl,
              d.deskripsi,
              d.prodi,
            ])}
            {...tableProps}
          />
        );

      case "indikator":
        return (
          <DataTable
            title="Indikator CPL"
            headers={["CPL", "Indikator", "Bobot", "Action"]}
            rows={filterData(dataIndikator).map((d) => [
              d.kode_cpl,
              d.indikator,
              d.bobot,
            ])}
            {...tableProps}
          />
        );

      case "bk":
        return (
          <DataTable
            title="Bahan Kajian (BK)"
            headers={["Kode", "Bahan Kajian", "Deskripsi", "Prodi", "Action"]}
            rows={filterData(dataBK).map((d) => [
              d.kode_bk,
              d.bahan_kajian,
              d.deskripsi,
              d.prodi,
            ])}
            {...tableProps}
          />
        );

      case "mk":
        return (
          <DataTable
            title="Mata Kuliah (MK)"
            headers={["Kode", "Mata Kuliah", "Deskripsi", "Action"]}
            rows={filterData(dataMK).map((d) => [
              d.kode_mk,
              d.nama_mk,
              d.deskripsi,
            ])}
            {...tableProps}
          />
        );

      default:
        return null;
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
          <h2>Kurikulum › Data</h2>
          <p>Kelola data kurikulum berdasarkan prodi dan tahun aktif</p>
        </div>
      </header>

      <main
        className={`dashboard-main ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="data-master-card">
          <div className="tab-nav">
            {["pl", "cpl", "indikator", "bk", "mk"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {renderTable()}
        </div>
      </main>

      {showModal && (
        <ModalKurikulum
          type={activeTab}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}

/* =======================
   DATA TABLE
======================= */
function DataTable({
  title,
  headers,
  rows,
  search,
  setSearch,
  onAdd,
  onDownload,
}) {
  return (
    <>
      <div className="table-header">
        <h3>{title}</h3>

        <div className="table-controls">
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="add-btn" onClick={() => onAdd("tambah")}>
            Tambah
          </button>
          <button className="import-btn" onClick={() => onAdd("import")}>
            Import
          </button>
          <button className="download-btn" onClick={onDownload}>
            Download Template
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="no-data">
                Tidak ada data
              </td>
            </tr>
          ) : (
            rows.map((cols, i) => (
              <tr key={i}>
                {cols.map((v, j) => (
                  <td key={j}>{v}</td>
                ))}
                <td>
                  <button className="edit-btn">EDIT</button>
                  <button className="delete-btn">DELETE</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
