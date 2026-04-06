type $$ComponentProps = {
    label: string;
    pending?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'ghost' | 'danger';
    onclick?: () => void;
};
declare const JgrCta: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrCta = ReturnType<typeof JgrCta>;
export default JgrCta;
