<script lang="ts">
  import { untrack } from 'svelte';
  import JgrLayout from './JgrLayout.svelte';
  import JgrTabList from './JgrTabList.svelte';
  import JgrDag from './JgrDag.svelte';
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

  export type IssueCluster = {
    keyword: string;
    keywords: string[];
    issues: number[];
    score: number;
    hasParent: boolean;
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
    roadmap,
    status = 'ok',
    generatedAt,
    onRegenerate,
    onissuefilter,
    ontabchange,
    onissueclick,
    clusters,
  }: {
    roadmap?: RoadmapData;
    clusters?: IssueCluster[];
    status?: 'loading' | 'ok' | 'empty' | 'generating' | 'error';
    generatedAt?: string;
    onRegenerate?: () => void;
    onissuefilter?: (issues: number[]) => void;
    ontabchange?: (issues: number[]) => void;
    onissueclick?: (n: number) => void;
  } = $props();

  let activeTab = $state('tasks');
  let selectedItemId: string | null = $state(null);
  let activeIds: number[] = $state([]);

  function dominantSkill(steps: RoadmapStep[]): string {
    const counts: Record<string, number> = {};
    for (const s of steps) counts[s.skill] = (counts[s.skill] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'internal';
  }

  // Construit un RoadmapData avec 1 nœud par couple (step, issue) pour l'onglet Tasks.
  function buildTaskRoadmap(steps: RoadmapStep[]): RoadmapData {
    // Pairs triés par step.id puis issue number
    const pairs = steps
      .flatMap(s => (s.issues ?? []).map(n => ({ step: s, issue: n })))
      .sort((a, b) => a.step.id !== b.step.id ? a.step.id - b.step.id : a.issue - b.issue);

    // stepId → liste d'indices de tâche
    const stepToTaskIds = new Map<number, number[]>();
    pairs.forEach(({ step }, i) => {
      if (!stepToTaskIds.has(step.id)) stepToTaskIds.set(step.id, []);
      stepToTaskIds.get(step.id)!.push(i);
    });

    const taskSteps: RoadmapStep[] = pairs.map(({ step, issue }, i) => {
      const depTaskIds = new Set<number>();
      for (const depStepId of step.dependsOnSteps)
        for (const tid of (stepToTaskIds.get(depStepId) ?? []))
          depTaskIds.add(tid);
      return {
        id: i,
        label: `#${issue}: ${step.concept ?? step.label}`,
        skill: step.skill,
        concept: `#${issue}`,
        nodes: step.nodes,
        files: step.files,
        rationale: step.rationale,
        dependsOnSteps: [...depTaskIds],
        issues: [issue],
        isSpine: step.isSpine,
      };
    });

    return {
      steps: taskSteps,
      spine: [],
      stats: { nodes: taskSteps.length, edges: taskSteps.reduce((n, s) => n + s.dependsOnSteps.length, 0), levels: 0, steps: taskSteps.length },
    };
  }

  // Construit un RoadmapData synthétique à partir des clusters.
  // Chaque cluster devient un nœud ; les arêtes sont dérivées des dépendances entre steps.
  function buildClusterRoadmap(steps: RoadmapStep[], cls: IssueCluster[]): RoadmapData {
    const stepToCluster = new Map<number, number>();
    cls.forEach((c, ci) => {
      for (const s of steps) {
        if (!stepToCluster.has(s.id) && (s.issues ?? []).some(n => c.issues.includes(n)))
          stepToCluster.set(s.id, ci);
      }
    });

    const syntheticSteps: RoadmapStep[] = cls.map((c, ci) => {
      const memberSteps = steps.filter(s => stepToCluster.get(s.id) === ci);
      const depClusters = new Set<number>();
      for (const s of memberSteps)
        for (const dep of s.dependsOnSteps) {
          const g = stepToCluster.get(dep);
          if (g !== undefined && g !== ci) depClusters.add(g);
        }
      return {
        id: ci,
        label: c.keyword,
        skill: dominantSkill(memberSteps.length ? memberSteps : [{ skill: 'internal' } as RoadmapStep]),
        concept: c.keyword,
        nodes: memberSteps.flatMap(s => s.nodes),
        files: memberSteps.flatMap(s => s.files),
        rationale: '',
        dependsOnSteps: [...depClusters],
        issues: c.issues,
      };
    });

    const edgeCount = syntheticSteps.reduce((n, s) => n + s.dependsOnSteps.length, 0);
    return {
      steps: syntheticSteps,
      spine: [],
      stats: { nodes: syntheticSteps.length, edges: edgeCount, levels: 0, steps: syntheticSteps.length },
    };
  }

  // Map itemId → stepIds pour la mise en évidence dans JgrDag
  const itemSteps = $derived.by(() => {
    const allSteps = roadmap?.steps ?? [];
    const hasIssueSteps = allSteps.some(s => (s.issues?.length ?? 0) > 0);
    const steps = hasIssueSteps ? allSteps.filter(s => (s.issues?.length ?? 0) > 0) : allSteps;
    const map = new Map<string, number[]>();

    steps.filter(s => (s.issues?.length ?? 0) > 0)
      .forEach(s => s.issues!.forEach(n => map.set(`task-${s.id}-${n}`, [s.id])));

    steps.forEach(s => map.set(String(s.id), [s.id]));

    for (const c of (clusters ?? [])) {
      const clusterStepIds = steps
        .filter(s => (s.issues ?? []).some(n => c.issues.includes(n)))
        .map(s => s.id);
      map.set(`cluster-${c.keyword}`, clusterStepIds);
    }
    return map;
  });

  function handleSelect(_tabId: string, item: ListItem) {
    if (selectedItemId === item.id) {
      selectedItemId = null;
      activeIds = [];
      onissuefilter?.([]);
    } else {
      selectedItemId = item.id;
      activeIds = itemSteps.get(item.id) ?? [];
      onissuefilter?.(item.issues ?? []);
    }
  }

  function handleIssueClick(n: number) {
    // Switcher sur l'onglet Tasks et sélectionner la task liée à cette issue
    const taskItem = tabs.find(t => t.id === 'tasks')?.items?.find(i => i.issues?.includes(n));
    activeTab = 'tasks';
    if (taskItem) {
      selectedItemId = taskItem.id;
      activeIds = itemSteps.get(taskItem.id) ?? [];
    } else {
      selectedItemId = null;
      activeIds = [];
    }
    onissueclick?.(n);
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
      labels: [{ name: s.skill, color: SKILL_COLOR[s.skill] ?? '555566' }],
      issues: s.issues ?? [],
    }));

    // Calcul du score d'homogénéité pour chaque cluster (issues / keywords)
    const clusterRatios = (clusters ?? []).map(c => ({
      cluster: c,
      memberSteps: steps.filter(s => (s.issues ?? []).some(n => c.issues.includes(n))),
      ratio: c.issues.length / Math.max(1, c.keywords.length),
    }));
    const maxRatio = Math.max(1, ...clusterRatios.map(x => x.ratio));

    const clusterItems: ListItem[] = clusterRatios.map(({ cluster: c, memberSteps, ratio }) => {
      // Skills dominants du cluster (top 2)
      const skillCounts: Record<string, number> = {};
      for (const s of memberSteps) skillCounts[s.skill] = (skillCounts[s.skill] ?? 0) + 1;
      const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 2);

      // Note d'homogénéité normalisée 0-100
      const homoScore = Math.round(ratio / maxRatio * 100);
      const homoColor = homoScore >= 65 ? '3a8a5a' : homoScore >= 35 ? 'd4a860' : 'c47070';

      return {
        id: `cluster-${c.keyword}`,
        label: c.keyword,
        prefix: String(c.issues.length),
        labels: [
          ...topSkills.map(([sk]) => ({ name: sk, color: SKILL_COLOR[sk] ?? '555566' })),
          { name: `∼${homoScore}%`, color: homoColor },
          ...c.keywords.slice(1, 3).map(k => ({ name: k, color: '445566' })),
        ],
        issues: c.issues,
      };
    });

    return [
      { id: 'tasks',    label: 'Tasks',    items: taskItems,    empty: 'Aucun step lié à des issues' },
      { id: 'steps',    label: 'Steps',    items: stepItems,    empty: 'Aucun step' },
      { id: 'clusters', label: 'Clusters', items: clusterItems, empty: 'Aucun cluster détecté' },
    ];
  });

  const tabsWithSelection: TabDef[] = $derived(
    tabs.map(t => ({ ...t, selectedId: selectedItemId ?? undefined }))
  );

  // Roadmap pour le DAG gauche : chaque onglet produit une vue différente.
  const dagRoadmap = $derived.by((): RoadmapData | undefined => {
    if (!roadmap) return undefined;

    const allSteps = roadmap.steps;
    const hasIssueSteps = allSteps.some(s => (s.issues?.length ?? 0) > 0);
    const issueSteps = hasIssueSteps ? allSteps.filter(s => (s.issues?.length ?? 0) > 0) : allSteps;

    // Vue par onglet
    if (activeTab === 'tasks') {
      // 1 nœud par couple (step, issue) → 188 nœuds
      return buildTaskRoadmap(issueSteps);
    }

    if (activeTab === 'steps') {
      // 1 nœud par step → 44 nœuds
      const keptIds = new Set(issueSteps.map(s => s.id));
      return {
        ...roadmap,
        steps: issueSteps.map(s => ({
          ...s,
          dependsOnSteps: s.dependsOnSteps.filter(id => keptIds.has(id)),
        })),
        stats: { ...roadmap.stats, steps: issueSteps.length },
      };
    }

    // Nœuds synthétiques par cluster
    if (activeTab === 'clusters') {
      return buildClusterRoadmap(issueSteps, clusters ?? []);
    }

    return undefined;
  });

  // Roadmap pour le DAG droit : toujours la vue clusters (référence fixe).
  const clusterDagRoadmap = $derived.by((): RoadmapData | undefined => {
    if (!roadmap) return undefined;
    const allSteps = roadmap.steps;
    const hasIssueSteps = allSteps.some(s => (s.issues?.length ?? 0) > 0);
    const issueSteps = hasIssueSteps ? allSteps.filter(s => (s.issues?.length ?? 0) > 0) : allSteps;
    return buildClusterRoadmap(issueSteps, clusters ?? []);
  });

  // activeIds pour le DAG clusters : index du cluster sélectionné (uniquement si onglet clusters actif).
  const clusterActiveIds = $derived.by(() => {
    if (!selectedItemId?.startsWith('cluster-')) return [];
    const keyword = selectedItemId.replace('cluster-', '');
    const ci = (clusters ?? []).findIndex(c => c.keyword === keyword);
    return ci >= 0 ? [ci] : [];
  });

  // Quand l'onglet change : réinitialiser la sélection et notifier les issues du tab actif.
  // On utilise untrack pour lire `tabs` sans créer de dépendance réactive dessus :
  // sinon, quand ontabchange modifie le filtre → roadmap prop change → tabs change → effet re-boucle.
  $effect(() => {
    void activeTab; // seule dépendance voulue
    selectedItemId = null;
    activeIds = [];
    const currentTab = untrack(() => tabs).find(t => t.id === activeTab);
    const tabIssues = [...new Set((currentTab?.items ?? []).flatMap((item: any) => item.issues ?? []))];
    ontabchange?.(tabIssues);
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
      <div class="dag-wrap">
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
          <div class="dag-panels">
            <div class="dag-panel">
              <span class="dag-panel-label">{activeTab === 'tasks' ? 'Tasks' : activeTab === 'clusters' ? 'Clusters' : 'Steps'}</span>
              {#if dagRoadmap}
                <JgrDag roadmap={dagRoadmap} {activeIds} />
              {/if}
            </div>
            <div class="dag-panel">
              <span class="dag-panel-label">Clusters</span>
              {#if clusterDagRoadmap}
                <JgrDag roadmap={clusterDagRoadmap} activeIds={clusterActiveIds} />
              {/if}
            </div>
          </div>
        {/if}
      </div>
    {/snippet}

    {#snippet right()}
      <JgrTabList
        tabs={tabsWithSelection}
        {activeTab}
        ontabchange={id => activeTab = id}
        onselect={handleSelect}
        onissueclick={handleIssueClick}
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

.dag-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.dag-panels {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  gap: 1px;
  background: var(--border, #1e1e2e);
}
.dag-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.dag-panel-label {
  position: absolute;
  top: 6px;
  left: 10px;
  z-index: 2;
  font-size: 0.52rem;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim, #333);
  pointer-events: none;
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
