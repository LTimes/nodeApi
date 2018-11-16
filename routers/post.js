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
    id = ctx.session.id || 1,
    name = ctx.session.name || 'ly',
    time = moment().format('YYYY-MM-DD HH:mm:ss'),
    avator = '',
    label = JSON.stringify(ctx.request.body.label),
    pv = 0,
    newTitle = title.replace(/[<">']/g, (target) => {
      return {
        '<': '&lt;',
        '"': '&quot;',
        '>': '&gt;',
        "'": '&#39;'
      } [target]
    });
    if (!title) {
      ctx.body = {
        success: false,
        message: '请填写文章标题'
      }
      return
    }
    if (!label) {
      ctx.body = {
        success: false,
        message: '请选择标签'
      }
      return
    }
    if (!mds) {
      ctx.body = {
        success: false,
        message: '请填写文章内容'
      }
      return
    }
    console.log(ctx.session, 'ctx.session2============')
  await userModel.findUserData(ctx.session.user)
    .then(res => {
      avator = res[0]['avator']
    }).catch(err => {
      console.log(err)
    })
  await userModel.insertPost([id, avator, name, newTitle, time, pv, md.render(mds), label])
    .then(() => {
      ctx.body = {
        success: true,
        message: '发布成功！'
      }
    }).catch(() => {
      ctx.body = {
        success: false,
        message: '发布失败'
      }
    })

    await next()
})


module.exports = router;