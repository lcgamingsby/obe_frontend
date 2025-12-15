import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/dashboard";
import DaftarPengguna from "./pages/daftarpengguna";
import DataMaster from "./pages/DataMaster";
import Data from "./pages/kurikulumdata";
//
import SetProdiTahunAktif from "./pages/setproditahunaktif";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Login tetap tanpa proteksi */}
        <Route path="/" element={<LoginPage />} />

        {/* Semua halaman dashboard sekarang tanpa ProtectedRoute */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/pengguna" element={<DaftarPengguna />} />
        <Route path="/dashboard/datamaster" element={<DataMaster />} />
        <Route path="/dashboard/setproditahunaktif" element={<SetProdiTahunAktif />}/>
        <Route path="/dashboard/kurikulum/data" element={<Data />} />
        

      </Routes>
    </Router>
  );
}

export default App;
