import player from './player.js';

(function() {
  // 標記用
  const mark = { 
    move: null, 
    fall: null, 
    jump: null
  };
  // 控制物體左右移動
  const move = (key, speed) => { 
    const animation = () => {
      // 紀錄當前按住的按鍵
      player.currentKeyboard = key;
      if(key === 'ArrowRight')  player.style.left = player.offsetLeft + speed + 'px';
      
      if(key === 'ArrowLeft') player.style.left = player.offsetLeft - speed + 'px';
    }
    clearInterval(mark.move);
    mark.move = setInterval(animation); 
  }

  // 跳躍
  const jump = (fallAnimation, distance, speed) => {
    // 跳躍的動畫
    const animation = () => {
      player.style.bottom = parseInt(getComputedStyle(player, null).bottom) + speed + 'px';

      // 判斷跳躍是否到最高點後，開始落下
      if(parseInt(player.style.bottom) > distance) {
        clearInterval(mark.jump);
        fall.now(fallAnimation);
      }
    }
      
    player.isJump = true;
    mark.jump = setInterval(animation);
  }

  // 落下
  const fall = speed => {
    // 綁定落下的動畫
    fall.now = animation => mark.fall = setInterval(animation);
    return () => {
      if(parseInt(player.style.bottom) > 0) {
        player.style.bottom = parseInt(player.style.bottom) - speed + 'px';
      }
  
      if(parseInt(player.style.bottom) <= 0) {
        clearInterval(mark.fall);
        player.isJump = false;
      }
    }
  }

  // 跳躍落下組合
  const jumpToFall = (jump, fall) => {
    return (distance, speed) => {
      jump(fall(speed), distance, speed);
    }
  }

  // 移動停止
  const moveStop = ({ key }) => {
    // 檢查是否和當初按住的按鍵一樣
    if(key === player.currentKeyboard) {
      clearInterval(mark.move);
    }
  }

  // 判斷左右移動還是跳躍
  const jumpAndMove = ({ key }) => {
    let { jumpDistance, speed } = player.gameValue;
    if(key === 'ArrowUp' && !player.isJump) jumpToFall(jump, fall)(jumpDistance, speed);
    if(key === 'ArrowRight' || key === 'ArrowLeft') move(key, speed);
  }

  // 按下鍵盤後開始控制物體移動
  document.body.addEventListener('keydown', jumpAndMove);
  // 鬆開按鍵後移動停止
  document.body.addEventListener('keyup', moveStop);
})();