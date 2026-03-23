<script lang="ts">
  import { browser } from '$app/environment'
  import JgrBiblio from '$lib/components/JgrBiblio.svelte'
  import type { LogEntry } from '$lib/components/JgrConsole.svelte'
  import { PRESETS } from 'jgr-maestra/demo/configs.js'
  import { createBiblio } from '$lib/utils/maestra.js'

  // ── Formulaire ───────────────────────────────────────────────────────────────
  let seedStr  = $state('4,4,4,4')
  let kyklos   = $state(3)
  let radius   = $state(100)
  let delta    = $state(0)
  let ellipse  = $state(1)

  function applyPreset(i: number) {
    const p = PRESETS[i].params
    seedStr = p.seed.join(',')
    kyklos  = p.kyklos
    radius  = p.radius
    delta   = p.delta
    ellipse = p.ellipse
  }

  function parseSeed(s: string): number[] {
    return s.split(',').map(x => parseInt(x.trim(), 10)).filter(n => !isNaN(n) && n >= 3)
  }

  // ── Biblio ───────────────────────────────────────────────────────────────────
  let biblio: any = $state(null)
  let logs: LogEntry[] = $state([])
  let error: string | null = $state(null)

  async function run() {
    if (!browser) return
    const t0 = performance.now()
    error = null
    logs = [{ line: '⚡ init() — jgr-maestra/Biblio', type: 'system' }]

    try {

      const seed = parseSeed(seedStr)

      biblio = await createBiblio({
        registres: { Vertices: 'Vertex', Formae: 'Forma' },
        type: 'SEED',
        graph: {
          xyzwh: { x: 600, y: 600 },
          seed:  { seed, kyklos, radius, ellipse, delta },
          limes: { quadro: false },
        },
        computeSeed: true,
      })

      const dt      = (performance.now() - t0).toFixed(1)
      const vxCount = biblio?.Vertices?.arche?.codex?.size ?? '?'
      const fxCount = biblio?.Formae?.arche?.codex?.size   ?? 'n/a'

      logs = [
        { line: `params: seed=[${seed}] kyklos=${kyklos} radius=${radius}`, type: 'system' },
        { line: `✓ Vertices : ${vxCount}`, type: 'agent' },
        { line: `✓ Formae   : ${fxCount}`, type: 'agent' },
        { line: `⏱ ${dt} ms`, type: 'system' },
      ]
    } catch (err: any) {
      error = err?.message ?? String(err)
      logs = [{ line: `✗ ${error}`, type: 'system' }]
      biblio = null
    }
  }

  // ── Réactivité : relance à chaque changement de formulaire ──────────────────
  $effect(() => {
    void seedStr; void kyklos; void radius; void delta; void ellipse
    run()
  })
</script>

<div class="page">
  <!-- ── Panneau gauche : formulaire ── -->
  <aside class="sidebar">
    <header class="sidebar-header">
      <span class="sidebar-title">Biblio Monitor</span>
      <span class="sidebar-sub">jgr-maestra</span>
    </header>

    <section class="form-section">
      <label class="form-label">Preset</label>
      <div class="preset-list">
        {#each PRESETS as p, i}
          <button class="preset-btn" onclick={() => applyPreset(i)}>{p.label}</button>
        {/each}
      </div>
    </section>

    <section class="form-section">
      <label class="form-label" for="seed">seed</label>
      <input id="seed" class="form-input" bind:value={seedStr} placeholder="4,4,4,4" />
      <span class="form-hint">Coxeter — ex: 3,4,3,4,3</span>
    </section>

    <section class="form-section">
      <label class="form-label" for="kyklos">kyklos</label>
      <input id="kyklos" class="form-input form-input--num" type="number" min="0" max="12"
             bind:value={kyklos} />
    </section>

    <section class="form-section">
      <label class="form-label" for="radius">radius</label>
      <input id="radius" class="form-input form-input--num" type="number" min="10" max="400"
             bind:value={radius} />
    </section>

    <section class="form-section">
      <label class="form-label" for="delta">delta</label>
      <input id="delta" class="form-input form-input--num" type="number" step="0.01"
             bind:value={delta} />
    </section>

    <section class="form-section">
      <label class="form-label" for="ellipse">ellipse</label>
      <input id="ellipse" class="form-input form-input--num" type="number" step="0.01" min="0.1"
             bind:value={ellipse} />
    </section>

    {#if error}
      <div class="error-box">{error}</div>
    {/if}

    <div class="sidebar-footer">
      <a href="/demo" class="back-link">← demo</a>
    </div>
  </aside>

  <!-- ── Panneau droit : monitor ── -->
  <main class="monitor">
    <JgrBiblio {biblio} {logs} />
  </main>
</div>

<style>
:global(html, body) { height: 100%; margin: 0; }

.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  height: 100vh;
  background: var(--bg-deep);
  color: var(--fg);
}

/* ── Sidebar ── */
.sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
  background: var(--bg-panel);
  overflow-y: auto;
  padding-bottom: 1rem;
}
.sidebar-header {
  padding: 1rem 1.2rem 0.75rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.sidebar-title {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent-hover, #9a8fff);
  letter-spacing: 0.04em;
}
.sidebar-sub {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: #333;
  margin-top: 0.15rem;
  letter-spacing: 0.06em;
}

/* ── Form ── */
.form-section {
  padding: 0.65rem 1.2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.form-input {
  background: var(--bg-deep);
  border: 1px solid #1e1e2a;
  color: #888;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  padding: 0.3rem 0.5rem;
  border-radius: 3px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.form-input:focus { border-color: var(--accent, #6c5fff); color: #bbb; }
.form-input--num { width: 6rem; }
.form-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: #2a2a3a;
  font-style: italic;
}

/* ── Presets ── */
.preset-list { display: flex; flex-direction: column; gap: 0.25rem; }
.preset-btn {
  background: none;
  border: 1px solid #1e1e2a;
  color: #444;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  padding: 0.3rem 0.6rem;
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.1s, color 0.1s;
}
.preset-btn:hover { border-color: var(--accent, #6c5fff); color: #aaa; }

/* ── Error ── */
.error-box {
  margin: 0.75rem 1.2rem 0;
  padding: 0.5rem 0.75rem;
  background: #1a0a0a;
  border: 1px solid #3a1a1a;
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  color: #c05050;
  white-space: pre-wrap;
  word-break: break-word;
}

.sidebar-footer {
  margin-top: auto;
  padding: 1rem 1.2rem 0;
}
.back-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #333;
  text-decoration: none;
}
.back-link:hover { color: #666; }

/* ── Monitor ── */
.monitor {
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
