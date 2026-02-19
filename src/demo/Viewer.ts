// Three.js の初期化・描画ループ
// 依存: three

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export class Viewer {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private controls: OrbitControls;

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000,
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x222222);

        // デフォルトライト
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        const directional = new THREE.DirectionalLight(0xffffff, 1);
        directional.position.set(10, 20, 10);
        this.scene.add(ambient, directional);

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;

        this.animate();
    }

    setScene(scene: THREE.Scene) {
        this.scene = scene;

        // ライトを引き継ぐ
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        const directional = new THREE.DirectionalLight(0xffffff, 1);
        directional.position.set(10, 20, 10);
        this.scene.add(ambient, directional);
    }

    private animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
