# RECAP — Daggerheart Companion

Source de vérité sur l'avancement du projet. Mis à jour en fin de session.

## Le projet
PWA Android pour gérer les fiches de personnages du JDR Daggerheart. Au départ, seul le MJ l'utilise, en local.

**Stack** : HTML / CSS / JavaScript simples, sans framework. localStorage + export/import JSON. Pas de serveur. Hébergement GitHub Pages.

## Périmètre V0.1
- [ ] Liste de personnages
- [ ] Créer / modifier / supprimer une fiche
- [ ] Champs : nom, ascendance, communauté, classe, niveau
- [ ] 6 caractéristiques : Agility, Strength, Finesse, Instinct, Presence, Knowledge
- [ ] PV, stress, espoir avec boutons +/− et limites configurables
- [ ] Sauvegarde locale (localStorage)
- [ ] Export / import JSON

Tout le reste est hors périmètre pour la V0.1.

**Critère de réussite** : créer 2 personnages, modifier leurs ressources, fermer puis rouvrir l'app et tout retrouver ; l'export/import JSON fonctionne.

## Avancement
### Session 1 — 2026-11-05
- [x] Compte GitHub créé (`EnguerrandM`)
- [x] Dépôt `daggerheart-companion` créé (public, avec README)
- [x] GitHub relié à Claude
- [x] RECAP.md créé

### Session 2 — 2026-11-06
- [x] `index.html` minimal (titre + viewport mobile)
- [x] GitHub Pages activé (branche `main`, `/root`)
- [x] Site visible sur téléphone : https://enguerrandm.github.io/daggerheart-companion/
- Note : sur mobile, cliquer *Save* dans Settings → Pages affiche une 404 de GitHub, mais le réglage est bien enregistré.

## À faire / points ouverts
- [ ] Activer la double authentification (2FA) sur GitHub (via navigateur : Settings → Password and authentication)
- [ ] Vérifier la licence du SRD Daggerheart (Darrington Press) avant d'y mettre du contenu de règles, le dépôt étant public

- [ ] Cache navigateur : après un push, l'ancienne version peut rester affichée ~10 min (tester en navigation privée). Prévoir un système de version pour forcer la mise à jour, surtout une fois en PWA.
- [ ] Après la V0.1 : manifeste + icône pour installer l'app comme une vraie appli (plein écran). En attendant : Chrome ⋮ → « Ajouter à l'écran d'accueil ».

### Session 3 — 2026-11-06 (soir)
- [x] `app.js` : objet `personnage` (= Structure Blueprint) + fonction `afficherPersonnage(perso)` + branchement dans `<div id="app">`
- [x] Notion vue : paramètre de fonction (= input pin) vs variable passée à l'appel
- [x] Mini-défi réussi : Enguy a modifié le nom et l'agilité directement sur GitHub

## Prochaine étape
Boutons +/− sur PV, stress et espoir (modifier la donnée → réafficher), en respectant min 0 et max.
