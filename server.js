const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const app = express();

/* ===== CONFIG ===== */
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // <<< ESSENCIAL para celular acessar
const FILE = path.join(__dirname, "fichas.json");

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ===== UTIL ===== */
function load() {
  try {
    if (!fs.existsSync(FILE)) return {};
    const txt = fs.readFileSync(FILE, "utf8").trim();
    if (!txt) return {};
    return JSON.parse(txt);
  } catch (err) {
    console.error("Erro ao carregar fichas:", err);
    return {};
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/* ===== ROTAS ===== */

// cria ficha nova
app.post("/ficha", (req, res) => {
  const fichas = load();
  const id = crypto.randomUUID();
  fichas[id] = req.body || {};
  save(fichas);
  res.json({ id });
});

// carrega ficha
app.get("/ficha/:id", (req, res) => {
  const fichas = load();
  res.json(fichas[req.params.id] || {});
});

// salva ficha
app.put("/ficha/:id", (req, res) => {
  const fichas = load();
  fichas[req.params.id] = req.body || {};
  save(fichas);
  res.json({ ok: true });
});

/* ===== START ===== */
app.listen(PORT, HOST, () => {
  console.log("Servidor rodando:");
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Rede:   http://SEU_IP_AQUI:${PORT}`);
});
