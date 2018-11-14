
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const util = require('util')
const verify = util.promisify(jwt.verify)  // 解密

/* 判断token 是否可用 */
module.exports = function () {
  return async (ctx, next) => {
    try {
      // 获取 token
      const token = ctx.header.authorization;
      if (token) {
        try {
          // 解密payload 获取用户名和id
          let payload = await verify(token.split(' ')[1], config.tokenSecret);
          ctx.user = {
            name: payload.name,
            id: payload.id
          }
        } catch (error) {
          console.log('token verify fail: ', error)
        }
      }
      await next()
    } catch (error) {
      if (error.status === 401) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: '认证失败'
        }
      } else {
        ctx.status = 404;
        ctx.body = {
          success: false,
          message: '404'
        }
      }
    }
  }
}
