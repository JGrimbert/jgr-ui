/**
 * DagOrb — Layout orbital de graphes dirigés acycliques
 *
 * Principe : diffusion par niveaux topologiques.
 * - L0 (racines) : répartition horizontale centrée sur 0
 * - Lk (descendants) : chaque nœud se place sous le centroïde de ses parents
 * - Plusieurs composantes connexes : côte à côte avec COMP_GAP
 *
 * Interface publique :
 *   layoutDAG(nodes, edges) → Map<id, {x, y}>
 *
 * Les positions retournées commencent à (0, 0).
 * Le consommateur applique ses propres marges/offsets.
 */

export const BRANCH_STEP = 120; // espacement vertical entre niveaux
export const SIBLING_GAP = 80;  // espacement horizontal minimal entre frères
export const COMP_GAP    = 100; // espacement horizontal entre composantes

/**
 * Calcule les positions (x, y) de chaque nœud dans le DAG.
 *
 * @param {Array<{id: *}>} nodes
 * @param {Array<{from: *, to: *}>} edges
 * @returns {Map<*, {x: number, y: number}>}
 */
export function layoutDAG(nodes, edges) {
  if (!nodes.length) return new Map();

  const levelMap    = _computeLevels(nodes, edges);
  const components  = _computeComponents(nodes, edges);
  components.sort((a, b) => b.length - a.length); // plus grande en premier

  const result  = new Map();
  let offsetX   = 0;

  for (const comp of components) {
    const pos  = _layoutComponent(comp, edges, levelMap);
    const xs   = [...pos.values()].map(p => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    // Translate : chaque composante part après la précédente
    for (const [id, p] of pos) {
      result.set(id, { x: p.x - minX + offsetX, y: p.y });
    }
    offsetX += (maxX - minX) + COMP_GAP;
  }

  return result;
}

// ─── Internals ────────────────────────────────────────────────────────────────

/**
 * Calcule le niveau topologique de chaque nœud.
 * Niveau d'un nœud = max(niveau de ses parents) + 1.
 * Les racines (sans parent) sont au niveau 0.
 *
 * @param {Array<{id: *}>} nodes
 * @param {Array<{from: *, to: *}>} edges  from→to signifie "to dépend de from"
 * @returns {Map<*, number>}
 */
function _computeLevels(nodes, edges) {
  const parentsOf = new Map(nodes.map(n => [n.id, []]));
  for (const e of edges) {
    if (parentsOf.has(e.to)) parentsOf.get(e.to).push(e.from);
  }

  const level    = new Map();
  const visiting = new Set();

  function lvl(id) {
    if (level.has(id))    return level.get(id);
    if (visiting.has(id)) { level.set(id, 0); return 0; } // garde cycle
    visiting.add(id);
    const parents = parentsOf.get(id) ?? [];
    const l = parents.length === 0
      ? 0
      : Math.max(...parents.map(lvl)) + 1;
    visiting.delete(id);
    level.set(id, l);
    return l;
  }

  for (const n of nodes) lvl(n.id);
  return level;
}

/**
 * Trouve les composantes connexes par union-find.
 *
 * @param {Array<{id: *}>} nodes
 * @param {Array<{from: *, to: *}>} edges
 * @returns {Array<Array<{id: *}>>}  tableau de composantes
 */
function _computeComponents(nodes, edges) {
  const parent = new Map(nodes.map(n => [n.id, n.id]));

  function find(x) {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
    return parent.get(x);
  }
  function union(a, b) { parent.set(find(a), find(b)); }

  for (const e of edges) {
    if (parent.has(e.from) && parent.has(e.to)) union(e.from, e.to);
  }

  const groups = new Map();
  for (const n of nodes) {
    const root = find(n.id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(n);
  }

  return [...groups.values()];
}

/**
 * Calcule les positions intra-composante.
 * Niveau 0 : centré sur 0, espacement SIBLING_GAP.
 * Niveau k : chaque nœud se place sous le centroïde de ses parents,
 *            puis étalement latéral pour éviter les chevauchements.
 *
 * @param {Array<{id: *}>} compNodes
 * @param {Array<{from: *, to: *}>} allEdges
 * @param {Map<*, number>} levelMap
 * @returns {Map<*, {x: number, y: number}>}
 */
function _layoutComponent(compNodes, allEdges, levelMap) {
  const ids   = new Set(compNodes.map(n => n.id));
  const edges = allEdges.filter(e => ids.has(e.from) && ids.has(e.to));

  const parentsOf = new Map(compNodes.map(n => [n.id, []]));
  for (const e of edges) {
    if (parentsOf.has(e.to)) parentsOf.get(e.to).push(e.from);
  }

  // Grouper par niveau, trier pour stabilité
  const byLevel = new Map();
  for (const n of compNodes) {
    const l = levelMap.get(n.id) ?? 0;
    if (!byLevel.has(l)) byLevel.set(l, []);
    byLevel.get(l).push(n.id);
  }
  for (const arr of byLevel.values()) arr.sort((a, b) => (a < b ? -1 : 1));

  const pos         = new Map();
  const sortedLevs  = [...byLevel.keys()].sort((a, b) => a - b);

  for (const lv of sortedLevs) {
    const group = byLevel.get(lv);
    const y     = lv * BRANCH_STEP;

    if (lv === 0) {
      // L0 : répartition horizontale centrée sur 0
      const totalWidth = (group.length - 1) * SIBLING_GAP;
      group.forEach((id, i) => {
        pos.set(id, { x: -totalWidth / 2 + i * SIBLING_GAP, y });
      });
    } else {
      // Lk : position idéale = centroïde des parents
      const withIdeal = group.map(id => {
        const parents = parentsOf.get(id) ?? [];
        const ix = parents.length === 0
          ? 0
          : parents.reduce((s, pid) => s + (pos.get(pid)?.x ?? 0), 0) / parents.length;
        return { id, ix };
      });

      // Trier par position idéale pour minimiser les croisements d'arêtes
      withIdeal.sort((a, b) => a.ix - b.ix);

      // Étaler pour respecter l'espacement minimal
      const finalX = _spread(withIdeal.map(n => n.ix), SIBLING_GAP * 0.8);
      withIdeal.forEach(({ id }, i) => pos.set(id, { x: finalX[i], y }));
    }
  }

  return pos;
}

/**
 * Étale des positions pour garantir un espacement minimal entre consécutifs,
 * en conservant le centre de gravité.
 *
 * @param {number[]} xs      positions idéales (déjà triées)
 * @param {number}   minGap  espacement minimal entre deux positions consécutives
 * @returns {number[]}
 */
function _spread(xs, minGap) {
  if (xs.length <= 1) return [...xs];
  const result = [...xs];
  const center = xs.reduce((s, x) => s + x, 0) / xs.length;

  // Passe avant : pousse vers la droite
  for (let i = 1; i < result.length; i++) {
    if (result[i] < result[i - 1] + minGap) result[i] = result[i - 1] + minGap;
  }
  // Passe arrière : rééquilibre vers la gauche
  for (let i = result.length - 2; i >= 0; i--) {
    if (result[i] > result[i + 1] - minGap) result[i] = result[i + 1] - minGap;
  }
  // Recentrer sur le centre de gravité original
  const newCenter = result.reduce((s, x) => s + x, 0) / result.length;
  const shift     = center - newCenter;
  return result.map(x => x + shift);
}
