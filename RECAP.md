# RECAP — Daggerheart Companion

Source de vérité sur l'avancement du projet. Mis à jour en fin de session.

## Le projet
PWA Android pour gérer les fiches de personnages du JDR Daggerheart. Au départ, seul le MJ l'utilise, en local.

**Stack** : HTML / CSS / JavaScript simples, sans framework. localStorage + export/import JSON. Pas de serveur. Hébergement GitHub Pages.

**Site** : https://enguerrandm.github.io/daggerheart-companion/

## Périmètre V0.1
- [x] Liste de personnages (écran liste + ouverture d'une fiche + retour)
- [x] Créer / supprimer un perso
- [x] Champs : nom, ascendance, communauté, classe, niveau (éditables en mode ✎ Modifier)
- [x] 6 caractéristiques : Agility, Strength, Finesse, Instinct, Presence, Knowledge (éditables)
- [x] PV, stress, espoir avec boutons +/− et limites configurables
- [x] Sauvegarde locale (localStorage) de toute la liste, testée sur téléphone
- [x] Export / import JSON

**✅ V0.1 TERMINÉE le 2026-11-07** (critère de réussite validé sur téléphone).

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
- `TEXTES` (haut d'`app.js`) : TOUS les textes affichés, en **français** depuis le 2026-11-09 (= String Table). Textes à trous = petites fonctions (`titreListe(n)`). Les clés internes (`pv`, `espoir`, `data-action`…) restent en français : ce sont des identifiants.
- `sw.js` : service worker « réseau d'abord » (`fetch` avec `cache: "no-cache"`), copie en cache `dhc-v1` pour le hors-ligne. `manifest.json` + `icones/` : app installable.
- **Cache** : réglé par le service worker. `?v=N` gardé par prudence (incrémenter à chaque modif d'`app.js`), à retirer plus tard.

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
- [x] Exo 3 trouvé par Enguy (2026-11-07) : une sauvegarde existe → `charger()` fait `return liste` avant d'atteindre `personnagesParDefaut`. Les défauts ne servent que sans sauvegarde (navigation privée, autre appareil, données effacées).

### Session 4 — 2026-11-07
- [x] Créer un perso (`.push`, id = `"perso-" + Date.now()`) / supprimer (`.filter` + `confirm()`), testé sur téléphone (`?v=6`)
- Décision : pas de formulaire de création séparé. « Nouveau » crée un perso vierge et ouvre sa fiche en mode édition → un seul écran à maintenir.
- [x] Mode édition (`modeEdition`, bouton ✎ Modifier / ✓ Terminé) pour l'identité ; écouteur `input` sur `data-champ` ; `echapper()` contre l'injection HTML (`?v=7`) ✅
- Le bouton Supprimer n'apparaît qu'en mode édition (évite les fausses manips en partie).
- [x] Caracs et max des ressources réglables en mode édition, via boutons −/+ (le clavier numérique Android cache souvent le « − »). `ligneReglage()` générique, listes `CARACS` / `RESSOURCES`, `BORNES` + `borner()` centralisés. Baisser un max ramène l'actuel dessous. (`?v=8`) ✅ testé
- [x] Version des données (`?v=9`) : sauvegarde = enveloppe `{ version: 1, personnages: [...] }` ; `migrer()` convertit en escalier (v0 = tableau nu → v1) et servira aussi à l'import JSON ; si la sauvegarde est illisible ou d'une version inconnue, copie brute mise de côté sous `dhc-personnages-secours` avant que les défauts n'écrasent tout. Testé en simulation (v0, v1, v99, JSON cassé). ✅ testé sur téléphone
- [x] Export/import JSON (`?v=10`) ✅ testé sur téléphone : export = Blob + lien `<a download>` → `daggerheart-AAAA-MM-JJ.json` (enveloppe versionnée, indentée) ; import = `<input type="file">` caché dans index.html (hors de #app), `async/await` pour lire le fichier, `migrer()` + `persoValide()` (`.every`), confirmation, puis REMPLACE la liste. Copie de la liste d'avant sous `dhc-personnages-avant-import`. `CARACS`/`RESSOURCES` remontées en haut du fichier (piège : un `const` n'existe pas avant sa ligne).

- [x] Nouvelle palette sarcelle / or champagne (inspirée d'une image de référence d'Enguy), couleurs centralisées en variables CSS dans `:root` (= Material Parameter Collection), `<meta name="theme-color">` pour la barre Android. Le bouton « Soin complet » reste non stylé (exo CSS).

## À faire / points ouverts
- [ ] Activer la double authentification (2FA) sur GitHub (via navigateur : Settings → Password and authentication)
- [ ] Vérifier la licence du SRD Daggerheart (Darrington Press) avant d'y mettre du contenu de règles, le dépôt étant public
- [ ] Vérifier dans les règles officielles les valeurs de départ (PV selon la classe, stress, espoir max)
- [x] ~~Cache d'`index.html` ~10 min~~ → réglé par le service worker (V0.2 étape 1).
- [ ] « Soin complet » = hack `delta 99`. Version propre possible : action `soin` qui fait `res.actuel = res.max` (bon exo sur le `switch`). Bouton pas encore stylé (exo CSS possible).
- [x] ~~Dette : pas de numéro de version dans les sauvegardes~~ → réglé en v9 (`VERSION_DONNEES`, `migrer()`).
- Règle : à chaque changement de FORME d'un perso, incrémenter `VERSION_DONNEES` et ajouter une marche dans `migrer()`. Ne jamais supprimer une ancienne marche.
- [ ] Rappel : vider les données de Chrome efface les persos → l'export JSON sera la vraie sauvegarde de secours.
- [ ] Après la V0.1 — souhaits d'Enguy (2026-11-07) :
  - Choix de création (ascendance, communauté, classe…) figés une fois le perso validé. Garder un mode « Correction MJ » (= l'actuel ✎ Modifier) comme porte de sortie.
  - Niveau et caracs qui n'augmentent que via un écran de montée de niveau (règles de level-up à vérifier).
  - Modificateur temporaire buff/debuff sur les caracs, affiché `base (modifiée)`. Stocker base et modif SÉPARÉMENT (ex. `{ base: 2, modif: -1 }`), jamais fusionnés.
  - Ascendance / communauté / classe choisies dans une liste (`<select>`) au lieu d'être tapées. Bloquants : lire la licence DPCGL (formats autorisés, mentions obligatoires) + choisir FR ou EN pour les noms. Prévoir que la liste s'agrandira (Class Packs annoncés).
  - → Pré-requis : version de schéma dans les sauvegardes (voir dette ci-dessus), à faire avant l'export JSON.
- [x] ~~Manifeste + icône~~ → fait (V0.2 étape 1).

## Plan V0.2 (validé le 2026-11-07)
1. PWA : manifeste + service worker « réseau d'abord » → règle le cache d'`index.html`, app installable, hors-ligne partiel.
2. Devoirs Enguy (sans code) : lire la licence DPCGL (mentions obligatoires, formats autorisés). ~~Choisir FR ou EN~~ → décidé : **EN** (noms du SRD + interface).
3. ~~Fichier de référence dans le dépôt~~ → **listes LOCALES** (classes, ascendances, communautés) saisies par le MJ dans un écran de gestion (ajouter/supprimer), stockées en localStorage + incluses dans l'export JSON. Les `<select>` se remplissent depuis ces listes, avec option « Other ». Aucun contenu SRD dans le dépôt tant que Darrington Press n'a pas répondu. Si feu vert : on livrera une liste officielle en plus.
4. Écran de création → validation → identité verrouillée ; le mode ✎ devient « Correction MJ ».
5. Modificateurs de caracs `{ base, modif }` → migration v3 → v4 (v2 = listes, v3 = brouillons).
- Plan révisé (2026-11-09) :
  - **V0.2** : 4b preset de caracs → 5 modificateurs buff/debuff → écran About → critère de réussite.
  - **V0.3** : capacités. Ascendance = 2 capacités, communauté = 1 (vérifié SRD), saisies par Enguy dans les listes. Cartes de domaine : chaque classe a 2 domaines, 2 cartes choisies à la création (vérifié SRD). Vue « deck » sur la fiche, swipe gauche/droite (CSS `scroll-snap`) + boutons ◀ ▶. Cartes saisies à la main par Enguy, avec ses mots.
  - **V0.4** : ajout de l'anglais (choix de langue).
  - Plus tard : montée de niveau. **Pas de multiclassage** avant longtemps.
- Preset de caracs (vérifié SRD) : +2, +1, +1, +0, +0, −1 à répartir. Interface finalement retenue : toucher-poser (voir étape 4b). Uniquement à la création ; la correction MJ garde les +/− libres.
- Décisions langue (2026-11-08) : un perso stocke un **identifiant** (`classe: "guardian"`), jamais le nom affiché ; données de référence en **un seul fichier**, une ligne par entrée avec les deux langues (`{ id, en, fr }`) ; Enguy n'a pas besoin de garder les persos actuels → pas de migration des anciens textes libres FR.

**Critère de réussite V0.2** : installer l'app sur l'écran d'accueil ; créer un perso via l'écran de création avec listes ; identité verrouillée ; appliquer/retirer un debuff ; un export d'avant la V0.2 se réimporte correctement (migration).

## Licence (décisions du 2026-11-08/09)
- DPCGL 2.0 lue : les applis/sites ne sont PAS dans les « Permitted Formats » ; l'usage privé entre amis n'est pas une « diffusion ». Traduire ne change rien (traduction = Adaptive Content).
- Enguy envoie un mail à info@darringtonpress.com (brouillon fait le 2026-11-08) pour demander si une appli gratuite est acceptée. En attente de réponse.
- En attendant : dépôt public, **aucun nom tiré du SRD dans le code** (pas de synonymes non plus). Noms de caracs/ressources (Agility, HP, Stress, Hope…) gardés : génériques, risque jugé faible (supposition).
- Règle : **le code est public, le contenu reste privé.** Les listes et cartes saisies par Enguy (même reformulées : une reformulation reste du contenu dérivé) vivent dans le localStorage et ses exports JSON, jamais dans le dépôt.
- Prévu : écran « About » avec la mention 4.1 + avertissement de non-affiliation (comme FreshCutGrass, Daggerheart Brews…).
- Plan B si refus : dépôt privé (gratuit) + Cloudflare Pages + Cloudflare Access (gratuit ≤ 50 utilisateurs, connexion par code email). Pièges : configurer Access sur *.pages.dev (pas seulement les previews) ; le service worker risque de mettre en cache la page de login → adapter sw.js. GitHub Pro (4 $/mois) ne sert à rien : le site resterait public.
- Icône d12 générée par IA (Claude) : Enguy pourra la refaire lui-même (contexte : Critical Role publiquement hostile à l'art généré par IA).

## Avancement V0.2
### Session 5 — 2026-11-08
- [x] Étape 1a : `manifest.json` + icônes (d12 doré, `icones/icone.svg` = source)
- [x] Étape 1b : `sw.js` réseau d'abord ✅ testé sur téléphone : app installée, fonctionne en mode avion
- [x] Interface passée en anglais via l'objet `TEXTES` (`?v=18`), persos par défaut en anglais

### Session 6 — 2026-11-09
- [x] Noms du SRD retirés des persos par défaut (`?v=19`)
- [x] Étape 3a (`?v=20`) : sauvegarde v2 = `{ version: 2, personnages, listes }`, listes vides `LISTES_VIDES = { classes, ascendances, communautes }` (entrées `{ id, en, fr }`). 1re vraie migration v1 → v2 (ajoute des listes vides). `migrer()` renvoie maintenant l'enveloppe entière ; `listesValides()` ; `enveloppe()` partagée par sauvegarde + export ; `let { personnages, listes } = charger()` (déstructuration = Break Struct). L'import remplace persos ET listes. Testé en simulation : vide, v0, v1, v2, v99, JSON cassé, listes cassées.
- Limite connue : importer un vieil export (v1) remplace tes listes par des listes vides.
- [x] Étape 3b (`?v=21`) : écran « ☰ Lists » (état `ecranListes`, 3e écran dans `rendre()`). Constante `LISTES` (= CARACS pour les listes). `ajouterEntree()` : id fabriqué depuis le nom EN par `versId()` (minuscules, sans accents, regex → `sea-born`), refus si nom vide ou id en double (`.some`). `retirerEntree()` (`.filter` + confirm). Affichage trié (`[...].sort` + `localeCompare`) sans toucher à l'ordre stocké. Testé en simulation (ajout, doublon, vide, accents, HTML échappé, retrait).
- Pas d'édition d'une entrée pour l'instant : retirer puis rajouter.
- [x] Étape 3c (`?v=22`) : en mode Edit, ascendance / communauté / classe = `<select>` (`champChoix()`, constante `CHAMPS_LISTE`) rempli depuis les listes + « — Choose — » + « Other… » (valeur `__autre__`, impossible comme id) qui fait apparaître un champ texte libre. Écouteur `change` sur `data-choix` → sauvegarde + `rendre()`. `champsAutre` = un `Set` (état d'interface) pour garder « Other… » affiché tant que rien n'est tapé. Affichage via `nomChoix()`. Nouveaux persos : champs `""` au lieu de `"?"` (les deux = « pas choisi »). Testé en simulation.
- ⚠️ Dette assumée : le même champ contient SOIT un id de liste, SOIT du texte libre. Pas de migration nécessaire, mais : une entrée retirée laisse un id « orphelin » affiché brut (ex. `seer`) ; un texte libre identique à un id (ex. taper « seer ») se raccroche à l'entrée. À reprendre si ça gêne (champs séparés `classeId` / `classeTexte` + migration).
- ✅ Étape 3 validée sur téléphone (2026-11-09).
- [x] Étape 4 (`?v=23`) : brouillon / création / correction MJ. Choix d'Enguy : validation = nom + ascendance + communauté + classe obligatoires ; « ✎ GM fix » protégé par confirmation ; un brouillon quitté reste dans la liste avec un badge « Draft ».
  - Sauvegarde **v3** : champ `cree` (booléen) sur chaque perso. Migration 2 → 3 : persos existants → `cree: true` (`forEach`). `persoValide()` vérifie `cree`.
  - `nouveauPerso()` : `nom: ""`, `cree: false`. `afficherPersonnage()` renvoie `afficherCreation()` pour un brouillon (réutilise `identiteEdition`/`caracsEdition`/`ressourcesEdition`). Action `valider` + `champsManquants()` (alerte « Missing: … »). « Other… » laissé vide compte comme manquant.
  - En mode jeu : identité + caracs en lecture seule ; seuls les +/− de ressources et Full heal restent. Sortir de GM fix ne demande pas de confirmation. Testé en simulation (migrations v1/v2 → v3, création, refus, brouillon, confirmation).
  - « Dupliquer » ouvre la copie en édition sans confirmation (assumé : on vient de la créer).
- [x] Correctif (`?v=24`, retour d'Enguy) : en GM fix, « ← List » gardait les modifs (sauvegarde à la frappe) → remplacé par « ✕ Cancel ». Snapshot `copieAvantCorrection` (`structuredClone`) pris en entrant en GM fix (et après Dupliquer) ; Cancel le remet à la même place (`findIndex`). « ✓ Done » garde les modifs. Limite : fermer l'app en pleine correction garde les modifs déjà tapées.
- [x] **Retour au français** (`?v=25`, décision d'Enguy) : le contenu (listes, futures cartes) est saisi par Enguy en français avec ses propres mots, donc l'interface repasse en FR (`TEXTES`, `lang="fr"`, manifeste). Listes : nom **FR obligatoire**, nom EN facultatif (servira à relier à l'officiel anglais si autorisation). Id fabriqué depuis le nom FR. `nomEntree(e)` = `e.fr || e.en` → les entrées créées en anglais restent valides, pas de migration. Noms des caracs traduits maison (Agilité, Force, Finesse, Instinct, Présence, Savoir) : à comparer avec une éventuelle VF officielle.
- [x] Étape 4b (`?v=26`) : preset de caracs à la création en **toucher-poser** (choix d'Enguy, plutôt que l'échange ou le vrai drag & drop, trop coûteux en tactile ; un vrai glisser pourra s'ajouter par-dessus plus tard). `PRESET_CARACS = [2, 1, 1, 0, 0, -1]`. Brouillon : caracs à `null` = pas placée (`persoValide` l'accepte seulement si `cree: false`). `reserve(perso)` recalcule la réserve (preset moins valeurs posées, `indexOf` + `splice`) → une seule source de vérité. État d'interface `jetonSelectionne`. Toucher une carac remplie main vide = reprendre sa valeur ; poser sur une carac remplie renvoie l'ancienne valeur dans la réserve. `champsManquants` exige une réserve vide. `preparerBrouillon()` remet à vide un vieux brouillon incohérent (six 0). Testé en simulation.

## Exos d'Enguy (avant la V0.2)
- [x] 1. Styler le bouton « Soin complet » (CSS + variables)
- [x] 2. Nombre de persos dans le titre : « Personnages (3) »
- [x] 3. Nom vide → afficher « Sans nom » (fonction `nomAffiche(perso)` + `.trim()` + `||`)
- [x] 4. « Soin complet » propre : action `soin` + `soignerComplet(perso, cle)` (v15)
- [x] 5. Bouton « Dupliquer » un perso : `dupliquerPerso(perso)` avec `structuredClone` (v16)
- [ ] Bonus : trier la liste par nom

Notes des exos 1-3 (2026-11-08) :
- Pièges vus : `;` oublié en CSS (la ligne suivante saute aussi) ; `border` raccourci vs `border-color` seul ; `personnages.map.length` = nb de paramètres de map (toujours 1) ; casse des noms de variables ; portée : dans `.map((p) => …)` le perso s'appelle `p` ; passer `p.nom` au lieu de `p` à une fonction qui attend le perso ; `${objet}` affiche `[object Object]` ; parenthèse non fermée = fichier entier cassé ; `echapper()` seulement pour du HTML, pas pour `confirm()`.
- Exos 4-5 : `switch/case` = Switch on String, `break` oublié = on enchaîne sur le case suivant ; guillemets = texte, sans = nom de variable ; `dataset` ne lit que les `data-…` (pas la class) ; accolade effacée par accident sur mobile = fichier entier cassé ; référence vs copie (`const copie = perso` = même objet, `structuredClone` = vrai Spawn, copie profonde) ; ne pas réutiliser le même nom pour original et copie ; récupérer le `return` d'une fonction.
- Nouveau fonctionnement : l'éditeur GitHub mobile est trop limité (un fichier par commit, pas de coloration ni de numéros de ligne). Enguy écrit son code dans le chat, Claude relit puis pousse son code tel quel et gère le `?v=N`.

## Prochaine étape
V0.2 étape 5 (modificateurs `{ base, modif }`, migration v3 → v4), écran « About », critère de réussite V0.2.
