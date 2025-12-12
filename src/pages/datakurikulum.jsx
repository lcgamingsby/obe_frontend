import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/sidebardashboard";
import "../css/datakurikulum.css";

// import modal (aktifkan nanti jika sudah benar path-nya)
import TambahPLModal from "./modal/TambahPLModal";
import TambahCPLModal from "./modal/TambahCPLModal";
import TambahIndikatorCPLModal from "./modal/TambahIndikatorCPLModal";
import TambahBKModal from "./modal/TambahBKModal";
import TambahMKModal from "./modal/TambahMKModal";

export default function KurikulumData() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("pl");
  const [showModal, setShowModal] = useState(false);

  // Dummy data
  const [dataPL, setDataPL] = useState([]);
  const [dataCPL, setDataCPL] = useState([]);
  const [dataIndikator, setDataIndikator] = useState([]);
  const [dataBK, setDataBK] = useState([]);
  const [dataMK, setDataMK] = useState([]);

  const handleAdd = (newItem) => {
    if (activeTab === "pl") setDataPL([...dataPL, newItem]);
    if (activeTab === "cpl") setDataCPL([...dataCPL, newItem]);
    if (activeTab === "indikator") setDataIndikator([...dataIndikator, newItem]);
    if (activeTab === "bk") setDataBK([...dataBK, newItem]);
    if (activeTab === "mk") setDataMK([...dataMK, newItem]);
    setShowModal(false);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    if (activeTab === "pl") setDataPL(dataPL.filter((_, i) => i !== index));
    if (activeTab === "cpl") setDataCPL(dataCPL.filter((_, i) => i !== index));
    if (activeTab === "indikator") setDataIndikator(dataIndikator.filter((_, i) => i !== index));
    if (activeTab === "bk") setDataBK(dataBK.filter((_, i) => i !== index));
    if (activeTab === "mk") setDataMK(dataMK.filter((_, i) => i !== index));
  };

  const getRowsForActiveTab = () => {
    switch (activeTab) {
      case "pl":
        return dataPL.map((d) => [d.kode, d.deskripsi, d.prodi || "-"]);
      case "cpl":
        return dataCPL.map((d) => [d.kode, d.deskripsi, d.prodi || "-"]);
      case "indikator":
        return dataIndikator.map((d) => [d.kode, d.indikator, d.cpl || "-"]);
      case "bk":
        return dataBK.map((d) => [d.kode, d.nama, d.deskripsi]);
      case "mk":
        return dataMK.map((d) => [d.kode, d.nama, d.sks, d.prodi || "-"]);
      default:
        return [];
    }
  };

  const getHeadersForActiveTab = () => {
    switch (activeTab) {
      case "pl":
        return ["Kode PL", "Deskripsi", "Prodi", "Action"];
      case "cpl":
        return ["Kode CPL", "Deskripsi", "Prodi", "Action"];
      case "indikator":
        return ["Kode", "Indikator CPL", "CPL Terkait", "Action"];
      case "bk":
        return ["Kode", "Bahan Kajian", "Deskripsi", "Action"];
      case "mk":
        return ["Kode MK", "Mata Kuliah", "SKS", "Prodi", "Action"];
      default:
        return [];
    }
  };

  return (
    <div className="kurikulum-wrapper">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`kurikulum-container ${sidebarOpen ? "open" : "closed"}`}>
        {/* HEADER ATAS */}
        <header className="kurikulum-header">
          <div>
            <h2>Kurikulum › Data</h2>
            <p>Kelola data kurikulum: profil lulusan, CPL, indikator, bahan kajian, dan mata kuliah</p>
          </div>
          <button className="logout-btn" onClick={() => navigate("/")}>
            Keluar
          </button>
        </header>

        {/* KONTEN DALAM CARD */}
        <div className="kurikulum-content">
          <div className="kurikulum-card">
            {/* TABS */}
            <div className="tab-header">
              <button
                className={`tab-btn ${activeTab === "pl" ? "active" : ""}`}
                onClick={() => setActiveTab("pl")}
              >
                Profil Lulusan (PL)
              </button>
              <button
                className={`tab-btn ${activeTab === "cpl" ? "active" : ""}`}
                onClick={() => setActiveTab("cpl")}
              >
                CPL Prodi
              </button>
              <button
                className={`tab-btn ${activeTab === "indikator" ? "active" : ""}`}
                onClick={() => setActiveTab("indikator")}
              >
                Indikator CPL
              </button>
              <button
                className={`tab-btn ${activeTab === "bk" ? "active" : ""}`}
                onClick={() => setActiveTab("bk")}
              >
                Bahan Kajian (BK)
              </button>
              <button
                className={`tab-btn ${activeTab === "mk" ? "active" : ""}`}
                onClick={() => setActiveTab("mk")}
              >
                Mata Kuliah (MK)
              </button>
            </div>

            {/* TITLE & ACTION */}
            <div className="table-header">
              <h3>
                {activeTab === "pl"
                  ? "Data Profil Lulusan"
                  : activeTab === "cpl"
                  ? "Data CPL Prodi"
                  : activeTab === "indikator"
                  ? "Data Indikator CPL"
                  : activeTab === "bk"
                  ? "Data Bahan Kajian"
                  : "Data Mata Kuliah"}
              </h3>
              <div className="actions">
                <input type="text" placeholder="Cari data..." />
                <button className="btn-green" onClick={() => setShowModal(true)}>
                  + Tambah
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {getHeadersForActiveTab().map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getRowsForActiveTab().length === 0 ? (
                    <tr>
                      <td colSpan={getHeadersForActiveTab().length} className="no-data">
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    getRowsForActiveTab().map((cols, rIdx) => (
                      <tr key={rIdx}>
                        {cols.map((c, cIdx) => (
                          <td key={cIdx}>{c}</td>
                        ))}
                        <td className="action-cell">
                          <button className="btn-blue">Edit</button>
                          <button className="btn-red" onClick={() => handleDelete(rIdx)}>
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="table-footer">
              <p>
                Menampilkan {getRowsForActiveTab().length} dari {getRowsForActiveTab().length} entri
              </p>
              <div>
                <button className="btn-light">Previous</button>
                <button className="btn-light">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {showModal && activeTab === "pl" && (
          <TambahPLModal
            onClose={() => setShowModal(false)}
            onSave={(newItem) => handleAdd(newItem)}
          />
        )}
        {showModal && activeTab === "cpl" && (
          <TambahCPLModal onClose={() => setShowModal(false)} onSave={handleAdd} />
        )}
        {showModal && activeTab === "indikator" && (
          <TambahIndikatorCPLModal
            onClose={() => setShowModal(false)}
            onImport={(data) => {
              console.log("Imported data:", data);
              setDataIndikator((prev) => [...prev, ...data]);
              setShowModal(false);
            }}
          />
        )}
        {showModal && activeTab === "bk" && (
          <TambahBKModal
            onClose={() => setShowModal(false)}
            onSave={(newItem) => setDataBK((prev) => [...prev, newItem])}
            onImport={(data) => setDataBK((prev) => [...prev, ...data])}
          />
        )}
        {showModal && activeTab === "mk" && (
          <TambahMKModal
            onClose={() => setShowModal(false)}
            onSave={(newItem) => setDataMK((prev) => [...prev, newItem])}
            onImport={(data) => setDataMK((prev) => [...prev, ...data])}
          />
        )}
      </div>  
    </div>
  );
}
