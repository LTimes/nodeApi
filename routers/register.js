const router = require('koa-router')()

const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const moment = require('moment');
const fs = require('fs')
    // 注册页面
router.post('/register', async(ctx, next) => {
    var req = ctx.request.body;
    if (!req.name || !req.pwd) {
        ctx.body = {
            success: false,
            message: '请输入昵称或密码'
        }
    } else {
        if (req.name.length > 18) {
            ctx.body = {
                success: false,
                message: '昵称设置太长'
            }
            return
        }
        if (req.pwd.trim().length > 18) {
            ctx.body = {
                success: false,
                message: '密码设置太长'
            }
            return
        }
        await userModel.findDataCountByName(req.name).then(async result => {
            if (result.count > 0) {
                ctx.body = {
                    success: false,
                    message: '该昵称已被注册'
                }
            } else {
                await userModel.insertData([req.name, md5(req.pwd), '', '', '', '', moment().format('YYYY-MM-DD HH:mm:ss')]).then(result => {
                    console.log(result)
                    ctx.body = {
                        success: true,
                        message: '注册成功'
                    }
                }).catch(rej => {
                    console.log(rej)
                })
            }
        })

    }
    await next()

})

module.exports = router;