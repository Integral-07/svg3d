// SVG3DAST → THREE.Scene（エントリポイント）
// 依存: three, core/ast.ts, scene.ts

import * as THREE from "three";
import type { SVG3DAST } from "../core/ast.ts";
import { buildObject } from "./scene.ts";

export function toThreeScene(ast: SVG3DAST): THREE.Scene {
    const threeScene = new THREE.Scene();

    for (const child of ast.scene.children) {
        const obj = buildObject(child);
        if (obj) threeScene.add(obj);
    }

    return threeScene;
}
