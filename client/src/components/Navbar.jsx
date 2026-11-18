import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [["Home", "/"], ["Soil", "/soil"], ["Irrigation", "/irrigation"], ["Weather", "/weather"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={() => setOpen(false)}><img src="/images/logo.png" alt="AgroSense" /></Link>
      <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav className={`nav-links ${open ? "open" : ""}`}>
        {links.map(([label, to]) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
      </nav>
    </header>
  );
}
