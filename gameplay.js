import player from './player.js';
import { food, createFood, settingFood } from './food.js';
import { settingPlatForms, platformsMove, leavePlatForm } from './platform.js';
import audio from './audio.js'

// 天空
const sky = document.querySelector('.sky');
// 地板
const floor = document.querySelector('.floor');
// 標記用
window.mark = {
  fall: null,
  move: null,
  jump: null,
  detect: {
    env: null,
    move: null,
    jump: null
  },
  keyboard: {
    k: null
  },
  animate: {
    bigChange: null,
    platformMove: null
  }
}

// 開關用
window.controller = {
  leavePlatForm: false
}

// 能力提升變化參數設置
const updateValue = {
  player: {
    body: {
      width: 10,
      height: 10
    },
    ability: {
      speed: 1,
      jumpDistance: 10
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
  audio();
}

// 吃食物動作組合
const eatFood = (eat, create, revise) => eat(create, revise, eatAfter);

// 環境偵測
const envDetect = (key, revice) => {
  // 偵測移動
  const move = () => {
    clearInterval(mark.detect.move);
    return () => {
      if(player.isEat() && food.style.display !== 'none') {
        eatFood(eating, createFood, player.changes(revice.player));
      }  
    }
  }

  // 偵測跳躍，跟移動不同，跳躍不能按住，所以必須偵測到落地
  const jump = () => {
    if(!player.isJump) clearInterval(mark.detect.jump);
   
    if(player.isEat() && food.style.display !== 'none') 
      eatFood(eating, createFood, player.changes(revice.player));
  }

  // 左右移動偵測
  if(key === 'ArrowRight' || key === 'ArrowLeft') {
    mark.detect.move = setInterval(move());
  }

  // 跳躍偵測 
  if(key === 'ArrowUp') mark.detect.jump = setInterval(jump);
  
}
// 遊玩
const gameplay = ({ key }) => {
  // 移動調用環境偵測
  envDetect(key, updateValue); 

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

  let { jumpDistance, speed } = updateValue.player.ability; 
  let { jumpDistance: originJump, speed: originSpeed } = player.originValue;
  // 按鍵J增強跳躍
  if(key === 'j') {
    player.upgraded.jumpDistance += jumpDistance;
    player.gameValue.jumpDistance += jumpDistance;
    message({
      type: '跳躍升級',
      ability: `當前跳躍: ${originJump + player.upgraded.jumpDistance}`
    });
  }
  // 按鍵K增加移動速度
  if(key === 'k') {
    player.upgraded.speed += speed;
    player.gameValue.speed += speed;  
    message({
      type: '速度升級',
      ability: `當前速度: ${player.gameValue.speed}`
    });
  }

  if(key === 'h') {
    player.gameValue.speed = originSpeed;
    player.gameValue.jumpDistance = originJump;
    message({
      type: '能力重置',
      ability: `當前速度: ${player.gameValue.speed}，當前跳躍: ${player.gameValue.jumpDistance}`
    });  
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
  if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') clearInterval(mark.detect.move); 
}

const startDetect = ({ key }) => {
  const isAboveGround = () => {
    return parseInt(player.style.bottom) !== 0;
  }
  // 防止在平臺上也能觸發
  if(key === 'ArrowUp' && !isAboveGround()) {
    mark.detect.env = setInterval(() => {
      // 閥門
      const isContinue = program => program.every(execute => execute());
      // 偵測玩家站在平臺和離開平臺
      // 返回true用於valve閥門，返回true就不會執行clearInterval
      const env = () => {
        leavePlatForm(player, 'move');
        return true;
      }
      // 結束偵測
      const valve = result => {
        result || clearInterval(mark.detect.env);
      }
      // 啟動
      valve(isContinue([isAboveGround, env]));
    });
  }
}

// --------------入口--------------

// 按鍵開始遊戲
// document.body.addEventListener('keydown', gameplay); 
document.body.addEventListener('keydown', startDetect); 

// 離開按鍵終止遊戲
// document.body.addEventListener('keyup', gameStop); 

window.addEventListener('load', () => {
  // 滾動條重置
  setTimeout(() => document.documentElement.scrollLeft = 0);
  // 寬度拓展
  sky.style.width = document.body.scrollWidth + 'px';
  floor.style.width = document.body.scrollWidth + 'px';
});

// 設置食物
settingFood(); 

// 設定平臺座標，參數為一個物件
// x, y(number)初始位置、count(number)數量、color(array)顏色、interval(object)的x, y為間隔
settingPlatForms({
  x: 300,
  y: 120,
  count: 10,
  color: ['black', 'purple', 'blue', 'gray', 'black', 'gray', '', '', '', 'yellow'],
  interval: {
    x: 200,
    y: 200
  }
});
// 啟動平臺移動，參數為一個物件
// canMove(array)准許動的，可傳入省略號例如['1-9']、speed(number)移動速度
platformsMove({
  whichMove: [1],
  speed: 0
});

//---------------------------------