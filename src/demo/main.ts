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

    <define name="window">
      <group>
        <!-- ガラス -->
        <box width="1.2" height="1" depth="0.05" material="glass"/>
        <!-- 上枠 -->
        <box width="1.4" height="0.12" depth="0.12" position="0 0.56 0" material="wood"/>
        <!-- 下枠 -->
        <box width="1.4" height="0.12" depth="0.12" position="0 -0.56 0" material="wood"/>
        <!-- 左枠 -->
        <box width="0.12" height="1.24" depth="0.12" position="-0.66 0 0" material="wood"/>
        <!-- 右枠 -->
        <box width="0.12" height="1.24" depth="0.12" position="0.66 0 0" material="wood"/>
      </group>
    </define>

    <define name="house">
      <group>
        <!-- 壁 -->
        <box width="8" height="4" depth="6" position="0 2 0" material="brick"/>

        <!-- 屋根（前後2つのwedgeで切妻屋根） -->
        <wedge width="8" height="2.5" depth="3" position="0 4 0" material="roof"/>
        <wedge width="8" height="2.5" depth="3" position="0 4 0" rotation="0 180 0" material="roof"/>

        <!-- 煙突 -->
        <box width="0.8" height="2.5" depth="0.8" position="2.5 5.2 -1" material="brick"/>
        <box width="1.1" height="0.2" depth="1.1" position="2.5 6.6 -1" material="concrete"/>

        <!-- ドア -->
        <box width="1.1" height="2.2" depth="0.08" position="0 1.1 3.04" material="wood"/>
        <!-- ドア上枠 -->
        <box width="1.3" height="0.15" depth="0.12" position="0 2.27 3.04" material="wood"/>
        <!-- ドア左枠 -->
        <box width="0.12" height="2.2" depth="0.12" position="-0.61 1.1 3.04" material="wood"/>
        <!-- ドア右枠 -->
        <box width="0.12" height="2.2" depth="0.12" position="0.61 1.1 3.04" material="wood"/>

        <!-- 窓（左） -->
        <window position="-2.8 2.5 3.04"/>
        <!-- 窓（右） -->
        <window position="2.8 2.5 3.04"/>

        <!-- 階段 -->
        <box width="2.5" height="0.18" depth="0.7" position="0 0.18 3.7" material="concrete"/>
        <box width="3"   height="0.18" depth="0.7" position="0 0    4.4" material="concrete"/>

        <!-- ポーチ柱 -->
        <cylinder radius="0.1" height="1" position="-0.8 0.5 3.5" material="concrete"/>
        <cylinder radius="0.1" height="1" position=" 0.8 0.5 3.5" material="concrete"/>
      </group>
    </define>
  </defs>

  <scene>
    <plane width="50" depth="50" material="grass" rotation="-90 0 0"/>
    <house position="0 0 0"/>
    <tree position="8 0 2"/>
    <tree position="-8 0 3"/>
    <tree position="10 0 -2"/>
  </scene>
</svg3d>`;

const ast = parse(xml);
const scene = toThreeScene(ast);
viewer.setScene(scene);
