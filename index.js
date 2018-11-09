/* 引入中间件 */
const Koa = require('koa');
const path = require('path')
const bodyParser = require('koa-bodyparser'); // 表单解析中间件
const ejs = require('ejs'); // 模板引擎中间件
const session = require('koa-session-minimal'); //处理数据库的中间件
const MysqlStore = require('koa-mysql-session'); //处理数据库的中间件
const router = require('koa-router') // 路由中间件
const views = require('koa-views') // 模板呈现中间件
const koaStatic = require('koa-static') // 静态资源加载中间件
const staticCache = require('koa-static-cache') //文件缓存
const cors = require('koa2-cors')  // 设置跨域
const config = require('./config/config.js');

const app = new Koa()

app.use(cors());

// session 存储配置
const sessionConfig = {
    user: config.databases.USERNAME,
    password: config.databases.PASSWORD,
    database: config.databases.DATABASE,
    host: config.databases.HOST
}

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionConfig)
}))

// 配置静态资源
app.use(koaStatic(
    path.join(__dirname, './public')
))

// 缓存
app.use(staticCache(
    path.join(__dirname, './public'), { dynamic: true }, { maxAge: 365 * 24 * 60 * 60 }
))

// 服务端 渲染引擎
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))

app.use(bodyParser({
    formLimit: '1mb'
}))


// 路由
app.use(require('./routers/signup.js').routes())
app.use(require('./routers/articles.js').routes())


app.listen(`${ config.PORT }`)


console.log(`${ config.PORT }端口已经启动...`)