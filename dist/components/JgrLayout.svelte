<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    storageKey = 'jgr-ui:panel-widths',
    leftWidth = 300,
    rightWidth = 340,
    height = '100vh',
    leftLabel = 'GAUCHE',
    rightLabel = 'DROITE',
    showStrips = true,
    topbar,
    left,
    center,
    right,
    footer,
  }: {
    storageKey?: string;
    leftWidth?: number;
    rightWidth?: number;
    height?: string;
    leftLabel?: string;
    rightLabel?: string;
    showStrips?: boolean;
    topbar?: Snippet;
    left?: Snippet;
    center?: Snippet;
    right?: Snippet;
    footer?: Snippet;
  } = $props();

  const STORAGE_KEY = storageKey;
  const COLLAPSED_KEY = storageKey + ':collapsed';
  const LIMITS = { left: [180, 600] as [number, number], right: [200, 600] as [number, number] };

  let widths = $state({ left: leftWidth, right: rightWidth });
  let collapsed = $state({ left: false, right: false });

  function loadWidths() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return {
          left:  Math.max(LIMITS.left[0],  Math.min(LIMITS.left[1],  p.left  ?? leftWidth)),
          right: Math.max(LIMITS.right[0], Math.min(LIMITS.right[1], p.right ?? rightWidth)),
        };
      }
    } catch { /* ignore */ }
    return { left: leftWidth, right: rightWidth };
  }

  function saveWidths() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(widths)); } catch { /* ignore */ }
  }

  function toggleCollapse(panel: 'left' | 'right') {
    collapsed = { ...collapsed, [panel]: !collapsed[panel] };
    if (showStrips) {
      try { localStorage.setItem(COLLAPSED_KEY, JSON.stringify(collapsed)); } catch { /* ignore */ }
    }
  }

  let dragging: 'left' | 'right' | null = $state(null);
  let dragStartX = 0;
  let dragStartW = 0;

  function startDrag(e: MouseEvent, panel: 'left' | 'right') {
    if (collapsed[panel]) return;
    dragging = panel;
    dragStartX = e.clientX;
    dragStartW = widths[panel];
    e.preventDefault();
  }

  function onMove(e: MouseEvent) {
    if (!dragging) return;
    const delta = e.clientX - dragStartX;
    const [min, max] = LIMITS[dragging];
    const next = dragging === 'left'
      ? Math.max(min, Math.min(max, dragStartW + delta))
      : Math.max(min, Math.min(max, dragStartW - delta));
    widths = { ...widths, [dragging]: next };
  }

  function onUp() {
    if (dragging) { saveWidths(); dragging = null; }
  }

  onMount(() => {
    widths = loadWidths();
    if (showStrips) {
      try {
        const raw = localStorage.getItem(COLLAPSED_KEY);
        if (raw) collapsed = JSON.parse(raw);
      } catch { /* ignore */ }
    }
  });
</script>

<svelte:window onmousemove={onMove} onmouseup={onUp} />

<div class="layout" class:dragging={!!dragging} style="height: {height}">
  {#if topbar}
    <div class="layout-topbar">{@render topbar()}</div>
  {/if}

  <div class="layout-body">
    <!-- Strip gauche -->
    {#if showStrips}
    <div class="panel-strip panel-strip--left">
      <button class:active={!collapsed.left} onclick={() => toggleCollapse('left')}>
        <span class="strip-label">{leftLabel}</span>
      </button>
    </div>
    {/if}

    {#if !collapsed.left && left}
      <div class="layout-panel layout-left" style="width: {widths.left}px">
        {@render left()}
      </div>
      <div
        class="handle"
        role="separator"
        aria-label="Redimensionner le panneau gauche"
        onmousedown={e => startDrag(e, 'left')}
        class:active={dragging === 'left'}
      ></div>
    {/if}

    <main class="layout-center">
      {#if center}{@render center()}{/if}
    </main>

    {#if !collapsed.right && right}
      <div
        class="handle"
        role="separator"
        aria-label="Redimensionner le panneau droit"
        onmousedown={e => startDrag(e, 'right')}
        class:active={dragging === 'right'}
      ></div>
      <div class="layout-panel layout-right" style="width: {widths.right}px">
        {@render right()}
      </div>
    {/if}

    <!-- Strip droite -->
    {#if showStrips}
    <div class="panel-strip panel-strip--right">
      <button class:active={!collapsed.right} onclick={() => toggleCollapse('right')}>
        <span class="strip-label">{rightLabel}</span>
      </button>
    </div>
    {/if}
  </div>

  {#if footer}
    <div class="layout-footer">{@render footer()}</div>
  {/if}
</div>

<style>
.layout {
  display: flex;
  flex-direction: column;
}
.layout.dragging { user-select: none; cursor: col-resize; }
.layout-topbar { flex-shrink: 0; }
.layout-body {
  display: flex;
  flex: 1;
  min-height: 0;
}
.layout.dragging :global(iframe) {
  pointer-events: none;
}
.layout-panel {
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.layout-center {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.layout-footer { flex-shrink: 0; }
.handle {
  flex-shrink: 0;
  width: 6px;
  cursor: col-resize;
  border-left: 1px solid #1e1e1e;
  border-right: 1px solid #1e1e1e;
  background: transparent;
  transition: border-color 0.15s;
}
.handle:hover, .handle.active { border-color: #3a3a3a; }
.panel-strip {
  width: 18px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  gap: 4px;
  background: var(--bg-panel);
  z-index: 10;
}
.panel-strip button {
  all: unset;
  cursor: pointer;
  padding: 4px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.panel-strip button:hover { background: var(--bg-subtle); }
.strip-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 9px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  color: var(--text-dim, #333);
  font-family: 'JetBrains Mono', monospace;
}
.panel-strip button.active .strip-label { color: var(--text-muted); }
.panel-strip--left  { border-right: 1px solid var(--border); }
.panel-strip--right { border-left:  1px solid var(--border); }
</style>
