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
