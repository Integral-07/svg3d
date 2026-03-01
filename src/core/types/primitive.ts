import type { BaseNode, MaterialInfo } from "./base.ts";

export interface BoxNode extends BaseNode {
    type: "box";
    width: number;
    height: number;
    depth: number;
    material: MaterialInfo;
}

export interface SphereNode extends BaseNode {
    type: "sphere";
    radius: number;
    material: MaterialInfo;
}

export interface CylinderNode extends BaseNode {
    type: "cylinder";
    radius: number;
    height: number;
    material: MaterialInfo;
}

export interface ConeNode extends BaseNode {
    type: "cone";
    radius: number;
    height: number;
    material: MaterialInfo;
}

export interface PlaneNode extends BaseNode {
    type: "plane";
    width: number;
    depth: number;
    material: MaterialInfo;
}

export interface TorusNode extends BaseNode {
    type: "torus";
    radius: number;
    tube: number;
    material: MaterialInfo;
}

export interface LatheNode extends BaseNode {
    type: "lathe";
    points: [number, number][];
    segments: number;
    material: MaterialInfo;
}

export interface WedgeNode extends BaseNode {
    type: "wedge";
    width: number;
    height: number;
    depth: number;
    material: MaterialInfo;
}

export interface ExtrudeNode extends BaseNode {
    type: "extrude";
    path: string;
    depth: number;
    material: MaterialInfo;
}
