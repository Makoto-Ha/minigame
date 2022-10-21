import './player.js';
import { mapInitialization, 
         playerFollowView } from './environment.js';
import { platformsTarget,
         isBelowPlatForm,
         settingPlatForms, 
         platformsMove, 
         leavePlatForm } from './platform.js';
import { fall, jumpOrMove, moveStop } from './move.js';
import { settingFood, foodTarget, eatFood } from './food.js';
import audio from './audio.js';
import animate from './animation.js';
import { startDetect } from './gameplay.js';
import './bindEvent.js';

export {
  mapInitialization, playerFollowView,
  platformsTarget, isBelowPlatForm, settingPlatForms, platformsMove, leavePlatForm,  
  fall, jumpOrMove, moveStop,
  settingFood, foodTarget, eatFood,
  audio, 
  animate, 
  startDetect 
};