<template>
  <div
    ref="rootEl"
    class="glass"
    :class="[`glass--${resolved.material}`, `glass--engine-${activeEngine}`, vibrancyClass, elevationClass, borderedClass, noiseClass]"
    :style="inlineStyles"
    role="presentation"
  >
    <div class="glass__background" aria-hidden="true" :style="backgroundLayerStyle">
      <slot name="background"></slot>
    </div>
    <div class="glass__noise" aria-hidden="true"></div>
    <div class="glass__content">
      <slot></slot>
    </div>
    <div class="glass__overlay">
      <slot name="overlay"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useGlassDefaults, useGlassTokens } from './GlassProvider'
import { supportsBackdropFilter, isLowEndDevice, isWeChatWebView } from './support'
import type { BackdropEngine, GlassProps, MaterialType, VibrancyMode } from './types'
import { captureGlassBitmap, scheduleBitmapRefresh } from './fallback-canvas'

const emit = defineEmits<{
  (e: 'fallback-change', engine: BackdropEngine): void
  (e: 'fps-drop', detail: { fps: number; engine: BackdropEngine }): void
  (e: 'error', detail: { code: string; message: string }): void
}>()

const defaults = useGlassDefaults()

const props = withDefaults(defineProps<GlassProps>(), {
  material: defaults.material ?? 'regular',
  engine: defaults.engine ?? 'auto',
  vibrancy: defaults.vibrancy ?? 'soft',
  bordered: defaults.bordered ?? true,
  noise: defaults.noise ?? true,
  adaptiveOpacity: defaults.adaptiveOpacity ?? true,
  mobileCapBlur: defaults.mobileCapBlur ?? 24,
  throttleMs: defaults.throttleMs ?? 160,
  elevation: defaults.elevation ?? 1
})

const tokens = useGlassTokens()
const rootEl = ref<HTMLElement | null>(null)
const activeEngine = ref<BackdropEngine>('static')
const refreshController = ref<{ cancel: () => void } | null>(null)
const canvasData = ref<string>('')

const resolved = computed(() => ({
  material: props.material ?? 'regular',
  vibrancy: props.vibrancy ?? 'soft',
  engine: props.engine ?? 'auto'
}))

const backgroundLayerStyle = computed(() => {
  if (activeEngine.value === 'canvas' && canvasData.value) {
    return { backgroundImage: `url(${canvasData.value})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }
  }
  return {}
})

const materialTokens = computed(() => tokens.material[resolved.value.material as MaterialType])

const blurPx = computed(() => {
  const blur = materialTokens.value.blur
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return Math.min(blur, props.mobileCapBlur)
  }
  return blur
})

const tintColor = computed(() => {
  const [r, g, b] = props.tintRGB ?? tokens.tintRGB
  return `rgba(${r}, ${g}, ${b}, ${opacity.value})`
})

const opacity = computed(() => {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const base = prefersDark ? materialTokens.value.opacityDark : materialTokens.value.opacityLight
  return Math.min(1, Math.max(0.05, base))
})

const elevationClass = computed(() => `glass--elevation-${props.elevation}`)
const borderedClass = computed(() => (props.bordered ? 'glass--bordered' : 'glass--borderless'))
const noiseClass = computed(() => (props.noise ? 'glass--noise' : 'glass--no-noise'))
const vibrancyClass = computed(() => `glass--vibrancy-${resolved.value.vibrancy as VibrancyMode}`)

const inlineStyles = computed(() => ({
  '--glass-blur': `${blurPx.value}px`,
  '--glass-tint-color': tintColor.value,
  '--glass-radius': props.radius ?? tokens.radius,
  '--glass-noise-opacity': String(props.noiseOpacity ?? tokens.noiseOpacity),
  '--glass-shadow-ambient': tokens.shadowAmbient,
  '--glass-border-color': `rgba(${tokens.borderColorRGB.join(',')}, ${tokens.borderOpacity})`,
  '--glass-highlight-opacity': String(tokens.highlightOpacity),
  '--glass-filter': `blur(${blurPx.value}px) saturate(${materialTokens.value.saturate * 100}%) contrast(${materialTokens.value.contrast}) brightness(${materialTokens.value.brightness})`,
  '--glass-noise-image': `url(${tokens.noiseImage})`
}))

const backgroundLayerStyle = computed(() => {
  if (activeEngine.value === 'canvas' && canvasData.value) {
    return { backgroundImage: `url(${canvasData.value})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }
  }
  return {}
})

watch(
  () => props.engine,
  () => {
    resolveEngine()
  }
)

watch(
  () => blurPx.value,
  () => {
    if (activeEngine.value === 'canvas' && rootEl.value) {
      captureGlassBitmap(rootEl.value, {
        blurRadius: blurPx.value,
        throttleMs: props.throttleMs
      })
        .then((canvas) => {
          canvasData.value = canvas.toDataURL('image/png')
        })
        .catch((error) => emit('error', { code: 'canvas', message: error.message }))
    }
  }
)

function resolveEngine() {
  const request = props.engine ?? 'auto'
  const hasBackdrop = supportsBackdropFilter()
  const lowEnd = isLowEndDevice()
  const inWeChat = isWeChatWebView()

  let target: BackdropEngine = 'static'
  if (request === 'css') {
    target = hasBackdrop ? 'css' : 'static'
  } else if (request === 'canvas') {
    target = 'canvas'
  } else if (request === 'static') {
    target = 'static'
  } else {
    if (hasBackdrop && !lowEnd && !inWeChat) {
      target = 'css'
    } else if (!lowEnd) {
      target = 'canvas'
    } else {
      target = 'static'
    }
  }

  if (target !== activeEngine.value) {
    activeEngine.value = target
    emit('fallback-change', target)
    setupEngine()
  }
}

function setupEngine() {
  cleanup()
  if (activeEngine.value === 'canvas') {
    if (rootEl.value) {
      captureGlassBitmap(rootEl.value, {
        blurRadius: blurPx.value,
        throttleMs: props.throttleMs,
        onError(error) {
          emit('error', { code: 'canvas', message: error.message })
        }
      })
        .then((canvas) => {
          canvasData.value = canvas.toDataURL('image/png')
        })
        .catch((error) => {
          emit('error', { code: 'canvas', message: error.message })
          activeEngine.value = 'static'
        })

      refreshController.value = scheduleBitmapRefresh(
        rootEl.value,
        {
          blurRadius: blurPx.value,
          throttleMs: props.throttleMs,
          onError(error) {
            emit('error', { code: 'canvas', message: error.message })
          }
        },
        (canvas) => {
          canvasData.value = canvas.toDataURL('image/png')
        }
      )
    }
  }
}

function cleanup() {
  refreshController.value?.cancel()
  refreshController.value = null
  if (activeEngine.value !== 'canvas') {
    canvasData.value = ''
  }
}

watch(
  () => activeEngine.value,
  (engine) => {
    if (engine !== 'canvas') {
      canvasData.value = ''
    }
  }
)

onMounted(() => {
  resolveEngine()
})

onUnmounted(() => {
  cleanup()
})

async function refresh() {
  if (activeEngine.value === 'canvas' && rootEl.value) {
    try {
      const canvas = await captureGlassBitmap(rootEl.value, {
        blurRadius: blurPx.value,
        throttleMs: props.throttleMs
      })
      canvasData.value = canvas.toDataURL('image/png')
    } catch (error) {
      emit('error', { code: 'canvas', message: (error as Error).message })
    }
  }
}

async function capture() {
  if (activeEngine.value !== 'canvas' || !rootEl.value) {
    return null
  }

  const canvas = await captureGlassBitmap(rootEl.value, {
    blurRadius: blurPx.value,
    throttleMs: props.throttleMs
  })
  return canvas
}

defineExpose({ refresh, capture })
</script>

<style scoped>
.glass {
  position: relative;
  border-radius: var(--glass-radius, 16px);
  overflow: hidden;
  box-shadow: var(--glass-shadow-ambient, 0 6px 20px rgba(0, 0, 0, 0.12));
}

.glass__background,
.glass__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.glass__background::before {
  content: '';
  position: absolute;
  inset: 0;
  backdrop-filter: var(--glass-filter);
  -webkit-backdrop-filter: var(--glass-filter);
  background: var(--glass-tint-color);
  transition: opacity 0.18s ease, filter 0.18s ease;
}

.glass--engine-static .glass__background::before {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  filter: none;
}

.glass__noise {
  background-image: var(--glass-noise-image);
  background-size: 120px 120px;
  opacity: var(--glass-noise-opacity, 0.03);
  mix-blend-mode: overlay;
}

.glass--no-noise .glass__noise {
  display: none;
}

.glass__content {
  position: relative;
  z-index: 1;
  padding: 16px;
  color: inherit;
}

.glass__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.glass--bordered::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid var(--glass-border-color, rgba(255, 255, 255, 0.4));
  border-radius: inherit;
  z-index: 2;
}

.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0.5px rgba(255, 255, 255, var(--glass-highlight-opacity, 0.6));
  z-index: 1;
  pointer-events: none;
}

.glass--engine-canvas .glass__background::before {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.glass--engine-canvas .glass__background {
  background-size: cover;
  background-position: center;
}

.glass--elevation-0 {
  box-shadow: none;
}

.glass--elevation-2 {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}
</style>
