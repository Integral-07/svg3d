// デモエントリポイント
// 依存: core/parser.ts, renderer/adapter.ts, Viewer.ts

import { parse } from "../core/parser.ts";
import { toThreeScene } from "../renderer/adapter.ts";
import { Viewer } from "./Viewer.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const viewer = new Viewer(canvas);

const xml = `<svg3d xmlns="http://www.svg3d.org">
  <scene>

    <plane width="30" depth="30" material="grass" rotation="-90 0 0"/>

    <group id="house" position="0 0 0">
      <box width="5" height="3" depth="4" position="0 1.5 0" material="brick"/>
      <cone radius="3.2" height="2" position="0 4 0" material="roof"/>
    </group>

    <group id="tree1" position="5 0 2">
      <cylinder radius="0.2" height="3" position="0 1.5 0" material="bark"/>
      <sphere radius="1.2" position="0 3.5 0" material="leaves"/>
    </group>

    <group id="tree2" position="-5 0 3">
      <cylinder radius="0.2" height="2.5" position="0 1.25 0" material="bark"/>
      <sphere radius="1" position="0 3 0" material="leaves"/>
    </group>

  </scene>
</svg3d>`;

const ast = parse(xml);
const scene = toThreeScene(ast);
viewer.setScene(scene);
