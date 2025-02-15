const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['expo-router']
    }
  }, argv);

  // Completely ignore font files
  config.module.rules.push({
    test: /\.(ttf|otf|woff|woff2)$/,
    loader: 'null-loader'
  });

  // Add module fallbacks
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: false,
    stream: false,
    path: false,
  };

  return config;
}