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
  },
  location: {
    platforms: null
  }
}

// 開關用
window.controller = {
  leavePlatForm: false
}

const updatePlatfroms = () => {
  let toggle = true; 
  return ({ key }) => {
    let isCurrentKey = key === 'ArrowUp' || key === 'ArrowDown' ||
                       key === 'ArrowLeft' || key === 'ArrowRight';
                                       
    if(!player.isFall && isCurrentKey) {
      toggle = true;
      clearInterval(mark.location.platforms);
      mark.location.platforms = setInterval(() => {
        // import('./platform.js');
        window.platformsLocation = '';
      });
    }

    if(player.isFall && toggle) {
      toggle = false;
      clearInterval(mark.location.platforms);
      mark.location.platforms = setInterval(() => {
        // import('./platform.js');
        window.platformsLocation = '';
        if(player.isStand && player.style.bottom === 0) clearInterval(mark.location.platforms);
      });
    }

  }
}

const clearContUpdate = () => {
  if(!player.isFall) clearInterval(mark.location.platforms);
}

const mapInitialization = () => {
  // 滾動條重置
  setTimeout(() => {
    document.documentElement.scrollLeft = 0;
    document.documentElement.scrollTop = player.offsetTop - 500;
  });
  // 寬度拓展
  document.querySelector('.sky').style.width = document.body.scrollWidth + 'px';
  document.querySelector('.floor').style.width = document.body.scrollWidth + 'px';
}

const playerFollowView = ((left, top) => {
  return (updateLeft, updateRight) => {
    if(updateLeft && updateRight) {
      left = updateLeft;
      top = updateRight;
    }
    document.documentElement.scrollLeft = player.offsetLeft - left;
    document.documentElement.scrollTop = player.offsetTop - top;
    return true;
  }
})(400, 500);

export { updatePlatfroms, clearContUpdate, mapInitialization, playerFollowView };