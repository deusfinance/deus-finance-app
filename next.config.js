module.exports = {
   exportPathMap: async function() {
      return {
         '/': {
            page: '/'
         },
         '/stablecoin': {
            page: '/stablecoin'
         },
      }
   },
   async redirects() {
    return [
      {
        source: '/',
        destination: '/stablecoin',
        permanent: true,
      },
    ]
  },   
}
