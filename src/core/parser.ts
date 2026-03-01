// XML文字列 → AST
import type { SVG3DAST, SVG3DNode, Defs, MaterialInfo, SceneNode, AmbientLightNode } from "./ast.ts";

// 環境を自動判定して切り替え
const { DOMParser, XMLSerializer } = typeof window !== "undefined"
  ? { DOMParser: window.DOMParser, XMLSerializer: window.XMLSerializer }
  : await import("@xmldom/xmldom");

const parser = new DOMParser();
const serializer = new XMLSerializer();

export function parse(xmlString: string): SVG3DAST {

    const dom = parser.parseFromString(xmlString, "text/xml");
    const root = dom.getElementsByTagName("svg3d")[0];
    if (!root) throw new Error("<svg3d> 要素が見つかりません");

    // defsを先読み
    const defs = parseDefs(root.getElementsByTagName("defs")[0] ?? null);

    // sceneをwalkNode
    const sceneEl = root.getElementsByTagName("scene")[0];
    if (!sceneEl) throw new Error("<scene> 要素が見つかりません");
    const sceneNode = walkNode(sceneEl, defs);
    if (!sceneNode || sceneNode.type !== "scene") throw new Error("<scene> のパースに失敗しました");
    const scene: SceneNode = sceneNode;

    // overlayはSVGをそのまま文字列で保持
    const overlayEl = root.getElementsByTagName("overlay")[0] ?? null;
    const overlay = overlayEl
        ? Array.from(overlayEl.childNodes)
            .map(n => serializer.serializeToString(n))
            .join("")
        : undefined;

    return { type: "svg3d", defs, scene, overlay };
}

function parseDefs(defsEl: Element | null): Defs {
    const materials: Defs["materials"] = {};
    const elements: Defs["elements"] = {};

    if (!defsEl) return { materials, elements };

    for (const child of Array.from(defsEl.childNodes).filter((n): n is Element => n.nodeType === 1)) {
        const tag = child.tagName.toLowerCase();

        if (tag === "material") {
            const id = child.getAttribute("id");
            if (id) materials[id] = parseMaterialAttr(child);
        } else if (tag === "define") {
            const name = child.getAttribute("name");
            if (name) {
                elements[name] = Array.from(child.childNodes)
                    .filter((n): n is Element => n.nodeType === 1)
                    .map(c => walkNode(c, { materials, elements }))
                    .filter((n): n is SVG3DNode => n !== null);
            }
        }
    }

    return { materials, elements };
}

function parseVec3(attr: string | null, def: [number, number, number]): [number, number, number] {
    if (!attr) return def;
    const parts = attr.trim().split(/\s+/).map(s => Number(s));
    return [parts[0] ?? def[0], parts[1] ?? def[1], parts[2] ?? def[2]];
}

function parseBaseAttrs(el: Element) {
    return {
        id: el.getAttribute("id") ?? undefined,
        position: parseVec3(el.getAttribute("position"), [0, 0, 0]),
        rotation: parseVec3(el.getAttribute("rotation"), [0, 0, 0]),
        scale: parseVec3(el.getAttribute("scale"), [1, 1, 1]),
        visible: el.getAttribute("visible") !== "false",
    };
}

function parseMaterialAttr(el: Element): MaterialInfo {
    return {
        preset: el.getAttribute("material") ?? el.getAttribute("base") ?? undefined,
        color: el.getAttribute("color") ?? undefined,
        opacity: el.getAttribute("opacity") !== null ? Number(el.getAttribute("opacity")) : undefined,
        roughness: el.getAttribute("roughness") !== null ? Number(el.getAttribute("roughness")) : undefined,
        metalness: el.getAttribute("metalness") !== null ? Number(el.getAttribute("metalness")) : undefined,
    };
}

function walkNode(el: Element, defs: Defs): SVG3DNode | null {

    const tag = el.tagName.toLowerCase();

    switch (tag) {
        case "csg": {

            const children = Array.from(el.childNodes).filter((n): n is Element => n.nodeType === 1 );
            const [firstChild, ...rest] = children;

            const base = walkNode(firstChild, defs);
            if (!base) throw new Error("csgのベース要素が不正です");

            return {

                type: "csg",
                ...parseBaseAttrs(el),
                base,
                steps: rest.map(child => ({
                    op: child.tagName as "subtract" | "union" | "intersect",
                    shapes: Array.from(child.childNodes)
                        .filter((n): n is Element => n.nodeType === 1)
                        .map(c => walkNode(c, defs))
                        .filter((n): n is SVG3DNode => n !== null)
                })),
                children: []
            }
        }

        case "box":
            return {
                type: "box",
                ...parseBaseAttrs(el),
                width: Number(el.getAttribute("width") ?? 1),
                height: Number(el.getAttribute("height") ?? 1),
                depth: Number(el.getAttribute("depth") ?? 1),
                material: parseMaterialAttr(el),
                children: Array.from(el.childNodes)
                    .filter((n): n is Element => n.nodeType === 1)
                    .map(child => walkNode(child, defs))
                    .filter((n): n is SVG3DNode => n !== null),
            };

        case "sphere":
            return {
                type: "sphere",
                ...parseBaseAttrs(el),
                radius: Number(el.getAttribute("radius") ?? 1),
                material: parseMaterialAttr(el),
                children: Array.from(el.childNodes)
                    .filter((n): n is Element => n.nodeType === 1)
                    .map(child => walkNode(child, defs))
                    .filter((n): n is SVG3DNode => n !== null),
            };

        case "cylinder":
            return {
                type: "cylinder",
                ...parseBaseAttrs(el),
                radius: Number(el.getAttribute("radius") ?? 1),
                height: Number(el.getAttribute("height") ?? 1),
                material: parseMaterialAttr(el),
                children: Array.from(el.childNodes)
                    .filter((n): n is Element => n.nodeType === 1)
                    .map(child => walkNode(child, defs))
                    .filter((n): n is SVG3DNode => n !== null),
            }

        case "cone":
            return {
                type: "cone",
                ...parseBaseAttrs(el),
                radius: Number(el.getAttribute("radius") ?? 1),
                height: Number(el.getAttribute("height") ?? 1),
                material: parseMaterialAttr(el),
                children: [],
            };

        case "plane":
            return {
                type: "plane",
                ...parseBaseAttrs(el),
                width: Number(el.getAttribute("width") ?? 1),
                depth: Number(el.getAttribute("depth") ?? 1),
                material: parseMaterialAttr(el),
                children: [],
            };

        case "torus":
            return {
                type: "torus",
                ...parseBaseAttrs(el),
                radius: Number(el.getAttribute("radius") ?? 1),
                tube: Number(el.getAttribute("tube") ?? 0.4),
                material: parseMaterialAttr(el),
                children: [],
            };

        case "lathe": {
            const pointsAttr = el.getAttribute("points") ?? "0 0, 1 0";
            const points: [number, number][] = pointsAttr.split(",").map(pair => {
                const [x, y] = pair.trim().split(/\s+/).map(s => Number(s));
                return [x ?? 0, y ?? 0];
            });
            return {
                type: "lathe",
                ...parseBaseAttrs(el),
                points,
                segments: Number(el.getAttribute("segments") ?? 32),
                material: parseMaterialAttr(el),
                children: [],
            };
        }

        case "wedge":
            return {
                type: "wedge",
                ...parseBaseAttrs(el),
                width: Number(el.getAttribute("width") ?? 1),
                height: Number(el.getAttribute("height") ?? 1),
                depth: Number(el.getAttribute("depth") ?? 1),
                material: parseMaterialAttr(el),
                children: [],
            };

        case "extrude": {
            const childEls = Array.from(el.childNodes).filter((n): n is Element => n.nodeType === 1);
            const svgEl = childEls.find(n => n.tagName.toLowerCase() === "svg");
            const pathEls = svgEl
                ? Array.from(svgEl.childNodes).filter((n): n is Element => n.nodeType === 1)
                : [];
            const pathEl = pathEls.find(n => n.tagName.toLowerCase() === "path");
            return {
                type: "extrude",
                ...parseBaseAttrs(el),
                path: pathEl?.getAttribute("d") ?? "",
                depth: Number(el.getAttribute("depth") ?? 1),
                material: parseMaterialAttr(el),
                children: [],
            };
        }

        case "camera":
            return {
                type: "camera",
                id: el.getAttribute("id") ?? undefined,
                position: parseVec3(el.getAttribute("position"), [0, 5, 10]),
                target: parseVec3(el.getAttribute("target"), [0, 0, 0]),
                fov: Number(el.getAttribute("fov") ?? 75),
                near: Number(el.getAttribute("near") ?? 0.1),
                far: Number(el.getAttribute("far") ?? 1000),
            };

        case "ambient-light":
            return {
                type: "ambient-light",
                ...parseBaseAttrs(el),
                color: el.getAttribute("color") ?? "#ffffff",
                intensity: Number(el.getAttribute("intensity") ?? 1),
                children: [],
            };

        case "directional-light":
            return {
                type: "directional-light",
                ...parseBaseAttrs(el),
                color: el.getAttribute("color") ?? "#ffffff",
                intensity: Number(el.getAttribute("intensity") ?? 1),
                children: [],
            };

        case "point-light":
            return {
                type: "point-light",
                ...parseBaseAttrs(el),
                color: el.getAttribute("color") ?? "#ffffff",
                intensity: Number(el.getAttribute("intensity") ?? 1),
                distance: Number(el.getAttribute("distance") ?? 0),
                decay: Number(el.getAttribute("decay") ?? 2),
                children: [],
            }

        case "spot-light":
            return {
                type: "spot-light",
                ...parseBaseAttrs(el),
                color: el.getAttribute("color") ?? "#ffffff",
                intensity: Number(el.getAttribute("intensity") ?? 1),
                distance: Number(el.getAttribute("distance") ?? 0),
                angle: Number(el.getAttribute("angle") ?? 30),
                penumbra: Number(el.getAttribute("penumbra") ?? 0),
                target: parseVec3(el.getAttribute("target"), [0, 0, 0]),
                children: [],
            }

        case "scene":
            return {
                type: "scene",
                ...parseBaseAttrs(el),
                children: Array.from(el.childNodes)
                    .filter((n): n is Element => n.nodeType === 1)
                    .map(child => walkNode(child, defs))
                    .filter((n): n is SVG3DNode => n !== null),
            };

        case "group":
            return {
                type: "group",
                ...parseBaseAttrs(el),
                children: Array.from(el.childNodes)
                    .filter((n): n is Element => n.nodeType === 1)
                    .map(child => walkNode(child, defs))
                    .filter((n): n is SVG3DNode => n !== null),
            };

        default:
            if (defs.elements[tag]) {
                return {
                    type: "group",
                    ...parseBaseAttrs(el),
                    children: defs.elements[tag],
                };
            }
            return null;
    }
}