import { useEffect, useState } from "react";
import { api } from "../api.js";

const day = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
const icon = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

export default function Weather() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.states().then(setStates).catch(() => {}); }, []);

  const pickState = async (value) => {
    setState(value); setDistrict(""); setData(null);
    setDistricts(value ? (await api.districts(value).catch(() => [])).map((d) => d.district) : []);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setData(null); setLoading(true);
    try { setData(await api.weather(state, district)); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <section className="section page">
      <div className="section-head">
        <span className="eyebrow">Forecast</span>
        <h2>Weather</h2>
        <p>Current conditions and a 5-day outlook for your location.</p>
      </div>
      <div className="card">
        <form className="grid" onSubmit={submit}>
          <label>State
            <select value={state} onChange={(e) => pickState(e.target.value)} required>
              <option value="">Select state</option>
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Location
            <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!state} required>
              <option value="">Select location</option>
              {districts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <button className="btn primary full" disabled={loading}>{loading ? "Loading…" : "Get weather"}</button>
        </form>

        {error && <p className="alert">{error}</p>}

        {data && (
          <div className="results">
            <div className="now">
              <img src={icon(data.current.icon)} alt="" />
              <div>
                <h3>{data.location}</h3>
                <p className="temp">{Math.round(data.current.temp)}°C <small>{data.current.description}</small></p>
              </div>
              <ul className="stats">
                <li><span>Feels like</span><b>{Math.round(data.current.feelsLike)}°C</b></li>
                <li><span>Humidity</span><b>{data.current.humidity}%</b></li>
                <li><span>Wind</span><b>{data.current.wind} m/s</b></li>
              </ul>
            </div>
            <div className="forecast">
              {data.forecast.map((d) => (
                <div className="fday" key={d.date}>
                  <span className="day-label">{day(d.date)}</span>
                  <img src={icon(d.icon)} alt={d.text} />
                  <b>{Math.round(d.max)}° <small>/ {Math.round(d.min)}°</small></b>
                  <span className="rain">💧 {d.rain} mm</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
