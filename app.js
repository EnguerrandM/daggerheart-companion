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

// La fiche est-elle en mode édition ? (état d'interface, non sauvegardé)
let modeEdition = false;

// Retrouver un perso par son id : .find parcourt le tableau et renvoie
// le premier élément qui vérifie la condition (= un "Find" sur un Array
// avec une condition, ou un ForEach + Branch + Break).
function trouverPerso(id) {
  return personnages.find((p) => p.id === id);
}

// --- 1c. CRÉER / SUPPRIMER ----------------------------------

// Fabrique un perso "vierge" (= Make Struct avec des valeurs par défaut).
// L'id doit être UNIQUE : Date.now() = nb de millisecondes depuis 1970,
// donc deux clics ne donnent jamais le même nombre.
function nouveauPerso() {
  return {
    id: "perso-" + Date.now(),
    nom: "Nouveau perso",
    ascendance: "?",
    communaute: "?",
    classe: "?",
    niveau: 1,
    caracs: { agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0 },
    ressources: {
      pv:     { actuel: 6, max: 6 },   // ⚠️ à vérifier selon la classe
      stress: { actuel: 0, max: 6 },
      espoir: { actuel: 2, max: 6 },
    },
  };
}

function ajouterPerso() {
  const perso = nouveauPerso();
  personnages.push(perso);   // .push = "Add" sur un Array : ajoute à la fin
  sauvegarder();
  return perso;
}

function supprimerPerso(id) {
  // .filter garde tous les éléments qui vérifient la condition :
  // ici, tous SAUF celui qui a cet id. On obtient un NOUVEAU tableau.
  personnages = personnages.filter((p) => p.id !== id);
  sauvegarder();
}

// --- 1d. LES BORNES -----------------------------------------
// Regroupées ici pour les retrouver facilement.
// ⚠️ Valeurs PROVISOIRES, à vérifier dans les règles officielles.
const BORNES = {
  niveau: { min: 1, max: 10 },
  carac:  { min: -5, max: 9 },
  maxRessource: { min: 1, max: 20 },
};

// borner = Clamp : force une valeur à rester entre min et max.
function borner(valeur, min, max) {
  return Math.min(max, Math.max(min, valeur));
}

// --- 2. L'AFFICHAGE -----------------------------------------

// Affiche +2 au lieu de 2 pour les valeurs positives (convention des JDR).
function signe(n) {
  return n > 0 ? `+${n}` : `${n}`;
}

// SÉCURITÉ : le texte tapé par l'utilisateur est injecté dans du HTML.
// Un nom comme "<b>Bob" serait interprété comme une balise et casserait
// la page. echapper() remplace les caractères spéciaux par leur version
// "texte" (&lt; = "<" affiché, pas interprété). À utiliser sur TOUT texte
// venant de l'utilisateur.
function echapper(texte) {
  return String(texte)
    .replaceAll("&", "&amp;")   // en premier, sinon on ré-échappe les suivants
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Écran LISTE : un bouton par personnage.
// .map transforme CHAQUE élément du tableau (perso → bout de HTML),
// puis .join("") colle tous les bouts ensemble en un seul texte.
function afficherListe() {
  const cartes = personnages.map((p) => `
    <button class="carte-perso" data-action="ouvrir" data-id="${p.id}">
      <strong>${echapper(p.nom)}</strong>
      <span>${echapper(p.classe)} · ${echapper(p.ascendance)} · Niv. ${p.niveau}</span>
      <span>PV ${p.ressources.pv.actuel}/${p.ressources.pv.max} · Stress ${p.ressources.stress.actuel}/${p.ressources.stress.max} · Espoir ${p.ressources.espoir.actuel}/${p.ressources.espoir.max}</span>
    </button>
  `).join("");

  return `
    <h2>Personnages</h2>
    ${cartes}
    <button class="ajouter" data-action="ajouter">+ Nouveau personnage</button>
  `;
}

// Bloc identité, version LECTURE.
function identiteLecture(perso) {
  return `
    <h2>${echapper(perso.nom)}</h2>
    <p>${echapper(perso.ascendance)} · ${echapper(perso.communaute)} · ${echapper(perso.classe)} · Niveau ${perso.niveau}</p>
  `;
}

// Un champ de saisie. data-champ = le nom de la propriété à modifier
// (même principe que data-ressource pour les boutons).
function champTexte(perso, champ, label) {
  return `
    <label class="champ">${label}
      <input type="text" data-champ="${champ}" value="${echapper(perso[champ])}">
    </label>
  `;
}

// Bloc identité, version ÉDITION.
function identiteEdition(perso) {
  return `
    ${champTexte(perso, "nom", "Nom")}
    ${champTexte(perso, "ascendance", "Ascendance")}
    ${champTexte(perso, "communaute", "Communauté")}
    ${champTexte(perso, "classe", "Classe")}
    <label class="champ">Niveau
      <input type="number" inputmode="numeric" min="1" max="10" data-champ="niveau" value="${perso.niveau}">
    </label>
  `;
}

// La liste des caracs, dans l'ordre d'affichage : [clé, label].
// Une seule liste → lecture ET édition l'utilisent, pas de doublon.
const CARACS = [
  ["agility", "Agility"],
  ["strength", "Strength"],
  ["finesse", "Finesse"],
  ["instinct", "Instinct"],
  ["presence", "Presence"],
  ["knowledge", "Knowledge"],
];

const RESSOURCES = [
  ["pv", "PV"],
  ["stress", "Stress"],
  ["espoir", "Espoir"],
];

// Une ligne de réglage générique : −, valeur, +.
// action = quel "case" du switch traitera le clic ; cle = quoi modifier.
function ligneReglage(action, cle, label, valeurAffichee) {
  return `
    <div class="ressource">
      <span class="label">${label}</span>
      <button data-action="${action}" data-cle="${cle}" data-delta="-1">−</button>
      <span class="valeur">${valeurAffichee}</span>
      <button data-action="${action}" data-cle="${cle}" data-delta="1">+</button>
    </div>
  `;
}

function caracsLecture(perso) {
  // [cle, label] dans les paramètres = on "déballe" chaque paire (= Break Struct)
  const lignes = CARACS.map(([cle, label]) => `<li>${label} : ${signe(perso.caracs[cle])}</li>`);
  return `<ul>${lignes.join("")}</ul>`;
}

function caracsEdition(perso) {
  return CARACS.map(([cle, label]) =>
    ligneReglage("carac", cle, label, signe(perso.caracs[cle]))
  ).join("");
}

function ressourcesLecture(perso) {
  return `
    ${ligneRessource("pv", "PV", perso.ressources.pv)}
    <button data-action="ressource" data-ressource="pv" data-delta="99">Soin complet</button>
    ${ligneRessource("stress", "Stress", perso.ressources.stress)}
    ${ligneRessource("espoir", "Espoir", perso.ressources.espoir)}
  `;
}

// En édition, on règle le MAX de chaque ressource (= "limites configurables").
function ressourcesEdition(perso) {
  return RESSOURCES.map(([cle, label]) =>
    ligneReglage("max", cle, `${label} max`, perso.ressources[cle].max)
  ).join("");
}

// Écran FICHE : chaque bloc en lecture ou en édition selon modeEdition.
function afficherPersonnage(perso) {
  return `
    <div class="barre">
      <button class="retour" data-action="retour">← Liste</button>
      <button class="retour" data-action="editer">${modeEdition ? "✓ Terminé" : "✎ Modifier"}</button>
    </div>
    <article class="fiche">
      ${modeEdition ? identiteEdition(perso) : identiteLecture(perso)}

      <h3>Caractéristiques</h3>
      ${modeEdition ? caracsEdition(perso) : caracsLecture(perso)}

      <h3>Ressources</h3>
      ${modeEdition ? ressourcesEdition(perso) : ressourcesLecture(perso)}
    </article>
    ${modeEdition ? `<button class="supprimer" data-action="supprimer">Supprimer ce personnage</button>` : ""}
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
  res.actuel = borner(res.actuel + delta, 0, res.max); // Clamp 0 → max
  sauvegarder();
}

function modifierCarac(perso, cle, delta) {
  perso.caracs[cle] = borner(perso.caracs[cle] + delta, BORNES.carac.min, BORNES.carac.max);
  sauvegarder();
}

function modifierMax(perso, cle, delta) {
  const res = perso.ressources[cle];
  res.max = borner(res.max + delta, BORNES.maxRessource.min, BORNES.maxRessource.max);
  // PIÈGE : si le max descend sous la valeur actuelle (6/6 → max 5),
  // on aurait 6/5. On ramène donc l'actuel sous le nouveau max.
  res.actuel = Math.min(res.actuel, res.max);
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
      modeEdition = false;
      break;
    case "carac":
      modifierCarac(trouverPerso(persoOuvertId), bouton.dataset.cle, Number(bouton.dataset.delta));
      break;
    case "max":
      modifierMax(trouverPerso(persoOuvertId), bouton.dataset.cle, Number(bouton.dataset.delta));
      break;
    case "editer":
      modeEdition = !modeEdition; // ! = NOT : bascule true ↔ false (= Flip Flop)
      break;
    case "ressource":
      modifierRessource(
        trouverPerso(persoOuvertId),
        bouton.dataset.ressource,
        Number(bouton.dataset.delta)
      );
      break;
    case "ajouter":
      persoOuvertId = ajouterPerso().id; // on ouvre directement la fiche du nouveau...
      modeEdition = true;                // ...en mode édition, pour lui donner un nom
      break;
    case "supprimer": {
      const perso = trouverPerso(persoOuvertId);
      // confirm() = boîte OK / Annuler du navigateur. Renvoie true ou false.
      // Garde-fou : une suppression ne s'annule pas.
      if (confirm(`Supprimer ${perso.nom} ? C'est définitif.`)) {
        supprimerPerso(persoOuvertId);
        persoOuvertId = null; // le perso n'existe plus → retour à la liste
        modeEdition = false;
      }
      break;
    }
  }

  rendre(); // quelle que soit l'action : état modifié → on réaffiche
});

// --- 6. LA SAISIE : un écouteur pour tous les champs ---------
// "input" se déclenche à CHAQUE frappe (= un Event "On Text Changed").
// On met à jour la donnée et on sauvegarde, mais on NE rappelle PAS
// rendre() : ça reconstruirait le champ et fermerait le clavier.
document.getElementById("app").addEventListener("input", (event) => {
  const champ = event.target.dataset.champ;
  if (!champ) return;
  const perso = trouverPerso(persoOuvertId);

  if (champ === "niveau") {
    const n = parseInt(event.target.value, 10); // texte → nombre entier
    if (Number.isNaN(n)) return;                // champ vide pendant la frappe : on ignore
    perso.niveau = borner(n, BORNES.niveau.min, BORNES.niveau.max);
  } else {
    perso[champ] = event.target.value;
  }
  sauvegarder();
});

// Premier affichage au chargement de la page
sauvegarder(); // enregistre tout de suite la liste (utile juste après la migration)
rendre();
