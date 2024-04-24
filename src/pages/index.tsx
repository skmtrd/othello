import { useState } from 'react';
import styles from './index.module.css';
const directions = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];
const stoneNum = [2, 2];
const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    // console.log(stoneNum);
    console.log(x, y);
    if (board[y][x] === 0) {
      const newBoard = structuredClone(board);
      for (const direction of directions) {
        const memoryPosision = [];
        if (
          newBoard[y + direction[0]] !== undefined &&
          newBoard[x + direction[1]] !== undefined &&
          newBoard[y + direction[0]][x + direction[1]] === 3 - turnColor
        ) {
          for (let i = 1; i < 8; i++) {
            if (
              newBoard[y + direction[0] * i] !== undefined &&
              newBoard[x + direction[1] * i] !== undefined
            ) {
              if (newBoard[y + direction[0] * i][x + direction[1] * i] === 3 - turnColor) {
                memoryPosision[memoryPosision.length] = [
                  y + direction[0] * i,
                  x + direction[1] * i,
                ];
                continue;
              } else if (newBoard[y + direction[0] * i][x + direction[1] * i] === turnColor) {
                newBoard[y][x] = turnColor;
                for (const posision of memoryPosision) {
                  newBoard[posision[0]][posision[1]] = turnColor;
                }
                setTurnColor(3 - turnColor);
                setBoard(newBoard);
                stoneNum[0] = 0;
                stoneNum[1] = 0;
                for (const rows of newBoard) {
                  for (let i = 0; i < 8; i++) {
                    if (rows[i] !== 0) {
                      rows[i] === 1 ? stoneNum[0]++ : stoneNum[1]++;
                    }
                  }
                }
                break;
              } else {
                break;
              }
            }
          }
        }
      }
    }
    console.log(stoneNum);
  };
  return (
    <div className={styles.container}>
      <div>
        blackStone:{stoneNum[0]} whitestone:{stoneNum[1]}
      </div>
      <div>{turnColor === 1 ? "Black's" : "White's"} turn</div>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
