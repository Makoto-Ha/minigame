const player = document.getElementById('player');
const food = document.querySelector('.food');
let eatX = food.offsetLeft - player.clientWidth;
let stop, change = true;
document.body.addEventListener('keydown', () => {
 if(change && food.style.display !== 'none') {
  change = false;
  stop = setInterval(() => {
    console.log('fps');
    if(player.offsetLeft > eatX) {
      food.style.display = 'none';
      player.style.width = parseInt(getComputedStyle(player, null).width) + 20 + 'px';
      clearInterval(stop);
      change = true;
      setTimeout(() => {
        food.style.display = 'block';
      }, 1000)
    }
  }, 30) 
 }
});  

document.body.addEventListener('keyup', (e) => {
  if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    clearInterval(stop);
    change = true;
  }
});  