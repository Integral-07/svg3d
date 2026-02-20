// ASTノード型定義

// 基底型
export interface BaseNode {

    type: string;
    id?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    visible: boolean;
    children: SVG3DNode[];
}

// マテリアル情報
export interface MaterialInfo {

    preset?: string;
    color?:string;
    opacity?: number;
    roughness?:number;
    metalness?:number;
    raw?: Record<string, unknown>;
}

// プリミティブノード
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

// シーン構造ノード
export interface SceneNode extends BaseNode {
    
    type: "scene";
}

export interface GroupNode extends BaseNode {
    
    type: "group";
}

// ルートのAST
export interface SVG3DAST {
    
    type: "svg3d";
    defs: {
    materials: Record<string, MaterialInfo>;
    elements: Record<string, SVG3DNode[]>; // define展開後の子ノード
    };
    scene: SceneNode;
    overlay?: string; // SVGをそのまま文字列で保持
}

export type SVG3DNode =
    | BoxNode | SphereNode | CylinderNode | ConeNode | PlaneNode | TorusNode
    | SceneNode
    | GroupNode;

export type Defs = SVG3DAST["defs"];