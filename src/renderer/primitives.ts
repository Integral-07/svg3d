// プリミティブノード → THREE.Mesh
// 依存: three, core/ast.ts, materials.ts

import * as THREE from "three";
import type { BoxNode, SphereNode, CylinderNode, ConeNode, PlaneNode, TorusNode, BaseNode } from "../core/ast.ts";
import { resolveMaterial } from "./materials.ts";

export function applyTransform(obj: THREE.Object3D, node: BaseNode) {
    obj.position.set(...node.position);
    obj.rotation.set(
        THREE.MathUtils.degToRad(node.rotation[0]),
        THREE.MathUtils.degToRad(node.rotation[1]),
        THREE.MathUtils.degToRad(node.rotation[2]),
    );
    obj.scale.set(...node.scale);
    obj.visible = node.visible;
    if (node.id) obj.name = node.id;
}

export function buildBox(node: BoxNode): THREE.Mesh {
    const geo = new THREE.BoxGeometry(node.width, node.height, node.depth);
    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}

export function buildSphere(node: SphereNode): THREE.Mesh {
    const geo = new THREE.SphereGeometry(node.radius, 32, 32);
    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}

export function buildCylinder(node: CylinderNode): THREE.Mesh {
    const geo = new THREE.CylinderGeometry(node.radius, node.radius, node.height, 32);
    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}

export function buildCone(node: ConeNode): THREE.Mesh {
    const geo = new THREE.CylinderGeometry(0, node.radius, node.height, 32);
    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}

export function buildPlane(node: PlaneNode): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(node.width, node.depth);
    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}

export function buildTorus(node: TorusNode): THREE.Mesh {
    const geo = new THREE.TorusGeometry(node.radius, node.tube, 16, 100);
    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}