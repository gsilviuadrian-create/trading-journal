// Importăm modulele necesare
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Port default pentru Render
const TRADES_FILE = path.join(__dirname, 'trades.json'); // Calea către fișierul JSON

// Middleware pentru parsarea JSON în request-uri
app.use(bodyParser.json());

// Servește fișiere statice din folderul 'public' (frontend-ul)
app.use(express.static(path.join(__dirname, 'public')));

// Asigură-te că fișierul trades.json există; dacă nu, creează-l cu un array gol
fs.ensureFileSync(TRADES_FILE);
if (!fs.existsSync(TRADES_FILE) || fs.readFileSync(TRADES_FILE, 'utf8').trim() === '') {
  fs.writeJsonSync(TRADES_FILE, []);
}

// Endpoint GET /trades: Returnează toate trade-urile din JSON
app.get('/trades', (req, res) => {
  try {
    const trades = fs.readJsonSync(TRADES_FILE);
    res.json(trades);
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la citirea datelor');
  }
});

// Endpoint POST /trades: Adaugă un nou trade și salvează în JSON
app.post('/trades', (req, res) => {
  try {
    const newTrade = req.body;
    const trades = fs.readJsonSync(TRADES_FILE);
    trades.push(newTrade);
    fs.writeJsonSync(TRADES_FILE, trades, { spaces: 2 }); // Salvăm frumos formatat
    res.status(201).json(newTrade);
  } catch (err) {
    console.error(err);
    res.status(500).send('Eroare la salvarea datelor');
  }
});

// Pornim serverul
app.listen(PORT, => {
  console.log(`Server rulat pe portul ${PORT}`);
});
