import player from './player.js';
import { food, createFood, settingFood } from './food.js';

// 天空
const sky = document.querySelector('.sky');
// 標記用
const mark = {
  move: null,
  jump: null,
  keyboard: {
    k: null
  }
}
// 能力提升變化參數設置
const valueChange = {
  player: {
    body: {
      width: 10,
      height: 10
    },
    ability: {
      speed: 1,
      jumpDistance: 30
    }
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
// 遊玩
const gameplay = ({ key }) => {

  // 移動調用環境偵測
  envDetect(key, valueChange); 

  // 提升能力後，在畫面上顯示升級訊息
  const message = ({ type, ability }) => {
    let span = document.createElement('span');
    if(food.nextSibling) {
      food.nextSibling.remove();
    }
    span.innerHTML = `
    <span>
      <p>${type}</p>
      <p>${ability}</p>
    </span>
    `;
    span.style = `
      position: absolute;
      width: 200px;
      height: 30px;
      right: 0;
      left: 0;
      margin: 30px auto;
      color: red;
      font-size: 30px;
    `
    sky.appendChild(span);
    clearTimeout(mark.keyboard.k);
    mark.keyboard.k = setTimeout(() => {
      if(food.nextSibling) {
        food.nextSibling.remove()
      }
    }, 2000);
  } 
  // 按鍵J增強跳躍
  if(key === 'j') {
    message({
      type: '跳躍升級',
      ability: `當前跳躍: ${player.gameValue.jumpDistance}`
    });
    player.gameValue.jumpDistance += 10;
  }
  // 按鍵K增加移動速度
  if(key === 'k') {
    message({
      type: '速度升級',
      ability: `當前速度: ${player.gameValue.speed}`
    });
    player.gameValue.speed += 1;  
  }

  if(key === 'h') {
    message({
      type: '能力重置',
      ability: `當前速度: ${player.gameValue.speed}，當前跳躍: ${player.gameValue.jumpDistance}`
    });
    player.gameValue.speed = 3;
    player.gameValue.jumpDistance = 240;
  }

  if(key === 'g') {
    message({
      type: '體積重置',
      ability: '大小還原'
    });
    player.style.width = '100px';
    player.style.height = '100px';

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

// 起始設置Food
settingFood(); 

//---------------------------------