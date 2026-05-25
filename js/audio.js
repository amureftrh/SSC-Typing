export const audioState = {
  profile: 'mute', 
  volume: 0.5,
  context: null,
  masterGain: null,
  buffers: {
    generic: [],
    space: null,
    backspace: null,
    enter: null
  }
};

export function initAudio() {
  if (!audioState.context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioState.context = new AudioContext();
    audioState.masterGain = audioState.context.createGain();
    audioState.masterGain.connect(audioState.context.destination);
    updateMasterVolume();
  } else if (audioState.context.state === 'suspended') {
    audioState.context.resume();
  }
}

export function setVolume(vol) {
  audioState.volume = Math.max(0, Math.min(1, vol));
  updateMasterVolume();
}

function updateMasterVolume() {
  if (audioState.masterGain) {
    audioState.masterGain.gain.setValueAtTime(audioState.volume, audioState.context.currentTime);
  }
}

export async function setSoundProfile(profile) {
  audioState.profile = profile;
  
  if (profile === 'mute') return;
  
  initAudio();
  await loadProfileBuffers(profile);
}

async function loadBuffer(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return await audioState.context.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.error("Failed to load audio:", url, e);
    return null;
  }
}

async function loadProfileBuffers(profile) {
  // Clear old buffers
  audioState.buffers = { generic: [], space: null, backspace: null, enter: null };
  
  const path = `assets/audio/${profile}/press`;
  
  // Load generics (R0-R4)
  const genericPromises = [];
  for (let i = 0; i <= 4; i++) {
    genericPromises.push(loadBuffer(`${path}/GENERIC_R${i}.mp3`));
  }
  
  const [generics, space, backspace, enter] = await Promise.all([
    Promise.all(genericPromises),
    loadBuffer(`${path}/SPACE.mp3`),
    loadBuffer(`${path}/BACKSPACE.mp3`),
    loadBuffer(`${path}/ENTER.mp3`)
  ]);

  audioState.buffers.generic = generics.filter(b => b !== null);
  audioState.buffers.space = space;
  audioState.buffers.backspace = backspace;
  audioState.buffers.enter = enter;
}

export function playTypingSound(key = '') {
  if (audioState.profile === 'mute' || audioState.volume <= 0) return;
  
  initAudio();
  if (!audioState.context) return;
  
  let bufferToPlay = null;
  
  if (key === 'Backspace' && audioState.buffers.backspace) {
    bufferToPlay = audioState.buffers.backspace;
  } else if (key === 'Enter' && audioState.buffers.enter) {
    bufferToPlay = audioState.buffers.enter;
  } else if (key === ' ' && audioState.buffers.space) {
    bufferToPlay = audioState.buffers.space;
  } else if (audioState.buffers.generic.length > 0) {
    // Pick a random generic row sound for variation
    const idx = Math.floor(Math.random() * audioState.buffers.generic.length);
    bufferToPlay = audioState.buffers.generic[idx];
  }

  if (!bufferToPlay && audioState.buffers.generic.length > 0) {
    bufferToPlay = audioState.buffers.generic[0]; // fallback
  }

  if (bufferToPlay) {
    const source = audioState.context.createBufferSource();
    source.buffer = bufferToPlay;
    
    // Slight randomization in pitch/volume for more realism
    source.playbackRate.value = 0.98 + (Math.random() * 0.04);
    
    const gainNode = audioState.context.createGain();
    gainNode.gain.value = 0.9 + (Math.random() * 0.2); // minor volume variation
    
    source.connect(gainNode);
    gainNode.connect(audioState.masterGain);
    
    source.start(0);
  }
}
