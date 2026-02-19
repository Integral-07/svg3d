// SVG3DNode → THREE.Object3D の振り分け
// 依存: three, core/ast.ts, primitives.ts

import * as THREE from "three";
import type { SVG3DNode } from "../core/ast.ts";
import { buildBox, applyTransform } from "./primitives.ts";

export function buildObject(node: SVG3DNode): THREE.Object3D | null {
    switch (node.type) {
        case "box":
            return buildBox(node);

        case "group": {
            const group = new THREE.Group();
            applyTransform(group, node);
            for (const child of node.children) {
                const obj = buildObject(child);
                if (obj) group.add(obj);
            }
            return group;
        }

        case "scene":
            return null;
    }
}
