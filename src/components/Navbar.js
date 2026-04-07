import React, { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">
        <img src="/logo.png" alt="logo" />
        <span className="logo-text">Aditaya</span>
      </div>

      {/* MENU ICON (Mobile) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* LINKS */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>

    </nav>
  );
}

export default Navbar;