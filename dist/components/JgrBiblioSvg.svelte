<script lang="ts">
  let {
    biblio = null,
    width  = 600,
    height = 600,
  }: {
    biblio?: any;
    width?:  number;
    height?: number;
  } = $props();

  // ── extraction des données depuis le Biblio ──────────────────────────────────

  const vertices = $derived.by(() => {
    if (!biblio?.Vertices) return []
    try {
      return biblio.Vertices.arrayFrom() as any[]
    } catch { return [] }
  })

  // Connexions orbitales : chaque orb de undae relie son vertex central à ses voisins
  const orbLines = $derived.by(() => {
    if (!biblio?.undae) return []
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
    try {
      for (const layer of biblio.undae) {
        for (const orb of layer) {
          const center = orb?.vertex?.xyz
          if (!center) continue
          // catena est un Peri (liste circulaire) — itération via les noeuds
          let node = orb?.catena?.head
          if (!node) continue
          const start = node
          do {
            const neighbor = node?.item?.xyz
            if (neighbor) {
              lines.push({ x1: center.x, y1: center.y, x2: neighbor.x, y2: neighbor.y })
            }
            node = node?.next
          } while (node && node !== start)
        }
      }
    } catch { /* structure non disponible */ }
    return lines
  })

  const formaePolygons = $derived.by(() => {
    if (!biblio?.Formae) return []
    try {
      return (biblio.Formae.arrayFrom() as any[]).map(f => {
        const pts = (f.viaArray?.() ?? []) as any[]
        const points = pts.map((v: any) => `${v.xyz.x},${v.xyz.y}`).join(' ')
        return { points, cx: f.centre?.xyz?.x ?? 0, cy: f.centre?.xyz?.y ?? 0 }
      })
    } catch { return [] }
  })
</script>

<div class="svg-wrap">
  {#if !biblio}
    <span class="empty">Aucune topologie générée</span>
  {:else}
    <svg
      viewBox="0 0 {width} {height}"
      preserveAspectRatio="xMidYMid meet"
      class="topo-svg"
    >
      <!-- Connexions orbitales -->
      {#each orbLines as l}
        <line
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke="#2a3a4a" stroke-width="0.8"
        />
      {/each}

      <!-- Formae (polygones) -->
      {#each formaePolygons as f}
        <polygon
          points={f.points}
          fill="none"
          stroke="#2e4a3e"
          stroke-width="0.6"
          opacity="0.6"
        />
        <circle cx={f.cx} cy={f.cy} r="2" fill="#1e3a2e" opacity="0.5" />
      {/each}

      <!-- Vertices -->
      {#each vertices as v}
        <circle
          cx={v.xyz?.x ?? 0}
          cy={v.xyz?.y ?? 0}
          r="3"
          fill="#7c6af7"
          opacity="0.85"
        />
      {/each}

      <!-- Vertex central -->
      {#if biblio.extra?.vertex?.xyz}
        <circle
          cx={biblio.extra.vertex.xyz.x}
          cy={biblio.extra.vertex.xyz.y}
          r="5"
          fill="none"
          stroke="#7c6af7"
          stroke-width="1.2"
        />
      {/if}
    </svg>

    <div class="svg-stats">
      {vertices.length} vertices
      {#if formaePolygons.length} · {formaePolygons.length} formae{/if}
      {#if orbLines.length} · {orbLines.length} connexions{/if}
    </div>
  {/if}
</div>

<style>
.svg-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-deep);
  gap: 0.5rem;
  padding: 1rem;
}
.topo-svg {
  width: 100%;
  max-height: calc(100% - 2rem);
  background: #080c10;
  border: 1px solid #1a1a2a;
  border-radius: 4px;
}
.svg-stats {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #333;
  letter-spacing: 0.05em;
}
.empty {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #2a2a3a;
  font-style: italic;
}
</style>
