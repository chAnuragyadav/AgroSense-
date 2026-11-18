import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import SoilFinder from "./components/SoilFinder.jsx";
import IrrigationCalculator from "./components/IrrigationCalculator.jsx";
import About from "./components/About.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SoilFinder />
        <IrrigationCalculator />
        <About />
      </main>
      <footer className="footer">© {new Date().getFullYear()} AgroSense. Grown with care.</footer>
    </>
  );
}
