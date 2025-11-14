<template>
  <Teleport to="body" v-if="open">
    <div class="glass-modal" role="dialog" aria-modal="true" @click.self="onBackdrop">
      <div class="glass-modal__backdrop" :class="{ 'glass-modal__backdrop--visible': open }"></div>
      <Glass v-bind="modalProps" class="glass-modal__panel">
        <header v-if="$slots.header" class="glass-modal__header">
          <slot name="header"></slot>
        </header>
        <section class="glass-modal__body">
          <slot></slot>
        </section>
        <footer v-if="$slots.footer" class="glass-modal__footer">
          <slot name="footer"></slot>
        </footer>
      </Glass>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Glass from '../core/Glass.vue'
import type { GlassProps } from '../core/types'

const props = withDefaults(
  defineProps<GlassProps & { open: boolean; dismissible?: boolean }>(),
  {
    open: false,
    dismissible: true,
    material: 'thick'
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalProps = computed(() => ({
  ...props,
  elevation: props.elevation ?? 2
}))

function onBackdrop() {
  if (props.dismissible) {
    emit('close')
  }
}
</script>

<style scoped>
.glass-modal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 1000;
}

.glass-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 12, 0.4);
  opacity: 0;
  transition: opacity 0.18s ease;
}

.glass-modal__backdrop--visible {
  opacity: 1;
}

.glass-modal__panel {
  width: min(520px, 92vw);
  max-height: 88vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.glass-modal__header,
.glass-modal__footer {
  padding: 16px 20px;
  font-weight: 600;
}

.glass-modal__body {
  padding: 0 20px 20px;
  overflow-y: auto;
}
</style>
