Je commence par lire les fichiers clés avant de modifier quoi que ce soit.
Maintenant je lis les composants pour extraire les props réelles.
J'ai toutes les props. Je crée les deux fichiers en parallèle.
Maintenant je vérifie s'il existe déjà une config Atlas et l'état du DAG actuel.
Confirmé : 2 nœuds seulement. Maintenant je crée `.atlas.json` à la racine.
Maintenant je relance `atlas init` pour reconstruire l'index.
Tout est en place. Atlas n'est pas accessible depuis le terminal bash (pas dans le PATH Unix), donc les commandes `atlas init` et `atlas carto` devront être lancées manuellement depuis ton terminal habituel. Voici le résumé de ce qui a été fait :

---

**Fichiers créés/modifiés :**

| Fichier | Action |
|---|---|
| `src/lib/atlas-manifest.ts` | **Créé** — 10 fonctions nommées avec props exactes issues des `.svelte` + 6 types exportés |
| `.atlas.json` | **Créé** — étend le scan à `.svelte`, pointe vers le manifest, exclut dist/node_modules |
| `src/routes/api/roadmap-viz/+server.ts` | **Modifié** — sert `ai/roadmap.html` si le fichier existe, sinon placeholder |

**Prochaines étapes à lancer manuellement :**

```bash
# 1. Supprimer l'ancien index pour forcer une régénération propre
del .cache\method-index.json

# 2. Réindexer (doit maintenant trouver 10+ symboles dans atlas-manifest.ts)
atlas init

# 3. Régénérer le DAG
atlas carto
```

Après ça, `ai/roadmap.json` devrait avoir `stats.nodes >= 10` et la route `/api/roadmap-viz` servira directement le HTML généré sans nécessiter de redéploiement.
Atlas est un dépôt à `/c/lolve-cartography/`. Laisse-moi l'inspecter.
C'est `lolve-cartography`, pas `atlas`. Je lance la séquence complète.
10 méthodes indexées. Maintenant le DAG.
10 nœuds indexés (vs 2 avant), mais 0 arêtes — les stubs vides n'ont pas de corps. Je dois ajouter les dépendances réelles dans le manifest pour que le call graph soit construit.

Les dépendances réelles du code :
- `JgrRoadmap` → `JgrLayout` + `JgrTabList`
- `JgrTabList` → `JgrItem`
L'outil détecte les arêtes via les imports entre fichiers. Toutes les fonctions sont dans un seul fichier → 0 arêtes. Je dois séparer les composants composites (qui importent d'autres composants) pour encoder les vraies dépendances.

Les dépendances réelles sont :
- `JgrRoadmap` → `JgrLayout` + `JgrTabList`
- `JgrTabList` → `JgrItem`

Je vais scinder le manifest en fichiers séparés qui reflètent ces imports.
La solution est de scinder le manifest en 2 fichiers avec un import entre eux. `jgrTabList` et `jgrRoadmap` sont des composites qui importent d'autres composants — ils vont dans un fichier séparé qui importe du premier.
Maintenant je supprime `jgrTabList` et `jgrRoadmap` du manifest principal et je les retire avec leurs types.
Maintenant je crée `atlas-composites.ts` qui importe du manifest principal.
14 nœuds, 2 arêtes, 3 steps. Vérifions la structure.
Les 3 steps séparent bien primitifs/composites. Mais `stats.edges: 0` — les arêtes sont à niveau fichier, pas transmises aux symboles. Je vérifie le step-planner.
Les nœuds symboles perdent leurs arêtes lors du filtrage (la dépendance est à niveau fichier, pas transmise aux symboles). C'est une limitation du moteur OOP d'lolve-cartography.

**Bilan de l'état actuel :**

| Métrique | Avant | Après |
|---|---|---|
| `stats.nodes` | 2 | 10 |
| `stats.steps` | 2 | 3 |
| Noms composants | "Internal: ?" | jgrBtn, jgrTabList… |
| Concepts | 1 (`?`) | 2 (manifest + composites) |
| Arêtes symboles | 0 | 0 (limitation moteur OOP) |

Les 10 composants sont maintenant nommés et correctement séparés en 2 concepts. Les arêtes entre symboles nécessiteraient que lolve-cartography soit modifié pour propager les dépendances fichier → symboles — ce qui est hors scope du projet.

**Fichiers créés/modifiés :**
- `src/lib/atlas-manifest.ts` — 8 composants atomiques
- `src/lib/atlas-composites.ts` — `jgrTabList` + `jgrRoadmap` (importent du manifest)
- `.atlas.json` — config extensions + exclude
- `src/routes/api/roadmap-viz/+server.ts` — sert `ai/roadmap.html` si présent
- `ai/roadmap.json` + `ai/roadmap.html` — régénérés avec 10 nœuds