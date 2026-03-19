Laissez-moi lire le fichier concerné.
Maintenant le composant `JgrTabList`.
Je vois le problème. L'`$effect` qui gère le timer est fragile : sa fonction cleanup (`loadTimer = null`) peut interférer avec la relance. De plus, il n'y a pas de CSS réduisant l'opacité de la liste quand `pending` est vrai.

La solution simple : remplacer l'`$effect` par un `onMount` avec interval toujours actif.
Maintenant ajoutons le CSS manquant pour le "voile opaque" (il n'y a actuellement aucune règle qui réduit l'opacité quand `pending` est vrai, malgré la `transition: opacity` déjà présente) :
Attention : le `tl-pending-row` est **à l'intérieur** du `tl-list.stale`, donc le spinner serait lui-même dimé. Il faut le sortir du div stale.
Vérifions l'état final du composant :
C'est bon. Voici ce qui a changé :

**Cause du bug** : l'`$effect` gérait le timer avec une fonction cleanup qui remettait `loadTimer = null` avant chaque re-run. Dans certains cas (changement de `tabs` dû à un `$derived` du parent), le cleanup s'exécutait et effaçait le timer juste avant que le body le relance — mais la condition `!loadTimer` étant non-réactive, Svelte pouvait ne pas re-tracker correctement le démarrage.

**Ce qui a changé** :
1. **`onMount` à la place de `$effect`** — l'interval tourne toujours (overhead négligeable), plus de logique fragile de start/stop
2. **`tl-pending-row` sorti du `tl-list`** — le spinner ne sera plus affecté par l'opacité `.stale`
3. **CSS `.tl-list.stale { opacity: 0.4; pointer-events: none; }`** — le "voile opaque" est maintenant réel et désactive les interactions pendant le pending