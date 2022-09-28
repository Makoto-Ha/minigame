(function(speed = 1) {
  // 體體玩家
  const player = document.getElementById('player');
  // 標記用
  let mark = { 
    move: null, 
    fall: null, 
    jump: null
  };
  // 初始化
  player.isJump = false;
  player.currentKeyboard = null;
  // 控制物體左右跳
  const move = (key, speed) => { 
    clearInterval(mark.move);
    return () => {
      // 紀錄當前按住的按鍵
      player.currentKeyboard = key;
      if(key === 'ArrowRight')  player.style.left = player.offsetLeft + speed + 'px';
      
      if(key === 'ArrowLeft') player.style.left = player.offsetLeft - speed + 'px';
    }
  }

  // 控制物體跳躍
  const jump = () => {
    player.style.bottom = parseInt(getComputedStyle(player, null).bottom) + 1 + 'px';

    if(parseInt(player.style.bottom) > 120) {
      clearInterval(mark.jump);
      mark.fall = setInterval(fall);
    }
  }

  // 物體跳完後自動落下
  const fall = () => {
    if(parseInt(player.style.bottom) > 0) {
      player.style.bottom = parseInt(player.style.bottom) - 1 + 'px';
    }

    if(parseInt(player.style.bottom) <= 0) {
      clearInterval(mark.fall);
      player.isJump = false;
    }
  }
  // 移動停止
  const moveStop = event => {
    // 檢查是否是和當初按住的按鍵一樣
    if(event.key === player.currentKeyboard) {
      clearInterval(mark.move);
    }
  }

  // 判斷是左右移動還是跳躍
  const jumpORMove = event => {
    if(event.key === 'ArrowUp' && !player.isJump){
      player.isJump = true;
      mark.jump = setInterval(jump);
    }
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      mark.move = setInterval(move(event.key, speed));   
    }
  }

  // 按下鍵盤後開始控制物體移動
  document.body.addEventListener('keydown', jumpORMove);
  // 鬆開按鍵後移動停止
  document.body.addEventListener('keyup', moveStop);
})(+prompt());