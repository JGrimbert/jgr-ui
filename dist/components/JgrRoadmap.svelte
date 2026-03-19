<script lang="ts">
  import JgrLayout from './JgrLayout.svelte';
  import JgrTabList from './JgrTabList.svelte';
  import type { TabDef, ListItem } from './JgrTabList.svelte';

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

  const SKILL_COLOR: Record<string, string> = {
    domain:      '9181f9',
    entrypoint:  'c97844',
    api:         'a8b4f0',
    integration: 'c47890',
    flow:        'd4a860',
    utility:     '7c6af7',
    internal:    '555566',
  };

  let {
    src,
    roadmap,
    status = 'ok',
    generatedAt,
    onRegenerate,
    onissuefilter,
  }: {
    src: string;
    roadmap?: RoadmapData;
    status?: 'loading' | 'ok' | 'empty' | 'generating' | 'error';
    generatedAt?: string;
    onRegenerate?: () => void;
    onissuefilter?: (issues: number[]) => void;
  } = $props();

  let activeTab = $state('tasks');
  let selectedItemId: string | null = $state(null);

  function dominantSkill(steps: RoadmapStep[]): string {
    const counts: Record<string, number> = {};
    for (const s of steps) counts[s.skill] = (counts[s.skill] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'internal';
  }

  function stepKey(step: RoadmapStep, depth: number): string {
    const file = step.files?.[0];
    if (file) {
      const parts = file.replace(/\\/g, '/').split('/')
        .filter(p => p && !p.startsWith('+') && !p.includes('.'));
      const idx = parts.length - 1 - depth;
      if (idx >= 0) return parts[idx];
      if (parts.length > 0) return parts[parts.length - 1];
    }
    return step.label.split(': ')[1] || step.label || 'misc';
  }

  // depth 0 = étapes (concept/fichier), 1 = dossiers, 2 = domaines (skill)
  function buildStackItems(steps: RoadmapStep[], depth: number): ListItem[] {
    const groups = new Map<string, RoadmapStep[]>();
    for (const step of steps) {
      const k = depth === 0
        ? (step.coalNodeId ?? step.concept ?? stepKey(step, 0))
        : depth === 1
          ? stepKey(step, 1)
          : (step.skill || 'internal');
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(step);
    }
    return [...groups.entries()]
      .sort((a, b) => Math.min(...a[1].map(s => s.id)) - Math.min(...b[1].map(s => s.id)))
      .map(([key, ss]) => {
        const issueNums = [...new Set(ss.flatMap(s => s.issues ?? []))];
        return {
          id: `stack-${depth}-${key}`,
          label: key,
          prefix: String(ss.length),
          labels: [
            { name: dominantSkill(ss), color: SKILL_COLOR[dominantSkill(ss)] ?? '555566' },
            ...issueNums.map(n => ({ name: `#${n}`, color: '446688' })),
          ],
          issues: issueNums,
        };
      });
  }

  // Map itemId → stepIds pour postMessage vers l'iframe
  const itemSteps = $derived.by(() => {
    const allSteps = roadmap?.steps ?? [];
    const hasIssueSteps = allSteps.some(s => (s.issues?.length ?? 0) > 0);
    const steps = hasIssueSteps ? allSteps.filter(s => (s.issues?.length ?? 0) > 0) : allSteps;
    const map = new Map<string, number[]>();

    steps.filter(s => (s.issues?.length ?? 0) > 0)
      .forEach(s => s.issues!.forEach(n => map.set(`task-${s.id}-${n}`, [s.id])));

    steps.forEach(s => map.set(String(s.id), [s.id]));

    for (const depth of [0, 1, 2] as const) {
      const groups = new Map<string, RoadmapStep[]>();
      for (const step of steps) {
        const k = depth === 0
          ? (step.coalNodeId ?? step.concept ?? stepKey(step, 0))
          : depth === 1 ? stepKey(step, 1)
          : (step.skill || 'internal');
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k)!.push(step);
      }
      for (const [key, ss] of groups) {
        map.set(`stack-${depth}-${key}`, ss.map(s => s.id));
      }
    }
    return map;
  });

  function sendCmd(msg: { type: string; ids?: number[] }) {
    try { localStorage.setItem('roadmap-cmd', JSON.stringify({ ...msg, ts: Date.now() })); } catch { /* ignore */ }
  }

  function handleSelect(_tabId: string, item: ListItem) {
    if (selectedItemId === item.id) {
      selectedItemId = null;
      sendCmd({ type: 'deactivate' });
      onissuefilter?.([]);
    } else {
      selectedItemId = item.id;
      const ids = itemSteps.get(item.id) ?? [];
      sendCmd({ type: 'activate', ids });
      onissuefilter?.(item.issues ?? []);
    }
  }

  const tabs: TabDef[] = $derived.by(() => {
    const allSteps = roadmap?.steps ?? [];
    // Même filtre que le visualizer : si des steps ont des issues, on n'affiche que ceux-là
    const hasIssueSteps = allSteps.some(s => (s.issues?.length ?? 0) > 0);
    const steps = hasIssueSteps ? allSteps.filter(s => (s.issues?.length ?? 0) > 0) : allSteps;

    const taskItems: ListItem[] = steps
      .filter(s => (s.issues?.length ?? 0) > 0)
      .flatMap(s => s.issues!.map(n => ({
        id: `task-${s.id}-${n}`,
        label: s.label,
        prefix: `#${n}`,
        labels: [{ name: s.skill, color: SKILL_COLOR[s.skill] ?? '555566' }],
        issues: [n],
      })));

    const stepItems: ListItem[] = steps.map(s => ({
      id: String(s.id),
      label: s.label,
      prefix: s.isSpine ? '◉' : String(s.id),
      labels: [
        { name: s.skill, color: SKILL_COLOR[s.skill] ?? '555566' },
        ...(s.issues ?? []).map(n => ({ name: `#${n}`, color: '446688' })),
      ],
      issues: s.issues ?? [],
    }));

    return [
      { id: 'tasks',    label: 'Tasks',    items: taskItems,                    empty: 'Aucun step lié à des issues' },
      { id: 'steps',    label: 'Steps',    items: stepItems,                    empty: 'Aucun step' },
      { id: 'etapes',   label: 'Étapes',   items: buildStackItems(steps, 0),   empty: 'Aucune donnée' },
      { id: 'dossiers', label: 'Dossiers', items: buildStackItems(steps, 1),   empty: 'Aucune donnée' },
      { id: 'domaines', label: 'Domaines', items: buildStackItems(steps, 2),   empty: 'Aucune donnée' },
    ];
  });

  const tabsWithSelection: TabDef[] = $derived(
    tabs.map(t => ({ ...t, selectedId: selectedItemId ?? undefined }))
  );

  // Quand l'onglet change : réinitialiser la sélection dans le graphe
  $effect(() => {
    activeTab; // dépendance réactive
    selectedItemId = null;
    sendCmd({ type: 'deactivate' });
  });
</script>

<div class="roadmap">
  <JgrLayout
    storageKey="jgr-ui:roadmap-layout"
    height="100%"
    rightWidth={300}
    rightLabel="ROADMAP"
    showStrips={false}
  >
    {#snippet topbar()}
      <div class="topbar">
        <span class="topbar-title">DAG Roadmap</span>
        {#if roadmap?.stats}
          <span class="topbar-stats">
            {roadmap.stats.steps} steps · {roadmap.stats.nodes} nodes · {roadmap.stats.levels} levels
          </span>
        {/if}
        {#if generatedAt}
          <span class="topbar-date">{generatedAt}</span>
        {/if}
        <button
          class="topbar-btn"
          onclick={onRegenerate}
          disabled={status === 'generating'}
          title="(Re)générer la roadmap"
        >
          {status === 'generating' ? '···' : '↺'}
        </button>
      </div>
    {/snippet}

    {#snippet center()}
      <div class="iframe-wrap">
        {#if status === 'loading'}
          <div class="placeholder">Chargement···</div>
        {:else if status === 'generating'}
          <div class="placeholder">Génération de la roadmap···</div>
        {:else if status === 'empty'}
          <div class="placeholder dim">Roadmap non générée · cliquez sur ↺</div>
        {:else if status === 'error'}
          <div class="placeholder err">
            Erreur · <button onclick={onRegenerate}>Réessayer</button>
          </div>
        {:else}
          <iframe
            {src}
            title="Roadmap DAG"
            class="dag-frame"
          ></iframe>
        {/if}
      </div>
    {/snippet}

    {#snippet right()}
      <JgrTabList
        tabs={tabsWithSelection}
        {activeTab}
        ontabchange={id => activeTab = id}
        onselect={handleSelect}
      />
    {/snippet}
  </JgrLayout>
</div>

<style>
.roadmap {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  height: 30px;
  border-bottom: 1px solid var(--border);
  padding: 0 0.8rem;
  gap: 0.8rem;
  background: var(--bg-panel);
}
.topbar-title {
  font-size: 0.58rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}
.topbar-stats {
  font-size: 0.55rem;
  color: var(--text-dim, #3a3a4a);
  font-family: 'JetBrains Mono', monospace;
  flex: 1;
}
.topbar-btn {
  background: none;
  border: none;
  color: var(--text-muted, #555);
  font-size: 0.85rem;
  padding: 2px 4px;
  cursor: pointer;
  line-height: 1;
  font-family: monospace;
  flex-shrink: 0;
  transition: color 0.15s;
}
.topbar-btn:hover:not(:disabled) { color: var(--accent, #9181f9); }
.topbar-btn:disabled { opacity: 0.4; cursor: default; }
.topbar-date {
  font-size: 0.52rem;
  color: var(--text-dim, #333);
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
}

.iframe-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.dag-frame {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #12121a;
}
.placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted, #555);
  font-style: italic;
  background: var(--bg-base, #0c0c16);
}
.placeholder.dim { color: var(--text-dim, #333); }
.placeholder.err { color: #e57373; font-style: normal; }
.placeholder.err button {
  background: none;
  border: 1px solid #444;
  color: #cdb4f3;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
  font-family: monospace;
  font-size: inherit;
  margin-left: 0.5rem;
}
</style>
