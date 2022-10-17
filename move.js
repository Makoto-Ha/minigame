import { isBelowPlatForm } from './platform.js';

// 控制物體左右移動
const move = (key, speed) => { 
  const forward = () => {
    player.style.left = player.offsetLeft + speed + 'px';
    document.documentElement.scrollLeft = player.offsetLeft - 400;
  }

  const stepBack = () => {
    player.style.left = player.offsetLeft - speed + 'px';
    document.documentElement.scrollLeft = player.offsetLeft - 400;
  }

  const goOrBack = keyboard => {
    switch(keyboard) {
      case 'ArrowRight':
        forward();
        break;
      case 'ArrowLeft':
        stepBack();
        break; 
    }  
  }

  const isNoTouch = keyboard => {
    return !player.isTouch(keyboard);
  }

  const noTouchToGO = funcs => {
    funcs.every(func => func(key));
  }

  noTouchToGO([isNoTouch, goOrBack]);
}

// 跳躍
const jump = (fall, distance, speed) => {
  // 跳躍到落下
  const jumpToFall = program => {
    program.forEach(execute => execute());
  }

  // 跳躍動畫
  const jumpNow = () => {
    player.style.bottom = parseInt(player.style.bottom) + speed + 'px';
    document.documentElement.scrollTop = player.offsetTop - 500;
  }

  // 判斷跳躍是否到最高點後，開始落下
  const highest = falling => {
    return () => {
      let playerBottom = parseInt(player.style.bottom);

      if(playerBottom > distance || isBelowPlatForm(player)) falling();
    }
  }

  // 開始落下
  const startFall = () => {
    clearInterval(mark.jump);
    mark.fall = setInterval(fall, 0, speed);
  }

  player.isJump = true;
  // 跳躍距離要加上離地高度
  distance += parseInt(player.style.bottom);  
  mark.jump = setInterval(jumpToFall, 0, [jumpNow, highest(startFall)]);
}

// 落下
const fall = (speed = 2) => {
  // 落下到停止之間
  const fallToStop = (falling, falled, lowest) => {
    falling(falled, lowest);
  }
  // 開始落下
  const start = (fallNow, bottom) => {
    return (falled, lowest) => {
      lowest ? falled() : fallNow(bottom);
    }
  }
  // 停止落下
  const stop = () => {
    clearInterval(mark.fall);
    player.inAir = false;
    player.isJump = false;
  }
  // 判斷是否落到平臺或是地面
  const isLowest = blooens => {
    return blooens.some(blooen => blooen);
  }

  // 落下動畫
  const fallNow = bottom => {
    player.style.bottom = bottom - speed + 'px';
    document.documentElement.scrollTop = player.offsetTop - 500;
  }
  // 有沒有到達地面
  let playerBottom = parseInt(player.style.bottom);
  let isGround = playerBottom === 0;
  clearInterval(mark.jump);
  player.inAir = true;
  // 開始落下停止
  fallToStop(start(fallNow, playerBottom), stop, isLowest([player.isStand, isGround]));
}

// 跳躍落下組合
const jumpToFall = (jump, fall) => {
  return (distance, speed) => {
    jump(fall, distance, speed);
  }
}

// 移動停止
const moveStop = ({ key }) => {
  // 檢查是否和當初按住的按鍵一樣
  if(key === player.direction) {
    clearInterval(mark.move);
  }
}

// 判斷左右移動還是跳躍
const jumpOrMove = e => {
  let { key } = e;
  let { jumpDistance, speed } = player.gameValue;
  if(key === 'ArrowUp' || key === 'ArrowDown' || 
     key === 'ArrowRight' || key === 'ArrowLeft') e.preventDefault();

  if(key === 'ArrowUp' && !player.isJump && !player.inAir) {
    jumpToFall(jump, fall)(jumpDistance, speed);
  }

  if(key === 'ArrowRight' || key === 'ArrowLeft') {
    // 去除默認左右按鍵觸發滾動條事件
    clearInterval(mark.move);
    mark.move = setInterval(move, 0, key, speed); 
  }
}

// 按下鍵盤後開始控制物體移動
document.body.addEventListener('keydown', jumpOrMove);
// 鬆開按鍵後移動停止
document.body.addEventListener('keyup', moveStop);

export default fall;