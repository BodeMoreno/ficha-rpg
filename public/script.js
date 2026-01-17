const id = new URLSearchParams(location.search).get("id");

function getTexto(el){
  return el.textContent || "";
}

function setTexto(el, v){
  el.textContent = (v ?? "").toString();
}

function atualizarClasses() {
  document.querySelectorAll(".campo").forEach(el => {
    const vazio = getTexto(el).trim() === "";
    el.classList.toggle("vazio", vazio);
    el.classList.toggle("preenchido", !vazio);
  });
}

function ajustarTudo() {
  atualizarClasses();
  if (window.ajustarFonte) {
    document.querySelectorAll(".campo").forEach(c => window.ajustarFonte(c));
  }
}

async function carregar(){
  const res = await fetch("/ficha/" + id);
  const f = await res.json();

  for (let k in f){
    const el = document.getElementById(k);
    if (!el) continue;
    setTexto(el, f[k]);
  }

  ajustarTudo();
}

async function salvar(){
  const ficha = {
    nome: getTexto(nome),
    raca: getTexto(raca),
    classe: getTexto(classe),
    hp: getTexto(hp),
    lv: getTexto(lv),
    rank: getTexto(rank),
    titulo: getTexto(titulo),
    str: getTexto(str),
    dex: getTexto(dex),
    con: getTexto(con),
    int: getTexto(int),
    wis: getTexto(wis),
    cha: getTexto(cha)
  };

  await fetch("/ficha/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ficha)
  });

  ajustarTudo();
}

carregar();
