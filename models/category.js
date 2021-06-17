const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
    },
    color: {
        type: String,
    },
    icon: {
        type: String,
    },
})

exports.Category = mongoose.model('Category', categorySchema);
