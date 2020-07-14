const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true    // 로그인 시 중복을 없애기 위해
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  memNum: {
    type: String,
    required: true,
    trim: true,
    unique: true,   // 회원번호는 중복되지 X
  },
  role: {
    type: Number,
    default: 0, // 0 : 일반사용자, 1 : 관리자
  },
  token: {
    type: String,
  },
});

// 모델명s -> 컬렉션이 만들어짐
module.exports = mongoose.model("user", UserSchema);