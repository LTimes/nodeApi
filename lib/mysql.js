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

// 定义 语句
let users =
    `create table if not exists users(
        id int not null auto_increment,
        name varchar(20) not null,
        pass varchar(50) not null,
        moment varchar(100) not null,
        primary key (id)
    );`
   /* 
        id: 文章id, uid: 作者id, name: 作者的名字, title: 文章的标题, content: 文章的内容,md: markdown格式的文章,
         pv: 文章的阅读量, avator: 作者头像, moment: 发布时间,label: 标签
   */
let articles =
    `create table if not exists articles(
        id int not null auto_increment,
        uid varchar(50) not null,
        name varchar(20) not null,
        title varchar(50) not null,
        moment varchar(100) not null,
        pv VARCHAR(40) NOT NULL DEFAULT '0',
        content TEXT(0) NOT NULL,
        md TEXT(0) NOT NULL,
        avator VARCHAR(100) NOT NULL,
        label VARCHAR(50) NOT NULL,
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
    let _sql = 'insert into users set name=?,pass=?,moment=?;';
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
    insertPost,
    updatePost,
    deletePost,
    findDataByUser,
    findAllPost,
    findPostByPage
}