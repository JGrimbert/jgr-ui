<script lang="ts">
  import type { RoadmapData } from './JgrRoadmap.svelte';

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
  const LH  = 107; // vertical spacing between levels
  const GAP = 20;  // horizontal gap between nodes
  const MX  = 160; // left margin
  const MY  = 80;  // top margin

  const STREAM_GAP   = 60;  // espace horizontal entre bandes
  const MAX_PER_ROW  = 8;   // nœuds max par sous-ligne de tête
  const HEAD_ROW_GAP = LH;  // espacement vertical sous-lignes de tête (= LH pour aligner la grille)

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

  // ── Compute (x, y) per step — layout "Streams" ────────────────
  const posMap = $derived.by(() => {
    // Phase A — Union-Find sur visibleSteps
    const parent = new Map<number, number>();
    for (const s of visibleSteps) parent.set(s.id, s.id);

    function find(x: number): number {
      if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
      return parent.get(x)!;
    }
    function union(a: number, b: number) {
      parent.set(find(a), find(b));
    }
    for (const s of visibleSteps)
      for (const dep of s.dependsOnSteps) union(s.id, dep);

    // Grouper par racine → composantes connexes
    const componentMap = new Map<number, number[]>();
    for (const s of visibleSteps) {
      const root = find(s.id);
      if (!componentMap.has(root)) componentMap.set(root, []);
      componentMap.get(root)!.push(s.id);
    }

    // Phase B — StreamInfo pour chaque composante
    type StreamInfo = {
      nodes: number[];
      headRows: number[][];
      bodyLevels: Map<number, number[]>;
      bandWidth: number;
      bandX: number;
    };

    function rowWidth(ids: number[]): number {
      if (!ids.length) return 0;
      return ids.reduce((sum, id) => sum + 2 * nodeR(id), 0) + (ids.length - 1) * GAP;
    }

    const streams: StreamInfo[] = [];
    for (const [, nodes] of componentMap) {
      const headNodes = nodes.filter(id => (levelMap.get(id) ?? 0) === 0);
      headNodes.sort((a, b) => a - b);

      // Découper headNodes en tranches de MAX_PER_ROW
      const headRows: number[][] = [];
      for (let i = 0; i < headNodes.length; i += MAX_PER_ROW)
        headRows.push(headNodes.slice(i, i + MAX_PER_ROW));

      // Grouper les nœuds de niveau > 0 par level
      const bodyLevels = new Map<number, number[]>();
      for (const id of nodes) {
        const lv = levelMap.get(id) ?? 0;
        if (lv === 0) continue;
        if (!bodyLevels.has(lv)) bodyLevels.set(lv, []);
        bodyLevels.get(lv)!.push(id);
      }
      for (const ids of bodyLevels.values()) ids.sort((a, b) => a - b);

      // bandWidth = max de toutes les largeurs de ligne
      const allWidths = [
        ...headRows.map(r => rowWidth(r)),
        ...[...bodyLevels.values()].map(r => rowWidth(r)),
      ];
      const bandWidth = Math.max(0, ...allWidths);

      streams.push({ nodes, headRows, bodyLevels, bandWidth, bandX: 0 });
    }

    // Phase C — Trier par taille décroissante et placer horizontalement
    streams.sort((a, b) => b.nodes.length - a.nodes.length);
    let cursor = MX;
    for (const s of streams) {
      s.bandX = cursor;
      cursor += s.bandWidth + STREAM_GAP;
    }
    const globalMaxHeadRows = Math.max(0, ...streams.map(s => s.headRows.length));

    // Phase D — Positions intra-stream
    const pos = new Map<number, { x: number; y: number }>();

    for (const s of streams) {
      // Tête : alignée par le bas (streams plus courts décalés vers le bas)
      for (let i = 0; i < s.headRows.length; i++) {
        const row = s.headRows[i];
        const yOffset = globalMaxHeadRows - s.headRows.length;
        const y = MY + (yOffset + i) * HEAD_ROW_GAP;
        const rw = rowWidth(row);
        let x = s.bandX + (s.bandWidth - rw) / 2;
        for (const id of row) {
          const r = nodeR(id);
          pos.set(id, { x: x + r, y });
          x += 2 * r + GAP;
        }
      }

      // Corps : après la tête, un niveau par ligne
      for (const [lv, ids] of s.bodyLevels) {
        const y = MY + globalMaxHeadRows * HEAD_ROW_GAP + (lv - 1) * LH;
        const rw = rowWidth(ids);
        let x = s.bandX + (s.bandWidth - rw) / 2;
        for (const id of ids) {
          const r = nodeR(id);
          pos.set(id, { x: x + r, y });
          x += 2 * r + GAP;
        }
      }
    }

    return { pos, globalMaxHeadRows };
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
      <!-- Sous-lignes de la tête (niveau 0) -->
      {#each {length: posMap.globalMaxHeadRows} as _, i}
        {@const y = MY + i * HEAD_ROW_GAP}
        <line x1="0" y1={y} x2={maxX} y2={y}
              stroke="#4d3fa0" stroke-width="0.3" opacity="0.2" stroke-dasharray="4,8"/>
        <text x="8" y={y - 6} font-size="9" fill="#7c6af7" opacity="0.5"
              font-family="monospace">L0.{i}</text>
      {/each}
      <!-- Niveaux du corps (lv > 0) -->
      {#each distinctLevels.filter(lv => lv > 0) as lv}
        {@const y = MY + posMap.globalMaxHeadRows * HEAD_ROW_GAP + (lv - 1) * LH}
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
