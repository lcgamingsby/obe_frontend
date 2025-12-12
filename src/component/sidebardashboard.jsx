// Sidebar.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../main.css";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [openMenu, setOpenMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    {
      title: "Pengaturan",
      icon: "⚙️",
      path: "/dashboard/settings",
      submenus: [
        { name: "Data Master", path: "/dashboard/datamaster" },
        { name: "Pengguna", path: "/dashboard/pengguna" },
        //{ name: "Prodi Aktif", path: "/dashboard/settings/prodi" },
      ],
    },
    {
      title: "Kurikulum",
      icon: "📚",
      path: "/dashboard/kurikulum",
      submenus: [
        { name: "Data", path: "/dashboard/kurikulum/data" },
        { name: "Pemetaan", path: "/dashboard/kurikulum/pemetaan" },
        { name: "Penyusunan", path: "/dashboard/kurikulum/penyusunan" },
      ],
    },
  ];

  const handleMenuClick = (menu) => {
    if (menu.submenus.length > 0) {
      setOpenMenu(openMenu === menu.title ? null : menu.title);
    } else {
      navigate(menu.path);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? "❮" : "☰"}
        </button>
        {isOpen && <h3 className="sidebar-title">OBE System</h3>}
      </div>

      <div className="menu-list">
        {menus.map((menu, i) => {
          const isActive =
            location.pathname.startsWith(menu.path) ||
            menu.submenus.some((sub) => location.pathname === sub.path);

          return (
            <div key={i} className="menu-group">
              <div
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={() => handleMenuClick(menu)}
              >
                <span className="menu-icon">{menu.icon}</span>
                {isOpen && <span className="menu-text">{menu.title}</span>}
                {isOpen && menu.submenus.length > 0 && (
                  <span
                    className={`arrow ${openMenu === menu.title ? "rotate" : ""}`}
                  >
                    ▼
                  </span>
                )}
              </div>

              {isOpen && menu.submenus.length > 0 && openMenu === menu.title && (
                <div className="submenu">
                  {menu.submenus.map((sub, j) => (
                    <div
                      key={j}
                      className={`submenu-item ${
                        location.pathname === sub.path ? "active" : ""
                      }`}
                      onClick={() => navigate(sub.path)}
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
