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
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    const canPlacePoint = [];
    const newBoard = structuredClone(board);
    // for (let i = 0; i < 8; i++) {
    //   //３になっているものを０に直す
    //   for (let j = 0; j < 8; j++) {
    //     if (newBoard[i][j] === 3) {
    //       newBoard[i][j] = 0;
    //     }
    //   }
    // }
    function checkCanPlace(y, x) {
      if (newBoard[y][x] === 0 || newBoard[y][x] === 3) {
        for (const direction of directions) {
          if (
            newBoard[y + direction[0]] !== undefined &&
            newBoard[x + direction[1]] !== undefined &&
            newBoard[y + direction[0]][x + direction[1]] === turnColor
          ) {
            for (let i = 1; i < 9; i++) {
              if (
                newBoard[y + direction[0] * i] !== undefined &&
                newBoard[x + direction[1] * i] !== undefined
              ) {
                if (newBoard[y + direction[0] * i][x + direction[1] * i] === turnColor) {
                  continue;
                } else if (newBoard[y + direction[0] * i][x + direction[1] * i] === 3 - turnColor) {
                  return 'True';
                } else {
                  break;
                }
              }
            }
          }
        }
      }
    }
    if (board[y][x] === 0 || board[y][x] === 3) {
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
                newBoard[y][x] = turnColor; //クリックしたところを自分の色にする
                for (const posision of memoryPosision) {
                  //ひっくり返し
                  newBoard[posision[0]][posision[1]] = turnColor;
                }
                console.log(newBoard);
                for (let i = 0; i < 8; i++) {
                  //３になっているものを０に直す
                  for (let j = 0; j < 8; j++) {
                    if (newBoard[i][j] === 3) {
                      newBoard[i][j] = 0;
                      console.log('pass');
                    }
                  }
                }
                console.log(newBoard);
                for (let i = 0; i < 8; i++) {
                  //０である置くことが可能な位置を調べる、可能であればリストに格納する
                  for (let j = 0; j < 8; j++) {
                    console.log(i, j);
                    if (checkCanPlace(i, j) === 'True') {
                      canPlacePoint[canPlacePoint.length] = [i, j];
                      console.log('passed');
                      // newBoard[i][j] = 3;
                    }
                  }
                }
                // console.log(canPlacePoint);
                console.log(canPlacePoint);
                for (const point of canPlacePoint) {
                  //格納された配置可能な座標を３にする
                  newBoard[point[0]][point[1]] = 3;
                }
                setTurnColor(3 - turnColor);
                setBoard(newBoard);
                stoneNum[0] = 0;
                stoneNum[1] = 0;
                for (const rows of newBoard) {
                  for (let i = 0; i < 8; i++) {
                    if (rows[i] !== 0 && rows[i] !== 3) {
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
  };
  return (
    <div className={styles.container}>
      <div>
        black:{stoneNum[0]} white:{stoneNum[1]}
      </div>
      <div>{turnColor === 1 ? "Black's" : "White's"} turn</div>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && color !== 3 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
              {color === 3 && <div className={styles.canPlacePointStyle} />}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
