<script lang="ts">
  let {
    label,
    pending = false,
    disabled = false,
    variant = 'primary',
    onclick,
  }: {
    label: string;
    pending?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'ghost' | 'danger';
    onclick?: () => void;
  } = $props();

  const FRAMES = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  let spinFrame = $state(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  $effect(() => {
    if (pending && !timer) {
      timer = setInterval(() => { spinFrame = (spinFrame + 1) % FRAMES.length; }, 100);
    } else if (!pending && timer) {
      clearInterval(timer);
      timer = null;
      spinFrame = 0;
    }
    return () => { if (timer) { clearInterval(timer); timer = null; } };
  });
</script>

<button
  class="cta-btn"
  class:ghost={variant === 'ghost'}
  class:danger={variant === 'danger'}
  disabled={disabled || pending}
  {onclick}
>
  {#if pending}<span class="cta-spin">{FRAMES[spinFrame]}</span>{/if}
  <span class="cta-label">{label}</span><span class="cta-arrow">→</span>
</button>

<style>
.cta-btn {
  background: #1e1540;
  border: 1px solid #3a2e70;
  border-radius: 3px;
  font-size: 0.65rem;
  padding: 0.3rem 0.9rem;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
}
.cta-btn.ghost {
  background: none;
  border-color: var(--border-strong);
}
.cta-btn.danger {
  background: #1a0a0a;
  border-color: #5a2a2a;
}
.cta-spin {
  color: cornsilk;
  font-size: 0.65rem;
  margin-right: 0.3rem;
  opacity: 0.8;
}
.cta-label { color: var(--color-impl, #7c6af7); }
.cta-btn.ghost .cta-label { color: var(--text-secondary); }
.cta-btn.danger .cta-label { color: #e07070; }
.cta-arrow { color: #fff; margin-left: 0.35em; }
.cta-btn.danger .cta-arrow { color: #e07070; }
.cta-btn:hover:not(:disabled) { background: #2a1e58; border-color: #5a4a9a; }
.cta-btn.ghost:hover:not(:disabled) { background: var(--bg-subtle); }
.cta-btn.danger:hover:not(:disabled) { background: #280a0a; border-color: #8a3a3a; }
.cta-btn:disabled { opacity: 0.35; cursor: default; }
</style>
