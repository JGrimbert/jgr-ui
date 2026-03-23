# Plan — Refacto `createVertex` : délégation à `Unda.strategy()`

**Branch** : `issue-75-utilisation-de-maestra`
**Scope** : `C:\jgr-maestra\Biblio.js` + `C:\jgr-maestra\prima\Peri\Unda.js`
**Date** : 2026-03-23

---

## 1. Analyse du problème

### État actuel

`createVertex` (Biblio.js l. 308-371) porte **trois responsabilités qui appartiennent à Unda** :

| Responsabilité | Ligne | Problème |
|---|---|---|
| Création du Vertex initial (`Vertex.nova`) | 311-315 | Biblio connaît la mécanique d'initialisation d'un Orb |
| Sélection de la stratégie itérateur (arbre if/else) | 317-348 | Biblio décide quelle méthode Unda appeler |
| BFS inline par niveaux (le `else` final) | 323-347 | Code dupliquant la logique de `Unda.kyklos`, non encapsulé |

Le TODO en ligne 324 le confirme : `// TODO: Sortir et mettre dans l'itérateur <3`

### Objectif du refacto

`createVertex` doit avoir **une seule délégation active** :

```javascript
const { undae, extra } = this.Unda.strategy({ ... })
this.undae = undae
this.extra = extra
```

Unda devient responsable de :
1. Créer `nova` via `Vertex.nova()` (le input source)
2. Encapsuler l'arbre de sélection de stratégie
3. Exécuter le BFS par niveaux (le `else` inlinisé)

### Contrainte Magma (résolution des dépendances)

`Unda` est résolu **en 4ème position** dans `novaMagma` (après Nucleus, Atomos, Peri), AVANT les `overrides` (où Vertex, Rosa, Apex vivent en lolve). Unda ne peut donc pas recevoir `Vertex` et `Rosa` comme dépendances de factory.

**Solution** : `Vertex` et `Rosa` sont passés comme **arguments d'exécution** à `Unda.strategy()`, pas comme dépendances de construction. Pattern déjà utilisé implicitement par `Quadri` et `Sectio` dans `Unda.kyklos` (closures, optional chaining).

---

## 2. Localisation des usages

### `createVertex` — un seul callsite

| Fichier | Ligne | Appel |
|---|---|---|
| `C:\jgr-maestra\Biblio.js` | 288 | `this.flags = this.createVertex(params)` depuis `nova()` |

`nova()` est lui-même appelé depuis la closure `build` du Monteur (l. 206-208), déclenchée par `init()` → `monteur.init()`.

### `this.extra = nova.orb` — consommateurs

| Fichier | Usage |
|---|---|
| `Biblio.js` l. 315 | Affectation (à migrer dans `strategy()`) |
| `Biblio.js` l. 376 | `updateExtra = (extra) => { this.extra = extra }` (inchangé) |
| `+page.svelte` | Lecture de `biblio.extra` pour le rendu canvas |

### `Unda` — méthodes statiques actuelles

| Méthode | Paramètres | Retour |
|---|---|---|
| `nova(orb)` | `Orb` | `Unda` instance (nœud racine) |
| `viaFormaChain(rootOrb, totalSize)` | `Orb, number` | `Unda` |
| `viaFormaChainKyklos(rootOrb, totalSize, apexIndex)` | `Orb, number, number` | `Unda` |
| `viaKyklos(rootOrb, totalSize, apexIndex)` | `Orb, number, number` | `Unda` |
| `kyklos(initialLevel, size, step)` | `Orb[], number, number` | `Unda` |

La méthode `strategy()` et `kyklosLevels()` sont à créer.

---

## 3. Stratégie de remplacement

### 3.1 — Nouvelle méthode `Unda.kyklosLevels(rootOrb, kyklos)`

Extrait **verbatim** le bloc `else` inline de `createVertex` (l. 323-347).

Signature : `static kyklosLevels(rootOrb, kyklos) → any[][]`

Retourne un tableau de tableaux d'Orbs (`any[][]`) — le format attendu actuellement par `this.undae` dans le cas `else`. Le type de retour est **intentionnellement différent** des autres stratégies (qui retournent `Unda`) : c'est une asymétrie préexistante, documentée mais hors-scope du refacto.

### 3.2 — Nouvelle méthode `Unda.strategy(params)`

Point d'entrée unique. Signature :

```javascript
static strategy({
  Vertex,       // Classe Vertex (this.Vertex depuis Biblio)
  Rosa,         // Classe Rosa   (this.Rosa   depuis Biblio)
  xyz,          // { x, y } — centre divisé par 2 dans nova()
  rosa,         // Folia (graph.struo) — descripteur géométrique
  delta,        // variation géométrique
  ellipse,      // rapport d'ellipse
  radius,       // rayon de propagation
  kyklos,       // profondeur BFS max
  viaForma,     // null | <Forma> — stratégie Forma-chain
  viaKyklos,    // null | number  — index apex pour stratégie axiale
})
→ { undae: Unda | any[][], extra: Orb }
```

Logique interne :

```
1. nova = Vertex.nova(Rosa.prima(rosa, xyz, rosa.grano.head), { xyz, rosa, delta, ellipse, radius, viaForma })
2. extra = nova.orb
3. Dispatch :
   viaForma && viaKyklos  → undae = this.viaFormaChainKyklos(extra, kyklos, viaKyklos)
   viaForma seulement     → undae = this.viaFormaChain(extra, kyklos)
   viaKyklos seulement    → undae = this.viaKyklos(extra, kyklos, viaKyklos)
   else                   → undae = this.kyklosLevels(extra, kyklos)   ← NEW
4. return { undae, extra }
```

### 3.3 — `createVertex` simplifié

```javascript
createVertex({ xyz, rosa, delta, ellipse, radius, kyklos, isHandleErrorMode, viaForma, viaKyklos, computeSeed, configMotiva }) {
  try {
    if (computeSeed) {
      const { undae, extra } = this.Unda.strategy({
        Vertex: this.Vertex, Rosa: this.Rosa,
        xyz, rosa, delta, ellipse, radius, kyklos, viaForma, viaKyklos,
      })
      this.undae = undae
      this.extra = extra

      if (this.type === 'PANORAMA' && configMotiva?.seed) {
        this.Byblos.branche(this.Formae.arrayFrom(), configMotiva)
      }
    }
    handleLocalStorage(localStorage.getItem('debugClavis'))
    return {}
  } catch (err) {
    // inchangé
  }
}
```

La logique PANORAMA reste dans `createVertex` — c'est de l'orchestration Biblio (Composite S3), pas de la traversée topologique.

---

## 4. Étapes de modification du code

### Étape 1 — `Unda.js` : ajouter `kyklosLevels`

**Fichier** : `C:\jgr-maestra\prima\Peri\Unda.js`

Ajouter après `kyklos` (l. 190), **avant** les méthodes privées :

```javascript
/**
 * BFS par niveaux — retourne un tableau de tableaux d'Orbs.
 * Equivalent inline du else de createVertex, migré ici.
 * Retour : any[][] (chaque sous-tableau = un niveau BFS)
 */
static kyklosLevels(rootOrb, kyklos) {
    const levels = [[rootOrb]]
    let current = [rootOrb]
    for (let step = 0; step < kyklos; step++) {
        if (step > 0) {
            const len = current.length
            for (let i = 0; i < len; i++) {
                current[i].prevExtra = current[(i - 1 + len) % len]?.extra
                current[i].nextExtra = current[(i + 1) % len]?.extra
            }
        }
        const next = []
        for (const orb of current) {
            this.nova(orb).via(slot => {
                if (slot.item && !slot.item.vertex?.isBeyondFrame) next.push(slot.item)
            })
        }
        if (!next.length) break
        levels.push(next)
        current = next
    }
    return levels
}
```

### Étape 2 — `Unda.js` : ajouter `strategy`

Ajouter après `kyklosLevels` :

```javascript
/**
 * Dispatcher unique : crée le Vertex initial et sélectionne la stratégie
 * d'itérateur selon viaForma / viaKyklos.
 *
 * @param {{ Vertex, Rosa, xyz, rosa, delta, ellipse, radius, kyklos, viaForma, viaKyklos }}
 * @returns {{ undae: Unda|any[][], extra: Orb }}
 */
static strategy({ Vertex, Rosa, xyz, rosa, delta, ellipse, radius, kyklos, viaForma, viaKyklos }) {
    const nova = Vertex.nova(
        Rosa.prima(rosa, xyz, rosa.grano.head),
        { xyz, rosa, delta, ellipse, radius, viaForma }
    )
    const extra = nova.orb
    let undae

    if (viaForma !== null && viaKyklos !== null) {
        undae = this.viaFormaChainKyklos(extra, kyklos, viaKyklos)
    } else if (viaForma !== null) {
        undae = this.viaFormaChain(extra, kyklos)
    } else if (viaKyklos !== null) {
        undae = this.viaKyklos(extra, kyklos, viaKyklos)
    } else {
        undae = this.kyklosLevels(extra, kyklos)
    }

    return { undae, extra }
}
```

### Étape 3 — `Biblio.js` : simplifier `createVertex`

**Fichier** : `C:\jgr-maestra\Biblio.js`

Remplacer le bloc `if (computeSeed) { ... }` (l. 310-354) par :

```javascript
if (computeSeed) {
    const { undae, extra } = this.Unda.strategy({
        Vertex: this.Vertex, Rosa: this.Rosa,
        xyz, rosa, delta, ellipse, radius, kyklos, viaForma, viaKyklos,
    })
    this.undae = undae
    this.extra = extra

    if (this.type === 'PANORAMA' && configMotiva?.seed) {
        this.Byblos.branche(this.Formae.arrayFrom(), configMotiva)
    }
}
```

### Étape 4 — Mettre à jour le JSDoc de `createVertex`

Remplacer le `TODO` du JSDoc (l. 301-304) par une description reflétant le nouveau rôle :

```javascript
/**
 * Étape terminale du Monteur — délègue la création du Vertex initial
 * et la traversée topologique à Unda.strategy().
 * Conserve uniquement l'orchestration Composite (PANORAMA / Byblos).
 */
```

---

## 5. Vérifications et nettoyage final

### 5.1 Régression fonctionnelle

| Vérification | Comment |
|---|---|
| `computeSeed = true`, `viaForma = null`, `viaKyklos = null` | Chemin le plus fréquent — `kyklosLevels` doit retourner le même `levels` qu'avant |
| `computeSeed = true`, `viaForma !== null` | `viaFormaChain` inchangé, chemin déjà dans Unda |
| `computeSeed = true`, `viaKyklos !== null` | `viaKyklos` inchangé, chemin déjà dans Unda |
| `computeSeed = false` | Guard intact — aucun appel à `strategy()` |
| `this.extra` accessible après `createVertex` | Vérifier `biblio.extra` dans `+page.svelte` |
| `this.undae` type `any[][]` pour le cas `kyklosLevels` | Aucun consommateur de `undae` ne doit casser |

### 5.2 Cohérence Magma

- `Vertex` et `Rosa` sont passés en arguments d'exécution, pas en dépendances factory → **aucune modification de `novaMagma`** requise.
- Si lolve implémente un pendant de `strategy()` dans son propre `Unda.js`, la même logique doit y être répliquée (scope `lolve/src/prima/Peri/Unda.js`).

### 5.3 Cohérence type UI

`biblio.extra` (Orb) et `biblio.undae` (Unda | any[][]) sont lus dans `+page.svelte`. Leur structure n'est pas modifiée par ce refacto — vérifier que le composant render Canvas ne présuppose pas le type de `undae`.

### 5.4 Nettoyage post-refacto

- Supprimer le commentaire TODO l. 324 (`// TODO: Sortir et mettre dans l'itérateur <3`) — accompli.
- Vérifier qu'aucune autre occurrence de `this.Vertex.nova(this.Rosa.prima(` n'existe dans Biblio (hors `createVertex`).
- Conserver le `handleLocalStorage` et le `catch` inchangés.

### 5.5 Tests manuels à exécuter

1. Lancer `run()` dans `+page.svelte` avec les params par défaut (`viaForma: null`, `viaKyklos: null`, `kyklos: 3`) → résultat visuel identique.
2. Activer `isHandleErrorMode: true` et provoquer une erreur volontaire → vérifier que l'erreur remonte correctement depuis `strategy()`.
3. Inspecter `biblio.extra` et `biblio.undae` dans la console — types et valeurs inchangés.

---

## Résumé des modifications

| Fichier | Changement | Nature |
|---|---|---|
| `Unda.js` | + `static kyklosLevels(rootOrb, kyklos)` | Extraction du `else` inline |
| `Unda.js` | + `static strategy({ Vertex, Rosa, ... })` | Nouveau dispatcher |
| `Biblio.js` | `createVertex` : if/else → `Unda.strategy()` | Délégation |
| `Biblio.js` | JSDoc `createVertex` mis à jour | Documentation |

**Aucune modification** de : `nova()`, `novaMagma`, `+page.svelte`, `maestra.js`, `Vertex.js`, `Rosa.js`.
