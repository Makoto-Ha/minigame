import animate from './animation.js';
import { foodTarget } from './food.js';
import { platformsTarget } from './platform.js';

// 本體玩家
const player = document.getElementById('player');
// 狀態初始化
player.isJump = false;
player.isFall = false;
player.isStand = false;
player.direction = null;
// 跳躍高度、移動速度初始值
player.originValue = {
  jumpDistance: 240,
  speed: 4
}
// 跳躍高度、移動速度遊戲進行中變化的值(包含平臺下面的高度)
player.gameValue = {
 ...player.originValue 
}

// 升級多少能力
player.upgraded = {
  jumpDistance: 0,
  speed: 0
}

// 有沒有吃到食物
player.isEat = function() {
  let foodLocation = foodTarget();
  // 吃到食物了嗎
  let isEatFood = this.offsetLeft > foodLocation.left - this.clientWidth && 
                  this.offsetLeft < foodLocation.right &&
                  this.offsetTop > foodLocation.top - this.clientHeight &&
                  this.clientHeight + parseInt(this.style.bottom) > foodLocation.bottom;
                  
  return isEatFood;
}

// 有沒有碰到平台
player.isTouch = function(key) { 
  let platformsLocation = platformsTarget();
  let istouch = platformsLocation.some(location => {
    return  this.offsetLeft + this.clientWidth >= location.left &&
            document.body.clientWidth - this.offsetLeft >= location.right &&
            this.clientHeight + parseInt(this.style.bottom) > location.bottom &&
            this.offsetTop + this.clientHeight > location.top;
                                    
  });

  if(player.direction !== key && istouch) return false;
 
  player.direction = key; 

  return istouch;
}

// 玩家數值變化
player.changes = function({ body: { width, height }, ability: { speed,  jumpDistance} }) {
  return () => { 
    animate('bigChange', this, { width, height });
    this.gameValue.speed += speed;
    this.gameValue.jumpDistance += jumpDistance;
  }
}

export default player;