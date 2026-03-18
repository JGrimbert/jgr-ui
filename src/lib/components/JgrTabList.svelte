<script lang="ts">
  import type { Snippet } from 'svelte';
  import JgrItem from './JgrItem.svelte';

  export type ListItem = {
    id: string;
    label: string;
    prefix?: string | number;
    labels?: { name: string; color: string }[];
    dimmed?: boolean;
    actionLabel?: string;
    actionLoading?: boolean;
    actionDone?: boolean;
    onaction?: () => void;
    ondelete?: () => void;
  };

  export type TabDef = {
    id: string;
    label: string;
    /** Undefined = onglet à contenu libre (customcontent snippet) */
    items?: ListItem[];
    /** Id de l'item sélectionné — affiche le snippet detail en-dessous */
    selectedId?: string;
    cta?: { label: string; onclick: () => void };
    /** Toute la liste passe en stale (opacité réduite, interactions bloquées) */
    pending?: boolean;
    loading?: boolean;
    empty?: string;
  };

  let {
    tabs,
    activeTab,
    ontabchange,
    onselect,
    detail,
    customcontent,
  }: {
    tabs: TabDef[];
    activeTab?: string;
    ontabchange?: (id: string) => void;
    onselect?: (tabId: string, item: ListItem) => void;
    /** Snippet rendu inline sous l'item sélectionné : (tabId, itemId) */
    detail?: Snippet<[string, string]>;
    /** Snippet rendu pour un onglet sans items : (tabId) */
    customcontent?: Snippet<[string]>;
  } = $props();

  let _tab = $state(tabs[0]?.id ?? '');
  const currentId = $derived(activeTab ?? _tab);
  const current = $derived(tabs.find(t => t.id === currentId));

  let queries = $state<Record<string, string>>({});
  const q = $derived(queries[currentId] ?? '');

  function setQ(v: string) {
    queries = { ...queries, [currentId]: v };
  }

  function switchTab(id: string) {
    _tab = id;
    ontabchange?.(id);
  }

  const rows = $derived(
    !q.trim()
      ? (current?.items ?? [])
      : (current?.items ?? []).filter(item =>
          item.label.toLowerCase().includes(q.toLowerCase()) ||
          String(item.prefix ?? '').toLowerCase().includes(q.toLowerCase())
        )
  );
</script>

<div class="tl">
  <div class="tl-bar">
    {#each tabs as t}
      <button class="tl-tab" class:active={currentId === t.id} onclick={() => switchTab(t.id)}>
        {t.label}
        {#if (t.items?.length ?? 0) > 0}
          <span class="tl-count">{t.items!.length}</span>
        {/if}
      </button>
    {/each}
    {#if current?.cta}
      <button class="tl-cta" onclick={current.cta.onclick}>{current.cta.label}</button>
    {/if}
  </div>

  {#if current?.items !== undefined}
    <div class="tl-search">
      <input
        class="tl-input"
        placeholder="Filtrer…"
        value={q}
        oninput={e => setQ((e.target as HTMLInputElement).value)}
      />
      {#if q}<button class="tl-clear" onclick={() => setQ('')}>✕</button>{/if}
    </div>

    <div class="tl-list" class:stale={current.pending}>
      {#if current.loading}
        <p class="tl-hint">Chargement…</p>
      {:else if rows.length === 0}
        <p class="tl-hint">{current.empty ?? (q ? 'Aucun résultat' : 'Vide')}</p>
      {:else}
        {#each rows as item}
          <div class="tl-row" class:dimmed={item.dimmed}>
            <JgrItem
              prefix={item.prefix}
              title={item.label}
              labels={item.labels}
              state={current.selectedId === item.id ? 'selected' : 'default'}
              actionLabel={item.actionLabel}
              actionLoading={item.actionLoading}
              actionDone={item.actionDone}
              onaction={item.onaction}
              onselect={() => onselect?.(currentId, item)}
            />
            {#if item.ondelete}
              <button class="tl-del" onclick={item.ondelete} title="Supprimer">✕</button>
            {/if}
          </div>
          {#if current.selectedId === item.id && detail}
            {@render detail(currentId, item.id)}
          {/if}
        {/each}
      {/if}
    </div>

  {:else if customcontent}
    <div class="tl-custom">
      {@render customcontent(currentId)}
    </div>
  {/if}
</div>

<style>
.tl {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.tl-bar {
  display: flex;
  align-items: center;
  height: 28px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--bg-panel);
}
.tl-tab {
  background: none;
  border: none;
  border-right: 1px solid var(--border);
  cursor: pointer;
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2e2e2e;
  padding: 0 0.55rem;
  height: 100%;
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.1s;
  flex-shrink: 0;
}
.tl-tab:hover { color: #555; }
.tl-tab.active { color: #777; }
.tl-count { font-size: 0.52rem; color: #3a3a3a; }
.tl-cta {
  margin-left: auto;
  background: none;
  border: none;
  border-left: 1px solid var(--border);
  color: #3a3a4a;
  font-size: 0.58rem;
  padding: 0 0.7rem;
  height: 100%;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
  transition: color 0.1s;
  flex-shrink: 0;
}
.tl-cta:hover { color: var(--accent-hover, #9181f9); }
.tl-search {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.tl-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  padding: 0.3rem 0.6rem;
}
.tl-input::placeholder { color: var(--border-strong); }
.tl-clear {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  padding: 0 0.4rem;
  font-size: 0.7rem;
}
.tl-clear:hover { color: #888; }
.tl-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  transition: opacity 0.15s;
}
.tl-list::-webkit-scrollbar { width: 4px; height: 4px; }
.tl-list::-webkit-scrollbar-track { background: transparent; }
.tl-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.tl-list::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }
.tl-list.stale { opacity: 0.4; pointer-events: none; }
.tl-row {
  position: relative;
  display: flex;
  align-items: stretch;
}
.tl-row.dimmed { opacity: 0.35; }
.tl-del {
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #333;
  font-size: 0.58rem;
  padding: 0.1rem 0.25rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s, color 0.1s;
}
.tl-row:hover .tl-del { opacity: 1; }
.tl-del:hover { color: #f44336; }
.tl-hint { padding: 1rem; color: #333; font-size: 0.8rem; }
.tl-custom {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
