import type { Meta, StoryObj } from '@storybook/vue3'
import Glass from '../src/core/Glass.vue'

const meta: Meta<typeof Glass> = {
  title: 'Core/Glass',
  component: Glass,
  args: {
    material: 'regular',
    vibrancy: 'soft'
  }
}

export default meta

type Story = StoryObj<typeof Glass>

export const Playground: Story = {
  render: (args) => ({
    components: { Glass },
    setup() {
      return { args }
    },
    template: `
      <div style="min-height: 100vh; background: url('https://picsum.photos/1200/800'); background-size: cover; padding: 40px;">
        <Glass v-bind="args" style="max-width: 320px;">
          <h3>Glass</h3>
          <p>Apple-inspired glass material component.</p>
        </Glass>
      </div>
    `
  })
}
