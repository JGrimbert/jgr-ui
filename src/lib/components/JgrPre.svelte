<script lang="ts">
  let {
    content,
    previewLines = 5,
    maxHeight = '14rem',
  }: {
    content: string;
    previewLines?: number;
    maxHeight?: string;
  } = $props();

  let expanded = $state(false);

  const lineCount  = $derived((content ?? '').split('\n').length);
  const collapsible = $derived(lineCount > previewLines);
</script>

{#if collapsible}
  <div
    class="jgr-pre-wrap"
    style="--preview-h: calc({previewLines} * 1.45em); --max-h: {maxHeight}"
  >
    <div class="jgr-pre-clip" class:expanded>
      <pre class="jgr-pre">{content}</pre>
      {#if !expanded}
        <div class="jgr-pre-fade"></div>
      {/if}
    </div>
    <button class="jgr-pre-btn" onclick={() => (expanded = !expanded)}>
      {expanded ? '▴ réduire' : '▾ voir tout'}
    </button>
  </div>
{:else}
  <pre class="jgr-pre">{content}</pre>
{/if}

<style>
.jgr-pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.67rem;
  color: #888;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  padding: 0.1rem 0;
}

.jgr-pre-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.jgr-pre-clip {
  position: relative;
  max-height: var(--preview-h);
  overflow: hidden;
}

.jgr-pre-clip.expanded {
  max-height: var(--max-h);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}

.jgr-pre-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5em;
  background: linear-gradient(to bottom, transparent, var(--bg-deep, #0e0e0e));
  pointer-events: none;
}

.jgr-pre-btn {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  font-size: 0.62rem;
  font-family: 'JetBrains Mono', monospace;
  padding: 0.2rem 0 0.1rem;
  text-align: left;
  transition: color 0.15s;
  align-self: flex-start;
}
.jgr-pre-btn:hover { color: var(--accent, #6e8); }
</style>
