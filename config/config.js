/* 相关配置 */
const config = {
    // 端口
    PORT: 3000,

    // 数据库配置
    databases: {
        DATABASE: 'nodemysql',
        HOST: 'localhost',
        PORT: '3306',
        USERNAME: 'root',
        PASSWORD: '123456'
    },
    tokenSecret: 'test'
}

module.exports = config;