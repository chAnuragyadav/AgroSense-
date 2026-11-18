import { useEffect, useState } from "react";
import { api } from "../api.js";

const soilInfo = {
  "Alluvial Soil": ["#c9a66b", "Fertile and well-drained. Great for wheat, rice, sugarcane and pulses."],
  "Black Soil": ["#3b3b3b", "Rich in clay, holds moisture well. Ideal for cotton, soybean and jowar."],
  "Red Soil": ["#b5513a", "Light and porous, low in nutrients. Suits millets, groundnut and pulses."],
  "Laterite Soil": ["#a0522d", "Acidic, leached soil. Works for tea, coffee, cashew and rubber."],
  "Mountain Soil": ["#6b7f5a", "Rich in humus on slopes. Good for tea, fruits and spices."],
  "Desert Soil": ["#e0c58a", "Sandy and dry. Best with drought-tolerant crops like bajra and guar."],
};

export default function SoilFinder() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { api.states().then(setStates).catch((e) => setError(e.message)); }, []);

  const pickState = async (value) => {
    setState(value); setDistrict(""); setDistricts([]);
    if (value) setDistricts(await api.districts(value).catch(() => []));
  };

  const soil = districts.find((d) => d.district === district)?.soil;
  const [color, tip] = soilInfo[soil] || [];

  return (
    <section id="soil" className="section">
      <div className="section-head">
        <span className="eyebrow">Step 1</span>
        <h2>Soil Information</h2>
        <p>Select your location to see the dominant soil type.</p>
      </div>
      <div className="card split">
        <div className="form">
          {error && <p className="alert">{error}</p>}
          <label>State
            <select value={state} onChange={(e) => pickState(e.target.value)}>
              <option value="">Select state</option>
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>District
            <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!state}>
              <option value="">Select district</option>
              {districts.map((d) => <option key={d.district}>{d.district}</option>)}
            </select>
          </label>
        </div>
        <div className="soil-result" style={{ "--soil": color || "#cfd8c4" }}>
          <div className="swatch" />
          {soil ? (<><h3>{soil}</h3><p>{tip}</p></>) : (<p className="muted">Your soil type will appear here.</p>)}
        </div>
      </div>
    </section>
  );
}
