const bigChange = (target, max) => {
  let width = 0, height = 0;
  return () => {
    if(width >= max.width && height >= max.height) {
      clearInterval(mark.bigChange);
      width = 0;
      height = 0;
    }
  
    if(width <= max.width) {
      target.style.width = parseInt(getComputedStyle(target, null).width) + 4 + 'px';
      width += 4;
    }
    
    if(height <= max.height) {
      target.style.height = parseInt(getComputedStyle(target, null).height) + 4 + 'px';
      height += 4;
    }
  }
}

const platformsMove = platforms => {
  let count = 0, toggle = true;
  return () => { 
    if(count < 300 && toggle) {
      platforms.forEach(platform => platform.style.left = parseInt(platform.style.left) + 1 + 'px');
      count++;
    }else {
      toggle = false;
    }

    if(count <= 300 && !toggle) {
      platforms.forEach(platform => platform.style.left = parseInt(platform.style.left) - 1 + 'px');
      count--;
    }

    if(count === -300) {
      toggle = true;
    }

  }
}

const animate = (type, target, value) => {
  switch(type) {
    case 'bigChange':
      mark.bigChange = setInterval(bigChange(target, value), 180);
    case 'platformsMove':
      mark.platformMove = setInterval(platformsMove(target), value.speed);
  }   
}

export default animate;