<script lang="ts">
  import { onMount } from 'svelte';
  let { children }: { children?: any } = $props();

  onMount(() => {
    const saved = localStorage.getItem('jgr-theme') ?? 'deep';
    document.documentElement.dataset.theme = saved;
  });
</script>

{#if children}
  {@render children()}
{/if}

<style>
  :global(:root[data-theme="deep"]) {
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
  :global(:root[data-theme="dark"]) {
    --bg-deep:        #181825;
    --bg-base:        #24273a;
    --bg-panel:       #1e1e2e;
    --bg-subtle:      #313244;
    --border:         #313244;
    --border-strong:  #45475a;
    --text-primary:   #cdd6f4;
    --text-secondary: #a6adc8;
    --text-muted:     #6c7086;
    --text-dim:       #45475a;
    --color-impl:     #f9e2af;
    --accent:         #cba6f7;
    --accent-hover:   #d4b8f9;
    --scrollbar:      #45475a;
  }
  :global(:root[data-theme="dim"]) {
    --bg-deep:        #1a1a2e;
    --bg-base:        #22223a;
    --bg-panel:       #1e1e32;
    --bg-subtle:      #2a2a42;
    --border:         #2e2e46;
    --border-strong:  #3a3a56;
    --text-primary:   #c4c4d4;
    --text-secondary: #8a8aa4;
    --text-muted:     #5a5a74;
    --text-dim:       #3a3a4e;
    --color-impl:     #f0e0c0;
    --accent:         #8b79f8;
    --accent-hover:   #a090fa;
    --scrollbar:      #3a3a56;
  }
  :global(:root[data-theme="light"]) {
    --bg-deep:        #e0e0eb;
    --bg-base:        #f0f0f5;
    --bg-panel:       #e8e8f0;
    --bg-subtle:      #f8f8ff;
    --border:         #d0d0e0;
    --border-strong:  #b8b8cc;
    --text-primary:   #1a1a2e;
    --text-secondary: #4a4a6a;
    --text-muted:     #8a8aaa;
    --text-dim:       #c0c0d8;
    --color-impl:     #5c3e00;
    --accent:         #5c4be8;
    --accent-hover:   #7060ee;
    --scrollbar:      #c0c0d8;
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
