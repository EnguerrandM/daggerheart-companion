# RECAP — Daggerheart Companion

Source de vérité sur l'avancement du projet. Mis à jour en fin de session.

## Le projet
PWA Android pour gérer les fiches de personnages du JDR Daggerheart. Au départ, seul le MJ l'utilise, en local.

**Stack** : HTML / CSS / JavaScript simples, sans framework. localStorage + export/import JSON. Pas de serveur. Hébergement GitHub Pages.

**Site** : https://enguerrandm.github.io/daggerheart-companion/

## Périmètre V0.1
- [x] Liste de personnages (écran liste + ouverture d'une fiche + retour)
- [ ] Créer / supprimer un perso ; modifier les champs d'une fiche
- [~] Champs : nom, ascendance, communauté, classe, niveau (affichés, pas encore éditables)
- [~] 6 caractéristiques : Agility, Strength, Finesse, Instinct, Presence, Knowledge (affichées, pas encore éditables)
- [~] PV, stress, espoir avec boutons +/− (fait) et limites configurables (pas encore)
- [x] Sauvegarde locale (localStorage) de toute la liste, testée sur téléphone
- [ ] Export / import JSON

Tout le reste est hors périmètre pour la V0.1.

**Critère de réussite** : créer 2 personnages, modifier leurs ressources, fermer puis rouvrir l'app et tout retrouver ; l'export/import JSON fonctionne.

## Architecture actuelle
- `index.html` : structure de la page + CSS + `<div id="app">` + chargement de `app.js?v=N`
- `app.js` :
  - `personnagesParDefaut` : tableau (= Array) d'objets (= Structures), utilisé seulement au tout premier lancement
  - `personnages` : la liste en cours ; `persoOuvertId` : état de l'interface (null = écran liste), non sauvegardé
  - `trouverPerso(id)` : `.find` sur le tableau
  - `afficherListe()` (`.map` + `.join`) / `afficherPersonnage(perso)` / `ligneRessource(...)` : donnée → HTML
  - `modifierRessource(perso, cle, delta)` : Clamp 0 → max, puis sauvegarde
  - `rendre()` : affiche la liste ou la fiche selon `persoOuvertId` (= Widget Switcher)
  - un seul écouteur de clic sur `#app` ; chaque bouton a un `data-action` (`ouvrir`, `retour`, `ressource`) → `switch`
  - `sauvegarder()` / `charger()` / `lireSlot()` : localStorage, clé `dhc-personnages`, JSON, try/catch. Migration : l'ancienne clé `dhc-personnage` (un seul perso) est récupérée comme 1er perso.
- **Principe** : clic → modifier la donnée / l'état → `rendre()`. On ne touche jamais la page directement.
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
- [x] Liste de personnages (Lydia + Brom), navigation liste ↔ fiche, migration de l'ancienne sauvegarde (`?v=4`)
- [x] Exos d'Enguy : 1) ascendance dans la liste ✅ (piège vu : `$(...)` au lieu de `${...}`) ; 2) bouton « Soin complet » (`data-delta="99"`) ✅ après une 1re tentative cassée (case inséré au milieu d'un autre, `dataset` ne contient que les data-...)
- [ ] Exo 3 en cours (Enguy cherche) : pourquoi un 3e perso ajouté dans `personnagesParDefaut` n'apparaît pas sur le téléphone ? Dans quel cas apparaîtrait-il ? — ne pas donner la réponse directement

## À faire / points ouverts
- [ ] Activer la double authentification (2FA) sur GitHub (via navigateur : Settings → Password and authentication)
- [ ] Vérifier la licence du SRD Daggerheart (Darrington Press) avant d'y mettre du contenu de règles, le dépôt étant public
- [ ] Vérifier dans les règles officielles les valeurs de départ (PV selon la classe, stress, espoir max)
- [ ] Cache : `?v=N` couvre `app.js`, mais `index.html` reste en cache ~10 min → très pénible pendant les tests. Trouver une vraie solution prochainement (puis à repenser une fois en PWA / service worker).
- [ ] « Soin complet » = hack `delta 99`. Version propre possible : action `soin` qui fait `res.actuel = res.max` (bon exo sur le `switch`). Bouton pas encore stylé (exo CSS possible).
- [ ] Dette : pas de numéro de version dans les données sauvegardées. Si la forme de l'objet change, l'ancienne sauvegarde ne collera plus.
- [ ] Rappel : vider les données de Chrome efface les persos → l'export JSON sera la vraie sauvegarde de secours.
- [ ] Après la V0.1 : manifeste + icône pour installer l'app comme une vraie appli. En attendant : Chrome ⋮ → « Ajouter à l'écran d'accueil ».

## Prochaine étape
1. Correction de l'exo 3 avec Enguy.
2. Créer un nouveau personnage (formulaire : nom, ascendance, communauté, classe, niveau, caracs, max des ressources) + supprimer un perso.
