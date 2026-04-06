<script lang="ts">
  export type PromptSection = { id: string; label: string; content: string; enabled?: boolean };

  let {
    value = $bindable(''),
    placeholder = 'Tâche…',
    sections = [],
    pending = false,
    onsubmit,
    onchange,
  }: {
    value?: string;
    placeholder?: string;
    sections?: PromptSection[];
    pending?: boolean;
    onsubmit?: (value: string) => void;
    onchange?: (value: string) => void;
  } = $props();

  let collapsed = $state(new Set<string>());

  function toggleSec(id: string) {
    const next = new Set(collapsed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    collapsed = next;
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onsubmit?.(value);
    }
  }

  function handleInput(e: Event) {
    const v = (e.target as HTMLTextAreaElement).value;
    value = v;
    onchange?.(v);
  }
</script>

<div class="jgr-prompt">
  <textarea
    class="prompt-ta"
    {placeholder}
    value={value}
    oninput={handleInput}
    onkeydown={handleKey}
    disabled={pending}
    rows="4"
  ></textarea>

  {#if sections.length > 0}
    <div class="sections">
      {#each sections as sec}
        {#if sec.enabled !== false}
          <div class="sec">
            <button class="sec-toggle" onclick={() => toggleSec(sec.id)}>
              {sec.label} {collapsed.has(sec.id) ? '▸' : '▾'}
            </button>
            {#if !collapsed.has(sec.id)}
              <pre class="sec-content">{sec.content}</pre>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
.jgr-prompt {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  height: 100%;
}
.prompt-ta {
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 2px;
  color: #999;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.67rem;
  line-height: 1.55;
  padding: 0.3rem 0.5rem;
  resize: vertical;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.prompt-ta:focus { color: #ccc; border-color: var(--border-strong); }
.prompt-ta:disabled { opacity: 0.45; cursor: wait; }
.prompt-ta::placeholder { color: var(--border-strong); }
.sections {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
.sections::-webkit-scrollbar { width: 3px; }
.sections::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
.sec { display: flex; flex-direction: column; padding: 0.2rem 0; }
.sec-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.46rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  text-align: left;
  padding: 0.25rem 0;
  width: 100%;
}
.sec-toggle:hover { color: #666; }
.sec-content {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #3a3a4a;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
</style>
