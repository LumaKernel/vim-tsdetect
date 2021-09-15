import path from 'path';
import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

void esbuild.build({
  entryPoints: [path.resolve(__dirname, '../src/entrypoints/coc.ts')],
  outdir: path.resolve(__dirname, '../out'),
  watch: process.env.NODE_ENV === 'development',
  platform: 'node',
  bundle: true,
  plugins: [nodeExternalsPlugin()],
});
