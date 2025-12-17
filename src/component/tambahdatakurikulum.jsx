import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../data/config";
import "../css/tambahdata.css";

/* ======================
   KONFIGURASI TERPUSAT
====================== */

// Endpoint CRUD
const CRUD_ENDPOINT = {
  pl: "pl",
  cpl: "cpl",
  indikator: "indikator-cpl",
  bk: "bahan-kajian",
  mk: "mata-kuliah",
};

// Endpoint IMPORT
const IMPORT_ENDPOINT = {
  pl: "pl",
  cpl: "cpl",
  indikator: "indikator",
  bk: "bk",
  mk: "mk",
};

// Key param (untuk EDIT / DELETE)
const KEY_FIELD = {
  pl: "kode_pl",
  cpl: "kode_cpl",
  indikator: "kode_indikator",
  bk: "kode_bk",
  mk: "kode_mk",
};

export default function ModalKurikulum({
  type,
  mode, // "tambah" | "edit" | "import"
  initialData = null,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [listCPL, setListCPL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ======================
     INIT & RESET STATE
  ====================== */
  useEffect(() => {
    setError("");
    setLoading(false);

    if (mode === "edit" && initialData) {
      if (type === "bk") {
        setForm({
          ...initialData,
          nama_bk: initialData.nama_bk || initialData.bahan_kajian || "",
        });
      } else {
        setForm(initialData);
      }
    }
    else {
      setForm({});
    }
  }, [mode, type, initialData]);

  /* ======================
     FETCH CPL (KHUSUS INDIKATOR)
  ====================== */
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
    } catch {
      setListCPL([]);
    }
  };

  /* ======================
     VALIDATION
  ====================== */
  const validateForm = () => {
    if (mode === "import") {
      if (!file) return "File belum dipilih";
      return null;
    }

    switch (type) {
      case "pl":
        if (!form.kode_pl || !form.deskripsi)
          return "Kode PL dan deskripsi wajib diisi";
        break;

      case "cpl":
        if (!form.kode_cpl || !form.deskripsi)
          return "Kode CPL dan deskripsi wajib diisi";
        break;

      case "indikator":
        if (
          !form.kode_cpl ||
          !form.kode_indikator ||
          !form.deskripsi ||
          form.bobot === undefined
        )
          return "Semua field indikator wajib diisi";
        if (form.bobot < 0 || form.bobot > 100)
          return "Bobot harus 0–100";
        break;

      case "bk":
        if (!form.kode_bk || !form.nama_bk || !form.deskripsi)
          return "Semua field BK wajib diisi";
        break;

      case "mk":
        if (
          !form.kode_mk ||
          !form.nama_mk ||
          !form.deskripsi ||
          !form.jenis_mk
        )
          return "Semua field MK wajib diisi";
        break;

      default:
        break;
    }

    return null;
  };

  /* ======================
     SUBMIT HANDLER (FINAL)
  ====================== */
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      /* ===== IMPORT ===== */
      if (mode === "import") {
        const fd = new FormData();
        fd.append("file", file);

        await axios.post(
          `${config.BACKEND_URL}/import/${IMPORT_ENDPOINT[type]}`,
          fd,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        onSuccess();
        onClose();
        return;
      }

      /* ===== TAMBAH ===== */
      if (mode === "tambah") {
        await axios.post(
          `${config.BACKEND_URL}/${CRUD_ENDPOINT[type]}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        onSuccess();
        onClose();
        return;
      }

      /* ===== EDIT ===== */
      const endpoint = CRUD_ENDPOINT[type];
      const keyField = KEY_FIELD[type];
      const keyValue = form[keyField];
      //console.log("EDIT BK initialData:", initialData);
      //console.log("FORM BK:", form);
      //console.log("UPDATE BK PAYLOAD:", payload);



      if (!keyValue) {
        throw new Error("Key data tidak ditemukan");
      }

      let payload = { ...form };

      // payload minimal khusus indikator
      if (type === "indikator") {
        payload = {
          deskripsi: form.deskripsi,
          bobot: form.bobot,
          kode_cpl: form.kode_cpl,
        };
      }

      // payload minimal & BENAR untuk BK
      if (type === "bk") {
        payload = {
          bahan_kajian: form.nama_bk, // ⬅️ WAJIB
          deskripsi: form.deskripsi,
        };
      }

      await axios.put(
        `${config.BACKEND_URL}/${endpoint}/${keyValue}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Gagal menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <h3>
            {mode === "tambah"
              ? "Tambah"
              : mode === "edit"
              ? "Edit"
              : "Import"}{" "}
            {type.toUpperCase()}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {error && <div className="error-text">{error}</div>}

          {mode === "import" ? (
            <div className="form-group">
              <label>Upload File (CSV / XLSX)</label>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          ) : (
            <>
              {/* ===== PL ===== */}
              {type === "pl" && (
                <>
                  <input
                    placeholder="Kode PL"
                    value={form.kode_pl || ""}
                    disabled={mode === "edit"}
                    onChange={(e) =>
                      setForm({ ...form, kode_pl: e.target.value })
                    }
                  />
                  <input
                    placeholder="Deskripsi"
                    value={form.deskripsi || ""}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                  />
                </>
              )}

              {/* ===== CPL ===== */}
              {type === "cpl" && (
                <>
                  <input
                    placeholder="Kode CPL"
                    value={form.kode_cpl || ""}
                    disabled={mode === "edit"}
                    onChange={(e) =>
                      setForm({ ...form, kode_cpl: e.target.value })
                    }
                  />
                  <input
                    placeholder="Deskripsi"
                    value={form.deskripsi || ""}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                  />
                </>
              )}

              {/* ===== INDIKATOR ===== */}
              {type === "indikator" && (
                <>
                  <select
                    value={form.kode_cpl || ""}
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

                  <input
                    placeholder="Kode Indikator"
                    value={form.kode_indikator || ""}
                    disabled={mode === "edit"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        kode_indikator: e.target.value,
                      })
                    }
                  />

                  <input
                    placeholder="Deskripsi"
                    value={form.deskripsi || ""}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Bobot (%)"
                    value={form.bobot || ""}
                    onChange={(e) =>
                      setForm({ ...form, bobot: Number(e.target.value) })
                    }
                  />
                </>
              )}
              

              {/* ===== BK ===== */}
              {type === "bk" && (
                <>
                  <input
                    placeholder="Kode BK"
                    value={form.kode_bk || ""}
                    disabled={mode === "edit"}
                    onChange={(e) =>
                      setForm({ ...form, kode_bk: e.target.value })
                    }
                  />
                  <input
                    placeholder="Nama BK"
                    value={form.nama_bk || ""}
                    onChange={(e) =>
                      setForm({ ...form, nama_bk: e.target.value })
                    }
                  />
                  <input
                    placeholder="Deskripsi"
                    value={form.deskripsi || ""}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                  />
                </>
              )}

              {/* ===== MK ===== */}
              {type === "mk" && (
                <>
                  <input
                    placeholder="Kode MK"
                    value={form.kode_mk || ""}
                    disabled={mode === "edit"}
                    onChange={(e) =>
                      setForm({ ...form, kode_mk: e.target.value })
                    }
                  />
                  <input
                    placeholder="Nama MK"
                    value={form.nama_mk || ""}
                    onChange={(e) =>
                      setForm({ ...form, nama_mk: e.target.value })
                    }
                  />
                  <input
                    placeholder="Deskripsi"
                    value={form.deskripsi || ""}
                    onChange={(e) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                  />
                  <select
                    value={form.jenis_mk || ""}
                    onChange={(e) =>
                      setForm({ ...form, jenis_mk: e.target.value })
                    }
                  >
                    <option value="">-- Pilih Jenis --</option>
                    <option value="Dalam Prodi">Dalam Prodi</option>
                    <option value="Luar Prodi">Luar Prodi</option>
                  </select>
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
          <button
            className="btn-save"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}