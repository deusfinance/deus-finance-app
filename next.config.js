module.exports = {
  exportPathMap: async function () {
    return {
      '/': {
        page: '/stablecoin',
      },
      '/stablecoin': {
        page: '/stablecoin',
      },
      '/bridge': {
        page: '/bridge',
      },
      '/dashboard': {
        page: '/dashboard',
      },
    }
  },
}
