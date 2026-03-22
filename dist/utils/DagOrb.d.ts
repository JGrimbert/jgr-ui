/**
 * Calcule les positions (x, y) de chaque nœud dans le DAG.
 *
 * @param {Array<{id: *}>} nodes
 * @param {Array<{from: *, to: *}>} edges
 * @returns {Map<*, {x: number, y: number}>}
 */
export function layoutDAG(nodes: Array<{
    id: any;
}>, edges: Array<{
    from: any;
    to: any;
}>): Map<any, {
    x: number;
    y: number;
}>;
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
export const BRANCH_STEP: 120;
export const SIBLING_GAP: 80;
export const COMP_GAP: 100;
