import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../data/config";
import "../css/tambahdata.css";

export default function ModalKurikulum({
  type,
  mode, // "tambah" | "import"
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [listCPL, setListCPL] = useState([]);

  useEffect(() => {
    if (type === "indikator") {
      fetchCPL();
    }
  }, [type]);

  const fetchCPL = async () => {
    try {
      const res = await axios.get(`${config.BACKEND_URL}/cpl`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setListCPL(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal fetch CPL", err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (mode === "import") {
        const fd = new FormData();
        fd.append("file", file);

        await axios.post(
          `${config.BACKEND_URL}/import/${type}`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          `${config.BACKEND_URL}/${type}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <h3>
            {mode === "tambah" ? "Tambah Data" : "Import Data"}{" "}
            {type.toUpperCase()}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {mode === "import" ? (
            <div className="form-group">
              <label>Upload File</label>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          ) : (
            <>
              {/* ========= PL ========= */}
              {type === "pl" && (
                <>
                  <div className="form-group">
                    <label>Kode PL</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, kode_pl: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Deskripsi</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, deskripsi: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* ========= CPL ========= */}
              {type === "cpl" && (
                <>
                  <div className="form-group">
                    <label>Kode CPL</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, kode_cpl: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Deskripsi</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, deskripsi: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* ========= INDIKATOR CPL ========= */}
              {type === "indikator" && (
                <>
                  <div className="form-group">
                    <label>CPL</label>
                    <select
                      onChange={(e) =>
                        setForm({ ...form, kode_cpl: e.target.value })
                      }
                    >
                      <option value="">-- Pilih CPL --</option>
                      {listCPL.map((c) => (
                        <option key={c.kode_cpl} value={c.kode_cpl}>
                          {c.kode_cpl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Kode Indikator CPL</label>
                    <input
                      onChange={(e) =>
                        setForm({
                          ...form,
                          kode_indikator: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Deskripsi</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, deskripsi: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Bobot (%)</label>
                    <input
                      type="number"
                      onChange={(e) =>
                        setForm({ ...form, bobot: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* ========= BK ========= */}
              {type === "bk" && (
                <>
                  <div className="form-group">
                    <label>Kode Bahan Kajian</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, kode_bk: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Bahan Kajian</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, nama_bk: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Deskripsi</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, deskripsi: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* ========= MK ========= */}
              {type === "mk" && (
                <>
                  <div className="form-group">
                    <label>Kode Mata Kuliah</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, kode_mk: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Nama Mata Kuliah</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, nama_mk: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Deskripsi</label>
                    <input
                      onChange={(e) =>
                        setForm({ ...form, deskripsi: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Jenis Mata Kuliah</label>
                    <select
                      onChange={(e) =>
                        setForm({ ...form, jenis_mk: e.target.value })
                      }
                    >
                      <option value="">-- Pilih Jenis --</option>
                      <option value="Dalam Prodi">Dalam Prodi</option>
                      <option value="Luar Prodi">Luar Prodi</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
