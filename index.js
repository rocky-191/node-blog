const koa=require('koa');
const session = require('koa-session')

const app=new koa()

// 签名key keys作用 用来对cookie进行签名
app.keys = ['some secret'];

// 配置项
const SESS_CONFIG = {
    key: 'kkb:sess', // cookie键名
    // maxAge: 86400000, // 有效期，默认一天
    // httpOnly: true, // 仅服务器修改
    // signed: true, // 签名cookie
};

// 为koa上下文扩展一些校验方法
const bouncer = require("koa-bouncer");
app.use(bouncer.middleware());

// 注册
app.use(session(SESS_CONFIG, app));

const bodyparser = require('koa-bodyparser')
app.use(bodyparser())

// 静态服务
const static = require("koa-static");
app.use(static(__dirname + '/public'));

app.use(require('./routes/register').routes())
app.use(require('./routes/api').routes())
app.use(require('./routes/restful').routes())

app.listen(3000);