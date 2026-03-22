<script lang="ts">
  import type { RoadmapData } from './JgrRoadmap.svelte';
  import { layoutDAG } from '../utils/DagOrb.js';

  // ── DagOrb inliné (évite tout problème de résolution de module externe) ──────
  const BRANCH_STEP = 120;
  const SIBLING_GAP = 80;
  const COMP_GAP    = 100;

  function layoutDAG(nodes: {id: number}[], edges: {from: number, to: number}[]): Map<number, {x: number, y: number}> {
    if (!nodes.length) return new Map();
    const levelMap   = _computeLevels(nodes, edges);
    const components = _computeComponents(nodes, edges);
    components.sort((a, b) => b.length - a.length);
    const result = new Map<number, {x: number, y: number}>();
    let offsetX = 0;
    for (const comp of components) {
      const pos  = _layoutComponent(comp, edges, levelMap);
      const xs   = [...pos.values()].map(p => p.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      for (const [id, p] of pos) result.set(id, { x: p.x - minX + offsetX, y: p.y });
      offsetX += (maxX - minX) + COMP_GAP;
    }
    return result;
  }

  function _computeLevels(nodes: {id: number}[], edges: {from: number, to: number}[]): Map<number, number> {
    const parentsOf = new Map(nodes.map(n => [n.id, [] as number[]]));
    for (const e of edges) if (parentsOf.has(e.to)) parentsOf.get(e.to)!.push(e.from);
    const level = new Map<number, number>();
    const visiting = new Set<number>();
    function lvl(id: number): number {
      if (level.has(id)) return level.get(id)!;
      if (visiting.has(id)) { level.set(id, 0); return 0; }
      visiting.add(id);
      const parents = parentsOf.get(id) ?? [];
      const l = parents.length === 0 ? 0 : Math.max(...parents.map(lvl)) + 1;
      visiting.delete(id);
      level.set(id, l);
      return l;
    }
    for (const n of nodes) lvl(n.id);
    return level;
  }

  function _computeComponents(nodes: {id: number}[], edges: {from: number, to: number}[]): {id: number}[][] {
    const parent = new Map(nodes.map(n => [n.id, n.id]));
    function find(x: number): number {
      if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
      return parent.get(x)!;
    }
    function union(a: number, b: number) { parent.set(find(a), find(b)); }
    for (const e of edges) if (parent.has(e.from) && parent.has(e.to)) union(e.from, e.to);
    const groups = new Map<number, {id: number}[]>();
    for (const n of nodes) {
      const root = find(n.id);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root)!.push(n);
    }
    return [...groups.values()];
  }

  function _layoutComponent(compNodes: {id: number}[], allEdges: {from: number, to: number}[], levelMap: Map<number, number>): Map<number, {x: number, y: number}> {
    const ids = new Set(compNodes.map(n => n.id));
    const edges = allEdges.filter(e => ids.has(e.from) && ids.has(e.to));
    const parentsOf = new Map(compNodes.map(n => [n.id, [] as number[]]));
    for (const e of edges) if (parentsOf.has(e.to)) parentsOf.get(e.to)!.push(e.from);
    const byLevel = new Map<number, number[]>();
    for (const n of compNodes) {
      const l = levelMap.get(n.id) ?? 0;
      if (!byLevel.has(l)) byLevel.set(l, []);
      byLevel.get(l)!.push(n.id);
    }
    for (const arr of byLevel.values()) arr.sort((a, b) => (a < b ? -1 : 1));
    const pos = new Map<number, {x: number, y: number}>();
    for (const lv of [...byLevel.keys()].sort((a, b) => a - b)) {
      const group = byLevel.get(lv)!;
      const y = lv * BRANCH_STEP;
      if (lv === 0) {
        const totalWidth = (group.length - 1) * SIBLING_GAP;
        group.forEach((id, i) => pos.set(id, { x: -totalWidth / 2 + i * SIBLING_GAP, y }));
      } else {
        const withIdeal = group.map(id => {
          const parents = parentsOf.get(id) ?? [];
          const ix = parents.length === 0 ? 0 : parents.reduce((s, pid) => s + (pos.get(pid)?.x ?? 0), 0) / parents.length;
          return { id, ix };
        });
        withIdeal.sort((a, b) => a.ix - b.ix);
        const finalX = _spread(withIdeal.map(n => n.ix), SIBLING_GAP * 0.8);
        withIdeal.forEach(({ id }, i) => pos.set(id, { x: finalX[i], y }));
      }
    }
    return pos;
  }

  function _spread(xs: number[], minGap: number): number[] {
    if (xs.length <= 1) return [...xs];
    const result = [...xs];
    const center = xs.reduce((s, x) => s + x, 0) / xs.length;
    for (let i = 1; i < result.length; i++)
      if (result[i] < result[i - 1] + minGap) result[i] = result[i - 1] + minGap;
    for (let i = result.length - 2; i >= 0; i--)
      if (result[i] > result[i + 1] - minGap) result[i] = result[i + 1] - minGap;
    const newCenter = result.reduce((s, x) => s + x, 0) / result.length;
    return result.map(x => x + (center - newCenter));
  }
  // ─────────────────────────────────────────────────────────────────────────────

  let {
    roadmap,
    activeIds = [],
    onNodeClick,
  }: {
    roadmap: RoadmapData;
    activeIds?: number[];
    onNodeClick?: (id: number) => void;
  } = $props();

  // ── Layout constants ───────────────────────────────────────────
  const MX  = 80;  // left/right margin
  const MY  = 80;  // top/bottom margin

  const SKILL_COLOR: Record<string, string> = {
    domain:      '#9181f9',
    entrypoint:  '#c97844',
    api:         '#a8b4f0',
    integration: '#c47890',
    flow:        '#d4a860',
    utility:     '#7c6af7',
    internal:    '#555566',
  };

  // ── Compute DAG level for each step ───────────────────────────
  const levelMap = $derived.by(() => {
    const map = new Map<number, number>();
    const visiting = new Set<number>();

    function lvl(id: number): number {
      if (map.has(id)) return map.get(id)!;
      if (visiting.has(id)) return 0; // cycle guard
      visiting.add(id);
      const s = roadmap.steps.find(x => x.id === id);
      const l = (!s || s.dependsOnSteps.length === 0)
        ? 0
        : Math.max(...s.dependsOnSteps.map(lvl)) + 1;
      visiting.delete(id);
      map.set(id, l);
      return l;
    }

    for (const s of visibleSteps) lvl(s.id);
    return map;
  });

  // Nœuds qui ont au moins un dépendant
  const dependentSet = $derived.by(() => {
    const set = new Set<number>();
    for (const s of roadmap.steps)
      for (const dep of s.dependsOnSteps) set.add(dep);
    return set;
  });

  // Nœuds visibles : au moins une arête (entrante OU sortante)
  const visibleSteps = $derived(
    roadmap.steps.filter(s =>
      s.dependsOnSteps.length > 0 || dependentSet.has(s.id)
    )
  );

  // Degré = in-degree + out-degree de chaque nœud
  const degreeMap = $derived.by(() => {
    const map = new Map<number, number>();
    for (const s of visibleSteps) {
      if (!map.has(s.id)) map.set(s.id, 0);
      for (const dep of s.dependsOnSteps) {
        map.set(dep, (map.get(dep) ?? 0) + 1);
        map.set(s.id, (map.get(s.id) ?? 0) + 1);
      }
    }
    return map;
  });

  // ── Compute (x, y) per step — layout DagOrb ──────────────────
  const posMap = $derived.by(() => {
    const nodes = visibleSteps.map(s => ({ id: s.id }));
    const edges = visibleSteps.flatMap(s =>
      s.dependsOnSteps.map(dep => ({ from: dep, to: s.id }))
    );
    const raw = layoutDAG(nodes, edges);
    // Applique les marges écran
    const pos = new Map<number, { x: number; y: number }>();
    for (const [id, p] of raw) pos.set(id as number, { x: p.x + MX, y: p.y + MY });
    return { pos };
  });

  // y de chaque niveau pour les level-lines
  const levelY = $derived.by(() => {
    const m = new Map<number, number>();
    for (const [id, p] of posMap.pos) {
      const lv = levelMap.get(id) ?? 0;
      if (!m.has(lv)) m.set(lv, p.y);
    }
    return m;
  });

  const distinctLevels = $derived(
    [...new Set(levelMap.values())].sort((a, b) => a - b)
  );

  const maxX = $derived.by(() => {
    let m = 0;
    for (const p of posMap.pos.values()) m = Math.max(m, p.x);
    return m + MX;
  });

  const maxY = $derived.by(() => {
    let m = 0;
    for (const p of posMap.pos.values()) m = Math.max(m, p.y);
    return m + MY + 40;
  });

  const edges = $derived(
    visibleSteps.flatMap(s =>
      s.dependsOnSteps.map(dep => ({ from: dep, to: s.id }))
    )
  );

  // ── Helpers ────────────────────────────────────────────────────
  function nodeR(id: number): number {
    const deg = degreeMap.get(id) ?? 0;
    return Math.min(30, Math.max(12, 12 + deg * 2));
  }

  function color(skill: string) {
    return SKILL_COLOR[skill] ?? '#555566';
  }

  function edgePath(from: number, to: number): string {
    const p1 = posMap.pos.get(from), p2 = posMap.pos.get(to);
    if (!p1 || !p2) return '';
    const r1 = nodeR(from), r2 = nodeR(to);
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < 1) return '';
    const nx = dx / d, ny = dy / d;
    const x1 = p1.x + nx * r1,  y1 = p1.y + ny * r1;
    const x2 = p2.x - nx * r2,  y2 = p2.y - ny * r2;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
  }

  function edgeCls(from: number, to: number): string {
    if (!activeIds.length) return 'orb-line';
    return (activeIds.includes(from) || activeIds.includes(to))
      ? 'orb-line highlight'
      : 'orb-line dim';
  }

  function vertexCls(id: number, isSpine?: boolean): string {
    const base = isSpine ? 'vertex spine-node' : 'vertex';
    return activeIds.includes(id) ? base + ' active' : base;
  }

  function nodeLabel(step: RoadmapData['steps'][number]): string {
    return step.concept ?? step.label.split(': ')[1] ?? step.label;
  }

  // ── Pan / zoom ─────────────────────────────────────────────────
  let tx = $state(0), ty = $state(0), sc = $state(1);
  let svgEl: SVGSVGElement | undefined = $state(undefined);
  let dragging = false, lx = 0, ly = 0;

  // Fit automatique : centre et zoome pour occuper 90% de l'espace dispo
  $effect(() => {
    const gw = maxX;
    const gh = maxY;
    const el = svgEl;
    if (!el || !gw || !gh) return;
    const raf = requestAnimationFrame(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const scale = Math.min((w * 0.9) / gw, (h * 0.9) / gh);
      sc = scale;
      tx = (w - gw * scale) / 2;
      ty = (h - gh * scale) / 2;
    });
    return () => cancelAnimationFrame(raf);
  });

  function onDown(e: MouseEvent) {
    if ((e.target as Element).closest('.vertex')) return;
    dragging = true; lx = e.clientX; ly = e.clientY;
  }
  function onMove(e: MouseEvent) {
    if (!dragging) return;
    tx += e.clientX - lx; ty += e.clientY - ly;
    lx = e.clientX; ly = e.clientY;
  }
  function onUp() { dragging = false; }
  function onWheel(e: WheelEvent) {
    e.preventDefault();
    sc = Math.min(3, Math.max(0.2, sc * (e.deltaY < 0 ? 1.1 : 0.9)));
  }
</script>

<svg
  bind:this={svgEl}
  class="dag-svg"
  xmlns="http://www.w3.org/2000/svg"
  onmousedown={onDown}
  onmousemove={onMove}
  onmouseup={onUp}
  onmouseleave={onUp}
  onwheel={onWheel}
  aria-label="DAG Roadmap"
>
  <defs>
    <marker id="dag-arrow" markerWidth="10" markerHeight="10"
            refX="9" refY="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#9181f9" opacity="0.7"/>
    </marker>
    <filter id="dag-glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <g transform="translate({tx},{ty}) scale({sc})">
    <!-- Grille de niveaux -->
    <g class="level-lines">
      {#each distinctLevels as lv}
        {@const y = levelY.get(lv) ?? 0}
        <line x1="0" y1={y} x2={maxX} y2={y}
              stroke="#4d3fa0" stroke-width="0.3" opacity="0.2" stroke-dasharray="4,8"/>
        <text x="8" y={y - 6} font-size="9" fill="#7c6af7" opacity="0.5"
              font-family="monospace">L{lv}</text>
      {/each}
    </g>

    <!-- Arêtes (dépendances) -->
    <g class="orb-lines">
      {#each edges as { from, to } (`${from}-${to}`)}
        <path class={edgeCls(from, to)} d={edgePath(from, to)}
              marker-end="url(#dag-arrow)"/>
      {/each}
    </g>

    <!-- Nœuds -->
    <g class="vertices">
      {#each visibleSteps as step (step.id)}
        {@const pos = posMap.pos.get(step.id)}
        {#if pos}
          {@const c = color(step.skill)}
          {@const r  = nodeR(step.id)}
          {@const rh = r + 8}
          {@const rs = r + 12}
          <g
            class={vertexCls(step.id, step.isSpine)}
            transform="translate({pos.x},{pos.y})"
            onclick={() => onNodeClick?.(step.id)}
            onkeydown={e => e.key === 'Enter' && onNodeClick?.(step.id)}
            role="button"
            tabindex="0"
          >
            <title>{step.label}{'\n\nNodes:\n'}{step.nodes.join('\n')}{'\n\nFiles:\n'}{step.files.join('\n')}</title>
            {#if step.isSpine}
              <circle r={rs} fill="none" stroke="#f5c542" stroke-width="1.2" class="spine-ring"/>
            {/if}
            <circle r={rh} fill={c} opacity="0.06" class="halo"/>
            <circle r={r}  fill="#12121a" stroke={c} stroke-width="1.2" class="vertex-circle"/>
            <text y="1" text-anchor="middle" dominant-baseline="middle"
                  font-size={Math.max(7, r * 0.5)} fill={c} font-weight="600" class="step-num">{step.id}</text>
          </g>
        {/if}
      {/each}
    </g>

    <!-- Labels -->
    <g class="labels" aria-hidden="true">
      {#each visibleSteps as step (step.id)}
        {@const pos = posMap.pos.get(step.id)}
        {#if pos}
          {@const c = color(step.skill)}
          <g transform="translate({pos.x},{pos.y + nodeR(step.id) + 16})">
            <text text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.75)"
                  font-family="monospace">{nodeLabel(step)}</text>
            <text y="12" text-anchor="middle" font-size="7.5" fill={c} opacity="0.55"
                  font-family="monospace">{step.skill}</text>
          </g>
        {/if}
      {/each}
    </g>
  </g>
</svg>

<style>
.dag-svg {
  width: 100%;
  height: 100%;
  cursor: grab;
  background: #12121a;
  display: block;
  user-select: none;
}
.dag-svg:active { cursor: grabbing; }

/* Arêtes */
.orb-line {
  stroke: #9181f9;
  stroke-width: 0.8;
  fill: none;
  opacity: 0.35;
  transition: opacity 0.2s, stroke-width 0.2s;
}
.orb-line.highlight { opacity: 0.9; stroke-width: 1.5; }
.orb-line.dim       { opacity: 0.05; }

/* Nœuds */
.vertex { cursor: pointer; }
.vertex .vertex-circle { transition: stroke-width 0.15s, filter 0.15s; }
.vertex:hover .vertex-circle,
.vertex.active .vertex-circle { stroke-width: 2.2; filter: url(#dag-glow); }
.vertex .halo { transition: opacity 0.15s; opacity: 0; }
.vertex:hover .halo,
.vertex.active .halo { opacity: 0.2; }

/* Anneau spine */
.spine-node .spine-ring {
  animation: spine-pulse 2.4s ease-in-out infinite;
}
@keyframes spine-pulse {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 0.9; }
}
</style>
