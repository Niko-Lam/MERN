const mongoose = require('mongoose')

//定義產品的數據類型結構 使用schema
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String,
    }],
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 225
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})


productSchema.virtual('id').get(function(){
    return this._id.toHexString();
})
productSchema.set('toJSON',{
    virtuals:true
})

//Product 是構造函數， mongoose.model 接受兩個參數
//第一個誰 eshop-db 裏面的文佳加名字
//第二個是 把上面定義的數據類型結構傳進來
exports.Product = mongoose.model('Product', productSchema)