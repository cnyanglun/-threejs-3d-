# 皇家战棋 -- Battle Royale game
我要使用threejs开发一个游戏，帮我想一下计划

## 游戏介绍

一个本地双人棋游戏

- 棋盘是6*6的格式，一开始要生成棋子并且随机分配在棋盘上
- 刺客＜禁卫军＜弓箭手＜骑士＜将军＜国王<刺客
- 等级高的可以吃对方比自己等级低或者同级的棋子
- 国王可以吃掉对方除刺客以外的任何棋子；刺客等级最低，但可以吃掉对方国王
- 对战双方轮流走棋（包括翻棋、走步、吃子）。

### 棋子状况
红方棋子（共计18个）：
刺　客：一星 ★　共8个
禁卫军：二星 ★★　共4个
弓箭手：三星 ★★★　共2个
骑　士：四星 ★★★★　共2个
将　军：五星 ★★★★★　共1个
国　王：六星 ★★★★★★　共1个

蓝方棋子（共计18个）：
刺　客：一星 ★　共8个
禁卫军：二星 ★★　共4个
弓箭手：三星 ★★★　共2个
骑　士：四星 ★★★★　共2个
将　军：五星 ★★★★★　共1个
国　王：六星 ★★★★★★　共1个


---------------

## 开发环境
目前的开发环境使用react+ threejs，使用模块化
```javascript
import { useRef, useEffect } from 'react';

// Threejs code
import * as THREE from 'three';
import { initScene } from '../threejs/initScene';
import { eventHandler } from '../threejs/eventHandler'

export default function ThreeCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        /**
         * Threejs Start --------------------------------------
         */

        // canvas
        const canvas = canvasRef.current;

        // Threejs Componets
        // initScene
        const {camera, renderer, size} = initScene(canvas)
        // Events handle
        const cleanupResize = eventHandler(camera, renderer, size);

        /**
         * Threejs End --------------------------------------
         */

        // Cleanup function
        return () => {
            // Clean render resource
            renderer.dispose();
            cleanupResize();
        };
    }, []);

    return <canvas ref={canvasRef} className="webgl"></canvas>;
}

// renderScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function initScene(canvas) {
    const size = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
    camera.position.set(1, 1, 5);

    const control = new OrbitControls(camera, canvas);
    control.enableDamping = true;

    const group = new THREE.Group();
    [-1, 0, 1].forEach((x, i) => {
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: [0xff0000, 0x00ff00, 0x0000ff][i] })
        );
        cube.position.x = x;
        group.add(cube);
    });
    scene.add(group);
    scene.add(new THREE.AxesHelper(5));

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(size.width, size.height);

    const tick = () => {
        control.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };
    tick();

    return { camera, renderer, size };
}

// eventHandler.js
export function eventHandler(camera, renderer, size) {
    const onResize = () => {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        camera.aspect = size.width / size.height;
        camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize); // 卸载时清理
}
```


## 计划的开发步骤
1. 初始化场景
2. 棋盘数据结构设计
    - Board.js管理6x6二维数组，存棋子对象或null。
    - 实现棋子初始化，随机分配（调用Pieces.js中的生成逻辑）。
3. 棋子数据定义
    - Pieces.js定义红蓝双方棋子数量、等级、类型。
    - 实现生成所有棋子数组并随机分配到棋盘
4. 棋盘和棋子3D模型生成，boardGenerator.js根据棋盘数据
5. 交互事件处理
    - interactionHandler.js监听点击，判断翻棋、选中走子、吃子。
    - 结合Rules.js实现规则校验。
6. 游戏逻辑管理
    - GameManager.js控制游戏流程：轮流走棋，判断胜负，切换回合
7. UI及提示