// ============================================================
// Daggerheart Companion — logique de l'app
// ============================================================

// --- 1. LA DONNÉE : une LISTE de personnages ----------------
// Un personnage = un "objet" (= Structure Blueprint).
// Plusieurs personnages = un "tableau" [ ... ] (= Array Blueprint) :
// une liste ordonnée, chaque élément a un index (0, 1, 2...).
//
// Persos par défaut, utilisés uniquement au tout premier lancement.
// ⚠️ Valeurs de départ (PV, stress, espoir) à vérifier dans les règles officielles.
const personnagesParDefaut = [
  {
    id: "perso-1",          // identifiant unique : sert à retrouver LE bon perso
    nom: "Lydia",
    ascendance: "Elfe",
    communaute: "Sylvestre",
    classe: "Rôdeur",
    niveau: 1,
    caracs: { agility: 3, strength: -1, finesse: 1, instinct: 1, presence: 0, knowledge: 0 },
    ressources: {
      pv:     { actuel: 6, max: 6 },
      stress: { actuel: 0, max: 6 },
      espoir: { actuel: 2, max: 6 },
    },
  },
  {
    id: "perso-2",
    nom: "Brom",
    ascendance: "Nain",
    communaute: "Souterraine",
    classe: "Gardien",
    niveau: 1,
    caracs: { agility: 0, strength: 2, finesse: -1, instinct: 1, presence: 1, knowledge: 0 },
    ressources: {
      pv:     { actuel: 7, max: 7 },
      stress: { actuel: 0, max: 6 },
      espoir: { actuel: 2, max: 6 },
    },
  },
];

// --- 1b. LA SAUVEGARDE : localStorage ------------------------
// localStorage = un petit coffre dans le navigateur, propre à ce site,
// qui survit à la fermeture de l'app. Il ne stocke QUE du texte,
// rangé sous une clé (comme un Save Game avec un "Slot Name").
const CLE_SAUVEGARDE = "dhc-personnages";      // nouveau slot : toute la liste
const ANCIENNE_CLE = "dhc-personnage";         // ancien slot : un seul perso (version d'avant)

function sauvegarder() {
  // JSON.stringify : tableau d'objets → texte
  localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(personnages));
}

// Lit un slot et renvoie l'objet, ou null si vide / illisible.
function lireSlot(cle) {
  const texte = localStorage.getItem(cle);
  if (texte === null) return null;
  try {
    return JSON.parse(texte); // texte → objet
  } catch (erreur) {
    console.warn("Sauvegarde illisible :", cle, erreur);
    return null;
  }
}

function charger() {
  // 1. Cas normal : la liste a déjà été sauvegardée
  const liste = lireSlot(CLE_SAUVEGARDE);
  if (Array.isArray(liste)) return liste;

  // 2. Premier lancement de CETTE version : on part des persos par défaut...
  const nouvelleListe = structuredClone(personnagesParDefaut);

  // ...mais si l'ancienne version avait sauvegardé UN perso, on le récupère
  // à la place du premier perso par défaut. C'est une "migration" :
  // convertir une vieille sauvegarde au nouveau format.
  const ancienPerso = lireSlot(ANCIENNE_CLE);
  if (ancienPerso) nouvelleListe[0] = ancienPerso;

  return nouvelleListe;
}

let personnages = charger();

// Quel perso est ouvert ? null = on est sur l'écran liste.
// C'est un "état" de l'interface : il n'est pas sauvegardé.
let persoOuvertId = null;

// Retrouver un perso par son id : .find parcourt le tableau et renvoie
// le premier élément qui vérifie la condition (= un "Find" sur un Array
// avec une condition, ou un ForEach + Branch + Break).
function trouverPerso(id) {
  return personnages.find((p) => p.id === id);
}

// --- 2. L'AFFICHAGE -----------------------------------------

// Écran LISTE : un bouton par personnage.
// .map transforme CHAQUE élément du tableau (perso → bout de HTML),
// puis .join("") colle tous les bouts ensemble en un seul texte.
function afficherListe() {
  const cartes = personnages.map((p) => `
    <button class="carte-perso" data-action="ouvrir" data-id="${p.id}">
      <strong>${p.nom}</strong>
      <span>${p.classe} · ${p.ascendance} · Niv. ${p.niveau}</span>
      <span>PV ${p.ressources.pv.actuel}/${p.ressources.pv.max} · Stress ${p.ressources.stress.actuel}/${p.ressources.stress.max} · Espoir ${p.ressources.espoir.actuel}/${p.ressources.espoir.max}</span>
    </button>
  `).join("");

  return `<h2>Personnages</h2>${cartes}`;
}

// Écran FICHE : la même qu'avant, avec un bouton retour en plus.
function afficherPersonnage(perso) {
  return `
    <button class="retour" data-action="retour">← Liste</button>
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
<button data-action="ressource" data-ressource="pv" data-delta="99">Soin complet</button>
      ${ligneRessource("stress", "Stress", perso.ressources.stress)}
      ${ligneRessource("espoir", "Espoir", perso.ressources.espoir)}
    </article>
  `;
}

// Une ligne de ressource : bouton −, valeur, bouton +.
// Les attributs data-... sont des "étiquettes" lues au moment du clic.
function ligneRessource(cle, label, res) {
  return `
    <div class="ressource">
      <span class="label">${label}</span>
      <button data-action="ressource" data-ressource="${cle}" data-delta="-1">−</button>
      <span class="valeur">${res.actuel} / ${res.max}</span>
      <button data-action="ressource" data-ressource="${cle}" data-delta="1">+</button>
    </div>
  `;
}

// --- 3. LA LOGIQUE : modifier la donnée ---------------------
function modifierRessource(perso, cle, delta) {
  const res = perso.ressources[cle]; // [cle] = accès par nom variable, ex. ressources["pv"]
  res.actuel = Math.min(res.max, Math.max(0, res.actuel + delta)); // Clamp 0 → max
  sauvegarder();
}

// --- 4. LE RENDU : quel écran afficher ? ---------------------
// Comme un "Widget Switcher" : selon l'état, on affiche la liste ou la fiche.
function rendre() {
  const perso = trouverPerso(persoOuvertId);
  const zone = document.getElementById("app");
  zone.innerHTML = perso ? afficherPersonnage(perso) : afficherListe();
}

// --- 5. LES ÉVÉNEMENTS : un seul écouteur pour tous les clics ----
// Chaque bouton porte un data-action qui dit ce qu'il fait.
// On lit l'action, puis on "switch" dessus (= Switch on String).
document.getElementById("app").addEventListener("click", (event) => {
  const bouton = event.target.closest("button[data-action]");
  if (!bouton) return;

  switch (bouton.dataset.action) {
    case "ouvrir":
      persoOuvertId = bouton.dataset.id;
      break;
    case "retour":
      persoOuvertId = null;
      break;
    case "ressource":
      modifierRessource(
        trouverPerso(persoOuvertId),
        bouton.dataset.ressource,
        Number(bouton.dataset.delta)
      );
      break;
  }

  rendre(); // quelle que soit l'action : état modifié → on réaffiche
});

// Premier affichage au chargement de la page
sauvegarder(); // enregistre tout de suite la liste (utile juste après la migration)
rendre();
