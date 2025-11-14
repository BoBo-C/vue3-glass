import type { Plugin } from 'vue'

export type MaterialType = 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick'
export type BackdropEngine = 'auto' | 'css' | 'canvas' | 'static'
export type VibrancyMode = 'off' | 'soft' | 'strong'

export interface GlassProps {
  material?: MaterialType
  engine?: BackdropEngine
  vibrancy?: VibrancyMode
  tintRGB?: [number, number, number]
  radius?: number | string
  bordered?: boolean
  noise?: boolean
  noiseOpacity?: number
  elevation?: 0 | 1 | 2
  adaptiveOpacity?: boolean
  mobileCapBlur?: number
  throttleMs?: number
  debugId?: string
}

export interface GlassMaterialTokens {
  blur: number
  opacityLight: number
  opacityDark: number
  saturate: number
  brightness: number
  contrast: number
}

export interface GlassThemeTokens {
  material: Record<MaterialType, GlassMaterialTokens>
  tintRGB: [number, number, number]
  radius: string
  borderColorRGB: [number, number, number]
  borderOpacity: number
  highlightOpacity: number
  shadowAmbient: string
  noiseImage: string
  noiseOpacity: number
}

export interface GlassProviderOptions {
  tokens?: Partial<GlassThemeTokens>
  defaults?: Partial<GlassProps>
}

export type GlassPlugin = Plugin
