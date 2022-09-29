const player = document.getElementById('player');
const food = document.querySelector('.food');
let stop, envMark;
const envDetect = () => {
  const detect = () => {
    // 環境
  }
  clearInterval(envMark); // 清除上一個環境偵測
  envMark = setInterval(detect,33);
}
document.body.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') envDetect(); // 調用環境偵測
  if(food.style.display !== 'none') {

    if(player.offsetLeft > food.offsetLeft - player.clientWidth) {
      food.style.display = 'none';
      player.style.width = parseInt(getComputedStyle(player, null).width) + 20 + 'px';
      setTimeout(() => food.style.display = 'block', 5000)
    }
   }


});  

document.body.addEventListener('keyup', (e) => {
  if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') clearInterval(envMark);
});  