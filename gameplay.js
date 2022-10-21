import { settingPlatForms, platformsMove, leavePlatForm } from './module.js';
import { settingFood, eatFood } from './module.js';
import { playerFollowView } from './module.js';

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

// 環境偵測
const envDetect = (key, revice) => {
  // 偵測移動
  const move = () => {
    clearInterval(mark.detect.move);
    return () => {
      if(player.isEat() && food.style.display !== 'none') {
        eatFood(player.changes(revice.player));
      }  
    }
  }

  // 偵測跳躍，跟移動不同，跳躍不能按住，所以必須偵測到落地
  const jump = () => {
    if(!player.isJump) clearInterval(mark.detect.jump);
    eatFood(player.changes(revice.player));
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
  // 天空
  const sky = document.querySelector('.sky');
  // 移動調用環境偵測
  envDetect(key, updateValue); 

  // 提升能力後，在畫面上顯示升級訊息
  const message = ({ type, ability }) => {
    let span = document.createElement('span');
    let food = document.querySelector('.food');
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
const gameStop = ({ key }) => {
  if(key === 'ArrowRight' || key === 'ArrowLeft') clearInterval(mark.detect.move); 
}

const startDetect = ({ key }) => {
  const isGround = () => parseInt(player.style.bottom) === 0;
  // 防止在平臺上也能觸發
  if(key === 'ArrowUp' && isGround()) {
    const detect = () => {
      const toDetect = program => program.every(execute => execute());
      // 返回true用於contOrEnd偵測繼續
      const env = () => {
        leavePlatForm(player, 'move');
        return true;
      }
      // 結束或著繼續偵測
      const valve = () => !isGround() || clearInterval(mark.detect.env);
   
      // 偵測啟動
      toDetect([valve, env]);
    }

    mark.detect.env = setInterval(detect);
  }
}

// --------------參數設置--------------
// 設置跟隨玩家視角距離，參數為兩個數字(number)
playerFollowView(400, 500);

// 設置食物，參數為兩個字串數字(number string)或數字(number)
settingFood(3000, -300); 

// 設置平臺座標，參數為一個物件
// x, y(number)初始位置、count(number)數量、color(array)顏色、interval(object)的x, y為間隔
settingPlatForms({
  x: 700,
  y: 0,
  width: 300,
  height: 60,
  count: 10,
  color: ['black', 'purple', 'blue', 'gray', 'black', 'gray', '', '', '', 'yellow'],
  interval: {
    x: 200,
    y: 200,
    width: 20,
    height: 4
  }
});
// 設置平臺移動，參數為一個物件
// canMove(array)准許動的，可傳入省略號例如['1-9']、speed(number)移動速度
platformsMove({
  whichMove: [1, 3, 5, 6, 8, 9],
  speed: 0
});

//---------------------------------

// 只能匯出給bindEvent模塊，gameplay.js不能匯出給其他模塊用
export { startDetect }; 