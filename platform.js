import animate from './animation.js';
import fall from './move.js';

const sky = document.querySelector('.sky');
const floor = document.querySelector('.floor');
let platforms;

const platformsTarget = () => {
  let locations = [];
  platforms.forEach(platform => {
    let location = {
      self: platform,
      left: platform.offsetLeft,
      right: document.body.clientWidth - (platform.offsetLeft + platform.clientWidth),
      top: platform.offsetTop,
      bottom: document.body.clientHeight - floor.clientHeight - (platform.clientHeight + platform.offsetTop),
    }
    locations.push(location);
  })
  return locations;
}

// 刷新物體在平臺上嗎
const isStandPlatForm = target => {
  let platformsLocation = platformsTarget();
  let isStand = platformsLocation.some(location => {
    return target.offsetLeft + target.clientWidth >= location.left &&
           document.body.clientWidth - target.offsetLeft >= location.right &&
           parseInt(target.style.bottom) >= location.bottom + location.self.clientHeight &&
           target.offsetTop + target.clientHeight >= location.top;
  });
  target.isStand = isStand;
  return isStand;
}

// 有撞到平臺下面嗎
const isBelowPlatForm = target => {
  let platformsLocation = platformsTarget();
  return platformsLocation.some(location => {
    return target.offsetLeft + target.clientWidth > location.left &&
           document.body.clientWidth - target.offsetLeft > location.right &&
           parseInt(target.style.bottom) + target.clientHeight >= location.bottom &&
           target.offsetTop + target.clientHeight >= location.top + location.self.clientHeight;
  }); 
}

// 設置所有平臺
const settingPlatForms = (
    initial = { 
      x: 300, 
      y: 40, 
      count: 1, 
      color: [], 
      interval: { x: 0, y: 0 } 
    }
  ) => {
  let { interval: { x, y }, count, color } = initial;
  for(let i=0; i<count; i++) {
    let platform = document.createElement('div');
    platform.classList.add('platform');
    platform.style = `
      position: absolute;
      left: ${initial.x}px;
      bottom: ${initial.y}px;
      width: 300px;
      height: 40px;
      background: ${color[i] || 'blue'};
    `;
    sky.insertAdjacentElement('beforeend', platform);
    initial.x += x;
    initial.y += y;
  }
  platforms = document.querySelectorAll('.platform');
}

// 平臺上移動至外觸發掉落
const leavePlatForm = (target, method) => {  
  let isStand = isStandPlatForm(target);
  let isEverStand = controller.leavePlatForm; 

  let whichLeave = type => {
    switch(type) {
      case 'move':
      return !isStand && !target.isJump;
    }
  }

  let checkStand = () => {
    return isStand || isEverStand;
  }

  let moveLeave = () => {
    controller.leavePlatForm = true;
    return whichLeave(method);
  }

  let startFall = () => {
    controller.leavePlatForm = false;
    clearInterval(mark.fall);
    mark.fall = setInterval(fall, 0, 4);
  }

  let program = [checkStand, moveLeave, startFall];

  program.every(execute => execute());
}

// 控制那些可以平臺移動和速度
const platformsMove = value => {
  let whichMove = value.whichMove[0];
  // 檢測是否為字串，是的話就是省略寫法，要特別處理
  if(typeof whichMove === 'string') {
    // 這個檢測例如['1-9']，就讓第1-9的平臺移動
    if(/^[0-9]\-[0-9]$/.test(whichMove)) {
      let filterMove = [];
      for(let i=+whichMove[0]-1; i<+whichMove[2]; i++) {
        filterMove.push([...platforms][i]);
      }
      return animate('platformsMove', filterMove, { speed: value.speed });
    }else {
      // 是字串，但傳入的是奇怪的字串，例如['a-1']、[11-9]
      animate('platformsMove', platforms, { speed: 0 });
    }

  }else {
    // try catch捕獲防止解構失敗，失敗代表傳入的是陣列以外的值，就讓全部移動
    // 陣列裡面不是字串的話，代表傳入的都是各個數字，就讓各個移動
    try {
      let { whichMove, speed } = value;
      let whichMovePlatforms = [...platforms].filter((_, i) => whichMove.some(num => num-1 === i));
      animate('platformsMove', whichMovePlatforms, { speed });
    }catch {
      animate('platformsMove', platforms, { speed: 0 });
    }
  }
}

export {  
  platformsTarget,
  isBelowPlatForm,
  settingPlatForms, 
  platformsMove, 
  leavePlatForm 
};