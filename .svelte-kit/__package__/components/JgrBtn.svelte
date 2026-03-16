<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    variant = 'cmd',
    active = false,
    disabled = false,
    title,
    onclick,
  }: {
    children: Snippet;
    variant?: 'back' | 'cmd' | 'file';
    active?: boolean;
    disabled?: boolean;
    title?: string;
    onclick?: () => void;
  } = $props();
</script>

<button
  class="jgr-btn"
  class:back={variant === 'back'}
  class:cmd={variant === 'cmd'}
  class:file={variant === 'file'}
  class:active
  {disabled}
  {title}
  {onclick}
>
  {@render children()}
</button>

<style>
.jgr-btn {
  border-radius: 3px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── back ── */
.jgr-btn.back {
  background: none;
  border: 1px solid var(--border-strong);
  color: var(--accent);
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
}
.jgr-btn.back:hover:not(:disabled) { background: var(--border); }

/* ── cmd ── */
.jgr-btn.cmd {
  padding: 0.2rem 0.55rem;
  background: var(--bg-panel);
  border: 1px solid var(--border-strong);
  color: #666;
  font-size: 0.65rem;
}
.jgr-btn.cmd:hover:not(:disabled) { background: var(--bg-subtle); color: #aaa; }
.jgr-btn.cmd.active { background: var(--accent); border-color: var(--accent); color: #fff; }
.jgr-btn.cmd.active:hover:not(:disabled) { background: var(--accent-hover); }
.jgr-btn.cmd:disabled { opacity: 0.4; cursor: default; }

/* ── file ── */
.jgr-btn.file {
  background: none;
  border: 1px solid #222;
  color: #555;
  font-size: 0.62rem;
  padding: 0.15rem 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  transition: color 0.15s, border-color 0.15s;
}
.jgr-btn.file:hover:not(:disabled) { color: var(--accent-hover); border-color: var(--accent-hover); }
.jgr-btn.file:disabled { opacity: 0.4; cursor: default; }
</style>
