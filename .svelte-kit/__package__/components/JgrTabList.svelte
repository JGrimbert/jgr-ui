<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import JgrItem from './JgrItem.svelte';

  export type ListItem = {
    id: string;
    label: string;
    prefix?: string | number;
    labels?: { name: string; color: string }[];
    issues?: number[];
    dimmed?: boolean;
    loading?: boolean;
    description?: string;
    actionLabel?: string;
    actionLoading?: boolean;
    actionDone?: boolean;
    onaction?: () => void;
    actionHoverOnly?: boolean;
    onclose?: { handler: () => void; loading?: boolean; done?: boolean };
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
    /** Label affiché sur le JgrCta pending. Défaut : "En cours" */
    pendingLabel?: string;
    loading?: boolean;
    empty?: string;
  };

  let {
    tabs,
    activeTab,
    ontabchange,
    onselect,
    onissueclick,
    detail,
    customcontent,
  }: {
    tabs: TabDef[];
    activeTab?: string;
    ontabchange?: (id: string) => void;
    onselect?: (tabId: string, item: ListItem) => void;
    onissueclick?: (n: number) => void;
    /** Snippet rendu inline sous l'item sélectionné : (tabId, itemId) */
    detail?: Snippet<[string, string]>;
    /** Snippet rendu pour un onglet sans items : (tabId) */
    customcontent?: Snippet<[string]>;
  } = $props();

  let _tab = $state(tabs[0]?.id ?? '');
  const currentId = $derived(activeTab ?? _tab);
  const current = $derived(tabs.find(t => t.id === currentId));

  const FRAMES = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  let loadFrame = $state(0);

  onMount(() => {
    const timer = setInterval(() => { loadFrame = (loadFrame + 1) % FRAMES.length; }, 100);
    return () => clearInterval(timer);
  });

  let queries = $state<Record<string, string>>({});
  const q = $derived(queries[currentId] ?? '');

  function setQ(v: string) {
    queries = { ...queries, [currentId]: v };
  }

  function switchTab(id: string) {
    _tab = id;
    ontabchange?.(id);
  }

  const ql = $derived(q.toLowerCase().trim());

  const titleRows = $derived(
    !ql
      ? (current?.items ?? [])
      : (current?.items ?? []).filter(item =>
          item.label.toLowerCase().includes(ql) ||
          String(item.prefix ?? '').toLowerCase().includes(ql)
        )
  );

  const descOnlyRows = $derived(
    !ql
      ? []
      : (() => {
          const ids = new Set(titleRows.map(i => i.id));
          return (current?.items ?? []).filter(item =>
            !ids.has(item.id) &&
            !!item.description?.toLowerCase().includes(ql)
          );
        })()
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
    {#if !current.loading}
    <div class="tl-search">
      <input
        class="tl-input"
        placeholder="Filtrer…"
        value={q}
        oninput={e => setQ((e.target as HTMLInputElement).value)}
      />
      {#if q}<button class="tl-clear" onclick={() => setQ('')}>✕</button>{/if}
    </div>
    {/if}

    {#if current.pending}
      <div class="tl-pending-row">
        <span class="tl-load-spin">{FRAMES[loadFrame]}</span>
        {#if current.pendingLabel}<span class="tl-pending-label">{current.pendingLabel}</span>{/if}
      </div>
    {/if}
    <div class="tl-list" class:stale={current.pending}>
      {#if current.loading}
        <div class="tl-loading">
          <span class="tl-load-spin">{FRAMES[loadFrame]}</span>
        </div>
      {:else if titleRows.length === 0 && descOnlyRows.length === 0}
        <p class="tl-hint">{current.empty ?? (q ? 'Aucun résultat' : 'Vide')}</p>
      {:else}
        {#each titleRows as item}
          <div class="tl-row" class:dimmed={item.dimmed} class:tl-row--with-close={!!item.onclose || !!item.loading} class:tl-row--selected={current.selectedId === item.id}>
            <JgrItem
              prefix={item.prefix}
              title={item.label}
              labels={item.labels}
              issues={item.issues}
              state={current.selectedId === item.id ? 'selected' : 'default'}
              actionLabel={item.actionHoverOnly ? undefined : item.actionLabel}
              actionLoading={item.actionLoading}
              actionDone={item.actionDone}
              onaction={item.actionHoverOnly ? undefined : item.onaction}
              onselect={() => onselect?.(currentId, item)}
              onissueclick={onissueclick}
            />
            {#if item.onclose}
              <button
                class="tl-del"
                class:tl-del-done={item.onclose.done}
                class:tl-del-vis={item.onclose.loading || item.onclose.done}
                onclick={(e) => { e.stopPropagation(); item.onclose!.handler(); }}
                disabled={item.onclose.loading || item.onclose.done}
                title="Fermer"
              >{item.onclose.done ? '✓' : item.onclose.loading ? '…' : '✕'}</button>
            {:else if item.loading}
              <span class="tl-del tl-del-vis tl-del-pending">{FRAMES[loadFrame]}</span>
            {/if}
            {#if item.onaction && item.actionHoverOnly}
              <button
                class="tl-act"
                class:tl-act-done={item.actionDone}
                onclick={(e) => { e.stopPropagation(); item.onaction!(); }}
                disabled={item.actionLoading || item.actionDone}
                title={item.actionLabel ?? "→"}
              >{item.actionDone ? '✓' : item.actionLoading ? '…' : '→'}</button>
            {/if}
          </div>
          {#if current.selectedId === item.id && detail}
            {@render detail(currentId, item.id)}
          {/if}
        {/each}
        {#if descOnlyRows.length > 0}
          <div class="tl-desc-sep">dans les descriptions</div>
          {#each descOnlyRows as item}
            <div class="tl-row tl-row--desc" class:dimmed={item.dimmed} class:tl-row--with-close={!!item.onclose || !!item.loading} class:tl-row--selected={current.selectedId === item.id}>
              <JgrItem
                prefix={item.prefix}
                title={item.label}
                labels={item.labels}
                issues={item.issues}
                state={current.selectedId === item.id ? 'selected' : 'default'}
                actionLabel={item.actionHoverOnly ? undefined : item.actionLabel}
                actionLoading={item.actionLoading}
                actionDone={item.actionDone}
                onaction={item.actionHoverOnly ? undefined : item.onaction}
                onselect={() => onselect?.(currentId, item)}
                onissueclick={onissueclick}
              />
              {#if item.onclose}
                <button
                  class="tl-del"
                  class:tl-del-done={item.onclose.done}
                  class:tl-del-vis={item.onclose.loading || item.onclose.done}
                  onclick={(e) => { e.stopPropagation(); item.onclose!.handler(); }}
                  disabled={item.onclose.loading || item.onclose.done}
                  title="Fermer"
                >{item.onclose.done ? '✓' : item.onclose.loading ? '…' : '✕'}</button>
              {:else if item.loading}
                <span class="tl-del tl-del-vis tl-del-pending">{FRAMES[loadFrame]}</span>
              {/if}
              {#if item.onaction && item.actionHoverOnly}
                <button
                  class="tl-act"
                  class:tl-act-done={item.actionDone}
                  onclick={(e) => { e.stopPropagation(); item.onaction!(); }}
                  disabled={item.actionLoading || item.actionDone}
                  title={item.actionLabel ?? "→"}
                >{item.actionDone ? '✓' : item.actionLoading ? '…' : '→'}</button>
              {/if}
            </div>
            {#if current.selectedId === item.id && detail}
              {@render detail(currentId, item.id)}
            {/if}
          {/each}
        {/if}
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
  transition: opacity 0.2s;
}
.tl-list.stale {
  opacity: 0.4;
  pointer-events: none;
}
.tl-list::-webkit-scrollbar { width: 4px; height: 4px; }
.tl-list::-webkit-scrollbar-track { background: transparent; }
.tl-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.tl-list::-webkit-scrollbar-thumb:hover { background: var(--border-strong); }
.tl-pending-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.35rem 0.6rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.tl-pending-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-muted, #555);
}
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
.tl-del-vis { opacity: 1 !important; }
.tl-del:hover:not(:disabled) { color: #f44336; }
.tl-del-done { color: #3a8a3a; cursor: default; }
.tl-del:disabled { cursor: default; }
.tl-del-pending { pointer-events: none; color: #888; cursor: default; }
.tl-hint { padding: 1rem; color: #333; font-size: 0.8rem; }
.tl-desc-sep {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.52rem;
  color: #3a3a4a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.6rem 0.2rem;
  border-top: 1px solid var(--border, #222);
  margin-top: 0.15rem;
}
.tl-row--desc { opacity: 0.6; }
.tl-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 0;
}
.tl-load-spin {
  color: cornsilk;
  font-size: 0.65rem;
  opacity: 0.8;
  font-family: 'JetBrains Mono', monospace;
}
.tl-custom {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.tl-act {
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  outline: none;
  color: #666;
  font-size: 1.3rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s, color 0.1s;
  font-family: 'JetBrains Mono', monospace;
  padding: 0 0.15rem;
  line-height: 1;
}
.tl-row:hover .tl-act,
.tl-row--selected .tl-act { opacity: 1; }
.tl-row--with-close .tl-act { right: 1.8rem; }
.tl-act:hover:not(:disabled) { color: var(--accent-hover, #9181f9); }
.tl-act-done { color: #3a8a3a; cursor: default; }
.tl-act:disabled:not(.tl-act-done) { opacity: 0.5; cursor: default; }
</style>
