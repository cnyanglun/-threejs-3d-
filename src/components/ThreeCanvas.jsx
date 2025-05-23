import { useRef, useEffect } from 'react';

// Threejs code
import * as THREE from 'three';
import { initScene } from '../threejs/initScene';
import { eventHandler } from '../threejs/eventHandler'

export default function ThreeCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        threejsCode()
    }, []);

    const threejsCode = () => {
        if (!canvasRef.current) return;

        /**
         * Threejs Start --------------------------------------
         */

        // canvas
        const canvas = canvasRef.current;

        // Threejs Componets
        // initScene
        const {camera, renderer, size, scene} = initScene(canvas)
        // Events handle
        const cleanupResize = eventHandler(camera, renderer, size, scene);

        /**
         * Threejs End --------------------------------------
         */

        // Cleanup function
        return () => {
            // Clean render resource
            renderer.dispose();
            cleanupResize();
        };
    }

    return <canvas ref={canvasRef} className="webgl"></canvas>;
}