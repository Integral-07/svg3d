// SVG3DNode → THREE.Object3D の振り分け
// 依存: three, core/ast.ts, primitives.ts

import * as THREE from "three";
import type { CSGStep, CSGNode, SVG3DNode } from "../core/ast.ts";
import { buildBox, buildSphere, buildCylinder, buildCone, buildPlane, buildTorus, buildLathe, buildWedge, buildExtrude, applyTransform } from "./primitives.ts";
import { Brush, Evaluator, SUBTRACTION, ADDITION, INTERSECTION } from "three-bvh-csg"; 

export function buildObject(node: SVG3DNode): THREE.Object3D | null {
    switch (node.type) {
        case "csg":
            return buildCSG(node);

        case "box":
            return buildBox(node);

        case "sphere":
            return buildSphere(node);

        case "cylinder":
            return buildCylinder(node);

        case "cone":
            return buildCone(node);

        case "plane":
            return buildPlane(node);

        case "torus":
            return buildTorus(node);

        case "lathe":
            return buildLathe(node);

        case "wedge":
            return buildWedge(node);

        case "extrude":
            return buildExtrude(node);

        case "group": {
            const group = new THREE.Group();
            applyTransform(group, node);
            for (const child of node.children) {
                const obj = buildObject(child);
                if (obj) group.add(obj);
            }
            return group;
        }

        case "ambient-light":
            return new THREE.AmbientLight(node.color, node.intensity);

        case "directional-light": {
            const light = new THREE.DirectionalLight(node.color, node.intensity);                                                              
            light.position.set(...node.position);                                                                                                
            return light; 
        }

        case "point-light": {
            const light = new THREE.PointLight(node.color, node.intensity, node.distance, node.decay);
            light.position.set(...node.position);
            return light;
        }

        case "spot-light": {
            const light = new THREE.SpotLight(node.color, node.intensity, node.distance, THREE.MathUtils.degToRad(node.angle), node.penumbra);
            light.position.set(...node.position);
            light.target.position.set(...node.target);
            return light;
        }

        case "scene":
        case "camera":
            return null;
    }
}

export function buildCSG(node: CSGNode): THREE.Mesh {

    const evaluator = new Evaluator();

    const baseMesh = buildObject(node.base) as THREE.Mesh;
    const baseBrush = new Brush(baseMesh.geometry, baseMesh.material);
    baseBrush.position.copy(baseMesh.position);
    baseBrush.rotation.copy(baseMesh.rotation);
    baseBrush.scale.copy(baseMesh.scale);
    baseBrush.updateMatrixWorld();

    const OP_MAP = { subtract: SUBTRACTION, union: ADDITION, intersect: INTERSECTION };
    
    let resultBrush = baseBrush;
    for (const step of node.steps){
        for (const shape of step.shapes){
            
            const shapeMesh = buildObject(shape) as THREE.Mesh;
            const shapeBrush = new Brush(shapeMesh.geometry, shapeMesh.material);
            shapeBrush.position.copy(shapeMesh.position);
            shapeBrush.rotation.copy(shapeMesh.rotation);
            shapeBrush.scale.copy(shapeMesh.scale);
            shapeBrush.updateMatrixWorld();
            
            resultBrush = evaluator.evaluate(resultBrush, shapeBrush, OP_MAP[step.op]);
        }
    }

    applyTransform(resultBrush, node);
    return resultBrush;
}