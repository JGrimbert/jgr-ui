<script lang="ts">
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';
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
    subdivisions?: { keyword: string; issues: number[] }[];
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
    extraTabs,
    prefixTabs,
    extracontent,
    defaultTab,
    evalDag = null,
  }: {
    roadmap?: RoadmapData;
    clusters?: IssueCluster[];
    status?: 'loading' | 'ok' | 'empty' | 'generating' | 'error';
    generatedAt?: string;
    onRegenerate?: () => void;
    onissuefilter?: (issues: number[]) => void;
    ontabchange?: (issues: number[]) => void;
    onissueclick?: (n: number) => void;
    ongroupselect?: (keyword: string | null) => void;
    extraTabs?: { id: string; label: string }[];
    prefixTabs?: { id: string; label: string }[];
    extracontent?: Snippet<[string, string | null, (kw: string | null) => void]>;
    defaultTab?: string;
    evalDag?: RoadmapData | null;
  } = $props();

  let activeTab = $state('tasks');
  if (defaultTab) activeTab = defaultTab;
  let selectedItemId: string | null = $state(null);
  let activeIds: number[] = $state([]);
  let splitMode = $state(false);
  let gravityMode = $state(false);
  let selectedGroupKeyword: string | null = $state(null);

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

  const allStepItems = $derived(
    (roadmap?.steps ?? []).map(s => ({
      id: String(s.id),
      label: s.label,
      prefix: s.isSpine ? '◉' : String(s.id),
      labels: [{ name: s.skill, color: SKILL_COLOR[s.skill] ?? '555566' }],
      issues: s.issues ?? [],
    }))
  );

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
      ...(prefixTabs ?? []).map(t => ({
        id: t.id,
        label: t.label,
        items: allStepItems,
        empty: 'Roadmap non générée',
      })),
      { id: 'tasks',    label: 'Tasks',    items: taskItems,    empty: 'Aucun step lié à des issues' },
      { id: 'steps',    label: 'Steps',    items: stepItems,    empty: 'Aucun step' },
      ...(extraTabs ?? []),
    ];
  });

  const tabsWithSelection: TabDef[] = $derived(
    tabs.map(t => ({ ...t, selectedId: selectedItemId ?? undefined }))
  );

  // Helpers partagés
  const issueSteps = $derived.by(() => {
    const allSteps = roadmap?.steps ?? [];
    const hasIssueSteps = allSteps.some(s => (s.issues?.length ?? 0) > 0);
    return hasIssueSteps ? allSteps.filter(s => (s.issues?.length ?? 0) > 0) : allSteps;
  });

  // DAG gauche : issueSteps avec leurs dépendances originales (non filtrées)
  // JgrDag ignore silencieusement les arêtes vers des nœuds absents
  const dagRoadmap = $derived.by((): RoadmapData | undefined => {
    if (!roadmap) return undefined;
    return { ...roadmap, steps: issueSteps };
  });

  // DAG unifié : tous les steps sans filtre → graphe connexe
  const unifiedDagRoadmap = $derived.by((): RoadmapData | undefined => {
    if (!roadmap) return undefined;
    return { ...roadmap, steps: roadmap.steps };
  });

  // DAG droit : 1 nœud par item de la liste active
  const rightDagRoadmap = $derived.by((): RoadmapData | undefined => {
    if (!roadmap) return undefined;
    // prefix tabs : DAG complet (tous les steps sans filtre)
    if ((prefixTabs ?? []).some(t => t.id === activeTab)) return unifiedDagRoadmap;
    if (activeTab === 'tasks') return dagRoadmap ? buildTaskRoadmap(dagRoadmap.steps) : undefined;
    // extra tabs : DAG cluster (même vue que l'ancien onglet Clusters)
    if ((extraTabs ?? []).some(t => t.id === activeTab)) {
      const cls = clusters ?? [];
      return cls.length > 0 && dagRoadmap ? buildClusterRoadmap(dagRoadmap.steps, cls) : dagRoadmap;
    }
    // steps : même graphe que gauche
    return dagRoadmap;
  });

  const rightActiveIds = $derived(activeIds);

  // Groupe sélectionné → index dans clusters (= id du nœud dans buildClusterRoadmap)
  const selectedGroupId = $derived.by(() => {
    if (!selectedGroupKeyword) return null;
    const idx = (clusters ?? []).findIndex(c => c.keyword === selectedGroupKeyword);
    return idx >= 0 ? idx : null;
  });

  // DAG interne du groupe sélectionné
  // Priorité : evalDag (IA) si disponible, sinon heuristique depuis la roadmap
  const groupInternalDag = $derived.by((): RoadmapData | undefined => {
    if (evalDag && selectedGroupKeyword) return evalDag;
    if (selectedGroupId === null || !roadmap) return undefined;
    const cluster = (clusters ?? [])[selectedGroupId];
    if (!cluster) return undefined;
    const groupIssueSet = new Set(cluster.issues);

    const relSteps = issueSteps.filter(s => (s.issues ?? []).some(n => groupIssueSet.has(n)));
    if (!relSteps.length) return undefined;

    const stepToGroupIssues = new Map<number, number[]>();
    for (const s of relSteps) {
      const gi = (s.issues ?? []).filter(n => groupIssueSet.has(n));
      if (gi.length) stepToGroupIssues.set(s.id, gi);
    }
    const issueToStep = new Map<number, RoadmapStep>();
    for (const s of relSteps) {
      for (const n of (s.issues ?? [])) {
        if (groupIssueSet.has(n) && !issueToStep.has(n)) issueToStep.set(n, s);
      }
    }

    // Dépendances inter-issues héritées des steps
    const issueDeps = new Map<number, Set<number>>();
    for (const n of cluster.issues) issueDeps.set(n, new Set());
    for (const s of relSteps) {
      for (const a of (stepToGroupIssues.get(s.id) ?? [])) {
        for (const depId of s.dependsOnSteps) {
          for (const b of (stepToGroupIssues.get(depId) ?? [])) {
            issueDeps.get(a)?.add(b);
          }
        }
      }
    }

    // Ordre séquentiel des issues (par step.id puis numéro)
    const seen = new Set<number>();
    const ordered: number[] = [];
    for (const s of [...relSteps].sort((a, b) => a.id - b.id)) {
      for (const n of (s.issues ?? []).filter(i => groupIssueSet.has(i)).sort((a, b) => a - b)) {
        if (!seen.has(n)) { seen.add(n); ordered.push(n); }
      }
    }
    for (const n of cluster.issues) { if (!seen.has(n)) ordered.push(n); }

    // Deps directes si disponibles, sinon chaîne séquentielle (garantit aucun nœud isolé)
    const nodes: RoadmapStep[] = ordered.map((n, i) => {
      const direct = [...(issueDeps.get(n) ?? [])];
      return {
        id: n, label: `#${n}`,
        skill: issueToStep.get(n)?.skill ?? 'domain',
        nodes: [], files: [], rationale: '',
        dependsOnSteps: direct.length > 0 ? direct : (i > 0 ? [ordered[i - 1]] : []),
        issues: [n],
      };
    });

    const edgeCount = nodes.reduce((a, s) => a + s.dependsOnSteps.length, 0);
    return { steps: nodes, spine: [], stats: { nodes: nodes.length, edges: edgeCount, levels: 0, steps: nodes.length } };
  });

  function handleGroupNodeClick(stepId: number) {
    const cluster = (clusters ?? [])[stepId];
    if (!cluster) return;
    const kw = cluster.keyword;
    selectedGroupKeyword = selectedGroupKeyword === kw ? null : kw;
    ongroupselect?.(selectedGroupKeyword);
  }

  // Quand l'onglet change : réinitialiser la sélection et notifier les issues du tab actif.
  // On utilise untrack pour lire `tabs` sans créer de dépendance réactive dessus :
  // sinon, quand ontabchange modifie le filtre → roadmap prop change → tabs change → effet re-boucle.
  $effect(() => {
    void activeTab; // seule dépendance voulue
    selectedItemId = null;
    selectedGroupKeyword = null;
    activeIds = [];
    let tabIssues: number[];
    if (untrack(() => extraTabs ?? []).some(t => t.id === activeTab)) {
      tabIssues = [];
    } else {
      const currentTab = untrack(() => tabs).find(t => t.id === activeTab);
      tabIssues = [...new Set((currentTab?.items ?? []).flatMap((item: any) => item.issues ?? []))];
    }
    ontabchange?.(tabIssues);
    // TASKS → gravité + vue unifiée par défaut
    if (activeTab === 'tasks') {
      splitMode = false;
      gravityMode = true;
    // STEPS, CLUSTERS et extra tabs → vue fragmentée
    } else if (
      activeTab === 'steps' ||
      activeTab === 'clusters' ||
      untrack(() => extraTabs ?? []).some(t => t.id === activeTab) ||
      untrack(() => prefixTabs ?? []).some(t => t.id === activeTab)
    ) {
      splitMode = true;
    }
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
        {#if !splitMode || activeTab === 'tasks'}
          <button
            class="topbar-btn"
            class:topbar-btn-active={gravityMode}
            onclick={() => gravityMode = !gravityMode}
            title={gravityMode ? 'Désactiver la loi de gravité' : 'Loi de gravité — rapprocher les nœuds L0 isolés de leurs descendants'}
          >↡</button>
        {/if}
        <button
          class="topbar-btn"
          onclick={() => splitMode = !splitMode}
          title={splitMode ? 'Vue unifiée' : 'Vue en deux colonnes'}
        >
          {splitMode ? '⊡' : '⊞'}
        </button>
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
        {:else if splitMode}
          {@const isExtraTab = (extraTabs ?? []).some(t => t.id === activeTab)}
          {#if isExtraTab && selectedGroupKeyword && groupInternalDag}
            <div class="dag-panels">
              <div class="dag-panel">
                <span class="dag-panel-label">Groupes</span>
                {#if rightDagRoadmap}
                  <JgrDag
                    roadmap={rightDagRoadmap}
                    activeIds={selectedGroupId !== null ? [selectedGroupId] : []}
                    onNodeClick={handleGroupNodeClick}
                    showIsolated={true}
                  />
                {/if}
              </div>
              <div class="dag-panel">
                <span class="dag-panel-label">{selectedGroupKeyword} — issues</span>
                <JgrDag roadmap={groupInternalDag} onNodeClick={onissueclick} />
              </div>
            </div>
          {:else}
            {@const isPrefixTab = (prefixTabs ?? []).some(t => t.id === activeTab)}
            <div class="dag-single">
              <div class="dag-panel">
                <span class="dag-panel-label">{activeTab === 'tasks' ? 'Tasks' : isPrefixTab ? ((prefixTabs ?? []).find(t => t.id === activeTab)?.label ?? activeTab) : isExtraTab ? 'Groupes' : (activeTab === 'clusters' ? 'Clusters' : 'Steps')}</span>
                {#if rightDagRoadmap}
                  <JgrDag
                    roadmap={rightDagRoadmap}
                    activeIds={isExtraTab ? (selectedGroupId !== null ? [selectedGroupId] : []) : rightActiveIds}
                    onNodeClick={isExtraTab ? handleGroupNodeClick : undefined}
                    gravityMode={activeTab === 'tasks' ? gravityMode : false}
                    showIsolated={isExtraTab}
                  />
                {/if}
              </div>
            </div>
          {/if}
        {:else}
          <div class="dag-single">
            {#if unifiedDagRoadmap}
              <JgrDag roadmap={unifiedDagRoadmap} {activeIds} {gravityMode} />
            {/if}
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
      >
        {#snippet customcontent(tabId)}
          {#if tabId === 'clusters'}
            <div class="cl-list">
              {#if !(clusters ?? []).length}
                <p class="cl-empty">Aucun cluster détecté</p>
              {/if}
              {#each clusters ?? [] as c}
                {@const itemId = `cluster-${c.keyword}`}
                {@const isSelected = selectedItemId === itemId}
                <div
                  class="cl-card"
                  class:cl-selected={isSelected}
                  role="button"
                  tabindex="0"
                  onclick={() => handleSelect('clusters', { id: itemId, label: c.keyword, issues: c.issues })}
                  onkeydown={(e) => e.key === 'Enter' && handleSelect('clusters', { id: itemId, label: c.keyword, issues: c.issues })}
                >
                  <div class="cl-head">
                    <span class="cl-count">{c.issues.length}</span>
                    <span class="cl-kw">{c.keyword}</span>
                    {#if c.keywords.length > 1}
                      <span class="cl-extra">+{c.keywords.slice(1, 3).join(', ')}</span>
                    {/if}
                  </div>
                  {#if (c.subdivisions ?? []).length > 0}
                    <div class="cl-subs">
                      {#each c.subdivisions as sub, i}
                        <div class="cl-sub-box" style="--sub-hue: {(i * 60) % 360}">
                          <div class="cl-sub-head">
                            <span class="cl-sub-kw">{sub.keyword}</span>
                            <span class="cl-sub-count">{sub.issues.length}</span>
                          </div>
                          <div class="cl-sub-issues">
                            {#each sub.issues as n}
                              <button class="cl-issue-num" onclick={(e) => { e.stopPropagation(); onissueclick?.(n); }}>#{n}</button>
                            {/each}
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {:else if extracontent}
            {@render extracontent(tabId, selectedGroupKeyword, (kw) => { selectedGroupKeyword = kw; ongroupselect?.(kw); })}
          {/if}
        {/snippet}
      </JgrTabList>
    {/snippet}
  </JgrLayout>
</div>

<style>
.roadmap {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
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
.topbar-btn-active { color: var(--accent, #9181f9); }
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
.dag-single {
  flex: 1;
  display: flex;
  overflow: hidden;
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

/* ── Clusters custom list ── */
.cl-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.4rem 0.5rem;
}
.cl-list::-webkit-scrollbar { width: 4px; }
.cl-list::-webkit-scrollbar-track { background: transparent; }
.cl-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.cl-empty { color: var(--text-muted, #555); font-size: 0.62rem; padding: 0.4rem 0; margin: 0; }
.cl-card {
  border: 1px solid var(--border, #333);
  border-radius: 3px;
  padding: 0.3rem 0.4rem;
  cursor: pointer;
  background: var(--bg-panel, #0e0e1a);
  transition: border-color 0.1s;
}
.cl-card:hover { border-color: #3a3a5a; }
.cl-selected { border-color: #5a4a9a !important; background: #0d0a20; }
.cl-head {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.2rem;
}
.cl-count {
  font-size: 0.55rem;
  color: var(--text-muted, #555);
  min-width: 1.2rem;
  text-align: right;
  flex-shrink: 0;
}
.cl-kw {
  font-size: 0.65rem;
  font-weight: bold;
  color: #9181f9;
  font-family: 'JetBrains Mono', monospace;
}
.cl-selected .cl-kw { color: #c07af9; }
.cl-extra {
  font-size: 0.55rem;
  color: var(--text-muted, #555);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cl-subs {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.1rem;
}
.cl-sub-box {
  border: 1px dashed hsl(calc(var(--sub-hue, 0) * 1deg) 28% 32%);
  border-radius: 2px;
  padding: 0.15rem 0.35rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.cl-sub-head {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.15rem;
}
.cl-sub-kw {
  font-size: 0.58rem;
  color: #7a6ad9;
  font-family: 'JetBrains Mono', monospace;
  flex: 1;
}
.cl-sub-count {
  font-size: 0.52rem;
  color: #555;
  flex-shrink: 0;
}
.cl-sub-issues {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}
.cl-issue-num {
  background: none;
  border: none;
  padding: 0;
  color: #5a8a5a;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  cursor: pointer;
  line-height: 1;
}
.cl-issue-num:hover { color: #7aba7a; text-decoration: underline; }
</style>
