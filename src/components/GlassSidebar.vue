<template>
  <Glass v-bind="sidebarProps" class="glass-sidebar">
    <div class="glass-sidebar__header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="glass-sidebar__content">
      <slot></slot>
    </div>
    <div class="glass-sidebar__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </Glass>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Glass from '../core/Glass.vue'
import type { GlassProps } from '../core/types'

const props = defineProps<GlassProps & { width?: string }>()

const sidebarProps = computed(() => ({
  material: props.material ?? 'regular',
  elevation: props.elevation ?? 1,
  radius: props.radius ?? '20px',
  ...props
}))
</script>

<style scoped>
.glass-sidebar {
  width: var(--glass-sidebar-width, 280px);
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.glass-sidebar__content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.glass-sidebar__header,
.glass-sidebar__footer {
  padding: 16px;
  font-weight: 600;
}
</style>
