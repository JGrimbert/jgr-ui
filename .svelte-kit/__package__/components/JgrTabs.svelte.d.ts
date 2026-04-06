import type { Snippet } from 'svelte';
type $$ComponentProps = {
    tabs: {
        id: string;
        label: string;
    }[];
    activeTab: string;
    onchange?: (id: string) => void;
    children?: Snippet<[string]>;
};
declare const JgrTabs: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrTabs = ReturnType<typeof JgrTabs>;
export default JgrTabs;
