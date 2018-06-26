var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    __HOST__: '"http://localhost:8082/#"',
    __SERVICE__: '"http://47.96.164.78:9218"',
    // witnesses: JSON.stringify(['ws://47.96.164.78:28090']),
    // faucet_addr: '"http://47.96.164.78:8888"'

    witnesses: JSON.stringify(['ws://39.104.105.147:8090']),
    faucet_addr: '"http://39.104.25.21:3000"'
    // __SERVICE__:'"https://walletgateway.IDAC.io"',
    // witnesses:JSON.stringify(["wss://node1.IDAC.io","wss://node5.IDAC.io","wss://node8.IDAC.io","wss://node11.IDAC.io","wss://node15.IDAC.io","wss://node16.IDAC.io","wss://node17.IDAC.io"]),
    // faucet_addr:'"https://opengateway.IDAC.io"'
});
