module.exports = function (api) {
  api.cache(false); // Disable caching to avoid conflicts
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-transform-import-meta',
        {
          module: 'ES6',
          useNull: true
        }
      ]
    ],
  };
};