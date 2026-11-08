// ===== SERVICE WORKER =====
// Un petit script que le navigateur fait tourner EN DEHORS de la page,
// placé entre l'app et Internet (≈ un proxy). Chaque requête de l'app
// (index.html, app.js, icônes…) passe par l'événement "fetch" ci-dessous,
// et c'est NOUS qui décidons d'où vient la réponse : réseau ou cache.
//
// Stratégie "réseau d'abord" :
//   1. on demande toujours la version fraîche au serveur ;
//   2. si ça marche → on la sert ET on en garde une copie dans le cache ;
//   3. si pas de réseau → on sert la dernière copie gardée (mode hors-ligne).
//
// ⚠️ Les persos ne sont PAS ici : ils sont dans localStorage, que le
// service worker ne touche jamais.

// Nom du cache. À changer seulement si on veut jeter toutes les copies.
const CACHE = "dhc-v1";

// Fichiers mis en cache dès l'installation → l'app s'ouvre hors-ligne
// même si on n'a jamais visité certaines URLs.
const FICHIERS_DE_BASE = [
  "./",
  "index.html",
  "app.js",
  "manifest.json",
  "icones/icone-192.png",
  "icones/icone-512.png",
];

// --- Installation : remplir le cache ---
self.addEventListener("install", (event) => {
  // waitUntil = "ne considère pas l'install finie tant que ce n'est pas fait"
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FICHIERS_DE_BASE))
  );
  // Le nouveau service worker prend la main tout de suite
  // au lieu d'attendre que tous les onglets soient fermés.
  self.skipWaiting();
});

// --- Activation : prendre le contrôle des pages déjà ouvertes ---
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// --- Chaque requête de l'app passe ici ---
self.addEventListener("fetch", (event) => {
  const requete = event.request;

  // On ne gère que les lectures (GET) de NOTRE site. Le reste passe tel quel.
  if (requete.method !== "GET") return;
  if (new URL(requete.url).origin !== self.location.origin) return;

  event.respondWith(reseauDabord(requete));
});

async function reseauDabord(requete) {
  try {
    // cache: "no-cache" = PIÈGE IMPORTANT. Sans ça, fetch() utiliserait le
    // cache HTTP du navigateur (~10 min sur GitHub Pages) et on retomberait
    // sur le vieux index.html. "no-cache" force à demander au serveur
    // si le fichier a changé (rapide : il répond "pas changé" sans renvoyer
    // le fichier si c'est le cas).
    const reponse = await fetch(requete.url, { cache: "no-cache" });

    if (reponse.ok) {
      const cache = await caches.open(CACHE);
      // .clone() : une réponse ne se lit qu'une fois. On en garde une copie
      // pour le cache, l'originale part vers la page.
      cache.put(requete, reponse.clone());
    }
    return reponse;
  } catch (erreur) {
    // Pas de réseau → copie du cache. ignoreSearch : "app.js?v=17"
    // retrouve la copie de "app.js" même si le ?v=N a changé.
    const copie = await caches.match(requete, { ignoreSearch: true });
    if (copie) return copie;
    throw erreur;
  }
}
