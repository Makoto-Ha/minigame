import { audio } from './module.js';

// 食物
const food = document.querySelector('.food');
// 地板
const floor = document.querySelector('.floor');

// 創建食物
const createFood = () => setTimeout(settingFood, 3000);

// 獲取食物位置
const foodTarget = () => {
  return {
    left: food.offsetLeft,
    right: food.offsetLeft + food.clientWidth,
    top: food.offsetTop,
    bottom: document.body.clientHeight - floor.clientHeight - (food.clientHeight + food.offsetTop)
  }
};

// 設置food位置
const settingFood = (top, left) => {
  food.style.display = 'block';
  if(Number(top) && Number(left)) {
    food.style.top = top + 'px';
    food.style.left = left + 'px';
  }else {
    food.style.top = Math.ceil(Math.random()*(document.body.clientHeight - floor.clientHeight - food.clientHeight)) + 'px';
    food.style.left = Math.ceil(Math.random()*(document.body.clientWidth - food.clientWidth)) + 'px';
  }
};

// 吃食物動作組合
const eatFood = revise => {
  if(player.isEat() && food.style.display !== 'none') eating(revise);
}
// 正在吃食物
const eating = revise => {
  food.style.display = 'none';
  eatAfter(revise);
}

// 吃完食物後
const eatAfter = playerChange => {
  createFood();
  playerChange();
  audio();
}

export { settingFood, foodTarget, eatFood };