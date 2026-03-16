<script lang="ts">
  let {
    title = '',
    prefix = '',
    labels = [],
    state: itemState = 'default',
    actionLabel,
    actionDone = false,
    actionLoading = false,
    onaction,
    onselect,
  }: {
    title?: string;
    prefix?: string | number;
    labels?: Array<{ name: string; color: string }>;
    state?: 'default' | 'hover' | 'selected' | 'pending';
    actionLabel?: string;
    actionDone?: boolean;
    actionLoading?: boolean;
    onaction?: () => void;
    onselect?: () => void;
  } = $props();
</script>

<div
  class="item-row"
  class:active={itemState === 'selected'}
  class:pending={itemState === 'pending'}
  role="button"
  tabindex="0"
  onclick={onselect}
  onkeydown={e => e.key === 'Enter' && onselect?.()}
>
  <div class="item-top">
    {#if prefix}<span class="item-prefix">{prefix}</span>{/if}
    <span class="item-title">{title}</span>
    {#if actionLabel}
      <button
        class="item-action"
        class:done={actionDone}
        onclick={e => { e.stopPropagation(); onaction?.(); }}
        disabled={actionLoading || actionDone}
        title={actionLabel}
      >{actionDone ? "✓" : actionLoading ? "…" : actionLabel}</button>
    {/if}
  </div>

  {#if labels.length > 0}
    <div class="item-labels">
      {#each labels as label}
        <span
          class="label"
          style="background: #{label.color}20; color: #{label.color}; border-color: #{label.color}40"
        >{label.name}</span>
      {/each}
    </div>
  {/if}
</div>

<style>
.item-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.5rem 1rem;
  background: var(--bg-base);
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
  gap: 0.45rem;
  overflow: visible;
  user-select: none;
}
.item-row:hover { background: var(--bg-panel); }
.item-row.active { background: var(--bg-subtle); }
.item-row.pending { opacity: 0.7; }
.item-top {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}
.item-prefix {
  color: #555;
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
}
.item-title {
  color: #bbb;
  font-size: 0.72rem;
  line-height: 1.3;
}
.item-action {
  margin-left: auto;
  flex-shrink: 0;
  background: none;
  border: 1px solid #333;
  color: #555;
  font-size: 0.58rem;
  padding: 0.05rem 0.35rem;
  border-radius: 3px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  transition: color 0.15s, border-color 0.15s;
}
.item-action:hover:not(:disabled) { color: var(--accent-hover); border-color: var(--accent-hover); }
.item-action:disabled { opacity: 0.5; cursor: default; }
.item-action.done { color: #3a8a3a; border-color: #1a4a1a; cursor: default; }
.item-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.label {
  font-size: 0.6rem;
  padding: 0.05rem 0.4rem;
  border-radius: 10px;
  border: 1px solid transparent;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.03em;
}
</style>
