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

// ── Types ────────────────────────────────────────────────────────────────────

export type LogEntry = {
  line: string;
  type: 'agent' | 'system' | 'error' | string;
};

export type PromptSection = {
  id: string;
  label: string;
  content: string;
  enabled?: boolean;
};

export type ListItem = {
  id: string;
  label: string;
  prefix?: string | number;
  labels?: { name: string; color: string }[];
  issues?: number[];
  dimmed?: boolean;
  loading?: boolean;
  actionLabel?: string;
  actionLoading?: boolean;
  actionDone?: boolean;
  onaction?: () => void;
  onclose?: { handler: () => void; loading?: boolean; done?: boolean };
};

export type TabDef = {
  id: string;
  label: string;
  items?: ListItem[];
  selectedId?: string;
  cta?: { label: string; onclick: () => void };
  pending?: boolean;
  loading?: boolean;
  empty?: string;
};

export type RoadmapStep = {
  id: number;
  label: string;
  skill: string;
  nodes: string[];
  files: string[];
  rationale: string;
  dependsOnSteps: number[];
  issues?: number[];
  isSpine?: boolean;
  concept?: string;
  pattern?: string;
  coalNodeId?: string;
};

export type RoadmapData = {
  steps: RoadmapStep[];
  spine: string[];
  stats: { nodes: number; edges: number; levels: number; steps: number };
  concepts?: Array<{ id: string; name: string; skill: string; nodes: string[] }>;
};

// ── Composants ───────────────────────────────────────────────────────────────

/** Injecte les CSS variables globales et normalise le box-model. */
export function jgrTheme(theme?: 'dark' | 'light'): void {}

/** Layout 3 panneaux redimensionnables avec persistance localStorage. */
export function jgrLayout(
  storageKey?: string,
  leftWidth?: number,
  rightWidth?: number,
  height?: string,
  leftLabel?: string,
  rightLabel?: string,
  showStrips?: boolean,
): void {}

/** Onglets génériques avec slot children reçevant l'activeTab. */
export function jgrTabs(
  tabs: { id: string; label: string }[],
  activeTab: string,
  onchange?: (id: string) => void,
): void {}

/** Ligne de liste avec préfixe, labels colorés, badges issues et action bouton. */
export function jgrItem(
  title?: string,
  prefix?: string | number,
  labels?: { name: string; color: string }[],
  issues?: number[],
  state?: 'default' | 'hover' | 'selected' | 'pending',
  actionLabel?: string,
  actionDone?: boolean,
  actionLoading?: boolean,
  onaction?: () => void,
  onselect?: () => void,
): void {}

/** Bouton stylistique avec variante back / cmd / file. */
export function jgrBtn(
  variant?: 'back' | 'cmd' | 'file',
  active?: boolean,
  disabled?: boolean,
  title?: string,
  onclick?: () => void,
): void {}

/** Bouton CTA avec spinner braille et variante primary / ghost / danger. */
export function jgrCta(
  label: string,
  variant?: 'primary' | 'ghost' | 'danger',
  pending?: boolean,
  disabled?: boolean,
  onclick?: () => void,
): void {}

/** Zone de saisie texte avec sections de contexte collapsibles. */
export function jgrPrompt(
  value?: string,
  placeholder?: string,
  sections?: PromptSection[],
  pending?: boolean,
  onsubmit?: (value: string) => void,
  onchange?: (value: string) => void,
): void {}

/** Console de logs streaming avec contrôles interrompre / terminer / fermer. */
export function jgrConsole(
  logs?: LogEntry[],
  running?: boolean,
  title?: string,
  completionLabel?: string,
  sessionAlive?: boolean,
  showInput?: boolean,
  oninterrupt?: () => void,
  onterminate?: () => void,
  ondismiss?: () => void,
  oninput?: (text: string) => void,
): void {}

/** Visualiseur SVG DAG : nœuds, arêtes, niveaux, mise en évidence réactive. */
export function jgrDag(
  roadmap: RoadmapData,
  activeIds?: number[],
  onNodeClick?: (id: number) => void,
): void {}

