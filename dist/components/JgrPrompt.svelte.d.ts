export type PromptSection = {
    id: string;
    label: string;
    content: string;
    enabled?: boolean;
};
type $$ComponentProps = {
    value?: string;
    placeholder?: string;
    sections?: PromptSection[];
    pending?: boolean;
    onsubmit?: (value: string) => void;
    onchange?: (value: string) => void;
};
declare const JgrPrompt: import("svelte").Component<$$ComponentProps, {}, "value">;
type JgrPrompt = ReturnType<typeof JgrPrompt>;
export default JgrPrompt;
