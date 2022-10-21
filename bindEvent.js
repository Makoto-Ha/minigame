import { mapInitialization } from './module.js'
import { jumpOrMove, moveStop } from './module.js'
import { startDetect } from './module.js'

// 地圖初始化
window.addEventListener('load', mapInitialization);
// 綁定更新地圖資訊、移動、偵測
document.body.addEventListener('keydown', jumpOrMove); 
document.body.addEventListener('keydown', startDetect);

// 按鍵鬆開停止更新地圖資訊、移動
document.body.addEventListener('keyup', moveStop);