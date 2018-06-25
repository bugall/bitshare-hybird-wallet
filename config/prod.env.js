module.exports = (function () {
  console.log('isProd',!!process.env.prod);
  if(!!process.env.prod){
    return {
      NODE_ENV: '"production"',
      __HOST__:'"https://mwallet.gxb.io/#"',
      __SERVICE__:'"https://walletgateway.gxb.io"',
      witnesses: JSON.stringify(['ws://39.104.105.147:8090']),
      faucet_addr: '"http://39.104.25.21:3000"'
    }
  }
  else{
    return {
      NODE_ENV: '"production"',
      __HOST__:'"http://47.96.164.78/#"',
      __SERVICE__:'"http://47.96.164.78:9218"',
      witnesses: JSON.stringify(['ws://39.104.105.147:8090']),
      faucet_addr: '"http://39.104.25.21:3000"'
    }
  }
})()
