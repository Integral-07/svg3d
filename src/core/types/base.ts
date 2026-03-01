import type { SVG3DNode } from "./scene.ts";

export interface BaseNode {
    type: string;
    id?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    visible: boolean;
    children: SVG3DNode[];
}

export interface MaterialInfo {
    preset?: string;
    color?: string;
    opacity?: number;
    roughness?: number;
    metalness?: number;
    raw?: Record<string, unknown>;
}
