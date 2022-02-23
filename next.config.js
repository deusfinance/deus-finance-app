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
    }
  },
}
