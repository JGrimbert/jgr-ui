import type { Snippet } from 'svelte';
export type ListItem = {
    id: string;
    label: string;
    prefix?: string | number;
    labels?: {
        name: string;
        color: string;
    }[];
    dimmed?: boolean;
    actionLabel?: string;
    actionLoading?: boolean;
    actionDone?: boolean;
    onaction?: () => void;
    onclose?: { handler: () => void; loading?: boolean; done?: boolean };
};
export type TabDef = {
    id: string;
    label: string;
    /** Undefined = onglet à contenu libre (customcontent snippet) */
    items?: ListItem[];
    /** Id de l'item sélectionné — affiche le snippet detail en-dessous */
    selectedId?: string;
    cta?: {
        label: string;
        onclick: () => void;
    };
    /** Toute la liste passe en stale (opacité réduite, interactions bloquées) */
    pending?: boolean;
    loading?: boolean;
    empty?: string;
};
type $$ComponentProps = {
    tabs: TabDef[];
    activeTab?: string;
    ontabchange?: (id: string) => void;
    onselect?: (tabId: string, item: ListItem) => void;
    /** Snippet rendu inline sous l'item sélectionné : (tabId, itemId) */
    detail?: Snippet<[string, string]>;
    /** Snippet rendu pour un onglet sans items : (tabId) */
    customcontent?: Snippet<[string]>;
};
declare const JgrTabList: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrTabList = ReturnType<typeof JgrTabList>;
export default JgrTabList;
