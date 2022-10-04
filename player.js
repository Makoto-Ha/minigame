import { animate } from './animation.js';
import { foodTarget } from './food.js';
// 本體玩家
const player = document.getElementById('player');
// 狀態初始化
player.isJump = false;
player.currentKeyboard = null;
// 跳躍高度、移動速度初始化
player.gameValue = {
  jumpDistance: 240,
  speed: 3,
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

// 玩家數值變化
player.changes = function({ body: { width, height }, ability: { speed,  jumpDistance} }) {
  let audio = document.createElement('audio');
  document.body.appendChild(audio);
  audio.style = `
    position: absolute;
    top: -100px;
    left: -100px;
    z-index: -999;
    visibility: hidden;
  `;
  audio.src = 'mari.mp3';
  audio.volume = 0.1;
  audio.addEventListener('ended', function() {
    this.remove();
  })
  return () => { 
    audio.play();
    animate('bigChange', this, { width, height });
    this.gameValue.speed += speed;
    this.gameValue.jumpDistance += jumpDistance;
  }
}

export default player;