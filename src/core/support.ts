const webkitBackdrop = '-webkit-backdrop-filter'

export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false
  }

  return CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports(webkitBackdrop, 'blur(1px)')
}

export function isWeChatWebView(ua: string = typeof navigator !== 'undefined' ? navigator.userAgent : ''): boolean {
  return /MicroMessenger/i.test(ua)
}

export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }

  const ua = navigator.userAgent
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4

  const lowEndUA = /Android\s(4|5|6|7)/i.test(ua)
  return memory <= 3 || cores <= 4 || lowEndUA
}
