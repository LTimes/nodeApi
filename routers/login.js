
const router = require('koa-router')()
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const config = require('../config/config')
const jwt = require('jsonwebtoken')

// post 登录
router.post('/login', async (ctx, next) => {
  let user = {
    name: ctx.request.body.name || '',
    pass: ctx.request.body.pwd || ''
  }
  if (!user.name || !user.pass) {
    ctx.body = {
      success: false,
      message: '账号或密码错误'
    }
    return 
  }
  try {
    await userModel.findDataByName(user.name)
      .then((result) => {
        if (user.name === result[0]['name'] && md5(user.pass) === result[0]['pwd']) {
          ctx.session = {
            user: result[0]['name'],
            id: result[0]['id']
          }
          let userToken = {
            user: result[0]['name'],
              id: result[0]['id']
          }
          // 签发token
          const token = jwt.sign(userToken, config.tokenSecret, {
            expiresIn: '5h'
          })
          ctx.body = {
            success: true,
            name: result[0]['name'],
            user_id: result[0]['id'],
            avator: result[0]['avator'],
            token: token,
            message: '登录成功'
          }


          console.log('session', ctx.session)
        } else {
          ctx.body = {
            success: false,
            message: '用户名或密码错误'
          }
        }
      }).catch(err => {
        console.log(err)
      })
  } catch (error) {
    console.log(error)
    ctx.body = {
      success: false,
      message: '查询数据出错'
    }
  }

  await next()

})

// 退出
router.post('/logout', async (ctx, next) => {
  ctx.session = null;
  ctx.body = {
    success: true,
    message: ''
  }

  await next()
})


module.exports = router