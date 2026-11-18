import { useState } from "react";

const links = [
  ["Home", "#home"],
  ["Soil", "#soil"],
  ["Irrigation", "#irrigation"],
  ["About", "#about"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <a href="#home" className="brand"><img src="/images/logo.png" alt="AgroSense" /></a>
      <button className="menu-btn" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav className={`nav-links ${open ? "open" : ""}`}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href="https://joyful-lily-3aa271.netlify.app/" target="_blank" rel="noreferrer">Weather ↗</a>
      </nav>
    </header>
  );
}
