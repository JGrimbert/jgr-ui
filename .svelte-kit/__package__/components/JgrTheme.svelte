<script lang="ts">
  let { theme = 'dark', children }: { theme?: 'dark' | 'light'; children?: any } = $props();
</script>

{#if children}
  {@render children()}
{/if}

<style>
  :global(:root) {
    --bg-deep:        #0c0c16;
    --bg-base:        #16161e;
    --bg-panel:       #12121a;
    --bg-subtle:      #1a1a28;
    --border:         #1e1e2e;
    --border-strong:  #2a2a3a;
    --text-primary:   #ccc;
    --text-secondary: #888;
    --text-muted:     #555;
    --text-dim:       #333;
    --color-impl:     cornsilk;
    --accent:         #7c6af7;
    --accent-hover:   #9181f9;
    --scrollbar:      #2a2a3a;
  }
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  :global(body) {
    background: var(--bg-base);
    color: var(--text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  :global(pre), :global(code), :global(.monospace) {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }
  :global(::-webkit-scrollbar)       { width: 4px; }
  :global(::-webkit-scrollbar-track) { background: transparent; }
  :global(::-webkit-scrollbar-thumb) { background: var(--scrollbar); border-radius: 2px; }
</style>
