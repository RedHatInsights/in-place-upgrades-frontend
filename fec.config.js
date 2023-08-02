module.exports = {
  appUrl: ['/insights/in-place-upgrades'],
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  _unstableHotReload: process.env.HOT === 'true',

  // NOTE: This is here for local testing purposes
  // remove it when you want to use deployed chrome-service,
  // meaning fed-modules and navigation is updated in chrome-service-backend
  routes: {
    '/api/chrome-service/v1/static': {
      host: 'http://localhost:9999',
    },
  },
};
