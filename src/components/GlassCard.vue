<template>
  <Glass v-bind="glassProps" class="glass-card">
    <header v-if="$slots.header" class="glass-card__header">
      <slot name="header"></slot>
    </header>
    <section class="glass-card__body">
      <slot></slot>
    </section>
    <footer v-if="$slots.footer" class="glass-card__footer">
      <slot name="footer"></slot>
    </footer>
  </Glass>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Glass from '../core/Glass.vue'
import type { GlassProps } from '../core/types'

const props = defineProps<GlassProps>()

const glassProps = computed(() => ({
  material: props.material ?? 'regular',
  elevation: props.elevation ?? 1,
  ...props
}))
</script>

<style scoped>
.glass-card {
  display: flex;
  flex-direction: column;
  min-width: 220px;
}

.glass-card__header,
.glass-card__footer {
  padding: 16px;
  font-weight: 600;
}

.glass-card__body {
  padding: 0 16px 16px;
  flex: 1;
}
</style>
