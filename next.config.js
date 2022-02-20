module.exports = {
  exportPathMap: async function () {
    return {
      '/': {
        page: '/stablecoin',
      },
      '/stablecoin': {
        page: '/stablecoin',
      },
      '/stablecoin/mint': {
        page: '/mint',
      },
    }
  },
}
