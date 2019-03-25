const router = require('koa-router')()
const userModel = require('../lib/mysql.js');
const moment = require('moment');
const md = require('markdown-it')();
const querystring = require('querystring');

// 查询文章
router.get('/article', async (ctx, next) => {
    let value = {};
    let params = querystring.parse(ctx.request.url.split('?')[1]);
    value.search = params.search;
    value.page = params.page;
    value.pageSize = params.pageSize;
    if (value.page && value.pageSize) {
        console.log(value)
        var totalCount = 0;
        let data = [];
        await userModel.findAllPost(value).then(res => {
            res.forEach(ele => {
                ele.label = JSON.parse(ele.label)
            });
            data = res;
        })
        await userModel.findPostTotal().then(result => {
            totalCount = result[0].total;
        })
        ctx.body = {
            data: data,
            totalCount: totalCount,
            success: true
        };


    } else {

        ctx.body = {
            data: '缺少参数',
            success: false
        }
    }

    await next()

})

// 新增文章
router.post('/addArticle', async (ctx, next) => {
    //console.log(ctx.session, '新增的post')

    let title = ctx.request.body.title,
        mds = ctx.request.body.md,
        uid = ctx.request.body.userId,
        name = '',
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
    await userModel.findUserIdData(uid)
        .then(res => {
            console.log(res)
            avator = res[0]['avator']
            name = res[0]['name']
        }).catch(err => {
            console.log(err)
        })
    await userModel.insertPost([uid, avator, name, newTitle, time, pv, mds, label])
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

// 更新文章
router.post('/editArticle', async (ctx, next) => {
    let postid = ctx.request.body.postId,
        title = ctx.request.body.title,
        mds = ctx.request.body.md,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        label = JSON.stringify(ctx.request.body.label),
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
    if (postid) {
        await userModel.updatePost([newTitle, mds, label, time, postid]).then(res => {
            ctx.body = {
                data: '编辑成功',
                success: true
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        ctx.body = {
            data: '缺少参数',
            success: false
        }
    }

    await next()
})

// 删除文章
router.post('/deleteArticle', async (ctx, next) => {
    let postId = ctx.request.body.postId;
    if (postId) {
        await userModel.deletePost(postId).then(res => {
            ctx.body = {
                data: '删除成功！',
                success: true
            }
        }).catch(err => {
            console.log(err)
            ctx.body = {
                data: '删除失败！',
                success: false
            }
        })
    } else {
        ctx.body = {
            data: '缺少参数',
            success: false
        }
    }

    await next()
})

// 获取文章详情
router.post('/articleDetail', async (ctx, next) => {
    let postId = ctx.request.body.postId;
    let type = ctx.request.body.type;
    if (postId) {
        await userModel.findPostDetail(postId).then(res => {
            if (type !== 1) {
                res[0].md = md.render(res[0].md)
            }
            res[0].label = JSON.parse(res[0].label)
            ctx.body = {
                data: res[0],
                success: true
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        ctx.body = {
            data: '缺少参数',
            success: false
        }
    }

    await next()
})





module.exports = router;