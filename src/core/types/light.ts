import type { BaseNode } from "./base.ts";

export interface AmbientLightNode extends BaseNode {
    type: "ambient-light";
    color: string;
    intensity: number;
}

export interface DirectionalLightNode extends BaseNode {
    type: "directional-light";
    color: string;
    intensity: number;
}

export interface PointLightNode extends BaseNode {
    type: "point-light";
    color: string;
    intensity: number;
    distance: number;
    decay: number;
}

export interface SpotLightNode extends BaseNode {
    type: "spot-light";
    color: string;
    intensity: number;
    distance: number;
    angle: number;
    penumbra: number;
    target: [number, number, number];
}
