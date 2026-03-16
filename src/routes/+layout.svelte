<script>
  import JgrTheme from '$lib/components/JgrTheme.svelte';
  let { children } = $props();
</script>

<JgrTheme>
  {@render children()}
</JgrTheme>
