const express = require('express')
const router = express.Router()
const { Product } = require('../models/products')
const { Category } = require('../models/category')
const mongoose = require('mongoose')

// 請求方法 get 接受兩個參數 一個是路由 一個是請求體和請求響應體
router.get(`/`, async (req, res) => {
    //查詢使用find(傳入id 對象 來值查詢)
    // const productList = await Product.find({
    //     _id: "609101fdf931f31f40b13787"
    // })
    //拿到Product 構造函數 並使用find方法 find沒有傳值則查詢全部products 下的全部數據
    //注意；記得使用async 和 await 來等待 數據
    let filter = req.query ? req.query : {}
    const productList = await Product.find(filter).populate('category')
    // const productList = await Product.find().select('name -_id') 只輸出name -_id 爲輸出id
    if (!productList) res.status(500).json({ success: false })
    res.send(productList)
})

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) res.status(500).send({ success: false })
    res.send(product)
})

//post 請求
router.post(`/`, async (req, res) => {
    let category = await Category.findById(req.body.category)
    console.log(category);
    if (!category) res.status(400).send('分類無效')
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });
    product = await product.save()
    if (!product) res.status(500).send('產品無法創建')
    res.status(200).send(product)
})
//

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send({ message: '找不到產品id' })
    }
    let category = await Category.findById(req.body.category)
    console.log(category);
    if (!category) res.status(400).send('分類無效')
    let product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    }, {
        new: true
    })
    if (!product) res.status(400).send({
        message: '更新失敗'
    })
    res.status(200).send(product)
})

router.delete('/:id', async (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({
                success: true,
                message: '商品成功刪除'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: '商品刪除失敗,沒有找到該商品'
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            data: err,
            message: 'id不符合規範'
        })
    })
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments(count => count)
    if (!productCount) res.status(500).send({ success: false })
    res.send({
        productCount: productCount
    })
})

router.get('/get/featured/:count', async (req, res) => {
    let count = req.params.count ? req.params.count : 0
    let products = await Product.find({ isFeatured: true }).limit(count*1)
    if (!products) res.status(500).json({
        message: '沒有找到商品'
    })
    res.status(200).send({
        message: '成功',
        data: products
    })
})

module.exports = router