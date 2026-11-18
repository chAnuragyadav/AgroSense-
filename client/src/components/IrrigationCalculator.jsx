import { useEffect, useState } from "react";
import { api } from "../api.js";

const soils = ["Alluvial", "Black", "Red", "Loamy", "Laterite", "Clay", "Sandy"];
const methods = ["Drip Irrigation", "Sprinkler Irrigation", "Surface Irrigation", "Subsurface Irrigation"];
const lastOptions = [["1-3", "1–3 days ago"], ["4-5", "4–5 days ago"], ["5-8", "5–8 days ago"], ["8-12", "8–12 days ago"], ["13-15", "13–15 days ago"]];
const empty = { state: "", district: "", soil: "", crop: "", method: "", lastIrrigation: "" };

export default function IrrigationCalculator() {
  const [form, setForm] = useState(empty);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [crops, setCrops] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.states().then(setStates).catch(() => {});
    api.crops().then(setCrops).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickState = async (e) => {
    const state = e.target.value;
    setForm((f) => ({ ...f, state, district: "" }));
    setDistricts(state ? (await api.districts(state).catch(() => [])).map((d) => d.district) : []);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setResult(null); setLoading(true);
    try { setResult(await api.irrigation(form)); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const max = result ? Math.max(...result.days.map((d) => d.mm), 1) : 1;

  return (
    <section id="irrigation" className="section">
      <div className="section-head">
        <span className="eyebrow">Step 2</span>
        <h2>Calculate Irrigation</h2>
        <p>Get water requirements for the next three days from the live forecast.</p>
      </div>
      <div className="card">
        <form className="grid" onSubmit={submit}>
          <label>State
            <select value={form.state} onChange={pickState} required>
              <option value="">Select state</option>
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Location
            <select value={form.district} onChange={set("district")} disabled={!form.state} required>
              <option value="">Select location</option>
              {districts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label>Soil type
            <select value={form.soil} onChange={set("soil")} required>
              <option value="">Select soil</option>
              {soils.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Crop
            <select value={form.crop} onChange={set("crop")} required>
              <option value="">Select crop</option>
              {crops.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Irrigation method
            <select value={form.method} onChange={set("method")}>
              <option value="">Select method</option>
              {methods.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label>Last irrigation
            <select value={form.lastIrrigation} onChange={set("lastIrrigation")} required>
              <option value="">Select</option>
              {lastOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <button className="btn primary full" disabled={loading}>{loading ? "Calculating…" : "Calculate irrigation"}</button>
        </form>

        {error && <p className="alert">{error}</p>}

        {result && (
          <div className="results">
            <h3>Next 3 days · {result.location}</h3>
            <div className="days">
              {result.days.map((d) => (
                <div className="day" key={d.label}>
                  <span className="day-label">{d.label}</span>
                  <strong>{d.mm.toFixed(1)}<small> mm</small></strong>
                  <div className="bar"><i style={{ width: `${(d.mm / max) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
