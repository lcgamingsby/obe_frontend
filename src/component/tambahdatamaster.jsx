import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../data/config";
import "../css/tambahdata.css";

export default function DataMasterModal({
  entity,
  mode,
  initialData,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const [listFakultas, setListFakultas] = useState([]);
  const [listProdi, setListProdi] = useState([]);
  const [listDosen, setListDosen] = useState([]);

  /* ======================
     INIT
  ====================== */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({});
    }
  }, [mode, initialData]);

  useEffect(() => {
    if (["prodi", "dosen", "kaprodi"].includes(entity)) fetchFakultas();
    if (["dosen", "kaprodi"].includes(entity)) fetchProdi();
    if (entity === "kaprodi") fetchDosen();
  }, [entity]);

  /* ======================
     FETCHERS
  ====================== */
  const fetchFakultas = async () => {
    const res = await axios.get(`${config.BACKEND_URL}/fakultas`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setListFakultas(res.data || []);
  };

  const fetchProdi = async () => {
    const res = await axios.get(`${config.BACKEND_URL}/prodi`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setListProdi(res.data || []);
  };

  const fetchDosen = async () => {
    const res = await axios.get(`${config.BACKEND_URL}/dosen`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setListDosen(res.data || []);
  };

  /* ======================
     HANDLERS
  ====================== */
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let endpoint = `/${entity}`;
      let key = "";

      if (mode === "edit") {
        if (entity === "dosen") key = form.nip;
        else if (entity === "kaprodi") key = form.nip_nik;
        else key = form.id;
      }

      if (mode === "tambah") {
        await axios.post(`${config.BACKEND_URL}${endpoint}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.put(`${config.BACKEND_URL}${endpoint}/${key}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     FILTERED DATA
  ====================== */
  const prodiFiltered =
    form.fakultas
      ? listProdi.filter((p) => p.fakultas === form.fakultas)
      : listProdi;

  /* ======================
     UI
  ====================== */
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{mode === "tambah" ? "Tambah" : "Edit"} {entity.toUpperCase()}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          {/* ===== FAKULTAS ===== */}
          {entity === "fakultas" && (
            <>
              <input placeholder="ID" value={form.id || ""} onChange={(e)=>handleChange("id",e.target.value)} disabled={mode==="edit"} />
              <input placeholder="Fakultas" value={form.fakultas || ""} onChange={(e)=>handleChange("fakultas",e.target.value)} />
              <input placeholder="Universitas" value={form.universitas || ""} onChange={(e)=>handleChange("universitas",e.target.value)} />
            </>
          )}

          {/* ===== PRODI ===== */}
          {entity === "prodi" && (
            <>
              <input placeholder="ID" value={form.id || ""} disabled={mode==="edit"} onChange={(e)=>handleChange("id",e.target.value)} />
              <input placeholder="Nama Prodi" value={form.prodi || ""} onChange={(e)=>handleChange("prodi",e.target.value)} />

              <select
                value={form.fakultas || ""}
                onChange={(e)=>{
                  const f = listFakultas.find(x=>x.fakultas===e.target.value);
                  handleChange("fakultas", e.target.value);
                  handleChange("universitas", f?.universitas || "");
                }}>
                <option value="">-- Pilih Fakultas --</option>
                {listFakultas.map(f=>(
                  <option key={f.id} value={f.fakultas}>{f.fakultas}</option>
                ))}
              </select>

              <input placeholder="Universitas" value={form.universitas || ""} readOnly />
            </>
          )}

          {/* ===== DOSEN ===== */}
          {entity === "dosen" && (
            <>
              <input placeholder="NIP" value={form.nip || ""} disabled={mode==="edit"} onChange={(e)=>handleChange("nip",e.target.value)} />
              <input placeholder="Nama" value={form.nama || ""} onChange={(e)=>handleChange("nama",e.target.value)} />
              <input placeholder="NIDN" value={form.nidn || ""} onChange={(e)=>handleChange("nidn",e.target.value)} />
              <input placeholder="Email" value={form.email || ""} onChange={(e)=>handleChange("email",e.target.value)} />

              <select
                value={form.fakultas || ""}
                onChange={(e)=>{
                  handleChange("fakultas", e.target.value);
                  handleChange("prodi", "");
                }}>
                <option value="">-- Fakultas --</option>
                {listFakultas.map(f=>(
                  <option key={f.id} value={f.fakultas}>{f.fakultas}</option>
                ))}
              </select>

              <select
                value={form.prodi || ""}
                onChange={(e)=>handleChange("prodi",e.target.value)}>
                <option value="">-- Prodi --</option>
                {prodiFiltered.map(p=>(
                  <option key={p.id} value={p.prodi}>{p.prodi}</option>
                ))}
              </select>
            </>
          )}

          {/* ===== KAPRODI ===== */}
          {entity === "kaprodi" && (
            <>
              <select
                value={form.prodi || ""}
                onChange={(e)=>{
                  const p = listProdi.find(x=>x.prodi===e.target.value);
                  handleChange("prodi", e.target.value);
                  handleChange("fakultas", p?.fakultas || "");
                }}>
                <option value="">-- Pilih Prodi --</option>
                {listProdi.map(p=>(
                  <option key={p.id} value={p.prodi}>{p.prodi}</option>
                ))}
              </select>

              <input value={form.fakultas || ""} readOnly />

              <input type="number" placeholder="Tahun" value={form.tahun || ""} onChange={(e)=>handleChange("tahun",e.target.value)} />

              <select
                value={form.nip_nik || ""}
                onChange={(e)=>{
                  const d = listDosen.find(x=>x.nip===e.target.value);
                  handleChange("nip_nik", d?.nip || "");
                  handleChange("nama_kaprodi", d?.nama || "");
                }}>
                <option value="">-- Pilih Dosen --</option>
                {listDosen.map(d=>(
                  <option key={d.nip} value={d.nip}>{d.nama} ({d.nip})</option>
                ))}
              </select>

              <input value={form.nama_kaprodi || ""} readOnly />
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Batal</button>
          <button className="btn-save" onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
