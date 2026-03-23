Je vois la structure. Maintenant je dois trouver le fichier `maestra.js` et comprendre la classe Biblio de jgr-maestra.
Maintenant je comprends bien la structure. Le plan est clair : fusionner `params` et `graph` dans `nova` et `createVertex`. Les deux objets sont très redondants. Voici la refactorisation :
Maintenant il faut aussi mettre à jour le commentaire de documentation dans la classe (`@param {Object} p`) pour refléter le nouveau paramètre unique :
Vérifions le résultat final des deux méthodes modifiées :
C'est propre. Voici le résumé des changements dans `C:\jgr-maestra\Biblio.js` :

**`nova`** — `params` absorbe maintenant `computeSeed` et `configMotiva` depuis `graph`, et l'appel passe de `this.createVertex(params, graph)` à `this.createVertex(params)`.

**`createVertex`** — le second paramètre `graph` est supprimé. À la place :
- `graph.computeSeed` → `computeSeed` (destructuré depuis params)
- `graph.configMotiva` → `configMotiva` (idem)
- `graph.struo.grano.head` → `rosa.grano.head` (puisque `rosa = graph.struo`, c'est la même référence)