import {shuffle } from './shuffle'

const PIECE_TYPES = [
    { type: '刺客', level: 1, count: 8 },
    { type: '禁卫军', level: 2, count: 4 },
    { type: '弓箭手', level: 3, count: 2 },
    { type: '骑士', level: 4, count: 2 },
    { type: '将军', level: 5, count: 1 },
    { type: '国王', level: 6, count: 1 },
]

function generatePlayerPieces(owner) {
    const pieces = []

    PIECE_TYPES.forEach(({type, level, count}) => {
        for(let i=0; i<count; i++){
            pieces.push({
                type,
                level,
                owner,
                revealed: false,
                id: `${owner}-${type}-${i}`
            })
        }
    })

    return pieces
}

// 生成全部36个棋子并随机排列
export function generateAllPieces() {
    const redPieces = generatePlayerPieces('red');
    const bluePieces = generatePlayerPieces('blue');
    const allPieces = [...redPieces, ...bluePieces];
    return shuffle(allPieces);  // 返回乱序的棋子数组
  }