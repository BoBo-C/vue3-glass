# @ai1144/glass

Apple-inspired glassmorphism primitives for Vue 3. The library focuses on delivering high fidelity backdrop-filter, vibrancy and fallback strategies for modern web applications.

## Features

- **Glass core component** with automatic engine selection (CSS, canvas, static).
- **Design tokens** powered by CSS variables and provider overrides.
- **Derived components** such as cards, buttons, toolbars, nav bars, modals and sidebars.
- **Fallback canvas utilities** and capability detection helpers.
- **Vite library build** configuration with TypeScript support.

## Getting started

```bash
pnpm install @ai1144/glass
```

Register the provider in your root component:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { createGlassProvider } from '@ai1144/glass'
import '@ai1144/glass/styles'

createApp(App)
  .use(createGlassProvider())
  .mount('#app')
```

Use the `Glass` material component directly or any derived component:

```vue
<template>
  <Glass material="regular" vibrancy="soft">
    <h3>Title</h3>
    <p>Body copy with dynamic vibrancy.</p>
  </Glass>
</template>
```

## Development

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run test
```

## License

MIT
