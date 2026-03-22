<script lang="ts">
  import JgrTabList from './JgrTabList.svelte'
  import type { TabDef, ListItem } from './JgrTabList.svelte'

  let {
    biblio = null,
  }: {
    biblio?: any;
  } = $props()

  function vertexItems(b: any): ListItem[] {
    if (!b?.Vertices) return []
    try {
      return (b.Vertices.arrayFrom() as any[]).map((v: any) => ({
        id:     v.clavis ?? String(Math.random()),
        label:  v.clavis ?? '—',
        prefix: `${Math.round(v.xyz?.x ?? 0)}, ${Math.round(v.xyz?.y ?? 0)}`,
      }))
    } catch { return [] }
  }

  function formaeItems(b: any): ListItem[] {
    if (!b?.Formae) return []
    try {
      return (b.Formae.arrayFrom() as any[]).map((f: any) => ({
        id:     f.clavis ?? String(Math.random()),
        label:  f.clavis ?? '—',
        prefix: `${f.viaArray?.().length ?? '?'} pts`,
      }))
    } catch { return [] }
  }

  function undaeItems(b: any): ListItem[] {
    if (!b?.undae) return []
    try {
      return (b.undae as any[][]).map((layer, i) => ({
        id:    String(i),
        label: `kyklos ${i}`,
        prefix: `${layer.length} orbs`,
      }))
    } catch { return [] }
  }

  const tabs = $derived.by((): TabDef[] => {
    const vx = vertexItems(biblio)
    const fx = formaeItems(biblio)
    const ux = undaeItems(biblio)
    return [
      { id: 'vertices', label: `Vertices (${vx.length})`, items: vx, empty: 'Aucun vertex' },
      { id: 'formae',   label: `Formae (${fx.length})`,   items: fx, empty: 'Aucune forma'  },
      { id: 'undae',    label: `Undae (${ux.length})`,    items: ux, empty: 'Aucune unda'   },
    ]
  })
</script>

<div class="inspector">
  {#if !biblio}
    <span class="empty">Lancez init() pour inspecter l'état</span>
  {:else}
    <JgrTabList {tabs} />
  {/if}
</div>

<style>
.inspector {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.empty {
  display: block;
  padding: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: #2a2a3a;
  font-style: italic;
}
</style>
