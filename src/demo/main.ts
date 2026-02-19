// デモエントリポイント
// 依存: core/parser.ts, renderer/adapter.ts, Viewer.ts

import { parse } from "../core/parser.ts";
import { toThreeScene } from "../renderer/adapter.ts";
import { Viewer } from "./Viewer.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const viewer = new Viewer(canvas);

const xml = `<svg3d xmlns="http://www.svg3d.org">
  <scene>
    <box width="2" height="2" depth="2" position="0 1 0" material="brick"/>
  </scene>
</svg3d>`;

const ast = parse(xml);
const scene = toThreeScene(ast);
viewer.setScene(scene);
