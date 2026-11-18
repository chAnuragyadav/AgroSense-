import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Soil from "./pages/Soil.jsx";
import Irrigation from "./pages/Irrigation.jsx";
import Weather from "./pages/Weather.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/soil" element={<Soil />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="*" element={<section className="section page"><h2>Page not found</h2><p><Link to="/">Back to home</Link></p></section>} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} AgroSense. Grown with care.</footer>
    </>
  );
}
