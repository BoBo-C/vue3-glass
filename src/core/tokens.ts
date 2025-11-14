import type { GlassThemeTokens, MaterialType } from './types'

const defaultNoise =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGElEQVQ4T2NkwAIYBaNgFIwCjYFIMAo2BUFADp0BDG/ZH70AAAAASUVORK5CYII='

const materialDefaults: Record<MaterialType, GlassThemeTokens['material'][MaterialType]> = {
  ultraThin: {
    blur: 6,
    opacityLight: 0.12,
    opacityDark: 0.18,
    saturate: 1.6,
    brightness: 1.05,
    contrast: 0.85
  },
  thin: {
    blur: 12,
    opacityLight: 0.16,
    opacityDark: 0.22,
    saturate: 1.7,
    brightness: 1.06,
    contrast: 0.85
  },
  regular: {
    blur: 20,
    opacityLight: 0.24,
    opacityDark: 0.3,
    saturate: 1.8,
    brightness: 1.08,
    contrast: 0.86
  },
  thick: {
    blur: 30,
    opacityLight: 0.32,
    opacityDark: 0.38,
    saturate: 1.9,
    brightness: 1.1,
    contrast: 0.88
  },
  ultraThick: {
    blur: 40,
    opacityLight: 0.38,
    opacityDark: 0.44,
    saturate: 2,
    brightness: 1.12,
    contrast: 0.9
  }
}

export const defaultGlassTokens: GlassThemeTokens = {
  material: materialDefaults,
  tintRGB: [255, 255, 255],
  radius: '16px',
  borderColorRGB: [255, 255, 255],
  borderOpacity: 0.4,
  highlightOpacity: 0.6,
  shadowAmbient: '0 6px 20px rgba(0,0,0,.12)',
  noiseImage: defaultNoise,
  noiseOpacity: 0.03
}

export function mergeTokens(partial?: Partial<GlassThemeTokens>): GlassThemeTokens {
  if (!partial) {
    return defaultGlassTokens
  }

  const merged: GlassThemeTokens = {
    ...defaultGlassTokens,
    ...partial,
    material: { ...defaultGlassTokens.material }
  }

  if (partial.material) {
    for (const key of Object.keys(partial.material) as MaterialType[]) {
      merged.material[key] = {
        ...defaultGlassTokens.material[key],
        ...partial.material[key]
      }
    }
  }

  return merged
}
