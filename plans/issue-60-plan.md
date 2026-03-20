Je vais lire le type `IssueCluster` pour m'assurer de la structure exacte avant d'écrire le mockup.
J'ai tout ce qu'il me faut. Je vais ajouter un mockup "claudicator" avec des steps et clusters réalistes dans la démo.
Maintenant j'ajoute la section HTML dans le template :
Vérifions que le fichier compile correctement :
0 erreur, que des warnings préexistants. La section claudicator est ajoutée.

Voici ce que j'ai fait :

**Données mockup `claudicatorRoadmap`** — 11 steps réalistes pour un outil d'analyse de code :
- `entrypoint: ClaudicatorEntry` (racine, isSpine)
- `domain: RepoScanner` → `AstParser` → `DependencyGraph` (isSpine) → `StepPlanner` (isSpine)
- `domain: ClusterEngine` (branche parallèle depuis RepoScanner)
- `flow: RoadmapOrchestrator` (convergence StepPlanner + ClusterEngine, isSpine)
- `api: RoadmapApi`, `utility: CacheLayer`, `integration: GithubSync` (isSpine), `internal: TypeIndex`
- 7 concepts nommés, stats : 83 nœuds / 61 arêtes / 6 niveaux

**Données mockup `claudicatorClusters`** — 4 clusters :
- `graph` (issues 1, 2, 7 — score 0.82)
- `analysis` (issues 2, 5, 6 — score 0.74)
- `github` (issues 3, 6, 8 — score 0.68)
- `performance` (issues 1, 4, 8 — score 0.55)

La nouvelle section `JgrRoadmap` avec `clusters=` est insérée entre la démo roadmap existante et le séparateur JgrTabList, à hauteur 520px.