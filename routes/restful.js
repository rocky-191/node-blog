const Router = require("koa-router");
const router = new Router({ prefix: '/users' });
const bouncer=require('koa-bouncer');

//假数据
const users = [{ id: 1, name: "tom" }, { id: 2, name: "jerry" }];
router.get("/",ctx=>{
    console.log('GET /users',ctx.body);
    const {name}=ctx.query;//查询参数
    let data=users;
    if(name){
        data=data.filter(item=>item.name===name);
    }
    ctx.body={ok:1,data}
})

router.get("/:id", ctx => {
    console.log("GET /users/:id");
    const { id } = ctx.params; // /users/1
    const data = users.find(u => u.id == id);
    ctx.body = { ok: 1, data };
});

const val = async (ctx, next) => {
    try {
        // 校验开始
        ctx
        .validateBody("name")
        .required("要求提供用户名")
        .isString()
        .trim()
        .isLength(6, 16, "用户名长度为6~16位")
        // 是否邮箱格式
        // .isEmail('非法的邮箱格式')
        // .eq('laowang1', "验证码填写有误")
        // 同步逻辑判断
        // .check('laowang' !== ctx.vals.name, "用户名已存在")
        // 异步逻辑判断
        //  const hasUser = () => new Promise(resolve => resolve(true))
        // .check(await hasUser(),"用户名已存在")

        // 如果走到这里校验通过
        // 校验器会用净化后的值填充 `ctx.vals` 对象
        console.log('ctx.vals', ctx.vals);
        next()
    } catch (error) {
        if (error instanceof bouncer.ValidationError) {
        ctx.body = '校验失败：' + error.message;
        return;
        }
        throw error
    }
}

router.post("/",val,ctx=>{
     // 校验器会用净化后的值填充 `ctx.vals` 对象
    console.log("POST /users");
    const user=ctx.vals;
    user.id=users.length+1;
    users.push(user);
    ctx.body = { ok: 1 };
})

//更新操作
router.put("/", ctx => {
    console.log("PUT /users");
    const { body: user } = ctx.request; // 请求body
    const idx = users.findIndex(u => u.id == user.id);
    // console.log(idx,ctx.body)
    if (idx > -1) {
      users[idx] = user;
    }
    console.log('user', users)
    ctx.body = { ok: 1 };
});
router.delete("/:id", ctx => {
    console.log("DELETE /users/:id");
    const { id } = ctx.params; // /users/1
    const idx = users.findIndex(u => u.id == id);
    if (idx > -1) {
      users.splice(idx, 1);
    }
    ctx.body = { ok: 1 };
});

module.exports=router