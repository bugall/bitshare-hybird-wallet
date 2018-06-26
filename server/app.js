const serve = require('koa-static');
const parser = require('ua-parser-js');
const Koa = require('koa');
const app = new Koa();


app.use(serve(__dirname + '/../dist'));
const port = process.env.PORT || 3000;
console.log('Listenning on port: ', port)
app.listen(process.env.PORT || 3000);
