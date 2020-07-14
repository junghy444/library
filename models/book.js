const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = mongoose.model("book", BookSchema);
