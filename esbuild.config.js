esbuild.build({
  entryPoints: ['index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'out.js',
});
