<script lang="ts">
  import JgrTabs           from './JgrTabs.svelte'
  import JgrConsole        from './JgrConsole.svelte'
  import JgrPre            from './JgrPre.svelte'
  import JgrBiblioSvg      from './JgrBiblioSvg.svelte'
  import JgrBiblioInspector from './JgrBiblioInspector.svelte'
  import type { LogEntry } from './JgrConsole.svelte'

  let {
    biblio = null,
    logs   = [],
  }: {
    biblio?: any;
    logs?:   LogEntry[];
  } = $props()

  let activeTab = $state('svg')

  const TABS = [
    { id: 'svg',       label: 'SVG'       },
    { id: 'inspector', label: 'Inspecteur' },
    { id: 'config',    label: 'Config'     },
  ]

  const configJson = $derived(
    biblio?.params ? JSON.stringify(biblio.params, null, 2) : '—'
  )
</script>

<div class="biblio-monitor">
  <div class="monitor-main">
    <JgrTabs tabs={TABS} {activeTab} onchange={(id) => { activeTab = id }}>
      {#snippet children(tab)}
        <div class="tab-panel">
          {#if tab === 'svg'}
            <JgrBiblioSvg {biblio} />
          {:else if tab === 'inspector'}
            <JgrBiblioInspector {biblio} />
          {:else if tab === 'config'}
            <div class="config-panel">
              <JgrPre content={configJson} maxHeight="100%" />
            </div>
          {/if}
        </div>
      {/snippet}
    </JgrTabs>
  </div>

  <div class="monitor-console">
    <JgrConsole {logs} />
  </div>
</div>

<style>
.biblio-monitor {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  gap: 0;
}
.monitor-main {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.monitor-console {
  flex-shrink: 0;
  height: 10rem;
  border-top: 1px solid var(--border);
}
.tab-panel {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.config-panel {
  padding: 1rem 1.2rem;
  overflow-y: auto;
  height: 100%;
}
</style>
