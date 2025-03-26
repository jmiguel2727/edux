import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { LuBookmarkCheck } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
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
    { to: "/admin/cursos", label: "Cursos", icon: <LuBookmarkCheck size={24} /> },
    { to: "/logout", label: "Logout", icon: <IoIosLogOut size={24} /> },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <aside
        ref={sidebarRef}
        className={`bg-dark text-white p-3 d-flex flex-column align-items-${isOpen ? "start" : "center"}`}
        style={{
          width: isOpen ? "200px" : "70px",
          transition: "width 0.3s",
          cursor: !isOpen ? "pointer" : "default"
        }}
        onClick={() => {
          if (!isOpen) toggleSidebar();
        }}
      >
        {/* Logótipo */}
        <div className="w-100 d-flex justify-content-center mb-4">
          <img
            src={logo}
            alt="EDUX Logo"
            className="rounded-circle"
            style={{ width: "50px" }}
          />
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

      <main className="flex-grow-1 p-4">
        {children}
      </main>
    </div>
  );
}
