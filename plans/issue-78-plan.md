Je dois trouver le vrai `Biblio.js` de jgr-maestra.
Clair. Je supprime `createVertex`, j'inline son contenu dans `nova`, et j'élimine la variable `params`.
Fait. Voilà le résultat :

- `createVertex` supprimée
- `params = { … }` supprimée — les champs passés directement dans le call `onComputeSeed`
- `quadro` retiré (n'était pas transmis à `onComputeSeed` de toute façon)
- `g` au lieu de `graph` pour faire court
- `this.flags = {}` reste en ligne après le if