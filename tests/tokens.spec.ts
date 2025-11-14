import { describe, expect, it } from 'vitest'
import { mergeTokens, defaultGlassTokens } from '../src/core/tokens'

describe('mergeTokens', () => {
  it('overrides material tokens partially', () => {
    const merged = mergeTokens({
      material: {
        regular: {
          blur: 25
        } as any
      }
    })

    expect(merged.material.regular.blur).toBe(25)
    expect(merged.material.regular.opacityLight).toBe(defaultGlassTokens.material.regular.opacityLight)
  })
})
