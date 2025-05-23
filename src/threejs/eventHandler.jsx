import * as THREE from 'three'
import { Scene } from 'three/webgpu';
import {GameState} from '../game/gameState'
import { log } from 'three/tsl';

// eventHandler.js
export function eventHandler(camera, renderer, size, scene) {
    // 射线设置
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let selectedPiece = null;

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

    const canEat = (attacker, defender) => {
        if (attacker.type === '刺客' && defender.type === '国王') return true;
        if (attacker.type === '国王' && defender.type === '刺客') return false;
        return attacker.level >= defender.level;
    }

    
    // Click the piece
    const onClick = (event) => {

        mouse.x = (event.clientX / size.width) * 2 - 1;
        mouse.y = -(event.clientY / size.height) * 2 + 1;
    
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if(intersects.length === 0) return 

        const mesh = intersects[0].object
        const piece = mesh.userData

        // 如果这个地方有棋子并且棋子没有翻开
        if(piece && !piece.revealed){
            piece.revealed = true
            console.log(piece.owner, '翻棋，翻出了一个 ', piece.type);

            // 不同的棋子，设置不同的高度和透明度
            const level = parseInt(piece.level)
            mesh.geometry.dispose();
            mesh.geometry = new THREE.BoxGeometry(0.7, 0.2 + 0.2 * level, 0.7);
            mesh.material.color.set(piece.owner === 'red' ? 0xff4444 : 0x4444ff);
            mesh.material.transparent = true;
            mesh.material.opacity = 0.3 + 0.1 * level;
            mesh.position.y = 0.1 * level;

            // 翻完切换回合
            GameState.switchTurn();
            return
        }

        if (piece && piece.revealed && piece.owner === GameState.currentPlayer) {
            if (selectedPiece && selectedPiece.piece === piece) {
                // 放下选中棋子，取消高亮
                selectedPiece = null;
                console.log('放下了：', piece.owner, "的: ", piece.type, " 棋子");
            } else {
                // 先取消之前选中棋子的高亮
                if (selectedPiece) {
                    console.log()
                }
                // 选中新棋子，设置高亮
                selectedPiece = { mesh, piece };
                console.log("选中了：", piece.owner, "的: ", piece.type, " 棋子");
            }
            return;
        }


        if (selectedPiece) {
            // 从哪到哪里
            const from = selectedPiece
            const to = piece

            // 判断是否可以移动（空位置或者地方已经翻开的棋子且可吃）
            const canMove = 
                !to || 
                (to.revealed && to.owner != GameState.currentPlayer && canEat(from.piece, to))
            
            if(canMove){
                // 如果是吃子，先移除目标棋子对应的mesh
                if (to) {
                    scene.remove(mesh); 
                    console.log(piece.owner, ' 的 ', piece.type, ' 被吃掉了')
                }

            // 移动选中棋子mesh到目标位置
            from.mesh.position.set(mesh.position.x, from.mesh.position.y, mesh.position.z);


            selectedPiece = null;

            // 切换回合
            GameState.switchTurn();

        }
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
