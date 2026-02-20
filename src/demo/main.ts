// デモエントリポイント
// 依存: core/parser.ts, renderer/adapter.ts, Viewer.ts

import { parse } from "../core/parser.ts";
import { toThreeScene } from "../renderer/adapter.ts";
import { Viewer } from "./Viewer.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const viewer = new Viewer(canvas);

const xml = `<svg3d xmlns="http://www.svg3d.org">
  <defs>
    <define name="tree">
      <group>
        <cylinder radius="0.15" height="2" position="0 1 0" material="bark"/>
        <cone radius="1.5" height="1.5" position="0 2.5 0" material="leaves"/>
        <cone radius="1.2" height="1.5" position="0 3.5 0" material="leaves"/>
        <cone radius="0.8" height="1.2" position="0 4.5 0" material="leaves"/>
        <cone radius="0.4" height="1.0" position="0 5.3 0" material="leaves"/>
      </group>
    </define>

    <define name="house">
      <group>
        <box width="5" height="3" depth="4" position="0 1.5 0" material="brick"/>
        <cone radius="3.2" height="2" position="0 4 0" material="roof"/>
      </group>
    </define>
  </defs>

  <scene>
    <plane width="30" depth="30" material="grass" rotation="-90 0 0"/>
    <house position="0 0 0"/>
    <tree position="5 0 2"/>
    <tree position="-5 0 3"/>
  </scene>
</svg3d>`;

const ast = parse(xml);
const scene = toThreeScene(ast);
viewer.setScene(scene);
