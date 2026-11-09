# RECAP — Duality Companion (ex-Daggerheart Companion)

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

**✅ V0.2 TERMINÉE le 2026-11-09** : critère validé sur téléphone (app installée et hors-ligne, création via l'écran de création avec listes, identité verrouillée, buff/debuff appliqué puis retiré, vieil export d'avant la V0.2 réimporté via les migrations v1 → v4).

## Licence (décisions du 2026-11-08/09)
- DPCGL 2.0 lue : les applis/sites ne sont PAS dans les « Permitted Formats » ; l'usage privé entre amis n'est pas une « diffusion ». Traduire ne change rien (traduction = Adaptive Content).
- Enguy envoie un mail à info@darringtonpress.com (brouillon fait le 2026-11-08) pour demander si une appli gratuite est acceptée. En attente de réponse.
- En attendant : dépôt public, **aucun nom tiré du SRD dans le code** (pas de synonymes non plus). Noms de caracs/ressources (Agility, HP, Stress, Hope…) gardés : génériques, risque jugé faible (supposition).
- Règle : **le code est public, le contenu reste privé.** Les listes et cartes saisies par Enguy (même reformulées : une reformulation reste du contenu dérivé) vivent dans le localStorage et ses exports JSON, jamais dans le dépôt.
- Écran « À propos » fait (non-affiliation) ; mention 4.1 repoussée (voir Avancement V0.2).
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
- ✅ Étape 4b validée sur téléphone (« trop stylé »).
- [x] Étape 5 (`?v=27`) : modificateurs temporaires. Choix d'Enguy : affichage `+2 (+1)` = base puis TOTAL entre parenthèses (couleur or clair = buff, terracotta = debuff) ; toucher une carac en mode jeu ouvre/ferme son réglage −/+ (état `caracOuverte`). Bouton « Retirer tous les modificateurs » visible s'il y en a.
  - Sauvegarde **v4** : chaque carac = `{ base, modif }`, jamais fusionnés. `versCaracs()` convertit (persos par défaut, nouveaux persos, migration 3 → 4). `persoValide()` vérifie la nouvelle forme (base `null` permise pour un brouillon). Correction MJ = règle la BASE ; la création place la BASE. `BORNES.modif` −5 → +5 (provisoire). `caracsLecture()` supprimée (remplacée par `caracsJeu()`). Testé en simulation : migrations v0/v3 → v4 (y compris brouillon), buff, debuff, retrait, correction MJ, création.
  - Note : une `function` est utilisable avant sa ligne (hoisting), pas un `const` → c'est pour ça que `personnagesParDefaut` peut appeler `versCaracs()`.
- [x] Écran « ⓘ À propos » (`?v=28`) : version de l'app (`VERSION_APP = "0.2"`, distincte de `VERSION_DONNEES`), présentation, rappel « données locales → exporte », avertissement de non-affiliation + marque, crédits (Enguy ; code avec l'aide de Claude, IA), lien vers le dépôt. État d'écran unifié : `ecran = null | "listes" | "apropos"` (remplace le booléen `ecranListes`).
- Décision : **pas de mention DPCGL 4.1 pour l'instant** (remarque d'Enguy, validée) : l'app ne contient presque rien du SRD, et la mention reviendrait à revendiquer une licence qui ne couvre pas les applis. À ajouter si Darrington Press donne son accord. ~~Question à poser dans le mail : utiliser « Daggerheart » dans le nom de l'app.~~
- [x] **Nouveau nom : Duality Companion** (`?v=29`, choix d'Enguy) pour ne plus utiliser la marque dans le nom. Changé : `<title>`, `<h1>`, manifeste (`name`, `short_name: "Duality"`), À propos (+ « Compatible avec le jeu de rôle Daggerheart »), nom des exports (`duality-companion-AAAA-MM-JJ.json`). Volontairement inchangés : nom du dépôt / adresse du site (renommer = nouvelle URL + réinstaller l'app ; données a priori conservées car le localStorage dépend du domaine, à vérifier + exporter avant) et clés localStorage `dhc-…` (les changer perdrait les sauvegardes). Recherche rapide : aucune appli JDR nommée « Duality Companion ».
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

## Plan V0.3 (validé le 2026-11-09)
Principe : V0.3 = tout ce qui **découle de l'identité** du perso (aucun choix de cartes) ; un seul mécanisme : une entrée de liste porte ses capacités, le deck les assemble.
1. Modifier une entrée de liste (prérequis).
2. Sous-classes : nouvelle liste, chaque entrée pointe vers sa classe (`classe: id`) ; champ `sousClasse` sur le perso ; menu filtré par la classe à la création ; obligatoire pour valider ; changer de classe efface la sous-classe (sauvegarde v5).
3. Capacités sur les entrées (ascendance, communauté, classe, sous-classe), nombre libre, `capacites: [{ nom, texte }]`, texte brut (sauvegarde v6).
4. Deck unique sur la fiche (badge de type), swipe `scroll-snap` + ◀ ▶, assemblé automatiquement.
- Le perso ne stocke que des ids ; capacités dans les listes (localStorage + export), jamais dans le dépôt. Retirer une entrée retire ses capacités du deck.
- À vérifier SRD : capacités de classe (Espoir + features), 2 sous-classes par classe, capacité de départ de sous-classe.

**Critère de réussite V0.3** (proposé) : saisir les capacités d'une ascendance, d'une communauté, d'une classe et d'une sous-classe ; créer un perso avec sous-classe ; voir ses cartes défiler au doigt et aux boutons ; corriger une capacité et voir la correction sur la fiche ; l'export/import conserve tout.

**Repoussé** : V0.4 = cartes de domaine (la liste des domaines existe déjà depuis `?v=37`) + choix des 2 cartes à la création (classe « Autre » bloquée) + vault plus tard. V0.5 = anglais.

## Avancement V0.3
### Session 7 — 2026-11-09
- [x] Étape 1 (`?v=30`) : modifier une entrée de liste. Bouton ✎ → écran `ecran = "entree"` (état `entreeEditee = { cle, id }`), rien n'est sauvegardé avant « ✓ Enregistrer » (« ✕ Annuler » = juste quitter). **L'id ne change jamais** (= Row Name d'une Data Table) → renommer met à jour tous les persos. Doublons détectés par **nom** normalisé (`nomPris`), plus par id ; `idLibre()` fabrique `orc-2` si `orc` est déjà pris (cas : « Orc » renommé « Ogre » puis nouvel « Orc »). En cas d'erreur (vide/doublon), le texte tapé reste. Testé en simulation.
- [x] Numéro de build dans « À propos » (`?v=31`) : `BUILD` est LU depuis `document.currentScript.src` (le `?v=N`), pas recopié → une seule source de vérité. `VERSION_APP = "0.3-dev"`. Rappel : après un push, GitHub Pages met 1-2 min ; fermer/rouvrir l'app, vérifier le build dans À propos.
- [x] Étape 2 (`?v=32`) : sous-classes. Choix d'Enguy : **plus de « Autre… » pour la classe** (ni la sous-classe) ; dans ☰ Listes, sous-classes **affichées sous leur classe** (décalées) avec un bouton « + Sous-classe » par classe.
  - Données : liste à part `listes.sousClasses`, entrées `{ id, fr, en, classe }` ; c'est l'affichage seul qui les range sous leur classe. Sauvegarde **v5** (migration 4 → 5 : liste vide + `sousClasse: ""` sur chaque perso).
  - « + Sous-classe » ouvre l'écran d'entrée en mode création (`entreeEditee.id = null`, `classe` = parent) → cet écran servira aussi à saisir les capacités. `ajouterEntree(cle, fr, en, extra)` avec `...extra` (spread).
  - `CHAMPS_LISTE` passe en objets `{ champ, liste, label, autre, parent }`. `entreesPour()` filtre les sous-classes par la classe du perso ; `choixValide()` : sans « Autre », la valeur doit être un id de la liste proposée. Changer de classe vide la sous-classe (champs dont `parent` = le champ modifié). Sous-classe obligatoire pour valider.
  - Retirer une classe retire ses sous-classes (cascade, confirmation qui le dit). Vieux perso avec une classe en texte libre : affichée « … (hors liste) » en correction MJ, pas perdue en silence, mais à remplacer par une classe de la liste.
  - Testé en simulation (migration v4 → v5, ajout, doublon, filtre, reset, validation, cascade, hors liste).
- ✅ Étape 2 validée sur téléphone (2026-11-09).
- [x] Affichage (`?v=33`, demande d'Enguy) : ordre **classe · sous-classe · ascendance · communauté** partout (liste des persos, fiche, formulaires) = ordre de `CHAMPS_LISTE` ; `resumeIdentite()` partagée liste + fiche. Niveau dans une **pastille ronde** à droite du nom (`pastilleNiveau()`, CSS `.ligne-nom` flex + `.niveau` `border-radius: 50%`).
- [x] Étape 3 (`?v=34`) : capacités sur les entrées des 4 listes. Sauvegarde **v6** (migration 5 → 6 : `capacites: []` sur chaque entrée, via `Object.values`). `listesValides` vérifie `{ nom, texte }`.
  - Écran d'entrée = **brouillon** : `ouvrirEntree()` copie l'entrée (`structuredClone`) dans `entreeEditee.brouillon` + `original`. Les champs écrivent dans le brouillon (`data-brouillon`, `data-cap-champ` + `data-index` ; `dataset.capChamp` : les tirets deviennent une majuscule), sans sauvegarde ni `rendre()`. « ✓ Enregistrer » copie dans la vraie liste ; « ✕ Annuler » demande confirmation s'il y a des changements (`brouillonModifie()` compare les JSON).
  - « + Capacité » (focus auto sur le nom), ✕ par capacité (confirmation si non vide). À l'enregistrement, `capacitesPropres()` : trim, capacités vides ignorées, refus si texte sans nom.
  - `capacitesDuPerso()` (`flatMap` sur `CHAMPS_LISTE`) : le perso ne stocke aucune capacité, on les retrouve via ses ids. Affichage provisoire sur la fiche (section Capacités, `white-space: pre-line` pour les retours à la ligne) → sera remplacé par le deck. Liste : « · N cap. » à côté de chaque entrée.
  - Limite : le bouton retour d'Android ne passe pas par « Annuler » (l'app ne gère pas l'historique) → un brouillon non enregistré peut être perdu.
  - Testé en simulation.
- ✅ Étape 3 validée sur téléphone (2026-11-09) ; Enguy a saisi toutes les capacités d'une Fae Druide née du savoir pour tester.
- [x] Étape 4 (`?v=35`) : **le deck** remplace l'affichage provisoire. CSS `scroll-snap` (`overflow-x: auto` + `scroll-snap-type: x mandatory` ; cartes `flex: 0 0 88%` → on devine la suivante ; `box-sizing: border-box` sinon le padding s'ajoute aux 88 %). Couleur par type via `data-type` + variable CSS `--accent-carte` (classe or, sous-classe lilas, ascendance vert d'eau, communauté terracotta).
  - JS minimal : ◀ ▶ (`allerCarte()` → `scrollTo` smooth), compteur « 2 / 6 » + boutons désactivés aux bouts (`majDeck()`, met à jour 3 éléments sans `rendre()`). Le défilement au doigt est géré par le navigateur ; on l'écoute avec `addEventListener("scroll", …, true)` : **scroll ne remonte pas** (pas de bubbling), le `true` = phase de capture.
  - Piège évité : `rendre()` redessine toute la fiche à chaque +/− → le deck revenait à la 1re carte. État `indexDeck` + `allerCarte(indexDeck, false)` à la fin de `rendre()`. Remis à 0 quand on ouvre un autre perso.
  - Testé en simulation (boutons, compteur, bouts, position conservée après +Stress).
- [x] Deck v2 (`?v=36`, précision d'Enguy) : **la fiche est la 1re carte du deck**, tout à gauche ; on glisse vers les capacités. Mode jeu seulement : correction MJ et création restent en écran plein.
  - Deck en pleine largeur : marges négatives (`margin: 0 -1.5rem`) qui annulent le padding du body + `scroll-padding` → la carte garde toute la largeur et on aperçoit le bord des voisines. Cartes `flex: 0 0 100%`, `align-items: flex-start` (chaque carte garde sa hauteur).
  - Barre ◀ « Fiche » / « Capacité 2 / 6 » ▶ **au-dessus** du deck, `position: sticky` (reste collée en haut). `remonterAuDeck()` : si on a défilé vers le bas et qu'on change de carte, on remonte en haut du deck (`getBoundingClientRect`).
  - Verrou `cibleDeck` pendant l'animation d'un bouton (sinon le compteur reculait et un 2e tap rapide allait au mauvais endroit), levé à l'arrivée ou après 700 ms (`setTimeout`/`clearTimeout`).
- ✅ Deck v2 validé sur téléphone (2026-11-09).
- [x] Visuels (`?v=37`, demandes d'Enguy) :
  - Toutes les cartes ont la hauteur de la fiche (`align-items` par défaut = `stretch`) → plus d'espace vide.
  - **Domaines avancés de la V0.4** (juste ce qu'il faut pour les couleurs) : nouvelle liste `domaines` (`{ ..., couleur: "#rrggbb" }`, choisie par le MJ avec `<input type="color">`, aucune couleur officielle dans le dépôt) ; chaque classe a `domaines: [id, id]` (2 menus sur l'écran de la classe). Sauvegarde **v7**. Pastilles de couleur devant domaines et classes dans ☰ Listes.
  - Carte de capacité de **classe et sous-classe** = dégradé diagonal entre les 2 couleurs de domaines, fondu au centre (variables CSS `--d1`/`--d2` passées en `style`, `color-mix(... 45%, transparent)`). **Ascendance = doré, communauté = argenté.**
  - Sécurité : une couleur finit dans un attribut `style` → validée par regex `^#[0-9a-f]{6}$` (`couleurSure()` + `listesValides` refuse un import piégé).
  - Testé en simulation (migration v6 → v7, saisie, couleurs, import piégé refusé).
- [x] Retouches (`?v=38`) : dégradé recalculé **en oklab** (`linear-gradient(in oklab 135deg, …)`), coins à 60 %, centre = mélange des 2 couleurs à 30 %, sur un fond **neutre** gris très sombre (le sarcelle de l'app ressortait au centre comme une 3e couleur). Cartes de **classe seulement** : bordure **dorée 2px avec reflet** (bordure transparente + 3e fond doré `border-box` sous les fonds `padding-box` ; les 2 calques en variables `--calque-couleur`/`--calque-fond` pour pouvoir leur donner chacun `padding-box`). Nécessite un Chrome récent (oklab/color-mix : Chrome 111+).

## Prochaine étape
**V0.3 — validation du critère de réussite sur téléphone**, puis cadrage V0.4 (voir Plan V0.3). Ancien cadrage :
- Capacités d'ascendance (2) et de communauté (1) rattachées aux entrées des listes, saisies par Enguy.
- Cartes de domaine : domaines (2 par classe), cartes saisies par Enguy (nom, domaine, niveau, coût, texte avec ses mots), 2 cartes choisies à la création.
- Vue « deck » sur la fiche : swipe (CSS `scroll-snap`) + boutons ◀ ▶.
- Rappels : contenu privé (localStorage + exports), jamais dans le dépôt. Pas de multiclassage. Réponse de Darrington Press attendue (mail à envoyer par Enguy).
- Petits restes possibles : icône à refaire par Enguy ; renommer le dépôt plus tard (optionnel).
