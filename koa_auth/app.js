const koa=require('koa');
const app=new koa();
const session=require('koa-session');

app.keys=['some secret'];//不可泄露，保密.随机字符串

const SESS_CONFIG={
    key:'test:ss',//随便定义，键名
    maxAge:8640000,
    httpOnly:true,//防止js读取cookie
    signed:true,//用于签名
}

app.use(session(SESS_CONFIG,app));

app.use(ctx=>{
    if(ctx.path==='/favicon.ico')return
    let n=ctx.session.count || 0;
    ctx.session.count=++n;
    ctx.body='第'+n+'次访问';
})

app.listen(3000)