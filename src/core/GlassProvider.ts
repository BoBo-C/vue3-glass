import { computed, inject, reactive } from 'vue'
import type { App, InjectionKey, Plugin } from 'vue'
import { defaultGlassTokens, mergeTokens } from './tokens'
import type { GlassProps, GlassProviderOptions, GlassThemeTokens } from './types'

const TOKENS_KEY: InjectionKey<Readonly<GlassThemeTokens>> = Symbol('glass-tokens')
const DEFAULTS_KEY: InjectionKey<Readonly<Partial<GlassProps>>> = Symbol('glass-defaults')

export function createGlassProvider(options?: GlassProviderOptions): Plugin {
  const tokens = reactive(mergeTokens(options?.tokens))
  const defaults = reactive({
    material: 'regular',
    engine: 'auto',
    vibrancy: 'soft',
    bordered: true,
    noise: true,
    adaptiveOpacity: true,
    mobileCapBlur: 24,
    throttleMs: 160,
    elevation: 1,
    ...options?.defaults
  })

  const plugin: Plugin = {
    install(app: App) {
      provideTokens(app, tokens)
      provideDefaults(app, defaults)
    }
  }

  return plugin
}

export function provideTokens(app: App, tokens: GlassThemeTokens): void {
  app.provide(TOKENS_KEY, tokens)
}

export function provideDefaults(app: App, defaults: Partial<GlassProps>): void {
  const merged = computed(() => ({
    material: 'regular',
    engine: 'auto',
    vibrancy: 'soft',
    bordered: true,
    noise: true,
    adaptiveOpacity: true,
    mobileCapBlur: 24,
    throttleMs: 160,
    elevation: 1,
    ...defaults
  }))
  app.provide(DEFAULTS_KEY, merged)
}

export function useGlassTokens(): Readonly<GlassThemeTokens> {
  return inject(TOKENS_KEY, defaultGlassTokens)
}

export function useGlassDefaults(): Readonly<Partial<GlassProps>> {
  const injected = inject(DEFAULTS_KEY)
  return injected ? injected.value : {}
}
