Maintenant j'ai tout ce qu'il faut. Voici ce que j'observe :

1. `lolve` est à `C:\lolve` — pas un package npm publié
2. `jgr-ui` n'a aucune dépendance sur `lolve` actuellement — il faudra un alias vite
3. Les méthodes `Trigo` de lolve sont des méthodes d'instance liées au framework (`this.item`, `this.prev`...) — `DagOrb.js` devra implémenter sa propre math pure
4. `lolve-cartography` est CJS — il faudra un port inline

Je commence.
**Commit 1 — `lolve/src/dag/DagOrb.js`**
**Commit 2 — alias vite + import dans JgrDag**
**Commit 3 — JgrDag.svelte : remplacer Streams par layoutDAG**
Correction de la ligne vide accidentelle, puis remplacement du bloc posMap :
Maintenant le bloc posMap (lignes 80–193) :
Maintenant le template — remplacer les level-lines :
JgrDag.svelte est propre. **Commit 4 — `roadmap-visualizer.cjs`** :
Il y a du code mort dans `_dagLevels`. Nettoyage :
Vérifions le résultat final des deux fichiers modifiés :
Bon. Maintenant les commits git :
Tout est commité. Résumé de ce qui a été fait :

---

### 3 commits, 3 repos

**`lolve` — `src/dag/DagOrb.js`** (nouveau)
- `layoutDAG(nodes, edges) → Map<id, {x, y}>` — API publique
- Algorithme : niveaux topologiques → composantes connexes → placement L0 centré → Lk sous centroïde des parents → étalement `_spread()` sans chevauchement → composantes côte à côte
- Math pure, aucune dépendance sur les classes lolve (Trigo, Nucleus...)

**`jgr-ui` — `vite.config.ts` + `JgrDag.svelte`**
- Alias vite : `'lolve'` → `../lolve`
- posMap : 109 lignes Streams → 8 lignes `layoutDAG()`
- Level-lines : 2 blocs `{#each}` imbriqués → 1 seul, piloté par `levelY` dérivé des positions
- Tout le reste (SVG, pan/zoom, edges, nodes, CSS) : inchangé

**`lolve-cartography` — `roadmap-visualizer.cjs`**
- `computeLayout()` remplacé par port CJS direct de DagOrb (même algorithme, même interface `{ pos, totalW, totalH }`)