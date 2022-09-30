const player = document.getElementById('player');
const food = document.querySelector('.food');
const floor = document.querySelector('.background > div:nth-child(1)');
let mark = {
  move: null,
  jump: null
}
food.style.top = Math.ceil(Math.random()*(document.body.clientHeight - floor.clientHeight - food.clientHeight)) + 'px';
food.style.left = Math.ceil(Math.random()*(document.body.clientWidth - food.clientWidth)) + 'px';
// 環境碰撞偵測
const envDetect = key => {
  // 環境
  const detect = () => {
    // 食物位置
    let foodLocation = {
      left: food.offsetLeft,
      right: food.offsetLeft,
      top: food.offsetTop,
      bottom: document.body.clientHeight - floor.clientHeight - (food.offsetHeight + food.offsetTop)
    }
    if(food.style.display !== 'none') {
      let eatDistance = player.offsetLeft > foodLocation.left - player.clientWidth && 
                        player.offsetLeft < foodLocation.right + food.clientWidth &&
                        player.offsetTop > foodLocation.top - player.clientHeight &&
                        player.clientHeight + parseInt(player.style.bottom) > foodLocation.bottom;
                        
      if(eatDistance) {
        food.style.display = 'none';
        player.style.width = parseInt(getComputedStyle(player, null).width) + 20 + 'px';
        setTimeout(() => {
          food.style.display = 'block'
          food.style.top = Math.ceil(Math.random()*(document.body.clientHeight - floor.clientHeight - food.clientHeight)) + 'px';
          food.style.left = Math.ceil(Math.random()*(document.body.clientWidth - food.clientWidth)) + 'px';
        }, 3000)
      }
    }

    if(!player.isJump) clearInterval(mark.jump);
    console.log('環境fps測試');
  }

  // 清除上一個環境偵測
  clearInterval(mark.move); 
  if(key === 'ArrowRight' || key === 'ArrowLeft') 
    mark.move = setInterval(detect);

  if(key === 'ArrowUp' && parseInt(player.style.bottom) === 0) 
    mark.jump = setInterval(detect);
  
}
document.body.addEventListener('keydown', e => {
  // 移動開始調用環境偵測
  if(e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') envDetect(e.key); 
  if(e.key === 'j') {
    player.gameValue.jumpDistance += 10;
    console.log(player.gameValue.jumpDistance);
    console.log('跳躍升級成功');
  }
  if(e.key === 'k') {
    player.gameValue.speed += 1;
    console.log(player.gameValue.speed);
    console.log('速度升級成功');
  }
});  

document.body.addEventListener('keyup', e => {
  if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') clearInterval(mark.move); 
});  