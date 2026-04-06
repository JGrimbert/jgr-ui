/**
 * atlas-composites.ts — Composants composites (dépendent d'autres composants)
 *
 * Ce fichier n'est PAS exporté dans le package (seul dist/ est publié).
 * Il importe atlas-manifest.ts pour encoder les dépendances réelles :
 *   - JgrTabList  →  JgrItem     (utilise JgrItem en interne)
 *   - JgrRoadmap  →  JgrLayout   (layout 3 panneaux)
 *   - JgrRoadmap  →  JgrTabList  (panneau latéral de navigation)
 *
 * Ces imports créent des arêtes dans le DAG lolve-cartography.
 */
import { jgrItem, jgrLayout, jgrDag } from './atlas-manifest';
// JgrTabList dépend de JgrItem (l'utilise pour chaque ligne de liste)
void jgrItem;
/** Liste tabulée avec recherche, sélection, actions inline et detail snippet. */
export function jgrTabList(tabs, activeTab, ontabchange, onselect) { }
// JgrRoadmap dépend de JgrLayout + JgrTabList + JgrDag
void jgrLayout;
void jgrDag;
/** Visualiseur DAG Roadmap avec JgrDag + panneau latéral JgrTabList. */
export function jgrRoadmap(roadmap, status, generatedAt, onRegenerate, onissuefilter) { }
