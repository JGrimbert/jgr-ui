/**
 * atlas-manifest.ts — Composants primitifs (sans dépendances inter-composants)
 *
 * Ce fichier n'est PAS exporté dans le package (seul dist/ est publié).
 * Il expose les composants atomiques sous forme de fonctions TypeScript nommées
 * afin qu'Atlas puisse les indexer dans .cache/method-index.json.
 *
 * Les composants composites (JgrTabList, JgrRoadmap) sont dans atlas-composites.ts
 * qui importe ce fichier, ce qui crée des arêtes dans le DAG.
 *
 * Pour régénérer la carto :
 *   node /c/lolve-cartography/bin/cli.cjs --project . annotate index
 *   node /c/lolve-cartography/bin/cli.cjs --project . roadmap
 */
// ── Composants ───────────────────────────────────────────────────────────────
/** Injecte les CSS variables globales et normalise le box-model. */
export function jgrTheme(theme) { }
/** Layout 3 panneaux redimensionnables avec persistance localStorage. */
export function jgrLayout(storageKey, leftWidth, rightWidth, height, leftLabel, rightLabel, showStrips) { }
/** Onglets génériques avec slot children reçevant l'activeTab. */
export function jgrTabs(tabs, activeTab, onchange) { }
/** Ligne de liste avec préfixe, labels colorés, badges issues et action bouton. */
export function jgrItem(title, prefix, labels, issues, state, actionLabel, actionDone, actionLoading, onaction, onselect) { }
/** Bouton stylistique avec variante back / cmd / file. */
export function jgrBtn(variant, active, disabled, title, onclick) { }
/** Bouton CTA avec spinner braille et variante primary / ghost / danger. */
export function jgrCta(label, variant, pending, disabled, onclick) { }
/** Zone de saisie texte avec sections de contexte collapsibles. */
export function jgrPrompt(value, placeholder, sections, pending, onsubmit, onchange) { }
/** Console de logs streaming avec contrôles interrompre / terminer / fermer. */
export function jgrConsole(logs, running, title, completionLabel, sessionAlive, showInput, oninterrupt, onterminate, ondismiss, oninput) { }
/** Visualiseur SVG DAG : nœuds, arêtes, niveaux, mise en évidence réactive. */
export function jgrDag(roadmap, activeIds, onNodeClick) { }
