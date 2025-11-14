<template>
  <Glass
    :material="material"
    :elevation="0"
    class="glass-button"
    :class="[`glass-button--${variant}`, `glass-button--${size}`]"
    bordered
  >
    <button class="glass-button__inner" type="button" :disabled="disabled">
      <slot></slot>
    </button>
  </Glass>
</template>

<script lang="ts" setup>
import Glass from '../core/Glass.vue'
import { toRefs } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'secondary' | 'tertiary'
    disabled?: boolean
    material?: 'ultraThin' | 'thin' | 'regular' | 'thick' | 'ultraThick'
  }>(),
  {
    size: 'md',
    variant: 'primary',
    disabled: false,
    material: 'thin'
  }
)

const { size, variant, disabled, material } = toRefs(props)
</script>

<style scoped>
.glass-button {
  display: inline-flex;
  border-radius: 999px;
  padding: 0;
  box-shadow: none;
}

.glass-button__inner {
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  width: 100%;
  padding: 0 20px;
  font-weight: 600;
  cursor: pointer;
  height: 40px;
  transition: transform 0.1s ease, opacity 0.15s ease;
}

.glass-button--sm .glass-button__inner {
  height: 32px;
  padding: 0 14px;
  font-size: 0.875rem;
}

.glass-button--lg .glass-button__inner {
  height: 48px;
  padding: 0 28px;
  font-size: 1.05rem;
}

.glass-button__inner:active {
  transform: scale(0.97);
}

.glass-button__inner:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
