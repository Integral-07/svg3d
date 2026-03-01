// SVG3DAST → THREE.Scene（エントリポイント）
// 依存: three, core/ast.ts, scene.ts

import * as THREE from "three";
import type { SVG3DAST, CameraNode } from "../core/ast.ts";
import { buildObject } from "./scene.ts";

export interface SceneResult {
    scene: THREE.Scene;
    camera?: CameraNode;
}

export function toThreeScene(ast: SVG3DAST): SceneResult {
    const threeScene = new THREE.Scene();
    let camera: CameraNode | undefined;

    for (const child of ast.scene.children) {
        if (child.type === "camera") {
            camera = child;
            continue;
        }
        const obj = buildObject(child);
        if (obj) threeScene.add(obj);
    }

    return { scene: threeScene, camera };
}
