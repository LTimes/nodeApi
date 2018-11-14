const mysql = require('mysql');
const config = require('../config/config')

const pool = mysql.createPool({
    host: config.databases.HOST,
    user: config.databases.USERNAME,
    password: config.databases.PASSWORD,
    database: config.databases.DATABASE
})

let query = function(sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }

                    connection.release() // 释放链接
                })
            }
        })
    })
}

// 定义 语句  COMMENT 别名
let users =
    `create table if not exists users(
        id int not null auto_increment,
        name varchar(30) not null COMMENT '用户名',
        pwd varchar(50) not null COMMENT '密码',
        sex varchar(2) COMMENT '性别',
        email varchar(100) COMMENT '邮箱',
        phone varchar(50) COMMENT '电话',
        avator varchar(50) COMMENT '头像',
        moment varchar(100) not null COMMENT '注册时间',
        primary key (id)
    );`
   /* 
        id: 文章id, uid: 作者id, name: 作者的名字, title: 文章的标题, content: 文章的内容,md: markdown格式的文章,
         pv: 文章的阅读量, avator: 作者头像, moment: 发布时间,label: 标签
   */
let articles =
    `create table if not exists articles(
        id int not null auto_increment,
        uid varchar(50) not null COMMENT '用户id',
        avator VARCHAR(100) NOT NULL COMMENT '用户头像',
        name varchar(20) not null COMMENT '文章作者',
        title varchar(50) not null COMMENT '文章标题',
        moment varchar(100) not null COMMENT '发布时间',
        pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览数量',
        md TEXT(0) NOT NULL COMMENT '文章内容',
        label VARCHAR(50) NOT NULL COMMENT '文章标签',
        primary key (id)
    );`

let createTable = (sql) => {
    return query(sql, [])
}

// 建表
createTable(users)
createTable(articles)


// 注册用户
let insertData = (value) => {
    let _sql = 'insert into users set name=?,pwd=?,sex=?,email=?,phone=?,avator=?,moment=?;';
    return query(_sql, value)
}

// 查找用户
let findUserData = (name) => {
    let _sql = 'select * from users where name=`${name}`';
    return query(_sql)
}

// 通过名字查找用户
let findDataByName = function (name) {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}
// 通过名字查找用户数量
let findDataCountByName = function (name) {
    let _sql = `select count(*) as count from users where name="${name}";`
    return query(_sql)
}

// 发表文章
let insertPost = function (value) {
    let _sql = `insert into articles set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?,label=?`
    return query(_sql, value)
}
// 更新文章
let updatePost = function (value) {
    let _sql = `update articles set title=?,content=?,md=?,label=?`
    return query(_sql, value)
}
// 删除文章
let deletePost = function (id) {
    let _sql = `delete from articles where id=${id}`;
    return query(_sql)
}
// 查询所有文章
let findAllPost = function () {
    let _sql = ` select * FROM articles;`
    return query(_sql)
}
// 查询分页文章
let findPostByPage = function (page) {
    let _sql = ` select * FROM articles limit ${(page-1)*10},10;`
    return query(_sql)
}
// 通过文章的名字查找用户
let findDataByUser = function (name) {
    let _sql = `select * from articles where name="${name}";`
    return query(_sql)
}


module.exports = {
    query,
    createTable,
    insertData,
    findUserData,
    findDataByName,
    findDataCountByName,
    insertPost,
    updatePost,
    deletePost,
    findDataByUser,
    findAllPost,
    findPostByPage
}