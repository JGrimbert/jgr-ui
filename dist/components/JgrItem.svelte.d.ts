type $$ComponentProps = {
    title?: string;
    prefix?: string | number;
    labels?: Array<{
        name: string;
        color: string;
    }>;
    state?: 'default' | 'hover' | 'selected' | 'pending';
    actionLabel?: string;
    actionDone?: boolean;
    actionLoading?: boolean;
    onaction?: () => void;
    onselect?: () => void;
};
declare const JgrItem: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrItem = ReturnType<typeof JgrItem>;
export default JgrItem;
