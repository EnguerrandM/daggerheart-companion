# RECAP — Daggerheart Companion

Source de vérité sur l'avancement du projet. Mis à jour en fin de session.

## Le projet
PWA Android pour gérer les fiches de personnages du JDR Daggerheart. Au départ, seul le MJ l'utilise, en local.

**Stack** : HTML / CSS / JavaScript simples, sans framework. localStorage + export/import JSON. Pas de serveur. Hébergement GitHub Pages.

**Site** : https://enguerrandm.github.io/daggerheart-companion/

## Périmètre V0.1
- [ ] Liste de personnages
- [ ] Créer / modifier / supprimer une fiche
- [~] Champs : nom, ascendance, communauté, classe, niveau (affichés, pas encore éditables)
- [~] 6 caractéristiques : Agility, Strength, Finesse, Instinct, Presence, Knowledge (affichées, pas encore éditables)
- [~] PV, stress, espoir avec boutons +/− (fait) et limites configurables (pas encore)
- [~] Sauvegarde locale (localStorage) — fait pour UN personnage, testé sur téléphone
- [ ] Export / import JSON

Tout le reste est hors périmètre pour la V0.1.

**Critère de réussite** : créer 2 personnages, modifier leurs ressources, fermer puis rouvrir l'app et tout retrouver ; l'export/import JSON fonctionne.

## Architecture actuelle
- `index.html` : structure de la page + CSS + `<div id="app">` + chargement de `app.js?v=N`
- `app.js` :
  - objet `personnage` (la donnée, = Structure Blueprint)
  - `afficherPersonnage(perso)` / `ligneRessource(...)` : donnée → HTML
  - `modifierRessource(cle, delta)` : modifie la donnée, bornée entre 0 et max (Clamp)
  - `rendre()` : redessine la page depuis la donnée
  - un seul écouteur de clic sur `#app` (délégation d'événement), boutons repérés par `data-ressource` / `data-delta`
  - `sauvegarder()` / `charger()` : localStorage, clé `dhc-personnage`, JSON.stringify / JSON.parse, try/catch si sauvegarde corrompue
  - `let personnage = charger() ?? structuredClone(personnageParDefaut)`
- **Principe** : clic → modifier la donnée → `rendre()`. On ne touche jamais la page directement.
- **Cache** : incrémenter `?v=N` dans `index.html` à chaque modif de `app.js`.

## Avancement
### Session 1 — 2026-11-05
- [x] Compte GitHub créé (`EnguerrandM`), dépôt `daggerheart-companion` (public), GitHub relié à Claude, RECAP.md créé

### Session 2 — 2026-11-06 (matin)
- [x] `index.html` minimal (titre + viewport mobile)
- [x] GitHub Pages activé (branche `main`, `/root`), site visible sur téléphone
- Note : sur mobile, cliquer *Save* dans Settings → Pages affiche une 404 de GitHub, mais le réglage est bien enregistré.

### Session 3 — 2026-11-06 (soir)
- [x] `app.js` : objet `personnage` + fonction d'affichage
- [x] Notion vue : paramètre de fonction (= input pin) vs variable passée à l'appel
- [x] Mini-défi réussi : Enguy a modifié le nom et l'agilité directement sur GitHub
- [x] Boutons +/− sur PV, stress, espoir (bornés 0 → max), testés sur téléphone
- [x] Contournement du cache avec `app.js?v=2`
- [x] Sauvegarde locale (localStorage) : les ressources survivent à la fermeture, testé sur téléphone (`?v=3`)

## À faire / points ouverts
- [ ] Activer la double authentification (2FA) sur GitHub (via navigateur : Settings → Password and authentication)
- [ ] Vérifier la licence du SRD Daggerheart (Darrington Press) avant d'y mettre du contenu de règles, le dépôt étant public
- [ ] Vérifier dans les règles officielles les valeurs de départ (PV selon la classe, stress, espoir max)
- [ ] Cache : `?v=N` couvre `app.js`, mais `index.html` peut rester en cache quelques minutes. À repenser une fois en PWA (service worker).
- [ ] Dette : pas de numéro de version dans les données sauvegardées. Si la forme de l'objet change, l'ancienne sauvegarde ne collera plus.
- [ ] Rappel : vider les données de Chrome efface les persos → l'export JSON sera la vraie sauvegarde de secours.
- [ ] Après la V0.1 : manifeste + icône pour installer l'app comme une vraie appli. En attendant : Chrome ⋮ → « Ajouter à l'écran d'accueil ».

## Prochaine étape
Passer d'UN personnage à une LISTE de personnages (tableau), avec un écran liste et un écran fiche. Sauvegarder toute la liste.
