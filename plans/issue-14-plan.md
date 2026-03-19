Laisse-moi examiner les fichiers modifiés liés au DAG.
Maintenant lisons `JgrTabList.svelte` pour voir comment `issues` est affiché.
Voyons `JgrItem.svelte` pour voir si le prop `issues` est géré.
Le problème est clair. `JgrItem` n'a pas de prop `issues` et `JgrTabList` ne le transmet pas non plus — les numéros d'issues existent dans les `ListItem` mais ne sont jamais rendus.
Maintenant ajouter le style pour `.issue` et passer `issues` depuis `JgrTabList` :
Maintenant passer `issues` dans `JgrTabList` :
Les trois changements effectués :

1. **`JgrItem.svelte`** — ajout du prop `issues?: number[]` et rendu de chaque numéro comme badge `#n` dans la zone labels.
2. **`JgrItem.svelte`** — style `.label.issue` en monospace discret (distinct des labels skill).
3. **`JgrTabList.svelte`** — transmission `issues={item.issues}` vers `JgrItem` (c'était le maillon manquant).

Les onglets Étapes, Dossiers et Domaines afficheront maintenant les `#id` des issues associées à chaque stack, comme avant.