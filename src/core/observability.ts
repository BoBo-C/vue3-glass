export interface FpsDropDetail {
  fps: number
  engine: string
}

export type FpsListener = (detail: FpsDropDetail) => void

let listener: FpsListener | null = null
let ticking = false

export function watchFps(threshold = 45, sample = 500): void {
  if (ticking) {
    return
  }

  ticking = true
  let frames = 0
  let start = performance.now()

  const loop = () => {
    frames += 1
    const now = performance.now()
    const elapsed = now - start
    if (elapsed >= sample) {
      const fps = (frames / elapsed) * 1000
      if (fps < threshold) {
        listener?.({ fps, engine: 'css' })
      }
      frames = 0
      start = now
    }
    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}

export function onFpsDrop(cb: FpsListener): void {
  listener = cb
}

export function stopFpsWatch(): void {
  listener = null
  ticking = false
}
