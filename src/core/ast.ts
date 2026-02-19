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
    | BoxNode
    | SceneNode
    | GroupNode;

export type Defs = SVG3DAST["defs"];