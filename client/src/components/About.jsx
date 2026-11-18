import { useState } from "react";
import { api } from "../api.js";

export default function About() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "", text: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.contact(form);
      setForm({ name: "", email: "", message: "" });
      setStatus({ type: "ok", text: "Thanks! We’ll get back to you soon." });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <section className="section">
      <div className="card split about">
        <div>
          <img className="about-logo" src="/images/logo2.png" alt="AgroSense logo" />
          <h2>About Us</h2>
          <p>We provide the best agricultural solutions for farmers. Connect with us for more details.</p>
          <ul className="contact-list">
            <li><img src="/images/gmail.png" alt="" /><a href="mailto:sonyadav134@gmail.com">sonyadav134@gmail.com</a></li>
            <li><img src="/images/customer-service.png" alt="" /><a href="tel:+918433061303">+91 84330 61303</a></li>
            <li><img src="/images/message.png" alt="" /><a href="https://www.linkedin.com/in/anurag-kumar-953440355/" target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><img src="/images/instagram.png" alt="" /><a href="https://www.instagram.com/anuragydv7624" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
        </div>
        <form className="form" onSubmit={submit}>
          <h3>Send us a message</h3>
          <label>Name<input value={form.name} onChange={set("name")} required /></label>
          <label>Email<input type="email" value={form.email} onChange={set("email")} required /></label>
          <label>Message<textarea rows="4" value={form.message} onChange={set("message")} required /></label>
          <button className="btn primary">Send message</button>
          {status.text && <p className={status.type === "ok" ? "success" : "alert"}>{status.text}</p>}
        </form>
      </div>
    </section>
  );
}
