# Template-for-React-and-Threejs
- Webgl canvas element in embed into the react frame
- Include the basic threejs template
![alt text](image.png)



## Structure
```
src/
├── components/
│   └── ThreeCanvas.jsx          // Three.js 画布组件，初始化场景和渲染循环
│
├── game/
│   ├── GameManager.js           // 核心游戏逻辑，回合管理、胜负判断
│   ├── Board.js                 // 棋盘数据结构，棋子存放及操作方法
│   ├── Pieces.js                // 棋子类型定义，初始化棋子数组和分配
│   ├── Rules.js                 // 吃子规则和走棋合法性判断
│   └── AI.js                   // （可选）简单AI逻辑
│
├── threejs/
│   ├── initScene.js             // 场景、相机、渲染器初始化
│   ├── boardGenerator.js        // 根据棋盘数据生成Three Mesh棋盘和棋子模型
│   ├── interactionHandler.js    // 监听鼠标点击，实现翻棋、走棋、吃子交互
│
├── utils/
│   └── shuffle.js               // 洗牌工具函数
│
└── App.jsx                     // React 主入口
```