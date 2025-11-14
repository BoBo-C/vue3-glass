<template>
  <Glass v-bind="toolbarProps" class="glass-toolbar">
    <div class="glass-toolbar__inner">
      <div class="glass-toolbar__slot">
        <slot name="left"></slot>
      </div>
      <div class="glass-toolbar__center">
        <slot name="center">
          <slot></slot>
        </slot>
      </div>
      <div class="glass-toolbar__slot glass-toolbar__slot--right">
        <slot name="right"></slot>
      </div>
    </div>
  </Glass>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Glass from '../core/Glass.vue'
import type { GlassProps } from '../core/types'

const props = defineProps<GlassProps>()

const toolbarProps = computed(() => ({
  material: props.material ?? 'thick',
  elevation: props.elevation ?? 1,
  radius: props.radius ?? '24px',
  ...props
}))
</script>

<style scoped>
.glass-toolbar {
  padding: 0;
}

.glass-toolbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  gap: 12px;
}

.glass-toolbar__center {
  flex: 1;
  text-align: center;
  font-weight: 600;
}
</style>
