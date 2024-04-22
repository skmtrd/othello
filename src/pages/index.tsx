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

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);

    var checkRun = 'True';
    const newBoard = structuredClone(board);
    for (const direction of directions) {
      const memoryPosision = [];
      if (checkRun === 'False') {
        break;
      }
      if (board[y + direction[0]][x + direction[1]] === 3 - turnColor) {
        for (let i = 1; i < 8; i++) {
          if (board[y + direction[0] * i][x + direction[1] * i] === 3 - turnColor) {
            memoryPosision[memoryPosision.length] = [y + direction[0] * i, x + direction[1] * i];
            console.log([y + direction[0] * i], [x + direction[1] * i]);
            // console.log(memoryPosision);
            continue;
          } else if (board[y + direction[0] * i][x + direction[1] * i] === turnColor) {
            newBoard[y][x] = turnColor;
            for (const posision of memoryPosision) {
              newBoard[posision[0]][posision[1]] = turnColor;
            }
            setTurnColor(3 - turnColor);
            setBoard(newBoard);
            console.log(memoryPosision);
            var checkRun = 'False';

            break;
          } else {
            break;
          }
        }
      }
    }
  };
  return (
    <div className={styles.container}>
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
