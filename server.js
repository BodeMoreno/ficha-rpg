const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const FILE = path.join(__dirname, "fichas.json");
const ALLOWED_IDS = new Set(["weslley", "anderson", "mity"]);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function load() {
  try {
    if (!fs.existsSync(FILE)) return {};
    const txt = fs.readFileSync(FILE, "utf8").trim();
    if (!txt) return {};
    return JSON.parse(txt);
  } catch (e) {
    console.error("Erro ao ler fichas.json:", e);
    return {};
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function validateId(req, res) {
  const id = String(req.params.id || "");
  if (!ALLOWED_IDS.has(id)) {
    res.status(404).json({ error: "id_invalido" });
    return null;
  }
  return id;
}

app.get("/ficha/:id", (req, res) => {
  const id = validateId(req, res);
  if (!id) return;

  const fichas = load();
  if (!fichas[id]) {
    fichas[id] = {};
    save(fichas);
  }
  res.json(fichas[id] || {});
});

app.put("/ficha/:id", (req, res) => {
  const id = validateId(req, res);
  if (!id) return;

  const fichas = load();
  fichas[id] = req.body || {};
  save(fichas);
  res.json({ ok: true });
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});
