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
  }: {
    src: string;
    roadmap?: RoadmapData;
    status?: 'loading' | 'ok' | 'empty' | 'generating' | 'error';
    generatedAt?: string;
    onRegenerate?: () => void;
  } = $props();

  let activeTab = $state('tasks');

  const tabs: TabDef[] = $derived.by(() => {
    const steps = roadmap?.steps ?? [];

    const taskItems: ListItem[] = steps
      .filter(s => (s.issues?.length ?? 0) > 0)
      .map(s => ({
        id: String(s.id),
        label: s.label,
        prefix: s.issues!.map(n => `#${n}`).join(' '),
        labels: [{ name: s.skill, color: SKILL_COLOR[s.skill] ?? '555566' }],
      }));

    const stepItems: ListItem[] = steps.map(s => ({
      id: String(s.id),
      label: s.label,
      prefix: s.isSpine ? '◉' : String(s.id),
      labels: [{ name: s.skill, color: SKILL_COLOR[s.skill] ?? '555566' }],
    }));

    // Plan : spine steps + concepts groupés
    const spineSteps = steps.filter(s => s.isSpine);
    const conceptMap = new Map<string, RoadmapStep[]>();
    for (const s of steps) {
      if (s.concept) {
        if (!conceptMap.has(s.concept)) conceptMap.set(s.concept, []);
        conceptMap.get(s.concept)!.push(s);
      }
    }
    const planItems: ListItem[] = [
      ...spineSteps.map(s => ({
        id: `spine-${s.id}`,
        label: s.label,
        prefix: '◉',
        labels: [{ name: s.skill, color: SKILL_COLOR[s.skill] ?? '555566' }],
      })),
      ...[...conceptMap.entries()].map(([concept, ss]) => ({
        id: `concept-${concept}`,
        label: `${concept} (${ss.length} steps)`,
        prefix: '⬡',
        labels: [{ name: ss[0].skill, color: SKILL_COLOR[ss[0].skill] ?? '555566' }],
      })),
    ];

    return [
      { id: 'tasks', label: 'Tasks', items: taskItems, empty: 'Aucun step lié à des issues' },
      { id: 'steps', label: 'Steps', items: stepItems, empty: 'Aucun step' },
      { id: 'plan',  label: 'Plan',  items: planItems, empty: 'Aucun chemin critique' },
    ];
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
        {tabs}
        {activeTab}
        ontabchange={id => activeTab = id}
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
