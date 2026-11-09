// ============================================================
// Daggerheart Companion — logique de l'app
// ============================================================

// --- 0. LES TEXTES DE L'INTERFACE ---------------------------
// Tous les textes affichés à l'écran sont regroupés ICI
// (= une String Table d'Unreal). Le code écrit TEXTES.retour
// au lieu de "← List" en dur. Pour la traduction (V0.3), il suffira
// d'avoir un deuxième objet comme celui-ci, en français.
//
// Les textes "à trous" (un nom, un nombre à insérer) sont des petites
// FONCTIONS : (nom) => `Delete ${nom}?` (= un Format Text avec {Nom}).
//
// ⚠️ Seuls les TEXTES AFFICHÉS sont en anglais. Les clés internes
// (pv, espoir, caracs, data-action...) restent telles quelles : ce sont
// des identifiants, jamais montrés au joueur. Les changer casserait
// les sauvegardes pour rien.
const TEXTES = {
  // Caracs et ressources
  agility: "Agility",
  strength: "Strength",
  finesse: "Finesse",
  instinct: "Instinct",
  presence: "Presence",
  knowledge: "Knowledge",
  hp: "HP",
  stress: "Stress",
  hope: "Hope",
  max: (label) => `${label} max`,

  // Écran liste
  titreListe: (n) => `Characters (${n})`,
  niveauCourt: (n) => `Lvl ${n}`,
  nouveauPerso: "+ New character",
  exporter: "⬇ Export",
  importer: "⬆ Import",

  // Fiche
  retour: "← List",
  termine: "✓ Done",
  niveauLong: (n) => `Level ${n}`,
  caracteristiques: "Traits",
  ressources: "Resources",
  soinComplet: "Full heal",
  dupliquer: "Duplicate this character",
  supprimer: "Delete this character",

  // Champs d'édition
  nom: "Name",
  ascendance: "Ancestry",
  communaute: "Community",
  classe: "Class",
  niveau: "Level",

  // Valeurs par défaut
  sansNom: "Unnamed",
  suffixeCopie: " (copy)",

  // Messages (alert / confirm)
  confirmerSuppression: (nom) => `Delete ${nom}? This cannot be undone.`,
  jsonIllisible: "This file is not readable JSON.",
  pasUneSauvegarde: "This file doesn't look like a Daggerheart Companion save (or it comes from a newer version).",
  confirmerImport: (nb, nbActuels) =>
    `Import ${nb} character(s)?\n` +
    `This REPLACES the ${nbActuels} current character(s) and your lists.`,

  // Écran des listes (classes, ascendances, communautés)
  boutonListes: "☰ Lists",
  titreListes: "Lists",
  listeClasses: "Classes",
  listeAscendances: "Ancestries",
  listeCommunautes: "Communities",
  listeVide: "Empty for now.",
  nomEn: "Name (EN)",
  nomFr: "Name (FR, optional)",
  ajouterEntree: "+ Add",
  nomManquant: "Enter a name in English first.",
  doublon: (nom) => `"${nom}" is already in this list.`,
  confirmerRetrait: (nom) => `Remove ${nom} from the list?`,

  // Menus déroulants de la fiche
  choisir: "— Choose —",
  autre: "Other…",
  saisieLibre: "Type it here",
  listeVideAide: "This list is empty: fill it in ☰ Lists.",

  // Création / validation / correction MJ
  titreCreation: "New character",
  creer: "✓ Create character",
  brouillon: "Draft",
  manque: (champs) => `Missing: ${champs.join(", ")}.`,
  correctionMj: "✎ GM fix",
  confirmerCorrection: "Edit a finished character? (GM fix: identity, traits and max values)",
};

// --- 1. LA DONNÉE : une LISTE de personnages ----------------
// Un personnage = un "objet" (= Structure Blueprint).
// Plusieurs personnages = un "tableau" [ ... ] (= Array Blueprint) :
// une liste ordonnée, chaque élément a un index (0, 1, 2...).
//
// Persos par défaut, utilisés uniquement au tout premier lancement.
// ⚠️ Valeurs de départ (PV, stress, espoir) à vérifier dans les règles officielles.
// LICENCE : aucun nom tiré du SRD ici (classes, ascendances, communautés).
// Le dépôt est public : ces listes seront des données LOCALES saisies par le MJ.
const personnagesParDefaut = [
  {
    id: "perso-1",          // identifiant unique : sert à retrouver LE bon perso
    nom: "Lydia",
    ascendance: "",
    communaute: "",
    classe: "",
    niveau: 1,
    cree: true,
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
    ascendance: "",
    communaute: "",
    classe: "",
    niveau: 1,
    cree: true,
    caracs: { agility: 0, strength: 2, finesse: -1, instinct: 1, presence: 1, knowledge: 0 },
    ressources: {
      pv:     { actuel: 7, max: 7 },
      stress: { actuel: 0, max: 6 },
      espoir: { actuel: 2, max: 6 },
    },
  },
];

// La liste des caracs, dans l'ordre d'affichage : [clé, label].
// Une seule liste → affichage, édition ET validation l'utilisent.
// ⚠️ Déclarées ICI, en haut : un `const` n'existe qu'à partir de sa ligne,
// et charger() (plus bas) s'exécute au démarrage et en a besoin.
const CARACS = [
  ["agility", TEXTES.agility],
  ["strength", TEXTES.strength],
  ["finesse", TEXTES.finesse],
  ["instinct", TEXTES.instinct],
  ["presence", TEXTES.presence],
  ["knowledge", TEXTES.knowledge],
];

const RESSOURCES = [
  ["pv", TEXTES.hp],
  ["stress", TEXTES.stress],
  ["espoir", TEXTES.hope],
];

// Les 3 listes de référence, dans l'ordre d'affichage : [clé, titre].
// Même principe que CARACS : une seule liste pilote l'écran de gestion
// (et, à l'étape 3c, les menus déroulants).
const LISTES = [
  ["classes", TEXTES.listeClasses],
  ["ascendances", TEXTES.listeAscendances],
  ["communautes", TEXTES.listeCommunautes],
];

// Quel champ d'un perso se choisit dans quelle liste : [champ, liste, label].
const CHAMPS_LISTE = [
  ["ascendance", "ascendances", TEXTES.ascendance],
  ["communaute", "communautes", TEXTES.communaute],
  ["classe", "classes", TEXTES.classe],
];

// Valeur spéciale de l'option "Other…" dans les menus. Elle ne peut pas
// entrer en collision avec un vrai id : versId() ne fabrique jamais de "_".
const VALEUR_AUTRE = "__autre__";

// --- 1b. LA SAUVEGARDE : localStorage ------------------------
// localStorage = un petit coffre dans le navigateur, propre à ce site,
// qui survit à la fermeture de l'app. Il ne stocke QUE du texte,
// rangé sous une clé (comme un Save Game avec un "Slot Name").
const CLE_SAUVEGARDE = "dhc-personnages";      // nouveau slot : toute la liste
const ANCIENNE_CLE = "dhc-personnage";         // ancien slot : un seul perso (version d'avant)

// VERSION DU FORMAT DES DONNÉES (pas de l'app !).
// À incrémenter à chaque fois que la FORME d'un perso change
// (ex. futur passage des caracs à { base, modif }), en ajoutant
// l'étape de conversion correspondante dans migrer().
//   v1 : { version, personnages }
//   v2 : + listes (classes, ascendances, communautés saisies par le MJ)
//   v3 : + cree sur chaque perso (false = brouillon en cours de création)
const VERSION_DONNEES = 3;

// LISTES DE RÉFÉRENCE, version vide. Chaque liste contiendra des entrées
// { id, en, fr } (= une ligne de Data Table : un Row Name fixe + un texte
// par langue). Elles sont VIDES dans le code : c'est le MJ qui les remplit
// (licence : pas de contenu du SRD dans le dépôt public).
const LISTES_VIDES = { classes: [], ascendances: [], communautes: [] };

// Fabrique l'enveloppe à écrire. Une seule fonction pour la sauvegarde
// ET l'export : impossible que les deux formats divergent.
// Comme un Save Game qui écrit son propre numéro de version.
function enveloppe() {
  return { version: VERSION_DONNEES, personnages: personnages, listes: listes };
}

function sauvegarder() {
  localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(enveloppe())); // objet → texte
}

// MIGRATION : prend des données dans n'importe quel ancien format
// et les amène au format actuel, ÉTAPE PAR ÉTAPE (0→1, puis 1→2...).
// Renvoie l'enveloppe au format actuel { version, personnages, listes },
// ou null si les données sont inexploitables.
// Servira aussi à l'import JSON : un vieux fichier exporté sera converti pareil.
function migrer(donnees) {
  // Format 0 (avant cette version) : un tableau nu, sans enveloppe.
  if (Array.isArray(donnees)) {
    donnees = { version: 0, personnages: donnees };
  }

  // Garde-fou : est-ce que ça ressemble à notre enveloppe ?
  if (typeof donnees !== "object" || donnees === null || !Array.isArray(donnees.personnages)) {
    return null;
  }

  // L'escalier des migrations. Chaque marche convertit d'UNE version.
  // Une sauvegarde v0 passe par toutes les marches ; une v1 n'en passe aucune.
  if (donnees.version === 0) {
    // 0 → 1 : seule l'enveloppe change, les persos gardent leur forme.
    donnees.version = 1;
  }
  if (donnees.version === 1) {
    // 1 → 2 : on ajoute les listes, vides. Les persos ne changent pas.
    // structuredClone : chaque sauvegarde a SES listes, pas une référence
    // partagée vers LISTES_VIDES (sinon remplir l'une remplirait "l'original").
    donnees.listes = structuredClone(LISTES_VIDES);
    donnees.version = 2;
  }
  if (donnees.version === 2) {
    // 2 → 3 : chaque perso reçoit cree = true. Les persos qui existaient
    // déjà sont considérés comme terminés (pas de brouillon rétroactif).
    // forEach = ForEach Loop : on modifie chaque élément sur place.
    donnees.personnages.forEach((p) => { p.cree = true; });
    donnees.version = 3;
  }
  // Prochaine marche (étape 5) : if (donnees.version === 3) { caracs → { base, modif } ; version = 4 }

  if (donnees.version !== VERSION_DONNEES) {
    // Version inconnue (ex. sauvegarde faite par une version PLUS RÉCENTE de l'app).
    console.warn("Version de données inconnue :", donnees.version);
    return null;
  }

  // .every = "est-ce que TOUS les éléments vérifient la condition ?"
  // (= ForEach + Branch, qui s'arrête au premier false)
  if (!donnees.personnages.every(persoValide)) {
    console.warn("Un perso a une forme inattendue");
    return null;
  }

  if (!listesValides(donnees.listes)) {
    console.warn("Les listes ont une forme inattendue");
    return null;
  }

  return donnees;
}

// Vérifie les listes : un objet avec les 3 tableaux attendus, chaque entrée
// ayant au moins un id et un nom anglais (le nom français est facultatif).
function listesValides(l) {
  const entreeOk = (e) => typeof e === "object" && e !== null
    && typeof e.id === "string" && typeof e.en === "string";
  return typeof l === "object" && l !== null
    && Object.keys(LISTES_VIDES).every((cle) => Array.isArray(l[cle]) && l[cle].every(entreeOk));
}

// Vérifie qu'un perso a bien tous les morceaux dont l'affichage a besoin.
// Utile surtout pour l'import : un fichier peut venir de n'importe où.
function persoValide(p) {
  const estObjet = (x) => typeof x === "object" && x !== null;
  const resOk = (r) => estObjet(r) && typeof r.actuel === "number" && typeof r.max === "number";
  return estObjet(p)
    && typeof p.id === "string"
    && typeof p.nom === "string"
    && typeof p.niveau === "number"
    && typeof p.cree === "boolean"
    && estObjet(p.caracs)
    && CARACS.every(([cle]) => typeof p.caracs[cle] === "number")
    && estObjet(p.ressources)
    && RESSOURCES.every(([cle]) => resOk(p.ressources[cle]));
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
  // 1. Cas normal : il y a une sauvegarde → on la migre si besoin
  const brut = lireSlot(CLE_SAUVEGARDE);
  if (brut !== null) {
    const donnees = migrer(brut);
    if (donnees) return donnees;
  }

  // 1b. FILET DE SÉCURITÉ : une sauvegarde existe mais on n'a pas pu la lire
  // (JSON cassé, version inconnue...). Sans ça, on repartirait des persos par
  // défaut et le sauvegarder() du démarrage ÉCRASERAIT les vraies données.
  // On met donc le texte brut de côté, sous une autre clé, avant de continuer.
  const texteIllisible = localStorage.getItem(CLE_SAUVEGARDE);
  if (texteIllisible !== null) {
    localStorage.setItem(CLE_SAUVEGARDE + "-secours", texteIllisible);
    console.warn("Sauvegarde illisible mise de côté sous", CLE_SAUVEGARDE + "-secours");
  }

  // 2. Premier lancement de CETTE version : on part des persos par défaut...
  const nouvelleListe = structuredClone(personnagesParDefaut);

  // ...mais si l'ancienne version avait sauvegardé UN perso, on le récupère
  // à la place du premier perso par défaut. C'est une "migration" :
  // convertir une vieille sauvegarde au nouveau format.
  const ancienPerso = lireSlot(ANCIENNE_CLE);
  if (ancienPerso) nouvelleListe[0] = ancienPerso;

  return { personnages: nouvelleListe, listes: structuredClone(LISTES_VIDES) };
}

// charger() renvoie un objet ; on le "déballe" en deux variables
// (= Break Struct). Écrire { personnages, listes } à gauche du = revient à :
//   personnages = resultat.personnages ; listes = resultat.listes
let { personnages, listes } = charger();

// Quel perso est ouvert ? null = on est sur l'écran liste.
// C'est un "état" de l'interface : il n'est pas sauvegardé.
let persoOuvertId = null;

// La fiche est-elle en mode édition ? (état d'interface, non sauvegardé)
let modeEdition = false;

// Est-on sur l'écran de gestion des listes ? (état d'interface, non sauvegardé)
let ecranListes = false;

// Champs pour lesquels le MJ vient de choisir "Other…" mais n'a encore rien
// tapé. Sans ça, un champ vide afficherait "— Choose —" et la saisie libre
// disparaîtrait aussitôt. Un Set = une collection SANS doublons (= un Set
// en Blueprint) : .add(), .delete(), .has(). État d'interface, non sauvegardé.
let champsAutre = new Set();

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
    nom: "",            // vide exprès : la validation exige un vrai nom
    ascendance: "",
    communaute: "",
    classe: "",
    niveau: 1,
    cree: false,        // brouillon : la fiche s'ouvre en écran de création
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

function dupliquerPerso(perso) {
  const copie = structuredClone(perso);
  copie.id = "perso-" + Date.now();
  copie.nom = perso.nom + TEXTES.suffixeCopie;
  personnages.push(copie);
  sauvegarder();
  return copie;
}

function supprimerPerso(id) {
  // .filter garde tous les éléments qui vérifient la condition :
  // ici, tous SAUF celui qui a cet id. On obtient un NOUVEAU tableau.
  personnages = personnages.filter((p) => p.id !== id);
  sauvegarder();
}

// --- 1c bis. LES LISTES : ajouter / retirer une entrée -------

// Fabrique un identifiant à partir du nom anglais :
//   "Sea Born!" → "sea-born"
// C'est cet id qu'un perso enregistrera (étape 3c), JAMAIS le nom affiché :
// on pourra corriger une faute ou ajouter le français sans casser les persos.
// Les /.../ sont des "expressions régulières" (des motifs de recherche) :
//   [^a-z0-9]+  = "un ou plusieurs caractères qui ne sont NI lettre NI chiffre"
//   ^-|-$       = "un tiret au tout début OU à la toute fin"
function versId(texte) {
  return texte
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // retire les accents : é → e
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ajouterEntree(cle, en, fr) {
  en = en.trim();
  fr = fr.trim();
  if (!en) {
    alert(TEXTES.nomManquant);
    return;
  }
  // Nom fait uniquement de symboles ("???") → id vide : on en fabrique un.
  const id = versId(en) || "entree-" + Date.now();
  // .some = "est-ce qu'AU MOINS UN élément vérifie la condition ?"
  // (le contraire de .every). Ici : cet id existe-t-il déjà ?
  if (listes[cle].some((e) => e.id === id)) {
    alert(TEXTES.doublon(en));
    return;
  }
  listes[cle].push({ id: id, en: en, fr: fr });
  sauvegarder();
}

function retirerEntree(cle, id) {
  listes[cle] = listes[cle].filter((e) => e.id !== id);
  sauvegarder();
}

// COMMENT LIRE ascendance / communaute / classe d'un perso :
//   - "" ou "?"              → pas encore choisi
//   - un id d'une liste      → on affiche le nom de cette entrée
//   - autre chose            → texte libre ("Other…"), affiché tel quel
// Pas de migration nécessaire : les anciens textes libres restent valables.
// ⚠️ Dette assumée : un même champ contient soit un id, soit du texte.
// Si on retire une entrée de la liste, son id devient un texte libre
// "orphelin" (ex. "sea-born") : moche mais rien ne casse.
function estVide(valeur) {
  return valeur === "" || valeur === "?";
}

function trouverEntree(cleListe, id) {
  return listes[cleListe].find((e) => e.id === id);
}

// Le texte à afficher pour ce champ. V0.3 : on choisira e.en ou e.fr selon la langue.
function nomChoix(cleListe, valeur) {
  if (estVide(valeur)) return "?";
  const entree = trouverEntree(cleListe, valeur);
  return entree ? entree.en : valeur;
}

// Ce qui manque pour valider un brouillon. Renvoie la liste des labels
// manquants (tableau vide = tout est bon).
function champsManquants(perso) {
  const manquants = [];
  if (!perso.nom.trim()) manquants.push(TEXTES.nom);
  CHAMPS_LISTE.forEach(([champ, , label]) => {   // la virgule seule = "on saute la 2e valeur"
    if (estVide(perso[champ])) manquants.push(label);
  });
  return manquants;
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

function nomAffiche(perso) {
  return  perso.nom.trim() || TEXTES.sansNom;
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
      <strong>${echapper(nomAffiche(p))}${p.cree ? "" : ` <span class="badge">${TEXTES.brouillon}</span>`}</strong>
      <span>${echapper(nomChoix("classes", p.classe))} · ${echapper(nomChoix("ascendances", p.ascendance))} · ${TEXTES.niveauCourt(p.niveau)}</span>
      <span>${RESSOURCES.map(([cle, label]) => `${label} ${p.ressources[cle].actuel}/${p.ressources[cle].max}`).join(" · ")}</span>
    </button>
  `).join("");

  return `
    <h2>${TEXTES.titreListe(personnages.length)}</h2>
    ${cartes}
    <button class="ajouter" data-action="ajouter">${TEXTES.nouveauPerso}</button>
    <div class="barre fichiers">
      <button class="retour" data-action="exporter">${TEXTES.exporter}</button>
      <button class="retour" data-action="importer">${TEXTES.importer}</button>
    </div>
    <button class="retour" data-action="listes">${TEXTES.boutonListes}</button>
  `;
}

// Écran GESTION DES LISTES : pour chaque liste, ses entrées + un mini
// formulaire d'ajout. Chaque champ a un id unique (nouveau-en-classes...)
// pour qu'au clic sur "+ Add" on sache lequel lire.
function afficherGestionListes() {
  const blocs = LISTES.map(([cle, titre]) => {
    // [...tableau] = une COPIE, qu'on trie pour l'affichage sans toucher
    // à l'ordre stocké. localeCompare = comparaison alphabétique propre.
    const triees = [...listes[cle]].sort((a, b) => a.en.localeCompare(b.en));
    const lignes = triees.map((e) => `
      <li class="entree">
        <span>${echapper(e.en)}${e.fr ? ` <span class="fr">· ${echapper(e.fr)}</span>` : ""}</span>
        <button data-action="retirer-entree" data-cle="${cle}" data-id="${e.id}">✕</button>
      </li>
    `).join("");

    return `
      <article class="fiche bloc-liste">
        <h3>${titre} (${listes[cle].length})</h3>
        ${lignes ? `<ul class="entrees">${lignes}</ul>` : `<p class="vide">${TEXTES.listeVide}</p>`}
        <label class="champ">${TEXTES.nomEn}
          <input type="text" id="nouveau-en-${cle}">
        </label>
        <label class="champ">${TEXTES.nomFr}
          <input type="text" id="nouveau-fr-${cle}">
        </label>
        <button class="ajouter" data-action="ajouter-entree" data-cle="${cle}">${TEXTES.ajouterEntree}</button>
      </article>
    `;
  }).join("");

  return `
    <button class="retour" data-action="retour">${TEXTES.retour}</button>
    <h2>${TEXTES.titreListes}</h2>
    ${blocs}
  `;
}

// Bloc identité, version LECTURE.
function identiteLecture(perso) {
  return `
    <h2>${echapper(nomAffiche(perso))}</h2>
    <p>${CHAMPS_LISTE.map(([champ, cleListe]) => echapper(nomChoix(cleListe, perso[champ]))).join(" · ")} · ${TEXTES.niveauLong(perso.niveau)}</p>
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

// Un menu déroulant (<select>) rempli depuis une liste, + "Other…".
// data-choix = quel champ du perso ce menu modifie (comme data-champ).
// Si "Other…" est choisi, un champ texte libre apparaît dessous.
function champChoix(perso, champ, cleListe, label) {
  const valeur = perso[champ];
  const entree = trouverEntree(cleListe, valeur);
  // On est en "Other…" si le MJ vient de le choisir, OU si la valeur
  // est un texte qui ne correspond à aucune entrée de la liste.
  const autre = champsAutre.has(champ) || (!estVide(valeur) && !entree);

  const triees = [...listes[cleListe]].sort((a, b) => a.en.localeCompare(b.en));
  // selected = l'option affichée par défaut. ${cond ? "selected" : ""}
  // n'écrit le mot que pour la bonne option.
  const options = triees.map((e) =>
    `<option value="${e.id}" ${entree === e ? "selected" : ""}>${echapper(e.en)}</option>`
  ).join("");

  return `
    <label class="champ">${label}
      <select data-choix="${champ}">
        <option value="" ${!entree && !autre ? "selected" : ""}>${TEXTES.choisir}</option>
        ${options}
        <option value="${VALEUR_AUTRE}" ${autre ? "selected" : ""}>${TEXTES.autre}</option>
      </select>
      ${autre ? `<input type="text" data-champ="${champ}" placeholder="${TEXTES.saisieLibre}" value="${echapper(estVide(valeur) ? "" : valeur)}">` : ""}
      ${triees.length === 0 ? `<span class="aide">${TEXTES.listeVideAide}</span>` : ""}
    </label>
  `;
}

// Bloc identité, version ÉDITION.
function identiteEdition(perso) {
  return `
    ${champTexte(perso, "nom", TEXTES.nom)}
    ${CHAMPS_LISTE.map(([champ, cleListe, label]) => champChoix(perso, champ, cleListe, label)).join("")}
    <label class="champ">${TEXTES.niveau}
      <input type="number" inputmode="numeric" min="1" max="10" data-champ="niveau" value="${perso.niveau}">
    </label>
  `;
}

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
  const lignes = CARACS.map(([cle, label]) => `<li>${label}: ${signe(perso.caracs[cle])}</li>`);
  return `<ul>${lignes.join("")}</ul>`;
}

function caracsEdition(perso) {
  return CARACS.map(([cle, label]) =>
    ligneReglage("carac", cle, label, signe(perso.caracs[cle]))
  ).join("");
}

function ressourcesLecture(perso) {
  return `
    ${ligneRessource("pv", TEXTES.hp, perso.ressources.pv)}
    <button class="fillHeal" data-action="soin">${TEXTES.soinComplet}</button>
    ${ligneRessource("stress", TEXTES.stress, perso.ressources.stress)}
    ${ligneRessource("espoir", TEXTES.hope, perso.ressources.espoir)}
  `;
}

// En édition, on règle le MAX de chaque ressource (= "limites configurables").
function ressourcesEdition(perso) {
  return RESSOURCES.map(([cle, label]) =>
    ligneReglage("max", cle, TEXTES.max(label), perso.ressources[cle].max)
  ).join("");
}

// Écran FICHE : chaque bloc en lecture ou en édition selon modeEdition.
function afficherPersonnage(perso) {
  // Brouillon → écran de création (tout est éditable, sans passer par ✎).
  if (!perso.cree) return afficherCreation(perso);

  return `
    <div class="barre">
      <button class="retour" data-action="retour">${TEXTES.retour}</button>
      <button class="retour" data-action="editer">${modeEdition ? TEXTES.termine : TEXTES.correctionMj}</button>
    </div>
    <article class="fiche">
      ${modeEdition ? identiteEdition(perso) : identiteLecture(perso)}

      <h3>${TEXTES.caracteristiques}</h3>
      ${modeEdition ? caracsEdition(perso) : caracsLecture(perso)}

      <h3>${TEXTES.ressources}</h3>
      ${modeEdition ? ressourcesEdition(perso) : ressourcesLecture(perso)}
    </article>
    ${modeEdition ? `<button class="ajouter" data-action="dupliquer">${TEXTES.dupliquer}</button>` : ""}
    ${modeEdition ? `<button class="supprimer" data-action="supprimer">${TEXTES.supprimer}</button>` : ""}
  `;
}

// Écran CRÉATION : les mêmes blocs d'édition que la correction MJ
// (on réutilise identiteEdition, caracsEdition, ressourcesEdition),
// + un bouton pour valider. Un seul code pour les deux usages.
function afficherCreation(perso) {
  return `
    <button class="retour" data-action="retour">${TEXTES.retour}</button>
    <h2>${TEXTES.titreCreation}</h2>
    <article class="fiche">
      ${identiteEdition(perso)}

      <h3>${TEXTES.caracteristiques}</h3>
      ${caracsEdition(perso)}

      <h3>${TEXTES.ressources}</h3>
      ${ressourcesEdition(perso)}
    </article>
    <button class="ajouter" data-action="valider">${TEXTES.creer}</button>
    <button class="supprimer" data-action="supprimer">${TEXTES.supprimer}</button>
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

function soignerComplet(perso, cle, delta) {
  const res = perso.ressources[cle]; // [cle] = accès par nom variable, ex. ressources["pv"]
  res.actuel = res.max;
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

// --- 3b. EXPORT / IMPORT JSON --------------------------------

function exporter() {
  // Même enveloppe que la sauvegarde. null, 2 = texte indenté, lisible à l'œil.
  const texte = JSON.stringify(enveloppe(), null, 2);

  // Blob = un "fichier en mémoire". createObjectURL lui donne une adresse
  // temporaire, qu'on met sur un lien <a download> invisible qu'on "clique".
  const blob = new Blob([texte], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `daggerheart-${new Date().toISOString().slice(0, 10)}.json`; // ex. daggerheart-2026-11-07.json
  lien.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); // libère la mémoire un peu après
}

// async = fonction qui peut "attendre" (await) sans bloquer l'app,
// comme un nœud latent (Delay, Async Load Asset) en Blueprint.
async function importer(fichier) {
  let donnees;
  try {
    const texte = await fichier.text(); // lecture du fichier : prend un peu de temps
    donnees = JSON.parse(texte);
  } catch (erreur) {
    alert(TEXTES.jsonIllisible);
    return;
  }

  const resultat = migrer(donnees); // même escalier que la sauvegarde locale
  if (!resultat) {
    alert(TEXTES.pasUneSauvegarde);
    return;
  }

  const ok = confirm(TEXTES.confirmerImport(resultat.personnages.length, personnages.length));
  if (!ok) return;

  // Filet : on garde la liste actuelle de côté avant de l'écraser.
  localStorage.setItem(CLE_SAUVEGARDE + "-avant-import", localStorage.getItem(CLE_SAUVEGARDE));

  // L'import remplace TOUT : persos ET listes.
  personnages = resultat.personnages;
  listes = resultat.listes;
  persoOuvertId = null;
  modeEdition = false;
  sauvegarder();
  rendre();
}

// --- 4. LE RENDU : quel écran afficher ? ---------------------
// Comme un "Widget Switcher" : selon l'état, on affiche un des 3 écrans.
function rendre() {
  const zone = document.getElementById("app");
  if (ecranListes) {
    zone.innerHTML = afficherGestionListes();
    return;
  }
  const perso = trouverPerso(persoOuvertId);
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
      champsAutre.clear();
      break;
    case "retour":
      persoOuvertId = null;
      modeEdition = false;
      ecranListes = false;
      champsAutre.clear();
      break;
    case "listes":
      ecranListes = true;
      break;
    case "ajouter-entree": {
      const cle = bouton.dataset.cle;
      // On LIT la page ici (la valeur tapée), mais on ne la modifie pas :
      // la donnée change, puis rendre() redessine tout (champs vidés inclus).
      const en = document.getElementById(`nouveau-en-${cle}`).value;
      const fr = document.getElementById(`nouveau-fr-${cle}`).value;
      ajouterEntree(cle, en, fr);
      break;
    }
    case "retirer-entree": {
      const cle = bouton.dataset.cle;
      const entree = listes[cle].find((e) => e.id === bouton.dataset.id);
      if (entree && confirm(TEXTES.confirmerRetrait(entree.en))) {
        retirerEntree(cle, entree.id);
      }
      break;
    }
    case "carac":
      modifierCarac(trouverPerso(persoOuvertId), bouton.dataset.cle, Number(bouton.dataset.delta));
      break;
    case "max":
      modifierMax(trouverPerso(persoOuvertId), bouton.dataset.cle, Number(bouton.dataset.delta));
      break;
    case "exporter":
      exporter();
      break;
    case "importer":
      // On "clique" à sa place sur le sélecteur de fichier caché (dans index.html)
      document.getElementById("fichier-import").click();
      break;
    case "editer":
      // Entrer en correction MJ demande confirmation ; en sortir, non.
      if (!modeEdition && !confirm(TEXTES.confirmerCorrection)) break;
      champsAutre.clear();
      modeEdition = !modeEdition; // ! = NOT : bascule true ↔ false (= Flip Flop)
      break;
    case "valider": {
      const perso = trouverPerso(persoOuvertId);
      const manquants = champsManquants(perso);
      if (manquants.length > 0) {
        alert(TEXTES.manque(manquants));
        break;   // on reste sur l'écran de création
      }
      perso.cree = true;
      sauvegarder();
      champsAutre.clear();
      modeEdition = false;   // → la fiche s'affiche en mode jeu
      break;
    }
    case "ressource":
      modifierRessource(
        trouverPerso(persoOuvertId),
        bouton.dataset.ressource,
        Number(bouton.dataset.delta)
      );
      break;
    case "soin":
        soignerComplet(
        trouverPerso(persoOuvertId),"pv");
      break;
       
    case "ajouter":
      persoOuvertId = ajouterPerso().id; // cree: false → écran de création
      modeEdition = false;
      break;
    case "dupliquer":
      persoOuvertId = dupliquerPerso(trouverPerso(persoOuvertId)).id;
      modeEdition = true;
      break;
    case "supprimer": {
      const perso = trouverPerso(persoOuvertId);
      // confirm() = boîte OK / Annuler du navigateur. Renvoie true ou false.
      // Garde-fou : une suppression ne s'annule pas.
      if (confirm(TEXTES.confirmerSuppression(nomAffiche(perso)))) {
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

// --- 6b. LES MENUS DÉROULANTS --------------------------------
// "change" se déclenche quand on choisit une option dans un <select>.
// Ici on PEUT rappeler rendre() : pas de clavier ouvert à fermer, et il
// faut faire apparaître / disparaître le champ texte de "Other…".
document.getElementById("app").addEventListener("change", (event) => {
  const champ = event.target.dataset.choix;
  if (!champ) return;   // ex. un champ texte qui perd le focus : pas pour nous
  const perso = trouverPerso(persoOuvertId);
  const valeur = event.target.value;

  if (valeur === VALEUR_AUTRE) {
    champsAutre.add(champ);
    perso[champ] = "";        // le MJ va taper son texte dans le champ libre
  } else {
    champsAutre.delete(champ);
    perso[champ] = valeur;    // un id de la liste, ou "" pour "— Choose —"
  }
  sauvegarder();
  rendre();
});

// --- 7. LE FICHIER CHOISI POUR L'IMPORT ----------------------
// "change" se déclenche quand l'utilisateur a choisi un fichier.
document.getElementById("fichier-import").addEventListener("change", (event) => {
  const fichier = event.target.files[0]; // files = liste ; on n'en prend qu'un
  if (fichier) importer(fichier);
  // PIÈGE : sans ça, rechoisir le MÊME fichier ne redéclenche pas "change"
  event.target.value = "";
});

// Premier affichage au chargement de la page
sauvegarder(); // enregistre tout de suite la liste (utile juste après la migration)
rendre();
