/**
 * maestra.js — accès centralisé à jgr-maestra depuis jgr-ui
 *
 * Point d'entrée unique : createBiblio({ ... })
 * Les imports dynamiques (lolve, jgr-maestra) sont gérés ici.
 *
 * config.graph.seed accepte deux formes :
 *   { seed: [4,4,4,4], kyklos, radius, ellipse, delta }  ← tableau Coxeter (recommandé)
 *   { struo, kyklos, radius, ellipse, delta }             ← Folia pré-calculé
 */
/**
 * Crée et initialise un Biblio.
 *
 * @param {Object} config — config Biblio sans novaMagma (injecté ici)
 * @returns {Promise<import('jgr-maestra/Biblio.js').Biblio>}
 */
export function createBiblio(config: Object): Promise<any>;
