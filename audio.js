function playAudio() {
  let audio = document.createElement('audio');
  document.body.appendChild(audio);
  audio.style = `
    position: absolute;
    top: -100px;
    left: -100px;
    z-index: -999;
    visibility: hidden;
  `;
  audio.src = 'mari.mp3';
  audio.volume = 0.1;
  audio.addEventListener('ended', function() { this.remove(); });
  audio.play();
};

export default playAudio;