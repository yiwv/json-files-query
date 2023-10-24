import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig(
  {
    test: {
      globals: true,
      include: [ './test/**/*.spec.{ts,js}' ],
      root: fileURLToPath(new URL('./', import.meta.url))
    },
  }
)
