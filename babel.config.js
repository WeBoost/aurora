module.exports = {
  presets: ['next/babel'],
  plugins: [
    '@babel/plugin-transform-runtime',
    ['babel-plugin-module-resolver', {
      root: ['./'],
      alias: {
        '@': './src',
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }],
  ],
};