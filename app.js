// ============================================================
// Daggerheart Companion — logique de l'app
// ============================================================

// --- 1. LA DONNÉE : un personnage ---------------------------
// Un "objet" JavaScript = un ensemble de paires clé: valeur.
// C'est l'équivalent d'une Structure en Blueprint : des champs nommés,
// chacun avec une valeur. Les objets peuvent contenir d'autres objets
// (comme une Structure qui contient une autre Structure).
//
// Pour l'instant ce personnage est écrit "en dur" (hardcodé) :
// il sert juste à tester l'affichage. Plus tard, les persos
// viendront de la sauvegarde locale.
const personnage = {
  id: "perso-1",          // identifiant unique, servira à retrouver le perso
  nom: "Lydia",
  ascendance: "Elfe",
  communaute: "Sylvestre",
  classe: "Rôdeur",
  niveau: 1,

  // Les 6 caractéristiques (modificateurs).
  caracs: {
    agility: 3,
    strength: -1,
    finesse: 1,
    instinct: 1,
    presence: 0,
    knowledge: 0,
  },

  // Les ressources : une valeur actuelle + un maximum configurable.
  // ⚠️ Valeurs de départ à vérifier dans les règles officielles.
  ressources: {
    pv:     { actuel: 6, max: 6 },
    stress: { actuel: 0, max: 6 },
    espoir: { actuel: 2, max: 6 },
  },
};

// --- 2. L'AFFICHAGE : transformer la donnée en HTML ---------
// Une fonction = une "Function" Blueprint : elle prend des entrées
// (ici un personnage) et renvoie une sortie (ici du texte HTML).
function afficherPersonnage(perso) {
  // Les backticks ` ` permettent d'écrire du texte sur plusieurs lignes
  // et d'y insérer des valeurs avec ${ ... } (comme un "Format Text").
  return `
    <article class="fiche">
      <h2>${perso.nom}</h2>
      <p>${perso.ascendance} · ${perso.communaute} · ${perso.classe} · Niveau ${perso.niveau}</p>

      <h3>Caractéristiques</h3>
      <ul>
        <li>Agility : ${perso.caracs.agility}</li>
        <li>Strength : ${perso.caracs.strength}</li>
        <li>Finesse : ${perso.caracs.finesse}</li>
        <li>Instinct : ${perso.caracs.instinct}</li>
        <li>Presence : ${perso.caracs.presence}</li>
        <li>Knowledge : ${perso.caracs.knowledge}</li>
      </ul>

      <h3>Ressources</h3>
      ${ligneRessource("pv", "PV", perso.ressources.pv)}
      ${ligneRessource("stress", "Stress", perso.ressources.stress)}
      ${ligneRessource("espoir", "Espoir", perso.ressources.espoir)}
    </article>
  `;
}

// Petite fonction réutilisée 3 fois (PV, stress, espoir) :
// une ligne = bouton −, valeur, bouton +.
// Les attributs data-... sont des "étiquettes" qu'on colle sur les boutons
// pour savoir, au clic, QUELLE ressource modifier et DE COMBIEN.
function ligneRessource(cle, label, res) {
  return `
    <div class="ressource">
      <span class="label">${label}</span>
      <button data-ressource="${cle}" data-delta="-1">−</button>
      <span class="valeur">${res.actuel} / ${res.max}</span>
      <button data-ressource="${cle}" data-delta="1">+</button>
    </div>
  `;
}

// --- 3. LA LOGIQUE : modifier la donnée ---------------------
// On change UNIQUEMENT l'objet, jamais la page directement.
function modifierRessource(cle, delta) {
  const res = personnage.ressources[cle]; // [cle] = accès par nom variable, ex. ressources["pv"]
  // Clamp entre 0 et max (comme le node "Clamp" en Blueprint)
  res.actuel = Math.min(res.max, Math.max(0, res.actuel + delta));
}

// --- 4. LE RENDU : redessiner la page à partir de la donnée --
// document.getElementById("app") = "Get Widget by name" : on récupère
// la zone <div id="app"> de index.html, puis on remplace son contenu.
function rendre() {
  document.getElementById("app").innerHTML = afficherPersonnage(personnage);
}

// --- 5. LES ÉVÉNEMENTS : réagir aux clics ------------------
// = un "Event OnClicked". Astuce : au lieu d'écouter chaque bouton
// (qui sont recréés à chaque rendu), on écoute toute la zone #app
// une seule fois, et on regarde sur quoi on a cliqué.
document.getElementById("app").addEventListener("click", (event) => {
  const bouton = event.target.closest("button[data-ressource]");
  if (!bouton) return; // clic ailleurs que sur un bouton → on ignore

  modifierRessource(bouton.dataset.ressource, Number(bouton.dataset.delta));
  rendre(); // donnée modifiée → on réaffiche
});

// Premier affichage au chargement de la page
rendre();
