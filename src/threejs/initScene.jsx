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

    const generateBoard = () => {
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

                const color = 0xF8F8FF

                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(0.7, 0.2 + 0.2 , 0.7),
                    new THREE.MeshBasicMaterial({
                        color,
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
    }

    const generateBoard2 = () => {
        const gridSize = 6;
        const cellSize = 1;

        for(let row=0; row<gridSize; row++){
            for(let col=0; col<gridSize; col++){
                const color = (row + col) % 2 === 0 ? 0xffffff : 0x999999;
                const cellMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(cellSize, cellSize),
                    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide})
                )
                cellMesh.rotation.x = -Math.PI / 2;
                cellMesh.position.set(
                col * cellSize - (gridSize / 2) * cellSize + cellSize / 2,
                0,
                row * cellSize - (gridSize / 2) * cellSize + cellSize / 2
                );
                scene.add(cellMesh);
            }
        }

        // 放棋子时位置对齐格子中心
        const pieceSizeYBase = 0.2;
        const pieceHeightUnit = 0.2;
        const pieces = generateAllPieces()
        const board = new Board()

        let index = 0;
        for(let row = 0; row < gridSize; row++){
        for(let col = 0; col < gridSize; col++){
            const piece = pieces[index];
            board.setPiece(row, col, piece);
            index++;

            const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, pieceSizeYBase, 0.7),
            new THREE.MeshBasicMaterial({
                color: piece.owner === 'red' ? 0xff4444 : 0x4444ff,
                transparent: true,
            })
            );

            // 位置对齐格子中心
            let x = col * cellSize - (gridSize / 2) * cellSize + cellSize / 2
            let y = (pieceSizeYBase ) / 2 + 0.01
            let z = row * cellSize - (gridSize / 2) * cellSize + cellSize / 2
            mesh.position.set(x, y, z);

            mesh.userData = piece;
            scene.add(mesh);
        }
        }



    }

    // 生成棋盘
    // generateBoard()
    generateBoard2()


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
