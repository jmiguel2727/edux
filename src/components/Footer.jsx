import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center p-4 mt-5">
      <div className="container">

        <div className="mb-3 d-flex justify-content-center gap-4 flex-wrap">
          <Link to="/sobre" className="text-white text-decoration-none">Sobre</Link>
          <Link to="/termos" className="text-white text-decoration-none">Termos e Condições</Link>
        </div>

        <div className="mb-3">
          <p className="mb-1">
            <MdEmail className="me-2" size={18} />
            suporte@edux.com
          </p>
          <p className="mb-1">
            <MdPhone className="me-2" size={18} />
            +351 999 999 999
          </p>
          <p className="mb-0">Coimbra Business School | ISCAC</p>
        </div>

        <div className="mb-3">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white me-3"><FaFacebook size={24} /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white me-3"><FaInstagram size={24} /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white me-3"><FaLinkedin size={24} /></a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-white"><FaYoutube size={24} /></a>
        </div>

        <p className="mt-3 mb-0 small">© {new Date().getFullYear()} EDUX | Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
