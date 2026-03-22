<script lang="ts">
  import JgrCta from '$lib/components/JgrCta.svelte';
  import JgrItem from '$lib/components/JgrItem.svelte';
  import JgrTabs from '$lib/components/JgrTabs.svelte';
  import JgrConsole from '$lib/components/JgrConsole.svelte';
  import JgrPrompt from '$lib/components/JgrPrompt.svelte';
  import JgrLayout from '$lib/components/JgrLayout.svelte';
  import JgrTabList from '$lib/components/JgrTabList.svelte';
  import JgrRoadmap from '$lib/components/JgrRoadmap.svelte';
  import type { TabDef, ListItem } from '$lib/components/JgrTabList.svelte';
  import type { RoadmapData, IssueCluster } from '$lib/components/JgrRoadmap.svelte';
  import type { LogEntry } from '$lib/components/JgrConsole.svelte';

  // ── JgrCta ──────────────────────────────────────────────────────────────────
  let pending1 = $state(false);
  let pending2 = $state(false);
  let pendingStatic = $state(true);

  function togglePending1() { pending1 = true; setTimeout(() => { pending1 = false; }, 2000); }
  function togglePending2() { pending2 = true; setTimeout(() => { pending2 = false; }, 2000); }

  // ── JgrTabs ──────────────────────────────────────────────────────────────────
  let activeTab = $state('console');
  const tabs = [
    { id: 'console', label: 'console' },
    { id: 'prompt',  label: 'prompt'  },
    { id: 'items',   label: 'items'   },
  ];

  const demoLogs: LogEntry[] = [
    { line: '[system] Démarrage agent...', type: 'system' },
    { line: 'Analyse du contexte',         type: 'agent'  },
    { line: 'Génération du plan',          type: 'agent'  },
    { line: 'Plan enregistré dans .agent/tasks/demo.plan.md', type: 'agent' },
  ];

  let promptValue = $state('');
  const demoSections = [
    { id: 'objectif',    label: 'Objectif',    content: 'Créer un composant JgrPrompt générique sans stores.',      enabled: true },
    { id: 'contraintes', label: 'Contraintes', content: 'Pas de stores Svelte. Tout via props/events.',             enabled: true },
  ];

  // ── JgrTabList — données partagées ──────────────────────────────────────────
  const todoItems: ListItem[] = [
    { id: 'src/auth.ts:42',     label: 'Vérifier l\'expiration du token JWT',  prefix: 'auth.ts:42',     actionLabel: '→' },
    { id: 'src/api/users.ts:8', label: 'Paginer les résultats de listUsers',   prefix: 'users.ts:8',     actionLabel: '→' },
    { id: 'src/db/index.ts:17', label: 'Ajouter retry sur connexion échouée',  prefix: 'db/index.ts:17', actionLabel: '→' },
    { id: 'src/cache.ts:55',    label: 'Invalider le cache après mutation',     prefix: 'cache.ts:55',    actionLabel: '→', dimmed: true },
  ];

  const issueItems: ListItem[] = [
    { id: '12', prefix: '#12', label: 'Authentification OAuth Google',            labels: [{ name: 'feature', color: '7c6af7' }],               actionLabel: 'Fermer' },
    { id: '14', prefix: '#14', label: 'Bug : 500 sur /api/users en prod',         labels: [{ name: 'bug', color: 'f44336' }, { name: 'urgent', color: 'ff9800' }], actionLabel: 'Fermer' },
    { id: '15', prefix: '#15', label: 'Mettre à jour les dépendances critiques',  labels: [{ name: 'maintenance', color: '607d8b' }],           actionLabel: 'Fermer' },
    { id: '17', prefix: '#17', label: 'Documentation API manquante sur /export', labels: [{ name: 'docs', color: '009688' }],                   actionLabel: 'Fermer' },
  ];

  const taskItems: ListItem[] = [
    { id: 't1', prefix: 'P1 #12', label: 'Authentification OAuth Google',   labels: [{ name: 'implémentation', color: '9181f9' }] },
    { id: 't2', prefix: '#14',    label: 'Bug 500 /api/users',               labels: [{ name: 'Spécification', color: '555555' }] },
    { id: 't3', prefix: 'P1 #15', label: 'Mise à jour dépendances',          labels: [{ name: 'Mergée', color: '4caf50' }], dimmed: true },
  ];

  // ── Démo 0 : pending statique ────────────────────────────────────────────────
  let demo0Tab = $state('todos');

  const demo0Tabs: TabDef[] = [
    { id: 'todos',  label: 'TODO',   items: todoItems,  pending: true,  pendingLabel: 'Création task…', empty: 'Aucun TODO', selectedId: 'src/auth.ts:42' },
    { id: 'issues', label: 'Issues', items: issueItems, pending: false,                                  empty: 'Aucune issue ouverte' },
  ];

  // ── Démo 2 : CTA header + pending (stale) ───────────────────────────────────
  let demo2Tab = $state('todos');
  let demo2TodoPending = $state(false);
  let demo2IssuePending = $state(false);
  let demo2NewIssuePending = $state(false);
  let demo2TodoDone: Record<string, boolean> = $state({});
  let demo2ClosedNums = $state(new Set<string>());

  function demo2CreateTask(id: string) {
    if (demo2TodoPending) return;
    demo2TodoPending = true;
    setTimeout(() => {
      demo2TodoDone = { ...demo2TodoDone, [id]: true };
      demo2TodoPending = false;
    }, 1800);
  }

  function demo2CloseIssue(id: string) {
    demo2IssuePending = true;
    setTimeout(() => {
      demo2ClosedNums = new Set([...demo2ClosedNums, id]);
      demo2IssuePending = false;
    }, 1200);
  }

  function demo2CreateIssue() {
    if (demo2NewIssuePending || demo2IssuePending) return;
    demo2NewIssuePending = true;
    setTimeout(() => { demo2NewIssuePending = false; }, 1500);
  }

  const demo2TodoItems: ListItem[] = todoItems.map(i => ({
    ...i,
    actionDone: demo2TodoDone[i.id] ?? false,
    onaction: () => demo2CreateTask(i.id),
  }));

  const demo2IssueItems: ListItem[] = issueItems.map(i => ({
    ...i,
    actionDone: demo2ClosedNums.has(i.id),
    onaction: () => demo2CloseIssue(i.id),
  }));

  $effect(() => {
    // recalcul réactif sur demo2TodoDone / demo2ClosedNums
    void demo2TodoDone;
    void demo2ClosedNums;
  });

  const demo2Tabs: TabDef[] = $derived([
    {
      id: 'todos',
      label: 'TODO',
      items: todoItems.map(i => ({
        ...i,
        actionDone: demo2TodoDone[i.id] ?? false,
        onaction: () => demo2CreateTask(i.id),
      })),
      pending: demo2TodoPending,
      pendingLabel: 'Création task…',
      empty: 'Aucun TODO',
    },
    {
      id: 'issues',
      label: 'Issues',
      items: issueItems.map(i => ({
        ...i,
        actionDone: demo2ClosedNums.has(i.id),
        onaction: () => demo2CloseIssue(i.id),
      })),
      pending: demo2IssuePending || demo2NewIssuePending,
      pendingLabel: demo2NewIssuePending ? 'Création issue…' : 'Fermeture issue…',
      cta: { label: '+ Issue', onclick: demo2CreateIssue },
      empty: 'Aucune issue ouverte',
    },
  ]);

  // ── Démo 3 : detail snippet (inline) ─────────────────────────────────────────
  let demo3Tab   = $state('todos');
  let demo3SelId = $state<string | undefined>(undefined);

  const demo3Details: Record<string, { file: string; line: number; excerpt: string }> = {
    'src/auth.ts:42':     { file: 'src/auth.ts',         line: 42, excerpt: 'if (!token) throw new Error("missing token");\n// TODO vérifier expiration\nreturn payload;' },
    'src/api/users.ts:8': { file: 'src/api/users.ts',    line: 8,  excerpt: 'export async function listUsers() {\n  // TODO paginer\n  return db.users.findAll();\n}' },
    'src/db/index.ts:17': { file: 'src/db/index.ts',     line: 17, excerpt: 'const client = await pool.connect();\n// TODO retry\nawait client.query(sql);' },
  };

  const demo3TodoItems: ListItem[] = todoItems.slice(0, 3).map(i => ({
    ...i,
    actionLabel: undefined,
  }));

  const demo3Tabs: TabDef[] = $derived([
    {
      id: 'todos',
      label: 'TODO',
      items: demo3TodoItems,
      selectedId: demo3Tab === 'todos' ? demo3SelId : undefined,
      empty: 'Aucun TODO',
    },
    {
      id: 'issues',
      label: 'Issues',
      items: issueItems,
      selectedId: demo3Tab === 'issues' ? demo3SelId : undefined,
      empty: 'Aucune issue',
    },
  ]);

  // ── Démo 4 : customcontent slot ───────────────────────────────────────────────
  let demo4Tab = $state('todos');
  let demo4SelIssue = $state<string | undefined>(undefined);

  const demo4Tabs: TabDef[] = [
    { id: 'todos',  label: 'TODO',   items: todoItems.slice(0, 3), empty: 'Vide' },
    { id: 'issues', label: 'Issues', items: issueItems,            empty: 'Vide' },
    { id: 'custom', label: 'Status' },
  ];

  const statusLines = [
    { label: 'Branch',  value: 'feat/oauth-google',        color: '#7c6af7' },
    { label: 'Commit',  value: 'a3f82c1 — init scaffold',  color: '#888'    },
    { label: 'CI',      value: '✓ passing',                color: '#4caf50' },
    { label: 'Tokens',  value: '18.4k / 200k',             color: '#888'    },
  ];

  // ── JgrRoadmap — données mock ─────────────────────────────────────────────────
  const mockRoadmap: RoadmapData = {
    steps: [
      { id: 1, label: 'domain: AuthService',     skill: 'domain',      nodes: ['AuthService', 'TokenManager'], files: ['src/auth/service.ts'], rationale: 'Authentification centrale', dependsOnSteps: [], isSpine: true, issues: [12, 14], concept: 'auth' },
      { id: 2, label: 'api: UserController',      skill: 'api',         nodes: ['UserController'], files: ['src/api/users.ts'], rationale: 'API REST utilisateurs', dependsOnSteps: [1], issues: [12], concept: 'users' },
      { id: 3, label: 'flow: SessionMiddleware',  skill: 'flow',        nodes: ['SessionMiddleware'], files: ['src/middleware/session.ts'], rationale: 'Propagation session', dependsOnSteps: [1], isSpine: true, concept: 'auth' },
      { id: 4, label: 'utility: TokenHelper',    skill: 'utility',     nodes: ['TokenHelper'], files: ['src/utils/token.ts'], rationale: 'Helpers JWT', dependsOnSteps: [1], issues: [14] },
      { id: 5, label: 'integration: GithubOAuth', skill: 'integration', nodes: ['GithubOAuth'], files: ['src/oauth/github.ts'], rationale: 'OAuth GitHub', dependsOnSteps: [3], isSpine: true, issues: [12], concept: 'oauth' },
    ],
    spine: ['AuthService', 'SessionMiddleware', 'GithubOAuth'],
    stats: { nodes: 47, edges: 32, levels: 4, steps: 5 },
    concepts: [
      { id: 'auth',  name: 'Authentication', skill: 'domain', nodes: ['AuthService', 'TokenManager'] },
      { id: 'oauth', name: 'OAuth',          skill: 'integration', nodes: ['GithubOAuth'] },
    ],
  };
  let demoRoadmapStatus = $state<'ok'|'generating'>('ok');
  let demoGeneratedAt = $state(new Date().toLocaleTimeString('fr-FR'));
  function demoRegenerate() {
    demoRoadmapStatus = 'generating';
    setTimeout(() => {
      demoRoadmapStatus = 'ok';
      demoGeneratedAt = new Date().toLocaleTimeString('fr-FR');
    }, 2000);
  }

  // ── Claudicator — mockup roadmap + clusters ───────────────────────────────
  const claudicatorRoadmap: RoadmapData = {
    steps: [
      {
        id: 1, label: 'entrypoint: ClaudicatorEntry', skill: 'entrypoint',
        nodes: ['ClaudicatorEntry'], files: ['src/index.ts'],
        rationale: 'Point d\'entrée principal : initialise config, logger et session',
        dependsOnSteps: [], isSpine: true, concept: 'core',
      },
      {
        id: 2, label: 'domain: RepoScanner', skill: 'domain',
        nodes: ['RepoScanner', 'FileWalker'], files: ['src/scanner/repo.ts', 'src/scanner/walker.ts'],
        rationale: 'Parcourt le dépôt et construit l\'inventaire des fichiers sources',
        dependsOnSteps: [1], issues: [4, 5], concept: 'scan',
      },
      {
        id: 3, label: 'domain: AstParser', skill: 'domain',
        nodes: ['AstParser', 'NodeVisitor'], files: ['src/ast/parser.ts', 'src/ast/visitor.ts'],
        rationale: 'Parse les fichiers via ts-morph et extrait nœuds, exports, imports',
        dependsOnSteps: [2], issues: [5], concept: 'ast',
      },
      {
        id: 4, label: 'domain: DependencyGraph', skill: 'domain',
        nodes: ['DependencyGraph', 'EdgeResolver'], files: ['src/graph/dependency.ts'],
        rationale: 'Construit le DAG de dépendances inter-modules à partir de l\'AST',
        dependsOnSteps: [3], isSpine: true, issues: [1, 2], concept: 'graph',
      },
      {
        id: 5, label: 'domain: StepPlanner', skill: 'domain',
        nodes: ['StepPlanner', 'ConceptMapper'], files: ['src/planner/steps.ts', 'src/planner/concepts.ts'],
        rationale: 'Génère les steps de roadmap depuis le graphe et détecte les nœuds critiques',
        dependsOnSteps: [4], isSpine: true, issues: [2, 6], concept: 'plan',
      },
      {
        id: 6, label: 'domain: ClusterEngine', skill: 'domain',
        nodes: ['ClusterEngine', 'KeywordExtractor'], files: ['src/cluster/engine.ts'],
        rationale: 'Groupe les issues par thème via TF-IDF sur les labels et titres',
        dependsOnSteps: [2], issues: [2], concept: 'cluster',
      },
      {
        id: 7, label: 'flow: RoadmapOrchestrator', skill: 'flow',
        nodes: ['RoadmapOrchestrator'], files: ['src/flow/orchestrator.ts'],
        rationale: 'Coordonne scan → parse → plan → cluster et produit le RoadmapData final',
        dependsOnSteps: [5, 6], isSpine: true, issues: [1, 6], concept: 'core',
      },
      {
        id: 8, label: 'api: RoadmapApi', skill: 'api',
        nodes: ['RoadmapApi', 'RoadmapSerializer'], files: ['src/api/roadmap.ts'],
        rationale: 'Expose /roadmap et /roadmap/regenerate via HTTP ; sérialise vers JSON',
        dependsOnSteps: [7], concept: 'api',
      },
      {
        id: 9, label: 'utility: CacheLayer', skill: 'utility',
        nodes: ['CacheLayer', 'HashKey'], files: ['src/cache/layer.ts'],
        rationale: 'Met en cache les analyses AST sur disque pour éviter le re-parse',
        dependsOnSteps: [2], issues: [4], concept: 'infra',
      },
      {
        id: 10, label: 'integration: GithubSync', skill: 'integration',
        nodes: ['GithubSync', 'IssueLoader'], files: ['src/github/sync.ts', 'src/github/issues.ts'],
        rationale: 'Charge les issues GitHub et les associe aux clusters via leur numéro',
        dependsOnSteps: [7], isSpine: true, issues: [3, 6, 8], concept: 'github',
      },
      {
        id: 11, label: 'internal: TypeIndex', skill: 'internal',
        nodes: ['TypeIndex'], files: ['src/ast/type-index.ts'],
        rationale: 'Index interne des types exportés — utilisé par NodeVisitor',
        dependsOnSteps: [3], issues: [5],
      },
    ],
    spine: ['ClaudicatorEntry', 'DependencyGraph', 'StepPlanner', 'RoadmapOrchestrator', 'GithubSync'],
    stats: { nodes: 83, edges: 61, levels: 6, steps: 11 },
    concepts: [
      { id: 'core',    name: 'Core',            skill: 'entrypoint', nodes: ['ClaudicatorEntry', 'RoadmapOrchestrator'] },
      { id: 'ast',     name: 'AST Parsing',     skill: 'domain',     nodes: ['AstParser', 'NodeVisitor', 'TypeIndex'] },
      { id: 'graph',   name: 'Dependency DAG',  skill: 'domain',     nodes: ['DependencyGraph', 'EdgeResolver'] },
      { id: 'plan',    name: 'Step Planning',   skill: 'domain',     nodes: ['StepPlanner', 'ConceptMapper'] },
      { id: 'cluster', name: 'Issue Clustering',skill: 'domain',     nodes: ['ClusterEngine', 'KeywordExtractor'] },
      { id: 'github',  name: 'GitHub',          skill: 'integration',nodes: ['GithubSync', 'IssueLoader'] },
      { id: 'infra',   name: 'Cache / Infra',   skill: 'utility',    nodes: ['CacheLayer'] },
    ],
  };

  const claudicatorClusters: IssueCluster[] = [
    {
      keyword: 'graph',
      keywords: ['dag', 'visualisation', 'svg', 'nœud', 'arête'],
      issues: [1, 2, 7],
      score: 0.82,
      hasParent: false,
    },
    {
      keyword: 'analysis',
      keywords: ['ast', 'parser', 'dépendance', 'step', 'type'],
      issues: [2, 5, 6],
      score: 0.74,
      hasParent: false,
    },
    {
      keyword: 'github',
      keywords: ['github', 'sync', 'oauth', 'issues', 'rate-limit'],
      issues: [3, 6, 8],
      score: 0.68,
      hasParent: false,
    },
    {
      keyword: 'performance',
      keywords: ['cache', 'latence', 'timeout', 'mémoire'],
      issues: [1, 4, 8],
      score: 0.55,
      hasParent: false,
    },
  ];

  let claudicatorStatus = $state<'ok'|'generating'>('ok');
  let claudicatorGeneratedAt = $state(new Date().toLocaleTimeString('fr-FR'));
  function claudicatorRegenerate() {
    claudicatorStatus = 'generating';
    setTimeout(() => {
      claudicatorStatus = 'ok';
      claudicatorGeneratedAt = new Date().toLocaleTimeString('fr-FR');
    }, 2000);
  }
</script>

<div style="padding: 2rem 3rem; max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 3rem;">
  <h1 style="font-size: 1.2rem; color: var(--text-primary); font-family: 'JetBrains Mono', monospace;">jgr-ui / demo</h1>

  <!-- ── Démo 0 : JgrTabList pending — spinner jgrCTA en premier slot ── -->
  <section>
    <h3 class="demo-title">0 — État pending — spinner jgrCTA en premier slot</h3>
    <p class="demo-desc">
      L'onglet <strong>TODO</strong> est en état <code>pending</code> statique : le premier slot de la liste
      affiche un <code>JgrCta</code> en mode spinner. Basculer sur <strong>Issues</strong> pour voir l'état normal.
    </p>
    <div class="demo-box">
      <JgrTabList
        tabs={demo0Tabs}
        activeTab={demo0Tab}
        ontabchange={id => demo0Tab = id}
      />
    </div>
  </section>

  <!-- ── JgrCta + JgrItem ── -->
  <div class="demo-grid">
    <section>
      <h2 class="section-title">JgrCta</h2>
      <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
        <JgrCta label="Primary"  onclick={togglePending1} pending={pending1} />
        <JgrCta label="Ghost"    variant="ghost" onclick={togglePending2} pending={pending2} />
        <JgrCta label="Danger"   variant="danger" />
        <JgrCta label="Disabled" disabled />
        <JgrCta label="Pending"  pending={pendingStatic} />
      </div>
    </section>

    <section>
      <h2 class="section-title">JgrItem</h2>
      <div style="border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">
        <JgrItem prefix="#1" title="Créer le repo jgr-ui" labels={[{ name: 'feature', color: '7c6af7' }]} />
        <JgrItem prefix="#2" title="Migrer CtaButton → JgrCta" state="selected" actionLabel="Done" actionDone />
        <JgrItem prefix="#3" title="Tâche en cours" state="pending" actionLabel="Run" actionLoading />
      </div>
    </section>
  </div>

  <!-- ── JgrLayout ── -->
  <section style="padding: 0; overflow: hidden;">
    <h2 class="section-title" style="padding: 0;">JgrLayout</h2>
    <div style="height: 280px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden; margin-top: 0.8rem;">
      <JgrLayout height="280px" storageKey="demo:layout" leftWidth={180} rightWidth={180}>
        {#snippet topbar()}
          <div style="height: 30px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem;">
            <span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em;">topbar</span>
          </div>
        {/snippet}
        {#snippet left()}
          <div style="padding: 0.8rem;"><span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">colonne gauche</span></div>
        {/snippet}
        {#snippet center()}
          <div style="padding: 0.8rem;"><span style="font-size: 0.55rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace;">colonne centre</span></div>
        {/snippet}
        {#snippet right()}
          <div style="padding: 0.8rem;"><span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">colonne droite</span></div>
        {/snippet}
        {#snippet footer()}
          <div style="height: 24px; border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem;">
            <span style="font-size: 0.5rem; color: #3a3a4a; font-family: 'JetBrains Mono', monospace;">footer</span>
          </div>
        {/snippet}
      </JgrLayout>
    </div>
  </section>

  <!-- ── JgrTabs + JgrConsole + JgrPrompt ── -->
  <section>
    <h2 class="section-title">JgrTabs + JgrConsole + JgrPrompt</h2>
    <div style="height: 360px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">
      <JgrTabs {tabs} {activeTab} onchange={id => activeTab = id}>
        {#snippet children(tab)}
          {#if tab === 'console'}
            <JgrConsole logs={demoLogs} title="demo-task" completionLabel="Plan enregistré" />
          {:else if tab === 'prompt'}
            <div style="padding: 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.8rem;">
              <JgrPrompt bind:value={promptValue} sections={demoSections} onsubmit={v => alert('Submit: ' + v)} />
              <div style="font-size: 0.6rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">Valeur : {promptValue}</div>
            </div>
          {:else if tab === 'items'}
            <div>
              <JgrItem prefix="#10" title="Issue exemple avec label long" labels={[{ name: 'bug', color: 'f44336' }, { name: 'ui', color: '4caf50' }]} />
              <JgrItem prefix="#11" title="Autre issue" actionLabel="Ouvrir" />
            </div>
          {/if}
        {/snippet}
      </JgrTabs>
    </div>
  </section>

  <!-- ── DAG Gravity démo ── -->
  <section>
    <h2 class="section-title">JgrDag — Gravity mode</h2>
    <p class="demo-desc">
      Démo isolée du toggle <strong>↡ gravité</strong> : les nœuds L0 dont tous les enfants directs
      sont en L≥2 descendent vers leurs descendants.<br/>
      <a href="/demo/dag" class="demo-link">→ Ouvrir la démo plein écran</a>
    </p>
  </section>

  <!-- ── JgrRoadmap ── -->
  <section>
    <h2 class="section-title">JgrRoadmap + JgrTabList</h2>
    <div style="height: 420px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">
      <JgrRoadmap
        roadmap={mockRoadmap}
        status={demoRoadmapStatus}
        generatedAt={demoGeneratedAt}
        onRegenerate={demoRegenerate}
      />
    </div>
  </section>

  <!-- ── Claudicator — roadmap avec clusters ── -->
  <section>
    <h2 class="section-title">Claudicator — mockup roadmap + clusters</h2>
    <p class="demo-desc">
      11 steps, 5 nœuds épine, 4 clusters d'issues.<br/>
      Les onglets <strong>Steps</strong> et <strong>Clusters</strong> montrent les deux vues du graphe.
    </p>
    <div style="height: 520px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">
      <JgrRoadmap
        roadmap={claudicatorRoadmap}
        clusters={claudicatorClusters}
        status={claudicatorStatus}
        generatedAt={claudicatorGeneratedAt}
        onRegenerate={claudicatorRegenerate}
      />
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════ -->
  <div class="divider"></div>
  <h2 class="section-title" style="font-size: 0.8rem; color: var(--text-secondary);">JgrTabList</h2>

  <!-- ── Démo 2 ── -->
  <section>
    <h3 class="demo-title">2 — CTA header + état pending (stale)</h3>
    <p class="demo-desc">
      Chaque onglet peut avoir un CTA dans la barre de tabs.<br/>
      L'action sur un item met toute la liste en stale jusqu'à la réponse.
      Cliquer <strong>→ Task</strong> ou <strong>Fermer</strong> pour tester.
    </p>
    <div class="demo-box">
      <JgrTabList
        tabs={demo2Tabs}
        activeTab={demo2Tab}
        ontabchange={id => demo2Tab = id}
      />
    </div>
  </section>

  <!-- ── Démos 3 + 4 ── -->
  <div class="demo-grid">
    <section>
      <h3 class="demo-title">3 — Snippet <code>detail</code> — panel inline sous l'item sélectionné</h3>
      <p class="demo-desc">
        Cliquer sur un TODO affiche le contexte de code en-dessous.<br/>
        Le snippet <code>detail(tabId, itemId)</code> est rendu inline après l'item actif.
      </p>
      <div class="demo-box">
        <JgrTabList
          tabs={demo3Tabs}
          activeTab={demo3Tab}
          ontabchange={id => { demo3Tab = id; demo3SelId = undefined; }}
          onselect={(_tabId, item) => {
            demo3SelId = demo3SelId === item.id ? undefined : item.id;
          }}
        >
          {#snippet detail(tabId, itemId)}
            {#if tabId === 'todos' && demo3Details[itemId]}
              {@const d = demo3Details[itemId]}
              <div class="detail-panel">
                <div class="detail-header">
                  <span class="detail-file">{d.file}</span>
                  <span class="detail-line">:{d.line}</span>
                </div>
                <pre class="detail-code">{d.excerpt}</pre>
              </div>
            {:else if tabId === 'issues'}
              <div class="detail-panel">
                <div class="detail-header">
                  <span class="detail-file">Issue #{itemId}</span>
                </div>
                <p class="detail-text">Détail complet de l'issue, labels, assignees, body…</p>
              </div>
            {/if}
          {/snippet}
        </JgrTabList>
      </div>
    </section>

    <section>
      <h3 class="demo-title">4 — Snippet <code>customcontent</code> — onglet à contenu libre</h3>
      <p class="demo-desc">
        Un onglet sans <code>items</code> reçoit le snippet <code>customcontent(tabId)</code>.<br/>
        Ici l'onglet <strong>Status</strong> affiche un panneau métier arbitraire.
      </p>
      <div class="demo-box">
        <JgrTabList
          tabs={demo4Tabs}
          activeTab={demo4Tab}
          ontabchange={id => demo4Tab = id}
          onselect={(_tabId, item) => demo4SelIssue = item.id}
        >
          {#snippet customcontent(tabId)}
            {#if tabId === 'custom'}
              <div class="status-panel">
                <div class="status-title">Projet courant</div>
                {#each statusLines as row}
                  <div class="status-row">
                    <span class="status-key">{row.label}</span>
                    <span class="status-val" style="color: {row.color}">{row.value}</span>
                  </div>
                {/each}
              </div>
            {/if}
          {/snippet}
        </JgrTabList>
      </div>
    </section>
  </div>

</div>

<style>
:global(body) {
  background: var(--bg-deep, #0c0c16);
}
.section-title {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
}
.divider {
  border: none;
  border-top: 1px solid var(--border);
}
.demo-title {
  font-size: 0.68rem;
  color: var(--text-secondary, #888);
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 0.4rem;
}
.demo-title code {
  font-size: 0.65rem;
  color: var(--accent, #7c6af7);
  background: #1a1a2e;
  padding: 0.05em 0.35em;
  border-radius: 3px;
}
.demo-desc {
  font-size: 0.62rem;
  color: var(--text-muted);
  font-family: 'Inter', sans-serif;
  margin-bottom: 0.8rem;
  line-height: 1.6;
}
.demo-desc strong {
  color: var(--text-secondary, #888);
}
.demo-link {
  color: #9181f9;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
}
.demo-link:hover { text-decoration: underline; }
.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.demo-box {
  height: 300px;
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.demo-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.demo-box-sm {
  flex: 1;
  min-width: 200px;
}
.demo-sublabel {
  font-size: 0.58rem;
  color: #444;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 0.4rem;
  letter-spacing: 0.05em;
}
.demo-inner {
  height: 200px;
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── detail snippet ── */
.detail-panel {
  background: #0d0d18;
  border-top: 1px solid #1a1a2e;
  border-bottom: 1px solid #1a1a2e;
  padding: 0.6rem 1rem;
}
.detail-header {
  display: flex;
  align-items: baseline;
  gap: 0;
  margin-bottom: 0.4rem;
}
.detail-file {
  font-size: 0.6rem;
  font-family: 'JetBrains Mono', monospace;
  color: #7c6af7;
}
.detail-line {
  font-size: 0.6rem;
  font-family: 'JetBrains Mono', monospace;
  color: #555;
}
.detail-code {
  font-size: 0.58rem;
  font-family: 'JetBrains Mono', monospace;
  color: #666;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}
.detail-text {
  font-size: 0.6rem;
  color: #555;
  font-family: 'Inter', sans-serif;
  margin: 0;
}

/* ── customcontent: status panel ── */
.status-panel {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.status-title {
  font-size: 0.6rem;
  color: #444;
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.3rem;
}
.status-row {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
}
.status-key {
  font-size: 0.6rem;
  font-family: 'JetBrains Mono', monospace;
  color: #333;
  width: 4rem;
  flex-shrink: 0;
}
.status-val {
  font-size: 0.62rem;
  font-family: 'JetBrains Mono', monospace;
}
</style>
