// ============================================================
// Duality Companion — logique de l'app
// (dépôt GitHub encore nommé daggerheart-companion ; les clés localStorage
// gardent le préfixe "dhc-" exprès : les renommer perdrait les sauvegardes)
// ============================================================

// --- 0. LES TEXTES DE L'INTERFACE ---------------------------
// Tous les textes affichés à l'écran sont regroupés ICI
// (= une String Table d'Unreal). Le code écrit TEXTES.retour
// au lieu de "← Liste" en dur. Pour ajouter l'anglais plus tard, il
// suffira d'avoir un deuxième objet comme celui-ci.
//
// Les textes "à trous" (un nom, un nombre à insérer) sont des petites
// FONCTIONS : (nom) => `Delete ${nom}?` (= un Format Text avec {Nom}).
//
// ⚠️ Les clés internes
// (pv, espoir, caracs, data-action...) restent telles quelles : ce sont
// des identifiants, jamais montrés au joueur. Les changer casserait
// les sauvegardes pour rien.
const TEXTES = {
  // Caracs et ressources
  // ⚠️ Traductions maison : si une édition française officielle existe,
  // ses termes peuvent différer (à vérifier un jour).
  agility: "Agilité",
  strength: "Force",
  finesse: "Finesse",
  instinct: "Instinct",
  presence: "Présence",
  knowledge: "Savoir",
  hp: "PV",
  stress: "Stress",
  hope: "Espoir",
  max: (label) => `${label} max`,

  // Écran liste
  titreListe: (n) => `Personnages (${n})`,
  nouveauPerso: "+ Nouveau personnage",
  exporter: "⬇ Exporter",
  importer: "⬆ Importer",

  // Fiche
  retour: "← Liste",
  termine: "✓ Terminé",
  niveauLong: (n) => `Niveau ${n}`,
  caracteristiques: "Caractéristiques",
  ressources: "Ressources",
  soinComplet: "Soin complet",
  dupliquer: "Dupliquer ce personnage",
  supprimer: "Supprimer ce personnage",

  // Champs d'édition
  nom: "Nom",
  ascendance: "Ascendance",
  communaute: "Communauté",
  classe: "Classe",
  sousClasse: "Sous-classe",
  niveau: "Niveau",

  // Valeurs par défaut
  sansNom: "Sans nom",
  suffixeCopie: " (copie)",

  // Messages (alert / confirm)
  confirmerSuppression: (nom) => `Supprimer ${nom} ? C'est définitif.`,
  jsonIllisible: "Ce fichier n'est pas un JSON lisible.",
  pasUneSauvegarde: "Ce fichier ne ressemble pas à une sauvegarde Duality Companion (ou vient d'une version plus récente).",
  confirmerImport: (nb, nbActuels) =>
    `Importer ${nb} personnage(s) ?\n` +
    `Ça REMPLACE les ${nbActuels} personnage(s) actuels et tes listes.`,

  // Écran des listes (classes, ascendances, communautés)
  boutonListes: "☰ Listes",
  titreListes: "Listes",
  listeClasses: "Classes",
  listeAscendances: "Ascendances",
  listeCommunautes: "Communautés",
  listeVide: "Vide pour l'instant.",
  nomFr: "Nom",
  nomEn: "Nom anglais (facultatif)",
  ajouterEntree: "+ Ajouter",
  nomManquant: "Indique d'abord un nom.",
  doublon: (nom) => `« ${nom} » est déjà dans cette liste.`,
  confirmerRetrait: (nom) => `Retirer ${nom} de la liste ?`,
  titreEditionEntree: (nom) => `Modifier : ${nom}`,
  titreNouvelleSousClasse: (classe) => `Nouvelle sous-classe de ${classe}`,
  sousClasseDe: (classe) => `Sous-classe de ${classe}`,
  ajouterSousClasse: "+ Sous-classe",
  confirmerRetraitClasse: (nom, n) => `Retirer ${nom} de la liste ?` + (n > 0 ? ` Ses ${n} sous-classe(s) seront retirées aussi.` : ""),
  choisirClasseDabord: "Choisis d'abord une classe.",
  aucuneSousClasse: "Aucune sous-classe pour cette classe : ajoute-en dans ☰ Listes.",
  horsListe: (v) => `${v} (hors liste)`,
  capacites: "Capacités",
  capaciteN: (n) => `Capacité ${n}`,
  nomCapacite: "Nom",
  texteCapacite: "Texte",
  ajouterCapacite: "+ Capacité",
  nbCapacites: (n) => `${n} cap.`,
  capaciteSansNom: "Une capacité a un texte mais pas de nom.",
  confirmerRetraitCapacite: (nom) => `Retirer la capacité ${nom || "sans nom"} ?`,
  confirmerAbandon: "Abandonner les modifications non enregistrées ?",
  ongletFiche: "Fiche",
  listeDomaines: "Domaines",
  couleur: "Couleur",
  domaineN: (n) => `Domaine ${n}`,
  aucunDomaine: "— Aucun —",
  aideDomaines: "Les capacités de la classe (et de ses sous-classes) prennent les couleurs de ses 2 domaines.",

  compteurCapacite: (i, n) => `Capacité ${i} / ${n}`,
  precedente: "Carte précédente",
  suivante: "Carte suivante",
  aucuneCapacite: "Aucune capacité pour l'instant : ajoute-les dans ☰ Listes (✎ sur la classe, la sous-classe, l'ascendance ou la communauté).",
  enregistrer: "✓ Enregistrer",
  annuler: "✕ Annuler",

  // Menus déroulants de la fiche
  choisir: "— Choisir —",
  autre: "Autre…",
  saisieLibre: "Écris-le ici",
  listeVideAide: "Cette liste est vide : remplis-la dans ☰ Listes.",

  // Création / validation / correction MJ
  titreCreation: "Nouveau personnage",
  creer: "✓ Créer le personnage",
  reserve: "Valeurs à placer",
  toutPlace: "Tout est placé ✓",
  aideJetons: "Touche une valeur, puis une caractéristique. Touche une carac remplie pour reprendre sa valeur.",
  brouillon: "Brouillon",
  manque: (champs) => `Il manque : ${champs.join(", ")}.`,
  correctionMj: "✎ Correction MJ",
  annuler: "✕ Annuler",
  confirmerCorrection: "Modifier un personnage terminé ? (correction MJ : identité, caracs et max)",

  // Modificateurs temporaires (buff / debuff)
  modif: "Modif.",
  retirerModifs: "Retirer tous les modificateurs",

  // Écran "À propos"
  boutonAPropos: "ⓘ À propos",
  titreAPropos: "À propos",
  version: (v, build) => `Version ${v} · build ${build}`,
  presentation: "Application de fan, gratuite et sans publicité, pour gérer les fiches de personnages à la table. Compatible avec le jeu de rôle Daggerheart.",
  titreDonnees: "Tes données",
  donnees: "Tout reste sur cet appareil (aucun compte, aucun serveur). Vider les données du navigateur efface tes personnages et tes listes : fais régulièrement un ⬇ Exporter pour garder une sauvegarde.",
  titreAvertissement: "Avertissement",
  nonAffiliation: "Projet non officiel. Il n'est ni affilié à, ni approuvé, ni sponsorisé par Darrington Press ou Critical Role. Daggerheart est une marque de Darrington Press, LLC.",
  titreCredits: "Crédits",
  credits: "Conçu par Enguy. Code écrit avec l'aide de Claude (une IA d'Anthropic).",
  codeSource: "Code source sur GitHub",
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
    sousClasse: "",
    niveau: 1,
    cree: true,
    caracs: versCaracs({ agility: 3, strength: -1, finesse: 1, instinct: 1, presence: 0, knowledge: 0 }),
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
    sousClasse: "",
    niveau: 1,
    cree: true,
    caracs: versCaracs({ agility: 0, strength: 2, finesse: -1, instinct: 1, presence: 1, knowledge: 0 }),
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

// Valeurs à répartir sur les 6 caracs à la création (règle vérifiée dans le SRD).
const PRESET_CARACS = [2, 1, 1, 0, 0, -1];

const RESSOURCES = [
  ["pv", TEXTES.hp],
  ["stress", TEXTES.stress],
  ["espoir", TEXTES.hope],
];

// Les 3 listes de référence, dans l'ordre d'affichage : [clé, titre].
// Même principe que CARACS : une seule liste pilote l'écran de gestion
// (et, à l'étape 3c, les menus déroulants).
const LISTES = [
  ["domaines", TEXTES.listeDomaines],   // avant les classes : elles s'y réfèrent
  ["classes", TEXTES.listeClasses],
  ["ascendances", TEXTES.listeAscendances],
  ["communautes", TEXTES.listeCommunautes],
];

// Quel champ d'un perso se choisit dans quelle liste.
// Un objet par champ (plus lisible qu'un tableau quand il y a 5 infos) :
//   champ  = la propriété du perso         liste = la liste de référence
//   label  = le texte affiché              autre = "Autre…" (texte libre) permis ?
//   parent = (facultatif) champ dont dépend celui-ci : on ne propose que
//            les entrées dont e.classe === perso.classe.
// L'ORDRE de ce tableau = l'ordre d'affichage partout (liste des persos,
// fiche, formulaire). Choix d'Enguy : classe, sous-classe, ascendance, communauté.
const CHAMPS_LISTE = [
  { champ: "classe", liste: "classes", label: TEXTES.classe, autre: false },
  { champ: "sousClasse", liste: "sousClasses", label: TEXTES.sousClasse, autre: false, parent: "classe" },
  { champ: "ascendance", liste: "ascendances", label: TEXTES.ascendance, autre: true },
  { champ: "communaute", liste: "communautes", label: TEXTES.communaute, autre: true },
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
//   v4 : chaque carac devient { base, modif } (modificateur temporaire)
//   v5 : + liste sousClasses (chaque entrée a un champ classe = id de sa
//        classe) ; chaque perso reçoit sousClasse: ""
//   v6 : chaque entrée de liste reçoit capacites: [{ nom, texte }]
//   v7 : + liste domaines (entrées avec couleur "#rrggbb") ; chaque classe
//        reçoit domaines: [] (ids de ses 2 domaines)
const VERSION_DONNEES = 7;

// Version de l'APP (affichée dans "À propos"). À ne pas confondre avec
// VERSION_DONNEES, qui ne change que quand la forme des données change.
const VERSION_APP = "0.3-dev";

// Numéro de BUILD = le N de "app.js?v=N" dans index.html. On le LIT
// plutôt que de le recopier : une seule source de vérité, impossible
// d'oublier de le mettre à jour. document.currentScript = la balise
// <script> en train de s'exécuter ; new URL(...).searchParams lit le
// "?v=30" de son adresse. "?" si on ne trouve rien (filet).
const BUILD = (() => {
  try {
    return new URL(document.currentScript.src).searchParams.get("v") || "?";
  } catch (e) {
    return "?";
  }
})();

// Convertit des caracs "simples" { agility: 2, ... } en { agility: { base: 2, modif: 0 }, ... }.
// Sert aux persos par défaut, aux nouveaux persos ET à la migration 3 → 4.
// BASE et MODIF restent SÉPARÉS : on ne les fusionne jamais, sinon on ne
// pourrait plus retirer un debuff sans perdre la vraie valeur.
// Object.keys = la liste des clés d'un objet (agility, strength...).
// (Une "function" classique est utilisable même AVANT sa ligne dans le fichier,
// contrairement à un const : c'est pour ça que les persos par défaut, plus haut,
// peuvent l'appeler.)
function versCaracs(simples) {
  const resultat = {};
  Object.keys(simples).forEach((cle) => {
    resultat[cle] = { base: simples[cle], modif: 0 };
  });
  return resultat;
}

// LISTES DE RÉFÉRENCE, version vide. Chaque liste contiendra des entrées
// { id, en, fr } (= une ligne de Data Table : un Row Name fixe + un texte
// par langue). Elles sont VIDES dans le code : c'est le MJ qui les remplit
// (licence : pas de contenu du SRD dans le dépôt public).
const LISTES_VIDES = { classes: [], ascendances: [], communautes: [], sousClasses: [], domaines: [] };

// Couleur par défaut d'un nouveau domaine (gris neutre).
const COULEUR_DEFAUT = "#8a8a8a";

// Une couleur "sûre" = exactement # + 6 chiffres hexadécimaux.
// ^ et $ = début et fin du texte : rien d'autre ne peut s'y glisser.
// Important : la couleur finit dans un attribut style="..." ; une valeur
// piégée (ex. dans un JSON importé) pourrait sinon y injecter du code.
const RE_COULEUR = /^#[0-9a-f]{6}$/i;
function couleurSure(c) {
  return typeof c === "string" && RE_COULEUR.test(c) ? c : COULEUR_DEFAUT;
}

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
  if (donnees.version === 3) {
    // 3 → 4 : caracs { agility: 2 } → { agility: { base: 2, modif: 0 } }.
    // La valeur existante devient la BASE, sans modificateur.
    donnees.personnages.forEach((p) => { p.caracs = versCaracs(p.caracs); });
    donnees.version = 4;
  }
  if (donnees.version === 4) {
    // 4 → 5 : liste des sous-classes (vide) + champ sousClasse sur chaque perso.
    donnees.listes.sousClasses = [];
    donnees.personnages.forEach((p) => { p.sousClasse = ""; });
    donnees.version = 5;
  }
  if (donnees.version === 5) {
    // 5 → 6 : chaque entrée de chaque liste reçoit une liste de capacités vide.
    // Object.values = les valeurs d'un objet (ici : les 4 tableaux de listes).
    Object.values(donnees.listes).forEach((liste) => {
      liste.forEach((e) => { e.capacites = []; });
    });
    donnees.version = 6;
  }
  if (donnees.version === 6) {
    // 6 → 7 : liste des domaines (vide) + domaines: [] sur chaque classe.
    donnees.listes.domaines = [];
    donnees.listes.classes.forEach((e) => { e.domaines = []; });
    donnees.version = 7;
  }

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
// ayant au moins un id et un nom (français, ou anglais pour les anciennes entrées).
function listesValides(l) {
  const capaciteOk = (c) => typeof c === "object" && c !== null
    && typeof c.nom === "string" && typeof c.texte === "string";
  const entreeOk = (e) => typeof e === "object" && e !== null
    && typeof e.id === "string"
    && (typeof e.fr === "string" || typeof e.en === "string")
    && Array.isArray(e.capacites) && e.capacites.every(capaciteOk);
  return typeof l === "object" && l !== null
    && Object.keys(LISTES_VIDES).every((cle) => Array.isArray(l[cle]) && l[cle].every(entreeOk))
    // Une sous-classe doit dire à quelle classe elle appartient.
    && l.sousClasses.every((e) => typeof e.classe === "string")
    // Un domaine a une couleur valide ; une classe, une liste d'ids de domaines.
    && l.domaines.every((e) => typeof e.couleur === "string" && RE_COULEUR.test(e.couleur))
    && l.classes.every((e) => Array.isArray(e.domaines) && e.domaines.every((d) => typeof d === "string"));
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
    && typeof p.sousClasse === "string"
    && estObjet(p.caracs)
    // Une carac = { base, modif }. base null est permis seulement pour un
    // brouillon (= valeur pas encore placée à la création).
    && CARACS.every(([cle]) => {
      const c = p.caracs[cle];
      return estObjet(c)
        && typeof c.modif === "number"
        && (typeof c.base === "number" || (!p.cree && c.base === null));
    })
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

// Écran "spécial" affiché par-dessus la liste / la fiche :
//   null = aucun (liste ou fiche selon persoOuvertId), "listes", "apropos",
//   "entree" (modification d'une entrée de liste).
// Un seul état au lieu d'un booléen par écran : impossible d'en avoir
// deux "ouverts" en même temps. (État d'interface, non sauvegardé.)
let ecran = null;

// Quelle entrée de liste est en cours de modification (écran "entree"), ou null :
//   { cle, id, classe, brouillon, original }
//   id null        = création (d'une sous-classe, rattachée à classe)
//   brouillon      = COPIE de l'entrée que l'écran modifie à chaque frappe
//   original       = la même copie, intacte, pour savoir s'il y a eu des changements
// Rien ne touche la vraie liste avant "✓ Enregistrer". État d'interface.
let entreeEditee = null;

// Quelle carte du deck est affichée (0 = la première). État d'interface,
// gardé à part car rendre() redessine toute la fiche à chaque +/− :
// sans ça, le deck reviendrait à la 1re carte à chaque clic sur les PV.
let indexDeck = 0;

// Carte visée par un bouton ◀ ▶ pendant son animation (null sinon).
// Pendant l'animation, la position passe par des valeurs intermédiaires :
// sans ce verrou, le compteur reculerait et un 2e tap rapide irait au
// mauvais endroit.
let cibleDeck = null;
let minuterieDeck = null;

// Ouvre l'écran d'entrée : prépare le brouillon (copie profonde).
function ouvrirEntree(cle, id, classe) {
  const e = id ? trouverEntree(cle, id) : { fr: "", en: "", classe: classe, capacites: [] };
  const copie = { fr: e.fr || "", en: e.en || "", capacites: structuredClone(e.capacites || []) };
  if (cle === "domaines") copie.couleur = couleurSure(e.couleur);
  // Toujours 2 cases pour les 2 domaines d'une classe ("" = aucun).
  if (cle === "classes") copie.domaines = [(e.domaines || [])[0] || "", (e.domaines || [])[1] || ""];
  entreeEditee = { cle, id, classe: id ? e.classe : classe, brouillon: copie, original: structuredClone(copie) };
  ecran = "entree";
}

// Le brouillon a-t-il changé ? Comparer deux objets champ par champ est
// long ; on compare leur version texte JSON (assez fiable ici).
function brouillonModifie() {
  return entreeEditee
    && JSON.stringify(entreeEditee.brouillon) !== JSON.stringify(entreeEditee.original);
}

// Nettoie les capacités du brouillon avant d'enregistrer :
// espaces en trop retirés, capacités complètement vides ignorées.
// Renvoie le tableau propre, ou null si une capacité a un texte sans nom.
function capacitesPropres(capacites) {
  const propres = capacites
    .map((c) => ({ nom: c.nom.trim(), texte: c.texte.trim() }))
    .filter((c) => c.nom || c.texte);
  if (propres.some((c) => !c.nom)) {
    alert(TEXTES.capaciteSansNom);
    return null;
  }
  return propres;
}

// Champs pour lesquels le MJ vient de choisir "Other…" mais n'a encore rien
// tapé. Sans ça, un champ vide afficherait "— Choose —" et la saisie libre
// disparaîtrait aussitôt. Un Set = une collection SANS doublons (= un Set
// en Blueprint) : .add(), .delete(), .has(). État d'interface, non sauvegardé.
let champsAutre = new Set();

// Copie du perso prise en ENTRANT en correction MJ (= un "snapshot").
// Les modifs sont sauvegardées à chaque frappe ; "✕ Cancel" remet cette
// copie à la place du perso modifié. null = pas de correction en cours.
let copieAvantCorrection = null;

// À la création : la valeur "dans la main" (touchée dans la réserve ou
// reprise d'une carac), ou null si rien n'est sélectionné. État d'interface.
let jetonSelectionne = null;

// En mode jeu : quelle carac a son réglage de modificateur ouvert ? (null = aucune)
let caracOuverte = null;

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
    sousClasse: "",
    niveau: 1,
    cree: false,        // brouillon : la fiche s'ouvre en écran de création
    // null = pas encore placée (le MJ répartit PRESET_CARACS à la création)
    caracs: versCaracs({ agility: null, strength: null, finesse: null, instinct: null, presence: null, knowledge: null }),
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

// Fabrique un identifiant à partir du nom :
//   "Né de la Mer !" → "ne-de-la-mer"
// C'est cet id qu'un perso enregistrera (étape 3c), JAMAIS le nom affiché :
// on pourra corriger une faute ou ajouter l'anglais sans casser les persos.
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

// Le nom affiché d'une entrée : le français, sinon l'anglais
// (les entrées créées quand l'app était en anglais n'ont que "en").
function nomEntree(e) {
  return e.fr || e.en;
}

// Un autre élément de la liste porte-t-il déjà ce nom ? On compare les
// noms "normalisés" (versId : sans accents ni majuscules), donc « Orc »
// et « orc » sont des doublons. sauf = l'id à ignorer (l'entrée qu'on
// est en train de modifier : elle a forcément son propre nom).
// .some = "est-ce qu'AU MOINS UN élément vérifie la condition ?"
function nomPris(cle, fr, sauf) {
  return listes[cle].some((e) => e.id !== sauf && versId(nomEntree(e)) === versId(fr));
}

// Fabrique un id qui n'existe pas encore dans la liste : "orc", sinon
// "orc-2", "orc-3"... Utile car un id ne change JAMAIS, même si on renomme
// l'entrée : "orc" renommé en « Ogre » garde l'id "orc", et un nouvel
// « Orc » ajouté ensuite doit prendre un autre id.
function idLibre(cle, fr) {
  // Nom fait uniquement de symboles ("???") → base vide : on en fabrique une.
  const base = versId(fr) || "entree-" + Date.now();
  let id = base;
  let n = 2;
  while (listes[cle].some((e) => e.id === id)) {
    id = `${base}-${n}`;
    n++;
  }
  return id;
}

// Les champs propres à certaines listes, avec leur valeur de départ.
function champsEnPlus(cle) {
  if (cle === "domaines") return { couleur: COULEUR_DEFAUT };
  if (cle === "classes") return { domaines: [] };
  return {};
}

// Renvoie true si l'ajout a réussi, false sinon (nom vide, doublon).
// extra = champs en plus pour certaines listes (ex. { classe: "id" } pour
// une sous-classe). ...extra = "étale" ses champs dans la nouvelle entrée.
function ajouterEntree(cle, fr, en, extra = {}) {
  fr = fr.trim();
  en = en.trim();
  if (!fr) {
    alert(TEXTES.nomManquant);
    return false;
  }
  if (nomPris(cle, fr, null)) {
    alert(TEXTES.doublon(fr));
    return false;
  }
  // capacites: [] d'abord, puis ...extra (qui peut le remplacer).
  listes[cle].push({ id: idLibre(cle, fr), fr: fr, en: en, capacites: [], ...extra });
  sauvegarder();
  return true;
}

// Modifie le nom d'une entrée. L'id NE CHANGE PAS : c'est lui que les
// persos stockent (classe: "seraphin"). Comme le Row Name d'une Data
// Table : on peut changer tout le contenu de la ligne, mais si on
// renommait la ligne, tout ce qui pointe dessus serait cassé.
// Résultat : renommer une classe met à jour tous les persos d'un coup.
// extra = champs propres à la liste (couleur d'un domaine, domaines d'une classe).
function modifierEntree(cle, id, fr, en, capacites, extra = {}) {
  fr = fr.trim();
  en = en.trim();
  if (!fr) {
    alert(TEXTES.nomManquant);
    return false;
  }
  if (nomPris(cle, fr, id)) {
    alert(TEXTES.doublon(fr));
    return false;
  }
  const entree = trouverEntree(cle, id);
  if (!entree) return false;
  entree.fr = fr;
  entree.en = en;
  entree.capacites = capacites;
  // Object.assign = copie les champs de extra dans entree (≈ Set Members).
  Object.assign(entree, extra);
  sauvegarder();
  return true;
}

function retirerEntree(cle, id) {
  listes[cle] = listes[cle].filter((e) => e.id !== id);
  // Retirer une classe retire aussi ses sous-classes (en cascade) :
  // sinon elles resteraient orphelines, invisibles dans ☰ Listes.
  if (cle === "classes") {
    listes.sousClasses = listes.sousClasses.filter((e) => e.classe !== id);
  }
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

// Le texte à afficher pour ce champ.
function nomChoix(cleListe, valeur) {
  if (estVide(valeur)) return "?";
  const entree = trouverEntree(cleListe, valeur);
  return entree ? nomEntree(entree) : valeur;
}

// --- La répartition des caracs à la création ---
// La RÉSERVE n'est pas stockée : on la recalcule = PRESET_CARACS moins les
// valeurs déjà posées. Une seule source de vérité (perso.caracs), donc
// impossible d'avoir une réserve et des caracs qui se contredisent.
// .splice(i, 1) = retirer 1 élément à l'index i (= Remove Index).
function reserve(perso) {
  const restant = [...PRESET_CARACS];
  CARACS.forEach(([cle]) => {
    const v = perso.caracs[cle].base;
    if (v === null) return;
    const i = restant.indexOf(v);   // indexOf = Find : -1 si absent
    if (i !== -1) restant.splice(i, 1);
  });
  return restant;
}

// Les valeurs posées viennent-elles bien du preset ? (faux pour un brouillon
// créé avant cette version, qui a six 0 : il faut le remettre à vide)
function repartitionCoherente(perso) {
  const restant = [...PRESET_CARACS];
  return CARACS.every(([cle]) => {
    const v = perso.caracs[cle].base;
    if (v === null) return true;
    const i = restant.indexOf(v);
    if (i === -1) return false;
    restant.splice(i, 1);
    return true;
  });
}

function preparerBrouillon(perso) {
  if (perso && !perso.cree && !repartitionCoherente(perso)) {
    CARACS.forEach(([cle]) => { perso.caracs[cle].base = null; });
    sauvegarder();
  }
}

// Les entrées proposées pour un champ : toute la liste, ou seulement
// celles rattachées au parent (les sous-classes de la classe choisie).
// .filter = garder les éléments qui vérifient la condition.
function entreesPour(perso, c) {
  const toutes = listes[c.liste];
  if (!c.parent) return toutes;
  return toutes.filter((e) => e.classe === perso[c.parent]);
}

// Le choix actuel est-il acceptable pour valider ?
//   - champ avec "Autre…" : n'importe quel texte non vide ;
//   - champ sans "Autre…" : un id qui existe dans les entrées proposées.
function choixValide(perso, c) {
  const valeur = perso[c.champ];
  if (estVide(valeur)) return false;
  if (c.autre) return true;
  return entreesPour(perso, c).some((e) => e.id === valeur);
}

// Ce qui manque pour valider un brouillon. Renvoie la liste des labels
// manquants (tableau vide = tout est bon).
function champsManquants(perso) {
  const manquants = [];
  if (!perso.nom.trim()) manquants.push(TEXTES.nom);
  if (reserve(perso).length > 0) manquants.push(TEXTES.caracteristiques);
  CHAMPS_LISTE.forEach((c) => {
    if (!choixValide(perso, c)) manquants.push(c.label);
  });
  return manquants;
}

// --- 1d. LES BORNES -----------------------------------------
// Regroupées ici pour les retrouver facilement.
// ⚠️ Valeurs PROVISOIRES, à vérifier dans les règles officielles.
const BORNES = {
  niveau: { min: 1, max: 10 },
  carac:  { min: -5, max: 9 },
  modif:  { min: -5, max: 5 },
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

// "Gardien · Rempart · Orc · Village", dans l'ordre de CHAMPS_LISTE.
// Une seule fonction pour la liste des persos ET la fiche : même ordre partout.
function resumeIdentite(perso) {
  return CHAMPS_LISTE.map((c) => echapper(nomChoix(c.liste, perso[c.champ]))).join(" · ");
}

// Le niveau dans un petit cercle. aria-label = ce que lit un lecteur
// d'écran (sinon il dirait juste "1").
function pastilleNiveau(n) {
  return `<span class="niveau" aria-label="${TEXTES.niveauLong(n)}">${n}</span>`;
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
      <span class="ligne-nom">
        <strong>${echapper(nomAffiche(p))}${p.cree ? "" : ` <span class="badge">${TEXTES.brouillon}</span>`}</strong>
        ${pastilleNiveau(p.niveau)}
      </span>
      <span>${resumeIdentite(p)}</span>
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
    <div class="barre fichiers">
      <button class="retour" data-action="listes">${TEXTES.boutonListes}</button>
      <button class="retour" data-action="apropos">${TEXTES.boutonAPropos}</button>
    </div>
  `;
}

// Écran À PROPOS : rien d'interactif, juste du texte.
// target="_blank" = ouvrir le lien dans un nouvel onglet ;
// rel="noopener" = sécurité standard qui va avec.
function afficherAPropos() {
  return `
    <button class="retour" data-action="retour">${TEXTES.retour}</button>
    <h2>${TEXTES.titreAPropos}</h2>
    <article class="fiche texte">
      <p><strong>Duality Companion</strong> · ${TEXTES.version(VERSION_APP, BUILD)}</p>
      <p>${TEXTES.presentation}</p>
      <h3>${TEXTES.titreDonnees}</h3>
      <p>${TEXTES.donnees}</p>
      <h3>${TEXTES.titreAvertissement}</h3>
      <p>${TEXTES.nonAffiliation}</p>
      <h3>${TEXTES.titreCredits}</h3>
      <p>${TEXTES.credits}</p>
      <p><a href="https://github.com/EnguerrandM/daggerheart-companion" target="_blank" rel="noopener">${TEXTES.codeSource}</a></p>
    </article>
  `;
}

// Écran MODIFIER UNE ENTRÉE. Contrairement à la fiche (sauvegarde à
// chaque frappe), ici rien n'est enregistré avant "✓ Enregistrer" :
// "✕ Annuler" n'a donc rien à défaire, il suffit de quitter l'écran.
// (Cet écran accueillera les capacités à l'étape 3.)
// Les 2 menus "Domaine 1 / Domaine 2" de l'écran d'une classe.
// data-domaine = l'index (0 ou 1) dans brouillon.domaines.
function choixDomaines(b) {
  const menus = [0, 1].map((i) => `
    <label class="champ">${TEXTES.domaineN(i + 1)}
      <select data-domaine="${i}">
        <option value="">${TEXTES.aucunDomaine}</option>
        ${trier(listes.domaines).map((d) =>
          `<option value="${d.id}" ${b.domaines[i] === d.id ? "selected" : ""}>${echapper(nomEntree(d))}</option>`
        ).join("")}
      </select>
    </label>
  `).join("");
  return menus + `<p class="aide">${TEXTES.aideDomaines}</p>`;
}

function afficherEditionEntree() {
  const { cle, id, classe, brouillon: b } = entreeEditee;
  const titre = id
    ? TEXTES.titreEditionEntree(echapper(nomEntree(trouverEntree(cle, id))))
    : TEXTES.titreNouvelleSousClasse(echapper(nomChoix("classes", classe)));
  // Pour une sous-classe, on rappelle sa classe sous le titre.
  const sousTitre = id && cle === "sousClasses"
    ? `<p class="aide">${TEXTES.sousClasseDe(echapper(nomChoix("classes", classe)))}</p>`
    : "";

  // Une carte d'édition par capacité. data-index = sa place dans le tableau
  // (comme l'index d'un ForEach), pour savoir laquelle modifier/retirer.
  const blocsCapacites = b.capacites.map((c, i) => `
    <div class="capacite-edition">
      <div class="barre">
        <span class="label-capacite">${TEXTES.capaciteN(i + 1)}</span>
        <button class="retirer-capacite" data-action="retirer-capacite" data-index="${i}">✕</button>
      </div>
      <label class="champ">${TEXTES.nomCapacite}
        <input type="text" data-cap-champ="nom" data-index="${i}" value="${echapper(c.nom)}">
      </label>
      <label class="champ">${TEXTES.texteCapacite}
        <textarea rows="5" data-cap-champ="texte" data-index="${i}">${echapper(c.texte)}</textarea>
      </label>
    </div>
  `).join("");

  return `
    <button class="retour" data-action="annuler-entree">${TEXTES.annuler}</button>
    <h2>${titre}</h2>
    ${sousTitre}
    <article class="fiche">
      <label class="champ">${TEXTES.nomFr}
        <input type="text" data-brouillon="fr" value="${echapper(b.fr)}">
      </label>
      <label class="champ">${TEXTES.nomEn}
        <input type="text" data-brouillon="en" value="${echapper(b.en)}">
      </label>
      ${cle === "domaines" ? `
        <label class="champ">${TEXTES.couleur}
          <input type="color" data-brouillon="couleur" value="${couleurSure(b.couleur)}">
        </label>
      ` : `
        ${cle === "classes" ? choixDomaines(b) : ""}
        <h3>${TEXTES.capacites}</h3>
        ${blocsCapacites}
        <button class="petit-ajout" data-action="ajouter-capacite">${TEXTES.ajouterCapacite}</button>
      `}
    </article>
    <button class="ajouter" data-action="enregistrer-entree">${TEXTES.enregistrer}</button>
  `;
}

// [...tableau] = une COPIE, qu'on trie pour l'affichage sans toucher
// à l'ordre stocké. localeCompare = comparaison alphabétique propre.
function trier(entrees) {
  return [...entrees].sort((a, b) => nomEntree(a).localeCompare(nomEntree(b)));
}

// Petites pastilles de couleur devant un domaine (sa couleur) ou une
// classe (les couleurs de ses domaines). Rien pour les autres listes.
function pastillesCouleur(cle, e) {
  const couleurs = cle === "domaines" ? [e.couleur] : cle === "classes" ? couleursClasse(e) : [];
  return couleurs.map((c) => `<span class="pastille-couleur" style="background:${couleurSure(c)}"></span>`).join("");
}

// Les couleurs des domaines d'une classe (0, 1 ou 2), domaines retirés ignorés.
function couleursClasse(classe) {
  if (!classe) return [];
  return (classe.domaines || [])
    .map((id) => trouverEntree("domaines", id))
    .filter((d) => d)
    .map((d) => couleurSure(d.couleur));
}

// Une ligne d'entrée : nom (+ nom anglais), boutons ✎ et ✕.
// classeEnPlus = classe CSS en plus ("sous-entree" pour le décalage).
function ligneEntree(cle, e, classeEnPlus) {
  return `
    <li class="entree ${classeEnPlus}">
      <span>${pastillesCouleur(cle, e)}${echapper(nomEntree(e))}${e.fr && e.en ? ` <span class="secondaire">· ${echapper(e.en)}</span>` : ""}${e.capacites.length ? ` <span class="secondaire">· ${TEXTES.nbCapacites(e.capacites.length)}</span>` : ""}</span>
      <span class="boutons-entree">
        <button class="editer" data-action="editer-entree" data-cle="${cle}" data-id="${e.id}">✎</button>
        <button data-action="retirer-entree" data-cle="${cle}" data-id="${e.id}">✕</button>
      </span>
    </li>
  `;
}

// Sous une classe : ses sous-classes (décalées) + un bouton pour en ajouter.
// Dans les DONNÉES, les sous-classes sont une liste à part (avec un champ
// classe) ; c'est seulement l'AFFICHAGE qui les range sous leur classe.
function sousClassesDe(classe) {
  const sous = trier(listes.sousClasses.filter((s) => s.classe === classe.id));
  return sous.map((s) => ligneEntree("sousClasses", s, "sous-entree")).join("") + `
    <li class="sous-entree">
      <button class="petit-ajout" data-action="nouvelle-sous-classe" data-classe="${classe.id}">${TEXTES.ajouterSousClasse}</button>
    </li>
  `;
}

// Écran GESTION DES LISTES : pour chaque liste, ses entrées + un mini
// formulaire d'ajout. Chaque champ a un id unique (nouveau-fr-classes...)
// pour qu'au clic sur "+ Add" on sache lequel lire.
function afficherGestionListes() {
  const blocs = LISTES.map(([cle, titre]) => {
    const lignes = trier(listes[cle]).map((e) =>
      ligneEntree(cle, e, "") + (cle === "classes" ? sousClassesDe(e) : "")
    ).join("");

    return `
      <article class="fiche bloc-liste">
        <h3>${titre} (${listes[cle].length})</h3>
        ${lignes ? `<ul class="entrees">${lignes}</ul>` : `<p class="vide">${TEXTES.listeVide}</p>`}
        <label class="champ">${TEXTES.nomFr}
          <input type="text" id="nouveau-fr-${cle}">
        </label>
        <label class="champ">${TEXTES.nomEn}
          <input type="text" id="nouveau-en-${cle}">
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
    <h2 class="ligne-nom">${echapper(nomAffiche(perso))} ${pastilleNiveau(perso.niveau)}</h2>
    <p>${resumeIdentite(perso)}</p>
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

// Un menu déroulant (<select>) rempli depuis une liste, + "Autre…" si permis.
// data-choix = quel champ du perso ce menu modifie (comme data-champ).
// Si "Autre…" est choisi, un champ texte libre apparaît dessous.
// c = une ligne de CHAMPS_LISTE.
function champChoix(perso, c) {
  const { champ, liste, label } = c;   // déstructuration = Break Struct
  const valeur = perso[champ];

  // Sous-classe sans classe choisie : rien à proposer.
  if (c.parent && estVide(perso[c.parent])) {
    return `
      <label class="champ">${label}
        <select disabled><option>${TEXTES.choisir}</option></select>
        <span class="aide">${TEXTES.choisirClasseDabord}</span>
      </label>
    `;
  }

  const proposees = entreesPour(perso, c);
  const entree = proposees.find((e) => e.id === valeur);
  // Valeur ni vide ni dans la liste : ancien texte libre, ou entrée retirée.
  const horsListe = !estVide(valeur) && !entree;
  // On est en "Autre…" si le MJ vient de le choisir, OU si la valeur est
  // un texte hors liste ET que ce champ accepte le texte libre.
  const autre = c.autre && (champsAutre.has(champ) || horsListe);

  const triees = [...proposees].sort((a, b) => nomEntree(a).localeCompare(nomEntree(b)));
  // selected = l'option affichée par défaut. ${cond ? "selected" : ""}
  // n'écrit le mot que pour la bonne option.
  const options = triees.map((e) =>
    `<option value="${e.id}" ${entree === e ? "selected" : ""}>${echapper(nomEntree(e))}</option>`
  ).join("");
  // Champ SANS "Autre…" qui contient quand même un texte hors liste (vieux
  // perso) : on l'affiche tel quel pour ne pas le perdre en silence.
  // Il ne sera pas accepté à la validation : il faudra choisir dans la liste.
  const optionHorsListe = horsListe && !c.autre
    ? `<option value="${echapper(valeur)}" selected>${echapper(TEXTES.horsListe(nomChoix(liste, valeur)))}</option>`
    : "";

  let aide = "";
  if (triees.length === 0) aide = c.parent ? TEXTES.aucuneSousClasse : TEXTES.listeVideAide;

  return `
    <label class="champ">${label}
      <select data-choix="${champ}">
        <option value="" ${!entree && !autre && !horsListe ? "selected" : ""}>${TEXTES.choisir}</option>
        ${options}
        ${optionHorsListe}
        ${c.autre ? `<option value="${VALEUR_AUTRE}" ${autre ? "selected" : ""}>${TEXTES.autre}</option>` : ""}
      </select>
      ${autre ? `<input type="text" data-champ="${champ}" placeholder="${TEXTES.saisieLibre}" value="${echapper(estVide(valeur) ? "" : valeur)}">` : ""}
      ${aide ? `<span class="aide">${aide}</span>` : ""}
    </label>
  `;
}

// Bloc identité, version ÉDITION.
function identiteEdition(perso) {
  return `
    ${champTexte(perso, "nom", TEXTES.nom)}
    ${CHAMPS_LISTE.map((c) => champChoix(perso, c)).join("")}
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

// "+2" sans modificateur ; "+2 (+1)" = base, puis TOTAL entre parenthèses
// (choix d'Enguy : le total est la valeur à utiliser pour le jet).
function texteCarac(c) {
  if (c.modif === 0) return signe(c.base);
  return `${signe(c.base)} <span class="${c.modif > 0 ? "buff" : "debuff"}">(${signe(c.base + c.modif)})</span>`;
}

// Mode jeu : chaque carac est un bouton. Le toucher ouvre (ou referme) son
// réglage de modificateur, juste en dessous.
function caracsJeu(perso) {
  const lignes = CARACS.map(([cle, label]) => {
    const c = perso.caracs[cle];
    const ouverte = caracOuverte === cle;
    return `
      <button class="case-carac ${ouverte ? "ouverte" : ""}" data-action="ouvrir-carac" data-cle="${cle}">
        <span>${label}</span>
        <span class="valeur">${texteCarac(c)}</span>
      </button>
      ${ouverte ? ligneReglage("modif", cle, TEXTES.modif, signe(c.modif)) : ""}
    `;
  }).join("");

  // .some : au moins une carac a un modificateur ?
  const aDesModifs = CARACS.some(([cle]) => perso.caracs[cle].modif !== 0);
  return `
    <div class="cases">${lignes}</div>
    ${aDesModifs ? `<button class="retour plein" data-action="retirer-modifs">${TEXTES.retirerModifs}</button>` : ""}
  `;
}


function caracsEdition(perso) {
  return CARACS.map(([cle, label]) =>
    ligneReglage("carac", cle, label, signe(perso.caracs[cle].base))
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
      ${modeEdition
        ? `<button class="retour" data-action="annuler">${TEXTES.annuler}</button>`
        : `<button class="retour" data-action="retour">${TEXTES.retour}</button>`}
      <button class="retour" data-action="editer">${modeEdition ? TEXTES.termine : TEXTES.correctionMj}</button>
    </div>
    ${modeEdition ? `
      <article class="fiche">
        ${identiteEdition(perso)}
        <h3>${TEXTES.caracteristiques}</h3>
        ${caracsEdition(perso)}
        <h3>${TEXTES.ressources}</h3>
        ${ressourcesEdition(perso)}
      </article>
    ` : afficherDeck(perso)}
    ${modeEdition ? `<button class="ajouter" data-action="dupliquer">${TEXTES.dupliquer}</button>` : ""}
    ${modeEdition ? `<button class="supprimer" data-action="supprimer">${TEXTES.supprimer}</button>` : ""}
  `;
}

// Toutes les capacités d'un perso, rassemblées depuis ses entrées de listes,
// dans l'ordre de CHAMPS_LISTE (classe, sous-classe, ascendance, communauté).
// Le perso ne STOCKE aucune capacité : on les retrouve via ses ids à chaque
// affichage → corriger une capacité dans ☰ Listes corrige tous les persos.
// flatMap = map, puis aplatit : [[a, b], [c]] → [a, b, c].
function capacitesDuPerso(perso) {
  return CHAMPS_LISTE.flatMap((c) => {
    const e = trouverEntree(c.liste, perso[c.champ]);
    if (!e) return [];   // pas choisi, texte libre ou entrée retirée
    // Couleurs du dégradé : celles des domaines de la classe du perso,
    // pour ses capacités de classe ET de sous-classe.
    const couleurs = c.champ === "classe" || c.champ === "sousClasse"
      ? couleursClasse(trouverEntree("classes", perso.classe))
      : [];
    return e.capacites.map((cap) => ({
      couleurs: couleurs,
      champ: c.champ,         // "classe", "sousClasse"... (pour la couleur)
      type: c.label,          // "Classe", "Ascendance"...
      origine: nomEntree(e),  // "Gardien", "Orc"...
      nom: cap.nom,
      texte: cap.texte,
    }));
  });
}

// Les 2 couleurs du dégradé, passées au CSS par des variables --d1/--d2
// (comme des paramètres d'une Material Instance). 1 seul domaine →
// même couleur des deux côtés ; aucun → le CSS garde ses valeurs par défaut.
function styleDomaines(couleurs) {
  if (couleurs.length === 0) return "";
  const d1 = couleurs[0];
  const d2 = couleurs[1] || couleurs[0];
  return `style="--d1:${d1}; --d2:${d2}"`;
}

// LE DECK (mode jeu) : la FICHE est la 1re carte, tout à gauche ; les
// capacités suivent. On glisse au doigt de carte en carte.
// Le défilement est géré par le NAVIGATEUR (CSS scroll-snap : la carte se
// "cale" toute seule). Le JS ne fait que les boutons ◀ ▶ et le compteur.
// La correction MJ et la création restent HORS deck (écran plein).
// data-type = le type de la carte (classe, sousClasse...) → couleur en CSS.
function afficherDeck(perso) {
  const caps = capacitesDuPerso(perso);
  const carteFiche = `
    <article class="fiche carte-deck">
      ${identiteLecture(perso)}
      <h3>${TEXTES.caracteristiques}</h3>
      ${caracsJeu(perso)}
      <h3>${TEXTES.ressources}</h3>
      ${ressourcesLecture(perso)}
      ${caps.length === 0 ? `<p class="aide">${TEXTES.aucuneCapacite}</p>` : ""}
    </article>
  `;
  const cartes = caps.map((c) => `
    <div class="carte-deck carte-capacite" data-type="${c.champ}" ${styleDomaines(c.couleurs)}>
      <span class="type-capacite">${echapper(c.type)} · ${echapper(c.origine)}</span>
      <strong>${echapper(c.nom)}</strong>
      <p>${echapper(c.texte)}</p>
    </div>
  `).join("");
  // La barre de navigation est AU-DESSUS (la fiche est longue : en bas,
  // elle serait loin) et "collante" (sticky) quand on fait défiler la page.
  return `
    <div class="nav-deck" id="nav-deck">
      <button data-action="deck-precedente" aria-label="${TEXTES.precedente}">◀</button>
      <span id="compteur-deck">${TEXTES.ongletFiche}</span>
      <button data-action="deck-suivante" aria-label="${TEXTES.suivante}">▶</button>
    </div>
    <div class="deck" id="deck">${carteFiche}${cartes}</div>
  `;
}

// Distance (en pixels) entre le début de deux cartes = largeur + espace.
// offsetLeft = position d'un élément dans son parent (le deck est en
// position: relative, donc c'est lui le repère).
function pasDeck(deck) {
  const cartes = deck.children;
  return cartes.length > 1 ? cartes[1].offsetLeft - cartes[0].offsetLeft : 1;
}

// Met à jour le compteur et les boutons SANS tout redessiner
// (on modifie juste 3 éléments : bien plus léger que rendre()).
// force = l'index voulu (boutons) ; sinon on le déduit de la position
// actuelle (glissé au doigt). Pendant l'animation d'un bouton, la position
// est encore l'ancienne : d'où ce paramètre, pour ne pas revenir en arrière.
function majDeck(force) {
  const deck = document.getElementById("deck");
  if (!deck) return;
  const n = deck.children.length;
  const avant = indexDeck;
  // Math.round = la carte la plus proche de la position actuelle.
  indexDeck = force !== undefined ? force : borner(Math.round(deck.scrollLeft / pasDeck(deck)), 0, n - 1);
  // Carte 0 = "Fiche" ; ensuite "Capacité 2 / 5" (la fiche ne compte pas).
  document.getElementById("compteur-deck").textContent =
    indexDeck === 0 ? TEXTES.ongletFiche : TEXTES.compteurCapacite(indexDeck, n - 1);
  document.querySelector('[data-action="deck-precedente"]').disabled = indexDeck === 0;
  document.querySelector('[data-action="deck-suivante"]').disabled = indexDeck === n - 1;
  if (indexDeck !== avant) remonterAuDeck();
}

// La fiche est longue, une capacité courte : si on a fait défiler la page
// vers le bas puis changé de carte, on se retrouverait face à du vide.
// On remonte donc en haut du deck (juste sous la barre collante).
// getBoundingClientRect().top = position de l'élément par rapport au HAUT
// DE L'ÉCRAN (négatif = il a disparu au-dessus).
function remonterAuDeck() {
  const deck = document.getElementById("deck");
  const nav = document.getElementById("nav-deck");
  const ecart = deck.getBoundingClientRect().top - nav.offsetHeight;
  if (ecart < 0) window.scrollBy({ top: ecart, behavior: "smooth" });
}

// Va à la carte i. smooth = animation ; sinon saut immédiat.
function allerCarte(i, smooth) {
  const deck = document.getElementById("deck");
  if (!deck) return;
  const n = deck.children.length;
  const cible = borner(i, 0, n - 1);
  if (smooth) {
    cibleDeck = cible;
    // Filet : si l'animation est interrompue (doigt), on lève le verrou.
    // clearTimeout annule la minuterie précédente (taps rapides).
    clearTimeout(minuterieDeck);
    minuterieDeck = setTimeout(() => { cibleDeck = null; majDeck(); }, 700);
  }
  deck.scrollTo({ left: cible * pasDeck(deck), behavior: smooth ? "smooth" : "auto" });
  majDeck(cible);
}

// Écran CRÉATION : les mêmes blocs d'édition que la correction MJ
// (on réutilise identiteEdition, caracsEdition, ressourcesEdition),
// + un bouton pour valider. Un seul code pour les deux usages.
// Création : la réserve de jetons + une case par carac.
function caracsCreation(perso) {
  const restant = reserve(perso);
  // Les doublons (+1, +1) sont identiques : on n'allume que le PREMIER
  // jeton qui a la valeur sélectionnée.
  const iChoisi = restant.indexOf(jetonSelectionne);
  const jetons = restant.map((v, i) =>
    `<button class="jeton ${i === iChoisi ? "choisi" : ""}" data-action="jeton" data-valeur="${v}">${signe(v)}</button>`
  ).join("");

  const cases = CARACS.map(([cle, label]) => {
    const v = perso.caracs[cle].base;
    return `
      <button class="case-carac ${v === null ? "vide" : ""}" data-action="poser" data-cle="${cle}">
        <span>${label}</span>
        <span class="valeur">${v === null ? "—" : signe(v)}</span>
      </button>`;
  }).join("");

  return `
    <p class="aide">${TEXTES.aideJetons}</p>
    <div class="reserve">
      <span class="label">${TEXTES.reserve}</span>
      ${jetons || `<span>${TEXTES.toutPlace}</span>`}
    </div>
    <div class="cases ${jetonSelectionne !== null ? "en-attente" : ""}">${cases}</div>
  `;
}

function afficherCreation(perso) {
  return `
    <button class="retour" data-action="retour">${TEXTES.retour}</button>
    <h2>${TEXTES.titreCreation}</h2>
    <article class="fiche">
      ${identiteEdition(perso)}

      <h3>${TEXTES.caracteristiques}</h3>
      ${caracsCreation(perso)}

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
  // Correction MJ : on règle la BASE (le modificateur temporaire ne bouge pas).
  const c = perso.caracs[cle];
  c.base = borner(c.base + delta, BORNES.carac.min, BORNES.carac.max);
  sauvegarder();
}

function modifierModif(perso, cle, delta) {
  const c = perso.caracs[cle];
  c.modif = borner(c.modif + delta, BORNES.modif.min, BORNES.modif.max);
  sauvegarder();
}

function retirerModifs(perso) {
  CARACS.forEach(([cle]) => { perso.caracs[cle].modif = 0; });
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
  lien.download = `duality-companion-${new Date().toISOString().slice(0, 10)}.json`; // ex. daggerheart-2026-11-07.json
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
// Comme un "Widget Switcher" : selon l'état, on affiche un des 4 écrans.
function rendre() {
  const zone = document.getElementById("app");
  if (ecran === "apropos") {
    zone.innerHTML = afficherAPropos();
    return;
  }
  // Filet : si l'entrée a disparu (ex. import entre-temps), on revient aux listes.
  if (ecran === "entree") {
    const existe = entreeEditee && (entreeEditee.id
      ? trouverEntree(entreeEditee.cle, entreeEditee.id)
      : trouverEntree("classes", entreeEditee.classe));   // création : la classe parente doit exister
    if (!existe) entreeEditee = null;
    if (existe) {
      zone.innerHTML = afficherEditionEntree();
      return;
    }
    ecran = "listes";
  }
  if (ecran === "listes") {
    zone.innerHTML = afficherGestionListes();
    return;
  }
  const perso = trouverPerso(persoOuvertId);
  zone.innerHTML = perso ? afficherPersonnage(perso) : afficherListe();
  // Le HTML vient d'être recréé : le deck repart à 0. On le replace
  // (sans animation) sur la carte où on était.
  allerCarte(indexDeck, false);
}

// --- 5. LES ÉVÉNEMENTS : un seul écouteur pour tous les clics ----
// Chaque bouton porte un data-action qui dit ce qu'il fait.
// On lit l'action, puis on "switch" dessus (= Switch on String).
document.getElementById("app").addEventListener("click", (event) => {
  const bouton = event.target.closest("button[data-action]");
  if (!bouton) return;

  switch (bouton.dataset.action) {
    case "deck-precedente":
      allerCarte(indexDeck - 1, true);
      return;   // pas de rendre() : le navigateur fait défiler tout seul
    case "deck-suivante":
      allerCarte(indexDeck + 1, true);
      return;
    case "ouvrir":
      persoOuvertId = bouton.dataset.id;
      indexDeck = 0;   // nouveau perso → première carte
      champsAutre.clear();
      jetonSelectionne = null;
      caracOuverte = null;
      preparerBrouillon(trouverPerso(persoOuvertId));
      break;
    case "ouvrir-carac":
      // Toucher la carac ouverte la referme ; toucher une autre l'ouvre à sa place.
      caracOuverte = caracOuverte === bouton.dataset.cle ? null : bouton.dataset.cle;
      break;
    case "modif":
      modifierModif(trouverPerso(persoOuvertId), bouton.dataset.cle, Number(bouton.dataset.delta));
      break;
    case "retirer-modifs":
      retirerModifs(trouverPerso(persoOuvertId));
      caracOuverte = null;
      break;
    case "jeton": {
      const v = Number(bouton.dataset.valeur);
      // Toucher le jeton déjà allumé le relâche (= Flip Flop sur la sélection).
      jetonSelectionne = jetonSelectionne === v ? null : v;
      break;
    }
    case "poser": {
      const perso = trouverPerso(persoOuvertId);
      const cle = bouton.dataset.cle;
      const actuel = perso.caracs[cle].base;
      if (jetonSelectionne !== null) {
        // On pose le jeton en main. S'il y avait déjà une valeur, elle
        // retourne toute seule dans la réserve (recalculée par reserve()).
        perso.caracs[cle].base = jetonSelectionne;
        jetonSelectionne = null;
      } else if (actuel !== null) {
        // Main vide + case remplie → on REPREND sa valeur en main.
        perso.caracs[cle].base = null;
        jetonSelectionne = actuel;
      }
      sauvegarder();
      break;
    }
    case "retour":
      caracOuverte = null;
      persoOuvertId = null;
      modeEdition = false;
      ecran = null;
      champsAutre.clear();
      break;
    case "listes":
      ecran = "listes";
      entreeEditee = null;
      break;
    case "editer-entree":
      ouvrirEntree(bouton.dataset.cle, bouton.dataset.id, null);
      break;
    case "nouvelle-sous-classe":
      ouvrirEntree("sousClasses", null, bouton.dataset.classe);
      break;
    case "annuler-entree":
      // Filet anti fausse manip : on ne perd pas un long texte sans prévenir.
      if (brouillonModifie() && !confirm(TEXTES.confirmerAbandon)) return;
      ecran = "listes";
      entreeEditee = null;
      break;
    case "ajouter-capacite":
      entreeEditee.brouillon.capacites.push({ nom: "", texte: "" });
      rendre();
      // Confort : on place le curseur dans le nom de la nouvelle capacité.
      // querySelectorAll + [length - 1] = le DERNIER champ "nom".
      {
        const noms = document.querySelectorAll('[data-cap-champ="nom"]');
        noms[noms.length - 1].focus();
      }
      return;
    case "retirer-capacite": {
      const i = Number(bouton.dataset.index);
      const c = entreeEditee.brouillon.capacites[i];
      // Confirmation seulement si la capacité contient quelque chose.
      if ((c.nom.trim() || c.texte.trim()) && !confirm(TEXTES.confirmerRetraitCapacite(c.nom.trim()))) return;
      entreeEditee.brouillon.capacites.splice(i, 1);   // splice = Remove Index
      break;
    }
    case "enregistrer-entree": {
      const { cle, id, classe, brouillon } = entreeEditee;
      const capacites = capacitesPropres(brouillon.capacites);
      if (!capacites) return;
      // id null = création (sous-classe), sinon modification.
      // Champs propres à la liste, repris du brouillon.
      const extra = {};
      if (cle === "domaines") extra.couleur = couleurSure(brouillon.couleur);
      if (cle === "classes") extra.domaines = brouillon.domaines.filter((d) => d);   // on retire les "" (aucun)
      const ok = id
        ? modifierEntree(cle, id, brouillon.fr, brouillon.en, capacites, extra)
        : ajouterEntree(cle, brouillon.fr, brouillon.en, { classe: classe, capacites: capacites });
      // En cas d'erreur (nom vide, doublon), on RESTE sur l'écran
      // (sans rendre(), pour ne pas effacer ce qui a été tapé).
      if (!ok) return;
      ecran = "listes";
      entreeEditee = null;
      break;
    }
    case "apropos":
      ecran = "apropos";
      break;
    case "ajouter-entree": {
      const cle = bouton.dataset.cle;
      // On LIT la page ici (la valeur tapée), mais on ne la modifie pas :
      // la donnée change, puis rendre() redessine tout (champs vidés inclus).
      const fr = document.getElementById(`nouveau-fr-${cle}`).value;
      const en = document.getElementById(`nouveau-en-${cle}`).value;
      // Échec (nom vide, doublon) → pas de rendre() : le texte tapé reste.
      if (!ajouterEntree(cle, fr, en, champsEnPlus(cle))) return;
      break;
    }
    case "retirer-entree": {
      const cle = bouton.dataset.cle;
      const entree = listes[cle].find((e) => e.id === bouton.dataset.id);
      const message = cle === "classes"
        ? TEXTES.confirmerRetraitClasse(nomEntree(entree || {}), listes.sousClasses.filter((sc) => sc.classe === bouton.dataset.id).length)
        : TEXTES.confirmerRetrait(nomEntree(entree || {}));
      if (entree && confirm(message)) {
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
      caracOuverte = null;
      // Entrer en correction MJ demande confirmation ; en sortir, non.
      if (!modeEdition && !confirm(TEXTES.confirmerCorrection)) break;
      champsAutre.clear();
      modeEdition = !modeEdition; // ! = NOT : bascule true ↔ false (= Flip Flop)
      // Entrée → on prend la copie ; sortie par "✓ Done" → on la jette (modifs gardées).
      copieAvantCorrection = modeEdition ? structuredClone(trouverPerso(persoOuvertId)) : null;
      break;
    case "annuler": {
      // On remet la copie À LA MÊME PLACE dans le tableau (findIndex = l'index
      // du perso qui a cet id), pour ne pas changer l'ordre de la liste.
      const i = personnages.findIndex((p) => p.id === copieAvantCorrection.id);
      personnages[i] = copieAvantCorrection;
      sauvegarder();
      copieAvantCorrection = null;
      champsAutre.clear();
      modeEdition = false;
      break;
    }
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
      jetonSelectionne = null;
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
      jetonSelectionne = null;
      break;
    case "dupliquer":
      persoOuvertId = dupliquerPerso(trouverPerso(persoOuvertId)).id;
      modeEdition = true;
      // On entre en édition sur la copie : il faut AUSSI un snapshot, sinon
      // "✕ Cancel" n'aurait rien à restaurer (copieAvantCorrection = null → plantage).
      // Cancel garde la copie telle qu'elle vient d'être créée.
      copieAvantCorrection = structuredClone(trouverPerso(persoOuvertId));
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
// Défilement du deck au doigt → on met à jour le compteur.
// Piège : l'événement "scroll" ne REMONTE PAS (pas de "bubbling") jusqu'à
// #app, contrairement à "click". Le true final = écouter en phase de
// "capture" (en descendant vers l'élément), ce qui marche quand même.
document.getElementById("app").addEventListener("scroll", (event) => {
  if (event.target.id !== "deck") return;
  if (cibleDeck !== null) {
    // Animation d'un bouton en cours : on attend d'être arrivé.
    const deck = event.target;
    if (Math.abs(deck.scrollLeft - cibleDeck * pasDeck(deck)) > 2) return;
    cibleDeck = null;
  }
  majDeck();
}, true);

document.getElementById("app").addEventListener("input", (event) => {
  const d = event.target.dataset;
  // Écran d'entrée : on écrit dans le BROUILLON (pas dans la liste, pas de
  // sauvegarde) et sans rendre() : on ne redessine pas pendant la frappe.
  if (d.brouillon) {
    entreeEditee.brouillon[d.brouillon] = event.target.value;
    return;
  }
  if (d.domaine !== undefined) {   // menu "Domaine 1/2" (un <select> déclenche aussi "input")
    entreeEditee.brouillon.domaines[Number(d.domaine)] = event.target.value;
    return;
  }
  if (d.capChamp) {   // data-cap-champ devient dataset.capChamp (tirets → majuscule)
    entreeEditee.brouillon.capacites[Number(d.index)][d.capChamp] = event.target.value;
    return;
  }

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
    perso[champ] = valeur;    // un id de la liste, ou "" pour "— Choisir —"
  }
  // Les champs qui DÉPENDENT de celui-ci (la sous-classe dépend de la
  // classe) sont remis à vide : l'ancienne sous-classe n'appartient
  // plus à la nouvelle classe.
  CHAMPS_LISTE.forEach((c) => {
    if (c.parent === champ) perso[c.champ] = "";
  });
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
