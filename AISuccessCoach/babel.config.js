module.exports = function (api) {
  api.cache(false);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      ['babel-plugin-transform-import-meta']
    ],
  };
};