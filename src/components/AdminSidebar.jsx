import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { LuBookmarkCheck } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { MdOutlineReport } from "react-icons/md"; // Novo ícone
import logo from "/src/assets/logo_edux_white.png";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const links = [
    { to: "/admin/users", label: "Utilizadores", icon: <FaUsers size={24} /> },
    { to: "/admin/course", label: "Cursos", icon: <LuBookmarkCheck size={24} /> },
    { to: "/admin/reports", label: "Denúncias", icon: <MdOutlineReport size={24} /> }, // Novo link
    { to: "/logout", label: "Logout", icon: <IoIosLogOut size={24} /> },
  ];

  const sidebarWidth = isOpen ? 200 : 70;

  return (
    <div className="d-flex">
      <aside
        ref={sidebarRef}
        className={`bg-dark text-white p-3 d-flex flex-column align-items-${isOpen ? "start" : "center"}`}
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          height: "100vh",
          width: `${sidebarWidth}px`,
          transition: "width 0.3s",
          zIndex: 1040,
          cursor: !isOpen ? "pointer" : "default",
        }}
        onClick={() => {
          if (!isOpen) toggleSidebar();
        }}
      >
        {/* Logótipo */}
        <div className="w-100 d-flex justify-content-center mb-4">
          <Link to="/admin">
            <img
              src={logo}
              alt="EDUX Logo"
              className="rounded-circle"
              style={{ width: "50px", cursor: "pointer" }}
            />
          </Link>
        </div>

        {/* Navegação */}
        {links.map(({ to, label, icon }) => (
          <div
            key={to}
            className={`mb-3 d-flex w-100 align-items-center ${
              isOpen ? "justify-content-start ps-2" : "justify-content-center"
            }`}
          >
            <Link
              to={to}
              className={`text-white text-decoration-none d-flex align-items-center gap-2 ${
                location.pathname === to ? "fw-bold" : ""
              }`}
              title={label}
            >
              {icon}
              {isOpen && <span>{label}</span>}
            </Link>
          </div>
        ))}
      </aside>

      <main
        className="flex-grow-1 p-4"
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s",
          width: `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        {children}
      </main>
    </div>
  );
}
