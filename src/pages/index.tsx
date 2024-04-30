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
const judgeFinish = [];
const invertPosition: number[][] = [];
const countSkip = [0, 0];
const stoneNum = [2, 2, 4];
//置くことが可能か判断する関数
const checkCanPut = (x: number, y: number, board: number[][], turnColor: number) => {
  if (board[y][x] === 1 || board[y][x] === 2) return false;
  let canPut: boolean = false;
  invertPosition.length = 0;
  for (const direction of directions) {
    let alreadyFindEnemy: boolean = false;
    const preInvertPosition = [];
    for (let i = 1; i < 9; i++) {
      const vertical = y + direction[0] * i;
      const horizontal = x + direction[1] * i;
      if (board[vertical] !== undefined) {
        if (board[vertical][horizontal] === turnColor && alreadyFindEnemy) {
          for (const row of preInvertPosition) {
            invertPosition.push(row);
          }
          canPut = true;
          break;
        } else if (board[vertical][horizontal] === 3 - turnColor) {
          preInvertPosition.push([vertical, horizontal]);
          alreadyFindEnemy = true;
        } else break;
      }
    }
  }
  if (canPut) return true;
};

//色の変更を担う関数
const reloadBoard = (x: number, y: number, board: number[][], turnColor: number) => {
  board[y][x] = turnColor;
  for (const cell of invertPosition) {
    board[cell[0]][cell[1]] = turnColor;
  }
  for (let s = 0; s < 3; s++) stoneNum[s] = 0;
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      if (board[i][j] === 1) stoneNum[0]++;
      if (board[i][j] === 2) stoneNum[1]++;
      if (board[i][j] === 3) board[i][j] = 0;
      if (checkCanPut(j, i, board, 3 - turnColor) === true) {
        board[i][j] = 3;
        stoneNum[2]++;
      }
    }
  }
  return board;
};

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 1],
    // [1, 0, 2, 0, 1, 0, 2, 0],
    // [2, 0, 1, 0, 2, 0, 1, 0],
    // [2, 0, 1, 0, 2, 0, 1, 0],
    // [0, 0, 0, 0, 0, 0, 1, 0],
    // [0, 0, 3, 0, 0, 0, 0, 0],
    // [0, 0, 0, 3, 0, 0, 0, 0],
    // [2, 1, 0, 0, 0, 0, 0, 0],
    // [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);

    if (checkCanPut(x, y, newBoard, turnColor) === true) {
      setBoard(reloadBoard(x, y, newBoard, turnColor));
      setTurnColor(3 - turnColor);
      console.log(stoneNum[2]);

      if (countSkip[0] === 2 || countSkip[1] === 2) {
        judgeFinish.push(1);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && color !== 3 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#393939' : '#fff' }}
                />
              )}
              {color === 3 && <div className={styles.canPlacePointStyle} />}
            </div>
          )),
        )}
      </div>
      <div className={styles.scoreBoardStyle}>
        <div className={styles.turnSwitcher}>
          <div
            className={styles.displayStrings}
            style={{
              fontSize: 25,
              marginTop: 10.5,
              marginLeft: 30,
            }}
          >
            Turn
          </div>
          <div
            className={styles.stoneStyle}
            style={{ background: turnColor === 1 ? '#393939' : '#fff', marginLeft: 5 }}
          />
        </div>
        <div className={styles.stoneNumBoardStyle}>
          <div
            className={styles.stoneNumStyle}
            style={{
              marginLeft: 40,
            }}
          >
            Black:{stoneNum[0]}
          </div>
          <div
            className={styles.stoneNumStyle}
            style={{
              marginLeft: 68,
            }}
          >
            White:{stoneNum[1]}
          </div>
        </div>
        <div className={styles.skipCountBoardStyle}>
          <div className={styles.displayStrings}>({countSkip[0]})</div>
          <div className={styles.displayStrings}>({countSkip[1]})</div>
        </div>
        <div className={styles.displayStrings}>{judgeFinish.length === 1 ? 'Finish' : ''}</div>
      </div>
    </div>
  );
};

export default Home;
