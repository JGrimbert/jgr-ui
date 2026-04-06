type $$ComponentProps = {
    title?: string;
    prefix?: string | number;
    labels?: Array<{
        name: string;
        color: string;
    }>;
    issues?: number[];
    state?: 'default' | 'hover' | 'selected' | 'pending';
    actionLabel?: string;
    actionDone?: boolean;
    actionLoading?: boolean;
    onaction?: () => void;
    onselect?: () => void;
    onissueclick?: (n: number) => void;
};
declare const JgrItem: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrItem = ReturnType<typeof JgrItem>;
export default JgrItem;
