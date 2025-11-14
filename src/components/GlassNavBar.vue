<template>
  <Glass v-bind="navProps" class="glass-nav">
    <div class="glass-nav__inner">
      <div class="glass-nav__slot">
        <slot name="left"></slot>
      </div>
      <div class="glass-nav__title">
        <slot name="title">
          <slot></slot>
        </slot>
      </div>
      <div class="glass-nav__slot glass-nav__slot--right">
        <slot name="right"></slot>
      </div>
    </div>
  </Glass>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Glass from '../core/Glass.vue'
import type { GlassProps } from '../core/types'

const props = defineProps<GlassProps & { inset?: boolean }>()

const navProps = computed(() => ({
  material: props.material ?? 'thick',
  elevation: props.elevation ?? 2,
  radius: props.inset ? '24px' : '0px',
  ...props
}))
</script>

<style scoped>
.glass-nav {
  padding: 0;
  width: 100%;
}

.glass-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
}

.glass-nav__title {
  font-weight: 600;
  font-size: 1.05rem;
}
</style>
