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

  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("tambah"); // tambah | edit | import
  const [selectedData, setSelectedData] = useState(null);

  /* ======================
     ENDPOINT MAP
  ====================== */
  const endpointMap = {
    pl: "/pl",
    cpl: "/cpl",
    indikator: "/indikator-cpl",
    bk: "/bahan-kajian",
    mk: "/mata-kuliah",
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
      const res = await axios.get(
        `${config.BACKEND_URL}${endpointMap[activeTab]}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal fetch data kurikulum:", err);
      setData([]);
    }
  };

  /* ======================
     FILTER
  ====================== */
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (row) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      let url = "";

      switch (activeTab) {
        case "pl":
          url = `/pl/${row.kode_pl}`;
          break;

        case "cpl":
          url = `/cpl/${row.kode_cpl}`;
          break;

        case "indikator":
          url = `/indikator-cpl/${row.kode_indikator}`;
          break;

        case "bk":
          url = `/bahan-kajian/${row.kode_bk}`;
          break;

        case "mk":
          url = `/mata-kuliah/${row.kode_mk}`;
          break;

        default:
          return;
      }

      await axios.delete(`${config.BACKEND_URL}${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };


  /* ======================
     DOWNLOAD TEMPLATE
  ====================== */
  const downloadTemplate = (type) => {
    const templates = {
      pl: ["Kode_Profil", "Deskripsi_Profil"],
      cpl: ["Kode_CPL", "Deskripsi_CPL"],
      indikator: [
        "Kode_CPL_Indikator",
        "Deskripsi_CPL_Indikator",
        "Bobot(%)",
        "Kode_CPL",
      ],
      bk: ["Kode_BK", "Bahan_Kajian", "Deskripsi_BK"],
      mk: ["Kode_MK", "Nama_MK", "Deskripsi_MK", "Jenis_MK"],
    };

    const csvContent = templates[type].join(";") + "\n";
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `template_${type}.csv`;
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
        setSelectedData(null);
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
            rows={filteredData.map((d) => ({
              view: [d.kode_pl, d.deskripsi, d.prodi],
              raw: d,
            }))}
            onEdit={(row) => {
              setSelectedData(row);
              setModalMode("edit");
              setShowModal(true);
            }}
            onDelete={handleDelete}
            {...tableProps}
          />
        );

      case "cpl":
        return (
          <DataTable
            title="CPL Prodi"
            headers={["Kode CPL", "Deskripsi", "Prodi", "Action"]}
            rows={filteredData.map((d) => ({
              view: [d.kode_cpl, d.deskripsi, d.prodi],
              raw: d,
            }))}
            onEdit={(row) => {
              setSelectedData(row);
              setModalMode("edit");
              setShowModal(true);
            }}
            onDelete={handleDelete}
            {...tableProps}
          />
        );

      case "indikator":
        return (
          <DataTable
            title="Indikator CPL"
            headers={["CPL", "Indikator", "Bobot", "Action"]}
            rows={filteredData.map((d) => ({
              id: d.id,
              view: [
                  <>
                    <strong>{d.kode_cpl}</strong>.{d.deskripsi_cpl}
                  </>,
                  <>
                    <strong>{d.kode_indikator}</strong>.{d.deskripsi}
                  </>,
                d.bobot,
              ],
              raw: d,
            }))}
            onEdit={(row) => {
              setSelectedData(row);
              setModalMode("edit");
              setShowModal(true);
            }}
            onDelete={handleDelete}
            {...tableProps}
          />
        );

      case "bk":
        return (
          <DataTable
            title="Bahan Kajian (BK)"
            headers={["Kode", "Bahan Kajian", "Deskripsi", "Prodi", "Action"]}
            rows={filteredData.map((d) => ({
              view: [d.kode_bk, d.bahan_kajian, d.deskripsi, d.prodi],
              raw: d,
            }))}
            onEdit={(row) => {
              setSelectedData(row);
              setModalMode("edit");
              setShowModal(true);
            }}
            onDelete={handleDelete}
            {...tableProps}
          />
        );

      case "mk":
        return (
          <DataTable
            title="Mata Kuliah (MK)"
            headers={["Kode", "Mata Kuliah", "Deskripsi", "Action"]}
            rows={filteredData.map((d) => ({
              view: [d.kode_mk, d.nama_mk, d.deskripsi],
              raw: d,
            }))}
            onEdit={(row) => {
              setSelectedData(row);
              setModalMode("edit");
              setShowModal(true);
            }}
            onDelete={handleDelete}
            {...tableProps}
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
          <h2>Kurikulum › Data</h2>
          <p>Kelola data kurikulum berdasarkan prodi dan tahun aktif</p>
        </div>
      </header>

      <main className={`dashboard-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
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
          initialData={selectedData}
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
  onEdit,
  onDelete,
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
            rows.map((row, i) => (
              <tr key={i}>
                {row.view.map((v, j) => (
                  <td key={j}>{v}</td>
                ))}
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
    </>
  );
}
