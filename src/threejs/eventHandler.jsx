import * as THREE from 'three'
import { Scene } from 'three/webgpu';
import {GameState} from '../game/gameState'

// eventHandler.js
export function eventHandler(camera, renderer, size, scene) {
    // 射线设置
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event) => {
        mouse.x = (event.clientX / size.width) * 2 - 1;
        mouse.y = -(event.clientY / size.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        // Reset all pieces to their original color
        scene.children.forEach((child) => {
            if (child.isMesh && child.material) {
                child.material.color.set(child.userData?.originalColor || child.material.color);
            }
        });

        // Highlight the piece under the mouse
        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            if (mesh.userData) {
                // Save the original color if not already saved
                if (!mesh.userData.originalColor) {
                    mesh.userData.originalColor = mesh.material.color.getHex();
                }
                // Change the color to white
                mesh.material.color.set(0xffffff);
            }
        }
    }

    // Click the piece
    const onClick = (event) => {

        mouse.x = (event.clientX / size.width) * 2 - 1;
        mouse.y = -(event.clientY / size.height) * 2 + 1;
    
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
    
        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            const piece = mesh.userData;
    
            if (!piece || piece.revealed) return;
    
            // 翻棋逻辑
            piece.revealed = true;
            console.log(piece.owner, '翻棋，翻出了一个 ', piece.type);
    
            const level = parseInt(piece.level);
    
            mesh.geometry.dispose();
            mesh.geometry = new THREE.BoxGeometry(0.7, 0.2 + 0.2 * level, 0.7);
    
            mesh.material.color.set(piece.owner === 'red' ? 0xff4444 : 0x4444ff);
            mesh.material.transparent = true;
            mesh.material.opacity = 0.3 + 0.1 * level;
    
            mesh.position.y = 0.1 * level;
    
            // ✅ 切换回合
            GameState.switchTurn();
        }
    };

    // 控制窗口大小
    const onResize = () => {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };


    // Run Event Listener
    window.addEventListener('resize', onResize);
    // window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)



    // Clean Event Listener
    return () => {
        window.removeEventListener('resize', onResize);
    } // 卸载时清理
}
