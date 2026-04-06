<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    tabs,
    activeTab,
    onchange,
    children,
  }: {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onchange?: (id: string) => void;
    children?: Snippet<[string]>;
  } = $props();
</script>

<div class="tabs-root">
  <div class="tab-bar">
    {#each tabs as tab}
      <button
        class="tab"
        class:active={activeTab === tab.id}
        onclick={() => onchange?.(tab.id)}
      >{tab.label}</button>
    {/each}
  </div>
  <div class="tab-content">
    {#if children}
      {@render children(activeTab)}
    {/if}
  </div>
</div>

<style>
.tabs-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.tab-bar {
  display: flex;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
}
.tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #444;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  padding: 0.35rem 0.9rem;
  cursor: pointer;
  flex-shrink: 0;
  margin-bottom: -1px;
  transition: color 0.1s, border-color 0.1s;
}
.tab:hover { color: #666; }
.tab.active { color: var(--accent-hover); border-bottom-color: var(--accent); }
.tab-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
