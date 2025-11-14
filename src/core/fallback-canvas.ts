export interface CanvasOptions {
  blurRadius: number
  dpr?: number
  throttleMs?: number
  onError?: (e: Error) => void
}

async function ensureCanvasContext(el: HTMLElement, opts: CanvasOptions): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> {
  const rect = el.getBoundingClientRect()
  const dpr = opts.dpr ?? window.devicePixelRatio ?? 1
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(rect.width * dpr))
  canvas.height = Math.max(1, Math.round(rect.height * dpr))
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('canvas-context-unavailable')
  }

  ctx.scale(dpr, dpr)
  return { canvas, ctx }
}

export async function captureGlassBitmap(el: HTMLElement, opts: CanvasOptions): Promise<HTMLCanvasElement> {
  const html2canvas = (window as typeof window & { html2canvas?: (element: HTMLElement | Document, options?: Record<string, unknown>) => Promise<HTMLCanvasElement> }).html2canvas

  if (!html2canvas) {
    throw new Error('html2canvas-missing')
  }

  const { canvas } = await ensureCanvasContext(el, opts)
  const rect = el.getBoundingClientRect()
  const screenshot = await html2canvas(document.body, {
    useCORS: true,
    backgroundColor: null,
    scale: opts.dpr ?? window.devicePixelRatio ?? 1
  })

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('canvas-context-unavailable')
  }

  ctx.filter = `blur(${opts.blurRadius}px)`
  ctx.drawImage(
    screenshot,
    rect.left,
    rect.top,
    rect.width,
    rect.height,
    0,
    0,
    rect.width,
    rect.height
  )

  return canvas
}

export function scheduleBitmapRefresh(
  el: HTMLElement,
  opts: CanvasOptions,
  onUpdate: (canvas: HTMLCanvasElement) => void
): { cancel: () => void } {
  let frame = 0
  let last = 0
  const step = () => {
    const now = performance.now()
    if (now - last >= (opts.throttleMs ?? 160)) {
      last = now
      captureGlassBitmap(el, opts)
        .then(onUpdate)
        .catch((error) => opts.onError?.(error))
    }
    frame = requestAnimationFrame(step)
  }

  frame = requestAnimationFrame(step)

  return {
    cancel() {
      cancelAnimationFrame(frame)
    }
  }
}
