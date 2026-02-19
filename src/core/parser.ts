// XML文字列 → AST
import type { SVG3DAST, SVG3DNode, Defs, MaterialInfo, SceneNode } from "./ast.ts";

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
                elements[name] = Array.from(child.children)
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
            return null;
    }
}