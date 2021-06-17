const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

//獲取全部的api 
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(categoryList);
})

//按id 獲取分類
router.get(`/:id`, async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ success: false, message: '沒有找到此id的分類' })
    }
    res.status(200).send(category);
})

//用id 查詢並更新
router.put('/:id', async (req, res) => {
    let category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }, {
        new: true
    })
    if (!category) res.status(400).send('更新失敗')
    res.send(category);
})

//新建分類
router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });
    category = await category.save();
    if (!category) res.status(404).send('目錄無法創建')
    res.send(category);
})

//http://localhost:6699/api/v1/categories/60941710b625981dd10744 dele 方法刪除
//刪除分類
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({
                success: true,
                message: '分類成功刪除'
            })
        } else {
            return res.status(404).json({
                success: false,
                massage: '找不到該分類'
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            err: err
        })
    })
})

module.exports = router;