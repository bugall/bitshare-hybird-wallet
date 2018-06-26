const serve = require('koa-static');
const parser = require('ua-parser-js');
const Koa = require('koa');
const app = new Koa();


app.use((ctx, next) => {
  const ua = parser(ctx.request.headers['user-agent'])
  let device = 'browser'
  if (ua.os.name === 'iOS') {
    device = 'ios'
  }
  if (ua.os.name === 'Android') {
    device = 'android'
  }

  if (ctx.request.url === '/') {
    ctx.redirect(`/index.html#/wallet-create?platform=${device}`)
  }
  return next()
})
app.use(serve(__dirname + '/../dist'));
const port = process.env.PORT || 3000;
console.log('Listenning on port: ', port)
app.listen(process.env.PORT || 3000);
