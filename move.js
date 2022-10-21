import { isBelowPlatForm } from './module.js';
import { playerFollowView as followView } from './module.js';

// 控制物體左右移動
const move = (key, speed) => { 
  const forward = () => player.style.left = player.offsetLeft + speed + 'px';
  const stepBack = () => player.style.left = player.offsetLeft - speed + 'px';
  
  // 前進、後退
  const goOrBack = () => {
    switch(key) {
      case 'ArrowRight':
        return forward();
      case 'ArrowLeft':
        return stepBack();
    }  
  }
  // 閥門，判斷沒有撞擊才能移動
  const valve = () => !player.isTouch(key);
  const program = step => step.every(execute => execute());
  program([valve, goOrBack, followView]);
}

// 跳躍
const jump = (fall, distance, speed) => {
  // 跳躍到落下
  const jumpToFall = program => program.every(execute => execute());
  // 跳躍動畫
  const jumpNow = () => player.style.bottom = parseInt(player.style.bottom) + speed + 'px';
  // 判斷跳躍是否到最高點後，開始落下
  const isHighest = () => parseInt(player.style.bottom) > distance || isBelowPlatForm(player);
  // 開始落下
  const toFall = () => {
    clearInterval(mark.jump);
    mark.fall = setInterval(fall, 0, speed);
  }
  player.isJump = true;
  // 跳躍距離要加上離地高度  
  jumpToFall([jumpNow, followView, isHighest, toFall]);
}

// 落下
const fall = (speed = 2, isStand = player.isStand) => {
  const isLowest = isStand || parseInt(player.style.bottom) === 0;
  // 落下動畫
  const fallNow = () => player.style.bottom = parseInt(player.style.bottom) - speed + 'px';
  // 停止落下
  const toStop = () => {
    clearInterval(mark.fall);
    player.isFall = false;
    player.isJump = false;
  }
  clearInterval(mark.jump);
  player.isFall = true;
  // 判斷是否落到平臺或是地面，有的話就停止，沒有就繼續
  isLowest ? toStop() : fallNow() && followView();
}

// 跳躍開始
const getJumpToFall = (jump, fall) => (distance, speed) => { 
  mark.jump = setInterval(jump, 0, fall, distance, speed);
}

// 移動停止
const moveStop = ({ key }) => {
  // 檢查是否和當初按住的按鍵一樣
  if(key === player.direction) clearInterval(mark.move);
}

// 判斷左右移動還是跳躍
const jumpOrMove = e => {
  let { key } = e;
  let { jumpDistance, speed } = player.gameValue;
  let distance = jumpDistance + parseInt(player.style.bottom);
  if(key === 'ArrowUp' || key === 'ArrowDown' || 
     key === 'ArrowRight' || key === 'ArrowLeft') e.preventDefault();

  if(key === 'ArrowUp' && !player.isJump && !player.isFall) {
    let jumping = getJumpToFall(jump, fall);
    jumping(distance, speed);
  }

  if(key === 'ArrowRight' || key === 'ArrowLeft') {
    // 去除默認左右按鍵觸發滾動條事件
    clearInterval(mark.move);
    mark.move = setInterval(move, 0, key, speed); 
  }
}

export { fall, jumpOrMove, moveStop };