Voici le plan détaillé :

---

## Plan : Remplacement de roadmap.html / iframe par des composants Svelte

### 1. Analyse du problème

**Pourquoi c'est problématique :**
- `roadmap.html` est un document HTML autonome avec styles CSS inline, SVG embarqué et script externe (`/api/roadmap-js`). Il est servi via une API route et affiché dans une `<iframe>`.
- La communication parent ↔ iframe se fait via `localStorage` (clé `roadmap-cmd`), un couplage fragile et non-typé.
- Le composant `JgrRoadmap.svelte` reçoit déjà les données (`RoadmapData`) mais ne les utilise que pour la topbar et le panneau droit — le rendu SVG est délégué à l'iframe.
- L'iframe empêche l'intégration naturelle dans le système de thème, les animations Svelte, et le typage TypeScript.

**Ce qui peut être extrait :**
- Les données sont déjà disponibles dans `roadmap.json` et passées via `RoadmapData`.
- La logique de rendu SVG est entièrement dans `roadmap.html` (nœuds, arêtes, grille de niveaux, halos d'interaction).
- Le script interactif (`/api/roadmap-js`) gère la mise en évidence des nœuds sélectionnés.

---

### 2. Localisation des usages

| Fichier | Rôle | Impact |
|---|---|---|
| `ai/roadmap.html` | Source générée — SVG + CSS + données | À conserver pour référence, ne plus servir |
| `src/routes/api/roadmap-viz/+server.ts` | Sert `roadmap.html` en HTTP | À supprimer |
| `src/routes/api/roadmap-js/+server.ts` | Sert le script d'interactivité | À supprimer (logique à migrer) |
| `src/lib/components/JgrRoadmap.svelte` | Affiche l'iframe + topbar + JgrTabList | Modifier : remplacer l'iframe |
| `src/routes/demo/+page.svelte` (lignes 298–304) | Usage de `<JgrRoadmap src=...>` | Adapter : retirer la prop `src` |

---

### 3. Stratégie de remplacement

**Approche choisie : créer un composant `JgrDag.svelte`** qui rend le SVG du DAG directement en Svelte, en réutilisant les données `RoadmapData` déjà typées.

- La prop `src` de `JgrRoadmap` devient **optionnelle puis dépréciée**.
- La communication via `localStorage` est **remplacée par une prop réactive** (`activeIds: number[]`).
- Les styles CSS du `roadmap.html` sont migrés dans `JgrDag.svelte` en utilisant les variables CSS du thème (`JgrTheme`).

---

### 4. Étapes de modification du code

#### Étape 1 — Créer `JgrDag.svelte`

Nouveau composant `src/lib/components/JgrDag.svelte` :

- **Props :**
  ```typescript
  {
    roadmap: RoadmapData;
    activeIds?: number[];          // nœuds à mettre en évidence
    onNodeClick?: (id: number) => void;
  }
  ```
- **Rendu :** SVG généré par Svelte (`{#each}` sur `roadmap.steps`), reproduisant :
  - Grille de niveaux (L0, L1…) calculée à partir de `step.level`
  - Cercles/nœuds (`<circle>`) avec halo (`<circle class="halo">`)
  - Lignes de dépendances (`<line>`) entre nœuds liés
  - Mise en évidence réactive via classe CSS sur les éléments dont l'id est dans `activeIds`
- **Styles :** reprendre les CSS variables de `roadmap.html`, alignées sur `JgrTheme` (couleurs par skill déjà présentes dans `JgrRoadmap`).
- **Pas de localStorage**, communication directe via props/callbacks.

#### Étape 2 — Modifier `JgrRoadmap.svelte`

- Remplacer le bloc `<iframe src={src}>` par `<JgrDag roadmap={roadmap} activeIds={activeIds} onNodeClick={handleNodeClick} />`.
- Supprimer : la prop `src`, la logique `localStorage`, les refs sur l'iframe, les event listeners sur `storage`.
- Connecter la sélection du `JgrTabList` directement à `activeIds` (état Svelte local).
- Conserver la topbar, le `JgrTabList` et le callback `onissuefilter` — leur logique est indépendante.

#### Étape 3 — Supprimer les routes API

- Supprimer `src/routes/api/roadmap-viz/+server.ts`.
- Supprimer `src/routes/api/roadmap-js/+server.ts` (le script JS d'interactivité est maintenant dans le composant).

#### Étape 4 — Mettre à jour `demo/+page.svelte`

- Retirer la prop `src="/api/roadmap-viz"` de l'usage `<JgrRoadmap>`.
- S'assurer que `mockRoadmap` est bien passé (il l'est déjà).

#### Étape 5 — Mettre à jour les exports publics

- Ajouter `JgrDag` dans `src/lib/index.ts` (il peut être utile en standalone).
- Mettre à jour `atlas-manifest.ts` pour déclarer `JgrDag` comme composant primitif.
- Mettre à jour `atlas-composites.ts` : `JgrRoadmap` dépend de `JgrLayout`, `JgrTabList`, **et `JgrDag`**.

---

### 5. Vérifications et nettoyage final

#### Vérifications fonctionnelles

- [ ] Le DAG SVG s'affiche correctement dans `/demo` avec les données mock.
- [ ] La sélection d'un item dans `JgrTabList` met en évidence les bons nœuds dans le SVG.
- [ ] Le callback `onissuefilter` est toujours déclenché correctement.
- [ ] Le bouton "Régénérer" (`onRegenerate`) fonctionne.
- [ ] Les états `loading`, `generating`, `empty`, `error` s'affichent sans iframe.
- [ ] Les couleurs par skill correspondent à celles de `roadmap.html` (`utility: #7c6af7`, etc.).

#### Vérifications de non-régression

- [ ] `lolve-cartography` continue de générer `roadmap.html` et `roadmap.json` sans modification (il n'est pas affecté par ce changement).
- [ ] Le build `dist/` exporte bien `JgrDag` et `JgrRoadmap` mis à jour.
- [ ] Aucun autre fichier ne référence `/api/roadmap-viz` ou `/api/roadmap-js`.
- [ ] TypeScript : aucune erreur de typage sur les nouvelles props.

#### Nettoyage

- [ ] Supprimer les fichiers de routes API vides.
- [ ] Retirer la prop `src?: string` de `JgrRoadmap` (ou la marquer `@deprecated` si besoin de transition).
- [ ] Vérifier que `roadmap.html` reste dans `ai/` pour la génération future, mais n'est plus référencé dans le code applicatif.

---

**Résumé des fichiers créés/modifiés/supprimés :**

| Action | Fichier |
|---|---|
| **Créer** | `src/lib/components/JgrDag.svelte` |
| **Modifier** | `src/lib/components/JgrRoadmap.svelte` |
| **Modifier** | `src/lib/index.ts` |
| **Modifier** | `src/lib/atlas-manifest.ts` |
| **Modifier** | `src/lib/atlas-composites.ts` |
| **Modifier** | `src/routes/demo/+page.svelte` |
| **Supprimer** | `src/routes/api/roadmap-viz/+server.ts` |
| **Supprimer** | `src/routes/api/roadmap-js/+server.ts` |