const http = require ('http');

const session={}
http
  .createServer ((req, res) => {
      const sessionKey='sid';
    if (req.url == '/favicon.ico') {
      return;
    } else {
        console.log('cookie',req.headers.cookie);//当前端有了cookie的时候，每次和服务端交互的时候都会携带cookie发送到服务端，可以用来保存一种登录状态
        const cookie=req.headers.cookie;
        if(cookie && cookie.indexOf(sessionKey)>-1){
            res.end('come back');
            console.log('cookie',req.headers.cookie)

            const pattern=new RegExp(`${sessionKey}=([^;]+);?\s*`)
            const sid=pattern.exec(cookie)[1]
            console.log('session:',sid,session,session[sid])
        }else{
            const sid=(Math.random()*9999999).toFixed()
            res.setHeader ('Set-Cookie', `${sessionKey}=${sid}`);//服务端设置cookie方式
            session[sid]={name:'mgl'};
            res.end ('hello cookie');
        }
    }
  })
  .listen (3000, function () {
    console.log ('建立服务');
  });
