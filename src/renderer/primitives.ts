// プリミティブノード → THREE.Mesh
// 依存: three, core/ast.ts, materials.ts

import * as THREE from "three";
import type { BoxNode, SphereNode, CylinderNode, ConeNode, PlaneNode, TorusNode, LatheNode, WedgeNode, ExtrudeNode, BaseNode } from "../core/ast.ts";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
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

export function buildLathe(node: LatheNode): THREE.Mesh {
    const points = node.points.map(([x, y]) => new THREE.Vector2(x, y));
    const geo = new THREE.LatheGeometry(points, node.segments);
    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}

export function buildWedge(node: WedgeNode): THREE.Mesh {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(node.depth, 0);
    shape.lineTo(0, node.height);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, { depth: node.width, bevelEnabled: false });
    geo.rotateY(-Math.PI / 2);
    geo.translate(node.width / 2, -node.height / 2, -node.depth / 2);

    const mat = resolveMaterial(node.material);
    const mesh = new THREE.Mesh(geo, mat);
    applyTransform(mesh, node);
    return mesh;
}

export function buildExtrude(node: ExtrudeNode): THREE.Group {
    const loader = new SVGLoader();
    const svgData = loader.parse(
        `<svg xmlns="http://www.w3.org/2000/svg"><path d="${node.path}"/></svg>`
    );
    const mat = resolveMaterial(node.material);
    const group = new THREE.Group();

    for (const path of svgData.paths) {
        for (const shape of SVGLoader.createShapes(path)) {
            const geo = new THREE.ExtrudeGeometry(shape, { depth: node.depth, bevelEnabled: false });
            group.add(new THREE.Mesh(geo, mat));
        }
    }

    applyTransform(group, node);
    return group;
}

