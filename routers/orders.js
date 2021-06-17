const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();
const { OrderItem } = require('../models/order-item')

router.get(`/`, async (req, res) => {
    const orderList = await Order.find();

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    res.send(orderList);
})

router.post(`/`, async (req, res) => {
    const orderItemIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save()
        return newOrderItem._id
    }))
    const orderItemIdsResolved = await orderItemIds

    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user
    });

    order = await order.save();
    if (!order) res.status(404).send('訂單無法創建');
    res.send(order);
})

module.exports = router;