const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get(`/`, async (req, res) => {
    const userList = await User.find();

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.post(`/`, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();
    if (!user) res.status(404).send('用戶無法創建')
    res.send(user);
})

router.get('/:id', async (req, res) => {
    await User.findById(req.params.id).select('-passwordHash')
        .then(use => {
            res.status(200).send(use)
        }).catch(err => {
            res.status(500).send({ message: '找不到該id', data: err })
        })
})

router.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) res.status(400).send({ message: '用戶不存在' })
    if (user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
        let token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.secret, { expiresIn: '1d' })
        res.status(200).send({ message: '用戶驗證成功', data: user, token: token })
    } else {
        res.status(400).send({ message: '密碼或者郵箱錯誤' })
    }
})

router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    user = await user.save();
    if (!user) res.status(404).send('用戶無法創建')
    res.send(user);
})

router.get('/get/count', async (req, res) => {
    let userCount = await User.countDocuments(count => count)
    if (!userCount) res.status(500).send({ message: '人數計算錯誤' })
    res.send({
        userCount: userCount
    })
})

router.delete('/:id', async (req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({
                success: true,
                message: '用戶成功移除'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: '移除用戶失敗'
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

module.exports = router;