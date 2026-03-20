export type RoadmapStep = {
    id: number;
    label: string;
    skill: string;
    nodes: string[];
    files: string[];
    rationale: string;
    dependsOnSteps: number[];
    issues?: number[];
    isSpine?: boolean;
    concept?: string;
    pattern?: string;
    coalNodeId?: string;
};
export type RoadmapData = {
    steps: RoadmapStep[];
    spine: string[];
    stats: {
        nodes: number;
        edges: number;
        levels: number;
        steps: number;
    };
    concepts?: Array<{
        id: string;
        name: string;
        skill: string;
        nodes: string[];
    }>;
};
export type IssueCluster = {
    keyword: string;
    keywords: string[];
    issues: number[];
    score: number;
    hasParent: boolean;
};
type $$ComponentProps = {
    roadmap?: RoadmapData;
    clusters?: IssueCluster[];
    status?: 'loading' | 'ok' | 'empty' | 'generating' | 'error';
    generatedAt?: string;
    onRegenerate?: () => void;
    onissuefilter?: (issues: number[]) => void;
    ontabchange?: (issues: number[]) => void;
    onissueclick?: (n: number) => void;
};
declare const JgrRoadmap: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrRoadmap = ReturnType<typeof JgrRoadmap>;
export default JgrRoadmap;
