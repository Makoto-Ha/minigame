// 食物
const food = document.querySelector('.food');
// 地板
const floor = document.querySelector('.floor');

// 設置food位置
const settingFood = () => {
  food.style.display = 'block';
  // food.style.top = Math.ceil(Math.random()*(document.body.clientHeight - floor.clientHeight - food.clientHeight)) + 'px';
  food.style.top = -1000 + 'px';
  // food.style.left = Math.ceil(Math.random()*(document.body.clientWidth - food.clientWidth)) + 'px';
  food.style.left = 1000 + 'px';
};

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

export { food, settingFood, foodTarget, createFood };