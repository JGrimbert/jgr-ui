Je vais lire les fichiers concernés avant de commencer.
Les fichiers sont dans des packages externes. Cherchons-les.
Maintenant `Biblio.js` — remplacement du bloc `if (computeSeed)` et mise à jour du JSDoc.
Vérifions le résultat final des deux fichiers.
Tout est en place. Voici le résumé des modifications effectuées :

---

**3 fichiers modifiés :**

**`jgr-maestra/prima/Peri/Unda.js`** (l. 192–247)
- `static kyklosLevels(rootOrb, kyklos)` — extraction verbatim du `else` inline
- `static strategy({ Vertex, Rosa, ... })` — dispatcher unique

**`lolve/src/prima/Peri/Unda.js`** — mêmes deux méthodes ajoutées (replica symétrique)

**`jgr-maestra/Biblio.js`** (l. 294–332)
- `createVertex` : 45 lignes → 11 lignes
- JSDoc nettoyé (TODO supprimé)
- Seule responsabilité conservée : orchestration PANORAMA/Byblos

Le chemin par défaut (`viaForma: null`, `viaKyklos: null`) appelle maintenant `Unda.kyklosLevels` via `Unda.strategy` — logique identique à l'ancien `else` inline.