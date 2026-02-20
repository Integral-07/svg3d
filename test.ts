import { parse } from "./src/core/parser.ts";

const xml = `<svg3d xmlns="http://www.svg3d.org">
  <scene>
    <box width="2" height="2" depth="2" position="0 1 0" material="brick"/>
    <sphere radius="2" position="2 2 0" />
  </scene>
</svg3d>`;

const dom = parse(xml);
console.log(JSON.stringify(dom, null, 2));
