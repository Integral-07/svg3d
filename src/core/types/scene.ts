import type { BaseNode, MaterialInfo } from "./base.ts";
import type { BoxNode, SphereNode, CylinderNode, ConeNode, PlaneNode, TorusNode, LatheNode, WedgeNode, ExtrudeNode } from "./primitive.ts";
import type { AmbientLightNode, DirectionalLightNode, PointLightNode, SpotLightNode } from "./light.ts";
import type { CameraNode } from "./camera.ts";

export interface SceneNode extends BaseNode {
    type: "scene";
}

export interface GroupNode extends BaseNode {
    type: "group";
}

export interface CSGStep {
    op: "subtract" | "union" | "intersect";
    shapes: SVG3DNode[];
}

export interface CSGNode extends BaseNode {
    type: "csg";
    base: SVG3DNode;
    steps: CSGStep[];
}

export type SVG3DNode =
    | BoxNode | SphereNode | CylinderNode | ConeNode | PlaneNode | TorusNode
    | LatheNode | WedgeNode | ExtrudeNode
    | AmbientLightNode | DirectionalLightNode | PointLightNode | SpotLightNode
    | CameraNode
    | SceneNode
    | GroupNode
    | CSGNode;

export interface SVG3DAST {
    type: "svg3d";
    defs: {
        materials: Record<string, MaterialInfo>;
        elements: Record<string, SVG3DNode[]>;
    };
    scene: SceneNode;
    overlay?: string;
}

export type Defs = SVG3DAST["defs"];
