// マテリアルプリセット定義
// 依存: three, core/ast.ts

import * as THREE from "three";
import type { MaterialInfo } from "../core/ast.ts";

const PRESETS: Record<string, THREE.MeshStandardMaterialParameters> = {
    default:   { color: 0xffffff, roughness: 0.5, metalness: 0.0 },
    brick:     { color: 0xcc8844, roughness: 0.9, metalness: 0.0 },
    wood:      { color: 0xc8a060, roughness: 0.8, metalness: 0.0 },
    grass:     { color: 0x4a9e3f, roughness: 1.0, metalness: 0.0 },
    dirt:      { color: 0x8b6340, roughness: 1.0, metalness: 0.0 },
    sand:      { color: 0xe0c97a, roughness: 1.0, metalness: 0.0 },
    rock:      { color: 0x888888, roughness: 0.9, metalness: 0.0 },
    snow:      { color: 0xf0f0f0, roughness: 0.8, metalness: 0.0 },
    water:     { color: 0x3399cc, roughness: 0.1, metalness: 0.0, transparent: true, opacity: 0.8 },
    leaves:    { color: 0x228b22, roughness: 0.9, metalness: 0.0 },
    bark:      { color: 0x5c3317, roughness: 1.0, metalness: 0.0 },
    concrete:  { color: 0xccccbb, roughness: 0.9, metalness: 0.0 },
    glass:     { color: 0xffffff, roughness: 0.0, metalness: 0.0, transparent: true, opacity: 0.3 },
    metal:     { color: 0xaaaaaa, roughness: 0.3, metalness: 0.9 },
    roof:      { color: 0x8b3a3a, roughness: 0.8, metalness: 0.0 },
    emissive:  { color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 },
    wireframe: { color: 0x00ff00, wireframe: true },
};

export function resolveMaterial(info: MaterialInfo): THREE.MeshStandardMaterial {
    const base = PRESETS[info.preset ?? "default"] ?? PRESETS["default"];
    return new THREE.MeshStandardMaterial({
        ...base,
        ...(info.color     !== undefined && { color: new THREE.Color(info.color) }),
        ...(info.opacity   !== undefined && { opacity: info.opacity, transparent: info.opacity < 1 }),
        ...(info.roughness !== undefined && { roughness: info.roughness }),
        ...(info.metalness !== undefined && { metalness: info.metalness }),
    });
}
