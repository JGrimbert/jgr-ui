Laisse-moi d'abord lire les fichiers concernés.
Maintenant je lis `JgrLayout` pour comprendre les strip-bars :
Voyons la structure des routes existantes :
J'ai tout le contexte. Voici le plan :

1. `JgrLayout` : prop `showStrips` pour masquer les strips
2. `JgrRoadmap` : passer `showStrips={false}`, ajouter prop `generatedAt` affiché à côté du ↺
3. `demo/+page.svelte` : remonter la section JgrRoadmap sous la console, simplifier le titre
4. Créer `/api/roadmap-viz/+server.ts` pour un 404 centré dans l'iframe
Maintenant `JgrRoadmap` : supprimer les strips et ajouter `generatedAt` :
Maintenant la route `/api/roadmap-viz` pour centrer le message dans l'iframe :
Maintenant la page démo — remonter JgrRoadmap sous la console et simplifier le titre :
Maintenant remonter la section JgrRoadmap juste après la section console et simplifier son titre. Je vais d'abord extraire le bloc JgrRoadmap + les démos 5 states, puis les repositionner :
Maintenant supprimer l'ancienne section JgrRoadmap en bas de page :
Vérifions le résultat final des deux fichiers modifiés :
Tout est en place. Récap des changements :

---

**`JgrLayout.svelte`**
- Prop `showStrips = true` ajoutée. Les deux strips sont conditionnels à `{#if showStrips}`.

**`JgrRoadmap.svelte`**
- `showStrips={false}` passé à `JgrLayout` → plus de strips latérales.
- Prop `generatedAt?: string` ajoutée. Affichée en `.topbar-date` entre les stats et le bouton ↺.

**`demo/+page.svelte`**
- `demoGeneratedAt` initialisé avec l'heure courante, mis à jour après chaque régénération.
- Section JgrRoadmap déplacée juste après la section console.
- Titre simplifié : `<h2 class="section-title">JgrRoadmap + JgrTabList</h2>` (même style que la console), sans `<h3>` ni `<p>`.
- Ancienne section JgrRoadmap en bas de page supprimée.

**`src/routes/api/roadmap-viz/+server.ts`** (nouveau)
- Retourne une page HTML centrée (`align-items: center; justify-content: center; height: 100vh`) sur fond `#0c0c16`, avec le texte « roadmap non générée » — élimine le 404 brut et centre le message.