<script lang="ts">
  import JgrCta from '$lib/components/JgrCta.svelte';
  import JgrItem from '$lib/components/JgrItem.svelte';
  import JgrTabs from '$lib/components/JgrTabs.svelte';
  import JgrConsole from '$lib/components/JgrConsole.svelte';
  import JgrPrompt from '$lib/components/JgrPrompt.svelte';
  import JgrLayout from '$lib/components/JgrLayout.svelte';
  import type { LogEntry } from '$lib/components/JgrConsole.svelte';

  let pending1 = $state(false);
  let pending2 = $state(false);
  let pendingStatic = $state(true);

  function togglePending1() {
    pending1 = true;
    setTimeout(() => { pending1 = false; }, 2000);
  }
  function togglePending2() {
    pending2 = true;
    setTimeout(() => { pending2 = false; }, 2000);
  }

  let activeTab = $state('console');
  const tabs = [
    { id: 'console', label: 'console' },
    { id: 'prompt', label: 'prompt' },
    { id: 'items', label: 'items' },
  ];

  const demoLogs: LogEntry[] = [
    { line: '[system] Démarrage agent...', type: 'system' },
    { line: 'Analyse du contexte', type: 'agent' },
    { line: 'Génération du plan', type: 'agent' },
    { line: 'Plan enregistré dans .agent/tasks/demo.plan.md', type: 'agent' },
  ];

  let promptValue = $state('');
  const demoSections = [
    { id: 'objectif', label: 'Objectif', content: 'Créer un composant JgrPrompt générique sans stores.', enabled: true },
    { id: 'contraintes', label: 'Contraintes', content: 'Pas de stores Svelte. Tout via props/events.', enabled: true },
  ];
</script>

<div style="padding: 2rem; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
  <h1 style="font-size: 1.2rem; color: var(--text-primary); font-family: 'JetBrains Mono', monospace;">jgr-ui / demo</h1>

  <!-- Boutons CTA -->
  <section>
    <h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">JgrCta</h2>
    <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
      <JgrCta label="Primary" onclick={togglePending1} pending={pending1} />
      <JgrCta label="Ghost" variant="ghost" onclick={togglePending2} pending={pending2} />
      <JgrCta label="Danger" variant="danger" />
      <JgrCta label="Disabled" disabled />
      <JgrCta label="Pending" pending={pendingStatic} />
    </div>
  </section>

  <!-- Items -->
  <section>
    <h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">JgrItem</h2>
    <div style="border: 1px solid var(--border); border-radius: 3px; overflow: hidden; max-width: 400px;">
      <JgrItem prefix="#1" title="Créer le repo jgr-ui" labels={[{ name: 'feature', color: '7c6af7' }]} />
      <JgrItem prefix="#2" title="Migrer CtaButton → JgrCta" state="selected" actionLabel="Done" actionDone />
      <JgrItem prefix="#3" title="Tâche en cours" state="pending" actionLabel="Run" actionLoading />
    </div>
  </section>

  <!-- Layout redimensionnable -->
  <section style="padding: 0; overflow: hidden;">
    <h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; padding: 0 2rem; font-family: 'JetBrains Mono', monospace;">JgrLayout</h2>
    <div style="height: 280px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">
      <JgrLayout height="280px" storageKey="demo:layout" leftWidth={180} rightWidth={180}>
        {#snippet topbar()}
          <div style="height: 30px; border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem; gap: 0.5rem; flex-shrink: 0;">
            <span style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em;">topbar</span>
          </div>
        {/snippet}
        {#snippet left()}
          <div style="padding: 0.8rem; height: 100%; box-sizing: border-box;">
            <div style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; margin-bottom: 0.5rem;">colonne gauche</div>
            <div style="font-size: 0.5rem; color: var(--text-dim, #3a3a4a); font-family: 'JetBrains Mono', monospace;">← drag →</div>
          </div>
        {/snippet}
        {#snippet center()}
          <div style="padding: 0.8rem; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="font-size: 0.55rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em;">colonne centre</div>
            <div style="font-size: 0.5rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; line-height: 1.7;">
              Redimensionner les colonnes<br/>en faisant glisser les bordures doubles.
            </div>
          </div>
        {/snippet}
        {#snippet right()}
          <div style="padding: 0.8rem; height: 100%; box-sizing: border-box;">
            <div style="font-size: 0.55rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; margin-bottom: 0.5rem;">colonne droite</div>
            <div style="font-size: 0.5rem; color: var(--text-dim, #3a3a4a); font-family: 'JetBrains Mono', monospace;">← drag →</div>
          </div>
        {/snippet}
        {#snippet footer()}
          <div style="height: 24px; border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 0.8rem; flex-shrink: 0;">
            <span style="font-size: 0.5rem; color: var(--text-dim, #3a3a4a); font-family: 'JetBrains Mono', monospace;">footer</span>
          </div>
        {/snippet}
      </JgrLayout>
    </div>
  </section>

  <!-- Onglets avec console/prompt/items -->
  <section>
    <h2 style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.8rem; font-family: 'JetBrains Mono', monospace;">JgrTabs + JgrConsole + JgrPrompt</h2>
    <div style="height: 360px; border: 1px solid var(--border); border-radius: 3px; overflow: hidden;">
      <JgrTabs {tabs} {activeTab} onchange={id => activeTab = id}>
        {#snippet children(tab)}
          {#if tab === 'console'}
            <JgrConsole logs={demoLogs} title="demo-task" completionLabel="Plan enregistré" />
          {:else if tab === 'prompt'}
            <div style="padding: 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.8rem;">
              <JgrPrompt bind:value={promptValue} sections={demoSections} onsubmit={v => alert('Submit: ' + v)} />
              <div style="font-size: 0.6rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">Valeur : {promptValue}</div>
            </div>
          {:else if tab === 'items'}
            <div>
              <JgrItem prefix="#10" title="Issue exemple avec label long" labels={[{ name: 'bug', color: 'f44336' }, { name: 'ui', color: '4caf50' }]} />
              <JgrItem prefix="#11" title="Autre issue" actionLabel="Ouvrir" />
            </div>
          {/if}
        {/snippet}
      </JgrTabs>
    </div>
  </section>
</div>
