Maintenant je lis la page démo.
J'ai tout en main. Je commence les modifications.

**Étape 1 — `computeGravityLevels` multi-passes dans `DagOrb.js`**
**Étape 2 — Passer `isSpine` dans `JgrDag.svelte`**
**Étape 3 — Mock démo + légende**
Maintenant je mets à jour la légende pour refléter le nouveau comportement et ajouter le cas cascade :
Maintenant j'ajoute le style CSS pour le nouveau tag `tag-cascade` :
Maintenant je vérifie le résultat final des deux fichiers modifiés :
Tout est correct. Les trois modifications sont en place :

---

**Résumé des changements**

**`DagOrb.js` — `computeGravityLevels`** : remplacé le mono-passe L0-only par une boucle itérative avec :
- Traitement de **tous les nœuds** (pas seulement L0)
- Condition `minChildLevel >= currentLevel + 2` (générique, pas juste `>= 2`)
- **Garde parentale** : `newLevel = max(maxParentLevel + 1, minChildLevel - 1)` → ordre topologique toujours préservé
- **Protection `isSpine`** : les épines sont sautées
- **Convergence** : la boucle s'arrête quand aucun nœud ne bouge

**`JgrDag.svelte`** : `nodes` pour `computeGravityLevels` transmet maintenant `isSpine`.

**`+page.svelte` (démo)** : ajout de la chaîne `11 → 12 → 13` qui illustre la cascade (pass 1 : #12 tombe de L1 à L3 ; pass 2 : #11 tombe de L0 à L2), avec la section "Cascade (2 passes)" dans la légende.

Pour les nœuds 37, 38, 42 de ta roadmap réelle : ils doivent maintenant descendre en cascade vers leurs références communes profondes avec `gravityMode: true`.