const markAnimate = {
  bigchange: null
}
const bigChange = (target, max) => {
  let width = 0, height = 0;
  return () => {
    if(width >= max.width && height >= max.height) {
      clearInterval(markAnimate.bigchange);
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

const animate = (type, target, max) => {
  switch(type) {
    case 'bigChange':
      markAnimate.bigchange = setInterval(bigChange(target, max), 100);
  }   
}

export { animate };