let audioCtx = null
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.6) {
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

export const sounds = {
  success: () => {
    playTone(660, 0.12, 'sine', 0.7)
    setTimeout(() => playTone(990, 0.18, 'sine', 0.7), 110)
  },
  error: () => {
    playTone(200, 0.22, 'square', 0.7)
    setTimeout(() => playTone(140, 0.28, 'square', 0.7), 180)
  },
  warning: () => {
    playTone(520, 0.15, 'triangle', 0.7)
    setTimeout(() => playTone(520, 0.15, 'triangle', 0.7), 200)
  },
  info: () => {
    playTone(880, 0.15, 'sine', 0.7)
  },
}