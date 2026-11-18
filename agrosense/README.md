# AgroSense

Soil lookup and 3-day irrigation estimates for Indian farmers.

**Stack:** React (Vite) · Node.js + Express · MongoDB (Mongoose) · HTML/CSS

## Setup
1. Install Node 18+ and MongoDB (local, or a free MongoDB Atlas cluster).
2. `npm run install:all`
3. `cp server/.env.example server/.env` and fill in `MONGO_URI` and `OPENWEATHER_API_KEY`.
4. `npm run dev` — React on http://localhost:5173, API on http://localhost:5000.

The database seeds itself on first start (210 districts, 52 crops). Re-seed any time with `npm run seed`.

## Production
`npm run build && npm start` — Express serves the built React app and the API together on port 5000.

## API
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/states` | List of states |
| GET | `/api/districts?state=` | Districts + soil type |
| GET | `/api/crops` | Crop list |
| POST | `/api/irrigation` | 3-day estimate (saved to MongoDB) |
| POST | `/api/contact` | Contact message (saved to MongoDB) |

## Structure
```
server/   index.js (routes) · models.js · seed.js · data/*.json
client/   src/components (Navbar, Hero, SoilFinder, IrrigationCalculator, About) · src/styles.css
```

## Deploy on Netlify (frontend + API)
The API runs as a Netlify Function (`netlify/functions/api.js`) that wraps the same Express app in `server/app.js`.

1. **MongoDB Atlas:** create a free cluster, add a database user, and under *Network Access* allow `0.0.0.0/0`
   (Netlify functions have no fixed IP). Copy the connection string and add the database name,
   e.g. `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/agrosense`.
2. **Netlify → Site configuration → Environment variables**, add:
   - `MONGO_URI` = your Atlas connection string
   - `OPENWEATHER_API_KEY` = your OpenWeather key
3. Push to GitHub. Netlify uses `netlify.toml` (build, publish, function folder and `/api/*` redirect).
   The database seeds itself on the first API request.
4. After changing environment variables, trigger **Deploys → Trigger deploy → Clear cache and deploy site**.
