<script lang="ts">
  import JgrDag from '$lib/components/JgrDag.svelte';
  import type { RoadmapData } from '$lib/components/JgrRoadmap.svelte';

  // ── Toggle gravity ────────────────────────────────────────────────────────────
  let gravityMode = $state(false);
  let activeIds: number[] = $state([]);

  // ── Mock DAG — illustre la loi de gravité ────────────────────────────────────
  // Sans gravité : 1, 9, 10 sont tous en L0
  // Avec gravité :
  //   9 (seul enfant = 3 en L2) → descend en L1
  //   10 (seul enfant = 4 en L3) → descend en L2
  //   1 (enfant = 2 en L1, <2) → reste en L0
  const dagMock: RoadmapData = {
    steps: [
      { id: 1,  label: 'CoreService',   skill: 'domain',      nodes: ['CoreService'],   files: [], rationale: 'Racine — enfant direct en L1 → reste en L0 même avec gravité',   dependsOnSteps: [],       isSpine: true },
      { id: 2,  label: 'DataLayer',     skill: 'domain',      nodes: ['DataLayer'],     files: [], rationale: 'L1',  dependsOnSteps: [1] },
      { id: 3,  label: 'QueryEngine',   skill: 'flow',        nodes: ['QueryEngine'],   files: [], rationale: 'L2',  dependsOnSteps: [2, 9] },
      { id: 4,  label: 'ApiGateway',    skill: 'api',         nodes: ['ApiGateway'],    files: [], rationale: 'L3',  dependsOnSteps: [3, 10], isSpine: true },
      { id: 5,  label: 'CacheStore',    skill: 'utility',     nodes: ['CacheStore'],    files: [], rationale: 'L2',  dependsOnSteps: [2] },
      { id: 6,  label: 'EventBus',      skill: 'integration', nodes: ['EventBus'],      files: [], rationale: 'L2',  dependsOnSteps: [2] },
      { id: 7,  label: 'RuleEngine',    skill: 'flow',        nodes: ['RuleEngine'],    files: [], rationale: 'L3',  dependsOnSteps: [5, 6] },
      { id: 8,  label: 'Orchestrator',  skill: 'domain',      nodes: ['Orchestrator'],  files: [], rationale: 'L4',  dependsOnSteps: [4, 7], isSpine: true },
      { id: 9,  label: 'ConfigLoader',  skill: 'utility',     nodes: ['ConfigLoader'],  files: [], rationale: 'L0 → enfant unique en L2 → gravité : descend en L1', dependsOnSteps: [] },
      { id: 10, label: 'PluginManager', skill: 'integration', nodes: ['PluginManager'], files: [], rationale: 'L0 → enfant unique en L3 → gravité : descend en L2', dependsOnSteps: [] },
    ],
    spine: ['CoreService', 'ApiGateway', 'Orchestrator'],
    stats: { nodes: 10, edges: 10, levels: 5, steps: 10 },
  };

  function toggleNode(id: number) {
    activeIds = activeIds.includes(id)
      ? activeIds.filter(x => x !== id)
      : [...activeIds, id];
  }
</script>

<div class="page">
  <header class="topbar">
    <a href="/demo" class="back-link">← demo</a>
    <span class="topbar-title">DAG Gravity — démo</span>
    <div class="topbar-controls">
      <button
        class="toggle-btn"
        class:active={gravityMode}
        onclick={() => gravityMode = !gravityMode}
        title={gravityMode
          ? 'Gravité ON — cliquer pour désactiver'
          : 'Gravité OFF — cliquer pour activer'}
      >
        ↡ gravité {gravityMode ? 'ON' : 'OFF'}
      </button>
    </div>
  </header>

  <div class="content">
    <aside class="legend">
      <h3 class="legend-title">Loi de gravité</h3>
      <p class="legend-desc">
        Tout nœud <strong>L0</strong> dont <em>tous</em> les enfants directs sont en
        <strong>L≥2</strong> descend au niveau <code>min(enfants) − 1</code>.
      </p>

      <div class="legend-section">
        <span class="legend-tag tag-gravity">Candidats gravité</span>
        <ul class="node-list">
          <li>
            <button
              class="node-btn"
              class:selected={activeIds.includes(9)}
              onclick={() => toggleNode(9)}
            >
              <span class="node-id">9</span>
              <span class="node-name">ConfigLoader</span>
            </button>
            <span class="node-rule">L0 → L1 (enfant #3 en L2)</span>
          </li>
          <li>
            <button
              class="node-btn"
              class:selected={activeIds.includes(10)}
              onclick={() => toggleNode(10)}
            >
              <span class="node-id">10</span>
              <span class="node-name">PluginManager</span>
            </button>
            <span class="node-rule">L0 → L2 (enfant #4 en L3)</span>
          </li>
        </ul>
      </div>

      <div class="legend-section">
        <span class="legend-tag tag-stable">Reste en L0</span>
        <ul class="node-list">
          <li>
            <button
              class="node-btn"
              class:selected={activeIds.includes(1)}
              onclick={() => toggleNode(1)}
            >
              <span class="node-id">1</span>
              <span class="node-name">CoreService ◉</span>
            </button>
            <span class="node-rule">enfant #2 en L1 &lt; 2</span>
          </li>
        </ul>
      </div>

      <p class="legend-hint">Cliquer un nœud pour le mettre en évidence.</p>
    </aside>

    <div class="dag-container">
      <JgrDag roadmap={dagMock} {activeIds} {gravityMode} onNodeClick={toggleNode} />
    </div>
  </div>
</div>

<style>
:global(html, body) { height: 100%; margin: 0; }

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0c0c16;
  color: #ccc;
  overflow: hidden;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 38px;
  padding: 0 1rem;
  border-bottom: 1px solid #1e1e2e;
  background: #10101c;
  flex-shrink: 0;
}
.back-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  color: #444;
  text-decoration: none;
}
.back-link:hover { color: #9181f9; }
.topbar-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex: 1;
}
.topbar-controls { display: flex; gap: 0.5rem; }
.toggle-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  background: none;
  border: 1px solid #2a2a40;
  color: #666;
  padding: 3px 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.toggle-btn:hover { color: #9181f9; border-color: #4d3fa0; }
.toggle-btn.active { color: #9181f9; border-color: #9181f9; background: #1a1430; }

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.legend {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid #1e1e2e;
  background: #10101c;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.legend-title {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #9181f9;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.legend-desc {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  color: #555;
  line-height: 1.6;
}
.legend-desc strong { color: #9181f9; }
.legend-desc em { font-style: normal; color: #d4a860; }
.legend-desc code { color: #7c6af7; font-size: 0.6rem; }

.legend-section { display: flex; flex-direction: column; gap: 0.4rem; }
.legend-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.52rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 1px 6px;
  border-radius: 2px;
  display: inline-block;
}
.tag-gravity { background: #1a1430; color: #9181f9; border: 1px solid #4d3fa0; }
.tag-stable  { background: #1a1a10; color: #888; border: 1px solid #333; }

.node-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.3rem; }
.node-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: 1px solid #1e1e2e;
  border-radius: 3px;
  padding: 3px 7px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: border-color 0.1s;
}
.node-btn:hover { border-color: #4d3fa0; }
.node-btn.selected { border-color: #9181f9; background: #1a1430; }
.node-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #9181f9;
  min-width: 14px;
}
.node-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #888;
}
.node-rule {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.52rem;
  color: #333;
  padding-left: 7px;
}
.legend-hint {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.52rem;
  color: #2a2a3a;
  font-style: italic;
}

.dag-container {
  flex: 1;
  overflow: hidden;
}
</style>
