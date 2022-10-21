import { updatePlatfroms, clearContUpdate, mapInitialization } from './environment.js'
import { jumpOrMove, moveStop } from './move.js'
import { startDetect } from './gameplay.js'

// 地圖初始化
window.addEventListener('load', mapInitialization);
// 綁定更新地圖資訊、移動、偵測
document.body.addEventListener('keydown', updatePlatfroms());
document.body.addEventListener('keydown', jumpOrMove); 
document.body.addEventListener('keydown', startDetect);

// 按鍵鬆開停止更新地圖資訊、移動
document.body.addEventListener('keyup', clearContUpdate); 
document.body.addEventListener('keyup', moveStop);