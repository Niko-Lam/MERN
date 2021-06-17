//es5 模塊引入 express 框架
const express = require('express')
//調用函數express
const app = express()
//在 app.js 裡面引入dotenv 這個庫
require('dotenv/config')
//環境變量process.env API_URL這個是寫在.env 裡面的變量
const api = process.env.API_URL
//日誌打印
const morgan = require('morgan')
//引入mongodb
const mongoose = require('mongoose')

const categoriesRoutes = require("./routers/categories");
const productsRoutes = require("./routers/products");
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");
const cors = require('cors')
//權限jwt
const authJwt = require('./helper/jwt')
const errorHandler = require('./helper/error-handler')

//創建中間鍵 用於解析請求json數據
app.use(express.json())
//日誌的配置爲tiny
app.use(morgan('tiny'))

app.use(cors())
app.options('*', cors())
//開啓token 權限
app.use(authJwt())
app.use(errorHandler)

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    dbName: 'eshop-db'
})
    .then(() => {
        console.log('數據庫連接成功')
    })
    .catch((err) => {
        console.log('數據庫連接失敗', err)
    })

//listen 接受兩個參數 一個是端口號 一個是打印在終端的打印結果
app.listen(6699, () => {
    console.log("我的服務器跑在了6699 端口：http://localhost:6699")
})