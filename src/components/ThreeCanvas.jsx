import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ThreeCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        /**
         * Base
         */

        // canvas
        const canvas = canvasRef.current;

        // size
        const size = {
            width: 800,
            height: 600,
        };

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const ratio = size.width / size.height;
        const camera = new THREE.PerspectiveCamera(75, ratio);
        camera.position.set(1, 1, 5);

        // OrbitControls
        const control = new OrbitControls(camera, canvas);
        control.enableDamping = true;

        /**
         * objects
         */
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // Object
        const group = new THREE.Group();
        scene.add(group);

        const cube1 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        cube1.position.x = -1;
        group.add(cube1);

        const cube2 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        cube2.position.x = 0;
        group.add(cube2);

        const cube3 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        cube3.position.x = 1;
        group.add(cube3);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        renderer.setSize(size.width, size.height);

        // updates
        const updates = () => {
            control.update();
        };

        // tick
        const tick = () => {
            updates();
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();

        // Cleanup function
        return () => {
            renderer.dispose();
            control.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} className="webgl"></canvas>;
}