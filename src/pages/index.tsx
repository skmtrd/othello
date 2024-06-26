import { useState } from 'react';
import styles from './index.module.css';
('next/dist/shared/lib/constants');
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
const preInvertPosition: number[][] = [];
const invertPosition: number[][] = [];
const countSkip = [0];
const stoneNum = [2, 2, 4];
const finishChecker: number[] = [0];
const restartBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 1, 2, 3, 0, 0],
  [0, 0, 3, 2, 1, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const checkCanPut = (x: number, y: number, board: number[][], turnColor: number) => {
  invertPosition.length = 0;
  let preReturn: boolean = false;
  if (board[y][x] === 1 || board[y][x] === 2) return false;
  for (const [dy, dx] of directions) {
    preInvertPosition.length = 0;
    for (let i = 1; i < 8; i++) {
      const [cursorY, cursorX] = [y + dy * i, x + dx * i];
      if (board[cursorY] !== undefined) {
        const cursor = board[cursorY][cursorX];
        if (cursor === turnColor) {
          if (i === 1) break;
          preInvertPosition.map((position) => {
            invertPosition.push(position);
            return null;
          });
          preReturn = true;
          break;
        } else if (cursor === 3 - turnColor) preInvertPosition.push([cursorY, cursorX]);
        else break;
      }
    }
  }
  return preReturn;
};

const reloadBoard = (x: number, y: number, board: number[][], turnColor: number) => {
  board[y][x] = turnColor;
  invertPosition.map((cell) => {
    board[cell[0]][cell[1]] = turnColor;
    return null;
  });
  const newBoard = displaySuggest(board, turnColor);
  countStoneNum(newBoard);
  return newBoard;
};

const countStoneNum = (board: number[][]) => {
  stoneNum.fill(0);
  const flatBoard: number[] = board.flat();
  stoneNum[0] += flatBoard.filter((x) => x === 1).length;
  stoneNum[1] += flatBoard.filter((x) => x === 2).length;
  stoneNum[2] += flatBoard.filter((x) => x === 3).length;
};

const displaySuggest = (board: number[][], turnColor: number) => {
  const newBoard = board.map((row) => {
    return row.map((element) => {
      return element % 3;
    });
  });
  const newBoard2 = newBoard.map((row, i) => {
    return row.map((cell, j) => {
      return [cell, 3][+checkCanPut(j, i, newBoard, 3 - turnColor)];
      // return checkCanPut(j, i, newBoard, 3 - turnColor) ? 3 : cell;
    });
  });
  return newBoard2;
};
const checkFinish = (board: number[][], turnColor: number) => {
  countSkip[0] = 0;
  if (stoneNum[2] === 0) {
    countSkip[0]++;
    const newBoard = displaySuggest(board, 3 - turnColor);
    countStoneNum(newBoard);
    // if (stoneNum[2] === 0) finishChecker[0]++;
    finishChecker[0] += [0, 1][+(stoneNum[2] === 0)];
    return newBoard;
  }
  return board;
};

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 0, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 1, 1, 0, 0],
  ]);
  const closeFinishEffect = () => {
    const newBoard = restartBoard;
    finishChecker[0] = 0;
    countStoneNum(newBoard);
    countSkip.fill(0);
    setBoard(newBoard);
    setTurnColor(1);
  };

  const clickHandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    if (checkCanPut(x, y, newBoard, turnColor)) {
      const reloadedBoard: number[][] = reloadBoard(x, y, newBoard, turnColor);
      const newBoard2: number[][] = checkFinish(reloadedBoard, turnColor);
      setBoard(newBoard2);
      countSkip[0] === 0 ? setTurnColor(3 - turnColor) : '';
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.btn} onClick={() => closeFinishEffect()}>
        <div className={styles.restartButtomStyle}>
          <div>Restart</div>
        </div>
      </div>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && color !== 3 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: { 1: '#585858', 2: '#fff' }[color] }}
                />
              )}
              {color === 3 && <div className={styles.canPlacePointStyle} />}
            </div>
          )),
        )}
      </div>
      <div className={styles.scoreBoardStyle}>
        <div className={styles.turnSwitcher}>
          <div className={styles.turnSwitcherString}>Turn :</div>

          <div
            className={styles.stoneStyle}
            style={{
              background: { 1: '#585858', 2: '#fff' }[turnColor],
              marginLeft: 14,
              width: 48,
              height: 48,
              marginTop: 2,
            }}
          />
        </div>
        <div className={styles.stoneNumBoardStyle}>
          <div
            className={styles.stoneStyle}
            style={{ background: '#585858', width: 30, height: 30 }}
          />
          <div style={{ marginLeft: 10 }}>{stoneNum[0]}</div>
        </div>
        <div className={styles.stoneNumBoardStyle}>
          <div
            className={styles.stoneStyle}
            style={{ background: '#ffffff', width: 30, height: 30 }}
          />
          <div style={{ marginLeft: 10 }}>{stoneNum[1]}</div>
        </div>
      </div>
      <div
        className={styles.finishStyle}
        style={{
          width: { 1: '99%', 0: 0 }[finishChecker[0]],
          overflow: { 1: 'visible', 0: 'hidden' }[finishChecker[0]],
        }}
        onClick={() => closeFinishEffect()}
      >
        <div className={styles.finishingBoard}>
          <div className={styles.winnerString}>
            <div style={{ display: 'flex' }}>
              {['White', 'Black'][+(stoneNum[0] > stoneNum[1])]} win!!
            </div>
          </div>
          <div className={styles.endStoneNumString}>
            <div style={{ display: 'flex' }}>
              {stoneNum[0]} : {stoneNum[1]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
