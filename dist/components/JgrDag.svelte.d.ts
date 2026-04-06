import type { RoadmapData } from './JgrRoadmap.svelte';
type $$ComponentProps = {
    roadmap: RoadmapData;
    activeIds?: number[];
    onNodeClick?: (id: number) => void;
    gravityMode?: boolean;
    showIsolated?: boolean;
};
declare const JgrDag: import("svelte").Component<$$ComponentProps, {}, "">;
type JgrDag = ReturnType<typeof JgrDag>;
export default JgrDag;
