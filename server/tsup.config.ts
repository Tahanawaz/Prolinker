import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  splitting: false,
  // The workspace package ships TypeScript source, so bundle it in.
  noExternal: ['@prolinker/shared'],
});
