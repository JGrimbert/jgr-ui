export type LogEntry = {
    line: string;
    type: 'agent' | 'system' | 'error' | string;
};
type $$ComponentProps = {
    logs?: LogEntry[];
    running?: boolean;
    title?: string;
    completionLabel?: string;
    sessionAlive?: boolean;
    showInput?: boolean;
    oninterrupt?: () => void;
    onterminate?: () => void;
    ondismiss?: () => void;
    oninput?: (text: string) => void;
};
declare const JgrConsole: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrConsole = ReturnType<typeof JgrConsole>;
export default JgrConsole;
