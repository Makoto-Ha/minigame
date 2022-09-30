// 玩家
const player = document.getElementById('player');
// 食物
const food = document.querySelector('.food');
// 地板
const floor = document.querySelector('.background > div:nth-child(1)');
// 標記用
const mark = {
  move: null,
  jump: null
}
// 個體變化參數設置
const objChange = {
  player: {
    width: 30,
    height: 30
  }
} 
// 設置food位置
const settingFood = () => {
  food.style.display = 'block';
  food.style.top = Math.ceil(Math.random()*(document.body.clientHeight - floor.clientHeight - food.clientHeight)) + 'px';
  food.style.left = Math.ceil(Math.random()*(document.body.clientWidth - food.clientWidth)) + 'px';
}
 // 有沒有吃到食物
player.isEat = function() {
  // 食物位置
  let foodLocation = {
    left: food.offsetLeft,
    right: food.offsetLeft + food.clientWidth,
    top: food.offsetTop,
    bottom: document.body.clientHeight - floor.clientHeight - (food.offsetHeight + food.offsetTop)
  }
  // 吃到食物了嗎
  let isEatFood = this.offsetLeft > foodLocation.left - this.clientWidth && 
                  this.offsetLeft < foodLocation.right &&
                  this.offsetTop > foodLocation.top - this.clientHeight &&
                  this.clientHeight + parseInt(this.style.bottom) > foodLocation.bottom;
                  
  return isEatFood;
}

// 玩家數值變化
player.changes = ({ width, height }) => {
  return () => {
    player.style.width = parseInt(getComputedStyle(player, null).width) + width + 'px';
    player.style.height = parseInt(getComputedStyle(player, null).height) + height + 'px';
  }
}

// 正在吃食物
const eating = (create, revise, after) => {
  food.style.display = 'none';
  after(create, revise);
}

// 吃完食物後
const eatAfter = (creating, playerChange) => {
  creating();
  playerChange();
}

// 創建食物
const createFood = () => {
  console.log('創建');
  setTimeout(settingFood, 3000);
}

// 吃食物動作組合
const eatFood = (eat, create, revise) => eat(create, revise, eatAfter);

// 環境偵測
const envDetect = (key, revice) => {

  // 偵測移動
  const move = clear => {
    clear(mark.move);
    return () => {
      if(player.isEat() && food.style.display !== 'none') 
        eatFood(eating, createFood, player.changes(revice.player));
    }
  }

  // 偵測跳躍，跟移動不同，跳躍不能按住，所以必須偵測到落地
  const jump = () => {
    if(!player.isJump) clearInterval(mark.jump);
    if(player.isEat() && food.style.display !== 'none') 
      eatFood(eating, createFood, player.changes(revice.player));
  }

  // 左右移動偵測
  if(key === 'ArrowRight' || key === 'ArrowLeft') {
    mark.move = setInterval(move(clearInterval));
  }
  
  // 跳躍偵測 
  if(key === 'ArrowUp' && parseInt(player.style.bottom) === 0) 
    mark.jump = setInterval(jump);
  
}

const gameplay = e => {
  // 移動開始調用環境偵測
    envDetect(e.key, objChange); 
  // 按鍵J增強跳躍
  if(e.key === 'j') {
    player.gameValue.jumpDistance += 10;
    console.log(player.gameValue.jumpDistance);
    console.log('跳躍升級成功');
  }
  // 按鍵K增加移動速度
  if(e.key === 'k') {
    player.gameValue.speed += 1;
    console.log(player.gameValue.speed);
    console.log('速度升級成功');
  }

}

// 鬆開按鍵停止遊戲
const gameStop = e => {
  if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') clearInterval(mark.move); 
}

// --------------入口--------------

// 按鍵開始遊戲
document.body.addEventListener('keydown', gameplay); 

// 離開按鍵終止遊戲
document.body.addEventListener('keyup', gameStop);  

// 開始設置Food
settingFood(); 

//---------------------------------