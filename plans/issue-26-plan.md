Le toggle `↡` existe déjà dans `JgrRoadmap.svelte` (lignes 340-347). Lisons `JgrDag.svelte` et `DagOrb.js` pour voir où en est l'implémentation.
Tout le code du plan est déjà implémenté. Le toggle `↡` est visible mais seulement quand `!splitMode`. Regardons la page de démo pour comprendre le problème.
Cherchons où `JgrRoadmap` est utilisé en démo.
Tout le code du plan est déjà implémenté. Le toggle `↡` est à la ligne 341-347 de `JgrRoadmap.svelte`, mais uniquement visible quand `splitMode = false`. Le problème : naviguer vers Steps ou Clusters force `splitMode = true` et le masque.

Cherchons s'il existe une démo dédiée DAG.
Il n'existe pas de démo dédiée au DAG. Le toggle `↡` est dans la topbar de `JgrRoadmap`, mais difficile à trouver car l'onglet "steps" force `splitMode=true` qui le masque. Je vais créer une page `/demo/dag` dédiée avec onglets Standard vs Gravity.
Je crée la page de démo dédiée DAG.
Maintenant ajoutons le lien vers cette page dans la démo principale.
Maintenant vérifions que la classe `demo-link` est définie dans le CSS de la page démo.
C'est fait. Voici ce qui a été créé :

**`/demo/dag/+page.svelte`** — page plein écran dédiée :
- Topbar avec bouton **`↡ gravité OFF/ON`** bien visible (s'allume en violet quand actif)
- Panneau légende gauche expliquant les candidats à la gravité :
  - **#9 ConfigLoader** (L0 → L1 avec gravité, enfant unique en L2)
  - **#10 PluginManager** (L0 → L2 avec gravité, enfant unique en L3)
  - **#1 CoreService** reste en L0 (enfant en L1 < 2)
- Clic sur un nœud de la légende ou du DAG pour le mettre en évidence

**`/demo/+page.svelte`** — lien ajouté vers `/demo/dag` dans la section dédiée.

Le mock est conçu pour que la différence soit immédiatement visible : les nœuds 9 et 10 "tombent" de L0 vers L1/L2 quand on active la gravité.