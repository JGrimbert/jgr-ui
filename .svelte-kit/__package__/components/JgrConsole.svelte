<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export type LogEntry = { line: string; type: 'agent' | 'system' | 'error' | string };

  let {
    logs = [],
    running = false,
    title = '',
    completionLabel = '',
    sessionAlive = false,
    showInput = false,
    oninterrupt,
    onterminate,
    ondismiss,
    oninput,
  }: {
    logs?: LogEntry[];
    running?: boolean;
    title?: string;
    completionLabel?: string;
    sessionAlive?: boolean;
    showInput?: boolean;
    oninterrupt?: () => void;
    onterminate?: () => void;
    ondismiss?: () => void;
    oninput?: (text: string) => void;
  } = $props();

  const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let frame = $state(0);
  let spinnerInterval: ReturnType<typeof setInterval> | null = null;

  onMount(() => { spinnerInterval = setInterval(() => { frame = (frame + 1) % FRAMES.length; }, 80); });
  onDestroy(() => { if (spinnerInterval) clearInterval(spinnerInterval); });

  let logArea: HTMLDivElement | undefined = $state();
  let autoScroll = true;

  $effect(() => {
    // Déclenche quand les logs changent
    void visibleLogs;
    if (autoScroll && logArea) logArea.scrollTop = logArea.scrollHeight;
  });

  function onScroll() {
    if (!logArea) return;
    autoScroll = logArea.scrollHeight - logArea.scrollTop - logArea.clientHeight < 40;
  }

  let visibleLogs = $derived(logs.filter(l =>
    l.type !== 'usage' && l.type !== 'context' && l.type !== 'session_status' &&
    !/^\[pid:\d+\]$/.test(l.line)
  ));

  let systemLogs = $derived(logs.filter(l => l.type === 'system' && !/^\[pid:\d+\]$/.test(l.line)));

  let statusLine = $state('');
  let statusDebounce: ReturnType<typeof setTimeout> | null = null;
  $effect(() => {
    if (systemLogs.length > 0) {
      if (statusDebounce) clearTimeout(statusDebounce);
      statusDebounce = setTimeout(() => { statusLine = systemLogs[systemLogs.length - 1].line; }, 150);
    } else {
      statusLine = '';
    }
  });

  let inputValue = $state('');

  function handleInputKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputValue.trim();
      if (text) { oninput?.(text); inputValue = ''; }
    }
  }
</script>

<div class="console">
  <div class="console-header">
    <span class="dot" class:running></span>
    <span class="console-label">Console</span>
    <span class="task-title">{title}</span>
    <span class="status-text">
      {#if running}
        {visibleLogs.length === 0 ? "Initialisation…" : "En cours…"}
      {:else if sessionAlive}
        session active
      {:else if completionLabel}
        {completionLabel}
      {:else if visibleLogs.length > 0}
        Terminé
      {/if}
    </span>
    {#if sessionAlive && !running}
      <span class="badge-session">⬡ session</span>
    {/if}
    {#if running}
      <button class="btn-stop" onclick={oninterrupt}>■ Interrompre</button>
    {/if}
    {#if sessionAlive && !running}
      <button class="btn-terminate" onclick={onterminate}>⏹ Terminer</button>
    {/if}
    {#if !running && !sessionAlive}
      <button class="btn-dismiss" onclick={ondismiss}>✕ Fermer</button>
    {/if}
  </div>

  <div class="log-area" bind:this={logArea} onscroll={onScroll}>
    {#if visibleLogs.length === 0}
      {#if running}
        {#if statusLine}
          <span class="hint status">{FRAMES[frame]} {statusLine}</span>
        {:else}
          <span class="hint blink">{FRAMES[frame]} En attente de la première sortie…</span>
        {/if}
      {:else}
        <span class="hint">Aucune sortie</span>
      {/if}
    {:else}
      {#each visibleLogs as entry}
        <div class="log-line" class:sys={entry.type === 'system'}>{entry.line}</div>
      {/each}
    {/if}
  </div>

  {#if !running && !sessionAlive && completionLabel}
    <div class="completion-hint">{completionLabel}</div>
  {/if}

  {#if showInput}
    <div class="input-row">
      <span class="prompt-sym">›</span>
      <input
        class="console-input"
        type="text"
        placeholder="Répondre… (Entrée)"
        bind:value={inputValue}
        onkeydown={handleInputKey}
      />
    </div>
  {/if}
</div>

<style>
.console {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-deep);
  font-family: 'JetBrains Mono', monospace;
}
.console-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 1rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--bg-panel);
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #333;
  flex-shrink: 0;
  transition: background 0.3s;
}
.dot.running {
  background: #7c6af7;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.console-label {
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #333;
  flex-shrink: 0;
}
.task-title {
  font-size: 0.65rem;
  color: #7c6af7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.status-text {
  font-size: 0.6rem;
  color: #2e2e2e;
  flex-shrink: 0;
  font-style: italic;
}
.btn-stop {
  background: none;
  border: 1px solid #3a2a2a;
  color: #a04040;
  font-size: 0.62rem;
  padding: 0.15rem 0.55rem;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
}
.btn-stop:hover { border-color: #f44336; color: #f44336; }
.btn-dismiss {
  background: none;
  border: 1px solid #1e1e1e;
  color: #333;
  font-size: 0.62rem;
  padding: 0.15rem 0.55rem;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
}
.btn-dismiss:hover { border-color: #555; color: #777; }
.badge-session {
  font-size: 0.58rem;
  color: #3a7a4a;
  border: 1px solid #1e3a2a;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  flex-shrink: 0;
  letter-spacing: 0.05em;
}
.btn-terminate {
  background: none;
  border: 1px solid #2a2a1e;
  color: #5a5a30;
  font-size: 0.62rem;
  padding: 0.15rem 0.55rem;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
}
.btn-terminate:hover { border-color: #a09030; color: #c0b040; }
.log-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.6rem 1.2rem;
  scroll-behavior: smooth;
}
.log-area::-webkit-scrollbar { width: 4px; }
.log-area::-webkit-scrollbar-track { background: transparent; }
.log-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.log-line {
  font-size: 0.7rem;
  color: #aaa;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
.log-line.sys { color: #3a3a5a; font-style: italic; }
.hint {
  display: block;
  padding: 0.4rem 0;
  color: #2a2a3a;
  font-size: 0.68rem;
  font-style: italic;
}
.blink { animation: blink 1.2s step-start infinite; }
@keyframes blink { 50% { opacity: 0.3; } }
.hint.status { color: #4a9eff; font-style: italic; font-size: 0.7rem; opacity: 0.75; }
.completion-hint {
  padding: 0.35rem 1.2rem;
  font-size: 0.65rem;
  color: #4a7a4a;
  border-top: 1px solid #1a2a1a;
  background: #0a120a;
  font-style: italic;
  flex-shrink: 0;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 1rem;
  border-top: 1px solid var(--border);
  background: var(--bg-panel);
  flex-shrink: 0;
}
.prompt-sym { color: #3a3a5a; font-size: 0.85rem; flex-shrink: 0; line-height: 1; }
.console-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #888;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  padding: 0;
}
.console-input:focus { color: #bbb; }
.console-input::placeholder { color: #252535; }
</style>
