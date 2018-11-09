const router = require('koa-router')()
const userModel = require('../lib/mysql.js');
const moment = require('moment');
const md = require('markdown-it')();

router.get('/article', async (ctx, next) => {
  await next()
  let res, 
  postLength, 
  name = decodeURIComponent(ctx.request.querystring.split('=')[1]);
  if (ctx.request.querystring) {
    await userModel.findDataByUser(name).then(result => {
      postLength = result.length
    })
    await userModel.findPostByUserPage(name, 1).then(result => {
      res = result
    })
    ctx.body = {
      session: ctx.session,
      data: res,
      postLength: Math.ceil(postLength / 10),
      total: postLength,
      success: true
    }
  } else {
    await userModel.findPostByPage(1)
      .then(result => {
        res = result
      })
    await userModel.findAllPost()
      .then(result => {
        postsLength = result.length
      })
    ctx.body = {
      session: ctx.session,
      data: res,
      postLength: Math.ceil(postLength / 10),
      total: postLength,
      success: true
    }
  }
  
})

// 新增文章
router.post('/addArticle', async (ctx, next) => {
  console.log(ctx.session)
  let title = ctx.request.body.title,
    mds = ctx.request.body.md,
    content = ctx.request.body.content || 'halo',
    id = ctx.session.id || 4,
    name = ctx.request.body.name,
    time = moment().format('YYYY-MM-DD HH:mm:ss'),
    avator = ctx.request.body.avator,
    label = ctx.request.body.label,
    // 现在使用markdown不需要单独转义
    // newContent = content.replace(/[<">']/g, (target) => {
    //   return {
    //     '<': '&lt;',
    //     '"': '&quot;',
    //     '>': '&gt;',
    //     "'": '&#39;'
    //   } [target]
    // }),
    newTitle = title.replace(/[<">']/g, (target) => {
      return {
        '<': '&lt;',
        '"': '&quot;',
        '>': '&gt;',
        "'": '&#39;'
      } [target]
    });

  // await userModel.findUserData(ctx.session.user)
  //   .then(res => {
  //     console.log(res[0]['avator'])
  //     avator = res[0]['avator']
  //   })
  await userModel.insertPost([name, newTitle,content, md.render(mds), id, time, avator, label])
    .then(() => {
      ctx.body = true
    }).catch(() => {
      ctx.body = false
    })
})

module.exports = router;