<script lang="ts">
  import { onMount } from 'svelte';

  const themes = [
    { id: 'deep',  label: 'Deep',  color: '#16161e' },
    { id: 'dark',  label: 'Dark',  color: '#24273a' },
    { id: 'dim',   label: 'Dim',   color: '#22223a' },
    { id: 'light', label: 'Light', color: '#f0f0f5' },
  ] as const;

  type ThemeId = typeof themes[number]['id'];

  let current = $state<ThemeId>('deep');

  onMount(() => {
    current = (localStorage.getItem('jgr-theme') ?? 'deep') as ThemeId;
  });

  function pick(id: ThemeId) {
    current = id;
    document.documentElement.dataset.theme = id;
    localStorage.setItem('jgr-theme', id);
  }
</script>

<div class="swatches">
  {#each themes as t}
    <button
      class="swatch"
      class:active={current === t.id}
      title={t.label}
      style="background: {t.color}"
      onclick={() => pick(t.id)}
    ></button>
  {/each}
</div>

<style>
.swatches {
  display: flex;
  align-items: center;
  gap: 4px;
}
.swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1.5px solid #444;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: border-color 0.15s, transform 0.1s;
}
.swatch:hover {
  transform: scale(1.2);
  border-color: #888;
}
.swatch.active {
  border-color: var(--accent, #7c6af7);
}
</style>
