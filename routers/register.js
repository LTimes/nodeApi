const router = require('koa-router')()

const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')
// 注册页面
router.post('/register', async (ctx, next) => {
    console.log(ctx.request.body, 'haha ')
    ctx.body = 'haha'
    await checkNotLogin(ctx)
    await next()
    
})

module.exports = router;