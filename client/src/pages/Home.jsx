import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";

const features = [
  ["🌱", "Soil", "Find the dominant soil type and suitable crops for your district.", "/soil"],
  ["💧", "Irrigation", "Get a 3-day water requirement estimate from the live forecast.", "/irrigation"],
  ["⛅", "Weather", "Check current conditions and a 5-day outlook for your location.", "/weather"],
];

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section">
        <div className="section-head">
          <span className="eyebrow">What you can do</span>
          <h2>Everything for your field</h2>
        </div>
        <div className="features">
          {features.map(([icon, title, text, to]) => (
            <Link key={to} to={to} className="feature card">
              <span className="feature-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="feature-link">Open →</span>
            </Link>
          ))}
        </div>
      </section>
      <About />
    </>
  );
}
