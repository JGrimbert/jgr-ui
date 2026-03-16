import type { Snippet } from 'svelte';
type $$ComponentProps = {
    children: Snippet;
    variant?: 'back' | 'cmd' | 'file';
    active?: boolean;
    disabled?: boolean;
    title?: string;
    onclick?: () => void;
};
declare const JgrBtn: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrBtn = ReturnType<typeof JgrBtn>;
export default JgrBtn;
