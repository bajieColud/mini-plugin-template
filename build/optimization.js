
module.exports = {
  splitChunks: {
      cacheGroups: { 
          // vendor: { 
          //   test: /[\\/]node_modules[\\/]/,
          //   chunks: 'initial', 
          //   minChunks:1,
          //   minSize:1,
          //   priority: 0,
          //   name:(module)=>{
          //     const context = module.context;
          //     const index = context.lastIndexOf('/')
          //     let name = context.substring(index+1)
          //     return `npm/${name}`
          //   }
          // },
          common:{
            priority: -1,
            chunks: 'initial', 
            minChunks:2,
            minSize:0,
            name:'utils/common'
          },
      }
  }
}