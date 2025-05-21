// renderScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Board } from '../game/Board';
import { generateAllPieces } from '../game/Pieces';
import { log } from 'three/tsl';

export function initScene(canvas) {
    const size = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEFA)

    const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
    camera.position.set(1, 1, 5);

    const control = new OrbitControls(camera, canvas);
    control.enableDamping = true;

    // 生成棋盘和棋子
    const board = new Board()
    const pieces = generateAllPieces()

    let index = 0
    for(let row=0; row<6; row++){
        for(let col=0; col<6; col++){
            // 将棋子添加到棋盘
            const piece = pieces[index]
            board.setPiece(row, col, piece)
            index++

            // 创建一个棋子
            const color = piece.owner === 'red' ? 0xff4444 : 0x4444ff
            const color1 = 0xF8F8FF
            // 等级越高的棋子高度越高，透明度越高
            const level = parseInt(piece.level)

            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.2 + 0.2 , 0.7),
                new THREE.MeshBasicMaterial({
                    color1,
                    transparent: true,
                    opacity: 0.3 + 0.1
                })
            )

            // 然后设置棋子的位置
            mesh.position.set(col-2.5, 0 + 0.1, row-2.5)
            // 将棋子的基本信息附加到mesh的userData上面，这样在场景中通过获得物体就能得到棋子的基本信息了，不用再找了
            mesh.userData = piece

            scene.add(mesh)


        }
    }

    // 添加坐标系方便调试
    scene.add(new THREE.AxesHelper(5));

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(size.width, size.height);

    const tick = () => {
        control.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };
    tick();

    return { camera, renderer, size, scene };
}
