const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    birth: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    memNum: {
        type: String,
        required: true,
        trim: true,
        unique: true,   // 회원번호는 중복되지 X
    },    
    created: {
        type: Date,
        default: Date.now
    }
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = mongoose.model("member", MemberSchema);
