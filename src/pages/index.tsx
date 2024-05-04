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
const finishChecker: number[] = [0];
const preInvertPosition = [];
const invertPosition: number[][] = [];
const countSkip = [0];
const stoneNum = [2, 2, 4];
const checkCanPut = (x: number, y: number, board: number[][], turnColor: number) => {
  if (board[y][x] === 1 || board[y][x] === 2) return false;
  const run = true;
  const i = 0;
  while (run) {
    let findEnemy = false;
    const cursor = board[y + directions[i][0] * i][x + directions[i][1] * 1];
    switch (cursor) {
      case 3 - turnColor:
        preInvertPosition.push([[y + directions[i][0] * i], [x + directions[i][1] * 1]]);
        break;
      case turnColor:
        if (findEnemy) {
          
        }
    }
  }
  // if (board[y][x] === 1 || board[y][x] === 2) return false;
  // let canPut: boolean = false;
  // invertPosition.length = 0;
  // for (const direction of directions) {
  //   let alreadyFindEnemy: boolean = false;
  //   const preInvertPosition = [];
  //   for (let i = 1; i < 9; i++) {
  //     const vertical = y + direction[0] * i;
  //     const horizontal = x + direction[1] * i;
  //     if (board[vertical] !== undefined) {
  //       if (board[vertical][horizontal] === turnColor && alreadyFindEnemy) {
  //         for (const row of preInvertPosition) {
  //           invertPosition.push(row);
  //         }
  //         canPut = true;
  //         break;
  //       } else if (board[vertical][horizontal] === 3 - turnColor) {
  //         preInvertPosition.push([vertical, horizontal]);
  //         alreadyFindEnemy = true;
  //       } else break;
  //     }
  //   }
  // }
  // return canPut;
};

const reloadBoard = (x: number, y: number, board: number[][], turnColor: number) => {
  board[y][x] = turnColor;
  invertPosition.map((cell) => {
    board[cell[0]][cell[1]] = turnColor;
    return null;
  });
  stoneNum.fill(0);
  const newBoard = displaySuggest(board, turnColor);
  countStoneNum(newBoard);
  return newBoard;
};

const countStoneNum = (board: number[][]) => {
  const flatBoard: number[] = board.flat();
  stoneNum[0] += flatBoard.filter((x) => x === 1).length;
  stoneNum[1] += flatBoard.filter((x) => x === 2).length;
  stoneNum[2] += flatBoard.filter((x) => x === 3).length;
};

const displaySuggest = (board: number[][], turnColor: number) => {
  const newBoard = board.map((row) => {
    return row.map((element) => {
      return element === 3 ? 0 : element;
    });
  });
  const newBoard2 = newBoard.map((row, i) => {
    return row.map((cell, j) => {
      return checkCanPut(j, i, newBoard, 3 - turnColor) === true ? 3 : cell;
    });
  });
  return newBoard2;
};
const checkFinish = (board: number[][], turnColor: number) => {
  if (stoneNum[2] === 0) {
    console.log('p');
    countSkip[0] = 0;
    countSkip[0]++;
    console.log(countSkip[0]);
    const newBoard = displaySuggest(board, 3 - turnColor);
    countStoneNum(newBoard);
    if (stoneNum[2] === 0) finishChecker[0]++;
    return newBoard;
  }
  return board;
};

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [1, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 0, 3, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const closeFinishEffect = () => {
    const newBoard = structuredClone(board);
    finishChecker[0] = 0;
    setBoard(newBoard);
    setTurnColor(turnColor);
  };

  const clickHandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    if (checkCanPut(x, y, newBoard, turnColor) === true) {
      const reloadedBoard: number[][] = reloadBoard(x, y, newBoard, turnColor);
      const newBoard2: number[][] = checkFinish(reloadedBoard, turnColor);
      setBoard(newBoard2);
      countSkip[0] === 0 ? setTurnColor(3 - turnColor) : '';
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
                  style={{ background: { 1: '#393939', 2: '#fff' }[color] }}
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
            style={{ background: { 1: '#393939', 2: '#fff' }[turnColor] }}
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
      </div>
      <div
        className={styles.finishStyle}
        style={{
          width: { 1: '100%', 0: 0 }[finishChecker[0]],
          //{1:"100%", 0:0[finishChecker[0]]}
          overflow: { 1: 'visible', 0: 'hidden' }[finishChecker[0]],
        }}
        onClick={() => closeFinishEffect()}
      >
        <a>Finish</a>
      </div>
    </div>
  );
};

export default Home;
