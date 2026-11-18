import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const quotes = [
  ["Farming looks mighty easy when your plow is a pencil, and you're a thousand miles from the corn field.", "Dwight D. Eisenhower"],
  ["The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings.", "Masanobu Fukuoka"],
  ["Agriculture is our wisest pursuit because it will, in the end, contribute most to real wealth, good morals, and happiness.", "Thomas Jefferson"],
  ["The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways.", "John F. Kennedy"],
  ["Farming is a profession of hope.", "Brett L. Markham"],
  ["No race can prosper till it learns that there is as much dignity in tilling a field as in writing a poem.", "Booker T. Washington"],
  ["The farmer has to be an optimist or he wouldn’t still be a farmer.", "Will Rogers"],
  ["A good farmer is nothing more nor less than a handy man with a sense of humus.", "E.B. White"],
  ["The discovery of agriculture was the first big step toward a civilized life.", "Arthur Keith"],
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % quotes.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Precision farming, simplified</span>
        <h1>Know your soil.<br />Water with confidence.</h1>
        <p>Look up the soil type for your district and get a 3-day irrigation estimate based on the live weather forecast.</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/soil">Find my soil</Link>
          <Link className="btn ghost" to="/irrigation">Calculate irrigation</Link>
        </div>
      </div>
      <figure className="quote-card" aria-live="polite">
        <blockquote key={i}>“{quotes[i][0]}”</blockquote>
        <figcaption key={`c${i}`}>— {quotes[i][1]}</figcaption>
        <div className="dots">
          {quotes.map((_, n) => (
            <button key={n} className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={`Quote ${n + 1}`} />
          ))}
        </div>
      </figure>
    </section>
  );
}
