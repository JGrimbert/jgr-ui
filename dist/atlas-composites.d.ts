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
import type { ListItem, TabDef, RoadmapData } from './atlas-manifest';
/** Liste tabulée avec recherche, sélection, actions inline et detail snippet. */
export declare function jgrTabList(tabs: TabDef[], activeTab?: string, ontabchange?: (id: string) => void, onselect?: (tabId: string, item: ListItem) => void): void;
/** Visualiseur DAG Roadmap avec JgrDag + panneau latéral JgrTabList. */
export declare function jgrRoadmap(roadmap?: RoadmapData, status?: 'loading' | 'ok' | 'empty' | 'generating' | 'error', generatedAt?: string, onRegenerate?: () => void, onissuefilter?: (issues: number[]) => void): void;
