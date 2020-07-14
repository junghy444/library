const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const member = require("../../models/member");


const showSignupPage = (req, res) => {
    res.render("user/signup");
};

const showLoginPage = (req, res) => {
    res.render("user/login");
};

// 회원가입
// - 성공 : 201(Created) 응답, 생성된 User 객체 반환
// - 실패 : 필수 입력값 누락 (400 : Bad Request)
//          memNum이 중복된 경우 (409 : Conflict)
//          등록된 memNum이 없는 경우 (404 : Not Found)
//          memNum과 name이 같은 회원을 가르키고 있지 않는 경우 (401 : Unauthorized)
//          id가 중복된 경우 (409 : Conflict)
const signup = (req, res) => {
    const { id, password, name, memNum } = req.body;
    if (!id || !password || !name || !memNum) return res.status(400).send("필수값이 입력되지 않았습니다.");

    member.findOne({ memNum }, (err, memberCheck) => {         // 회원번호 체크
        if (err) return res.status(500).send("회원가입 시 오류가 발생했습니다.");
        if (!memberCheck) return res.status(404).send("등록된 회원번호가 없습니다.");

        UserModel.findOne({ memNum }, (err, result) => {            // 중복 가입 방지
            if (err) return res.status(500).send("회원가입 시 오류가 발생했습니다.");
            if (result) return res.status(409).send("이미 사용중인 회원번호입니다.");

            if (memberCheck.name === name) {                        // 실제 회원 본인인지 확인
                
                UserModel.findOne({ id }, (err, result) => {        // 아이디 중복 방지
                    if (err) return res.status(500).send("회원가입 시 오류가 발생했습니다.");
                    if (result) return res.status(409).send("이미 사용중인 아이디입니다.");

            
                    // bcrypt: 단방향 해시 함수
                    const saltRounds = 10;  // salt 자릿수
                    bcrypt.hash(password, saltRounds, (err, hash) => {
                        if (err) return res.status(500).send("암호화 시 오류가 발생했습니다.");

                        const user = new UserModel({ id, password: hash, name, memNum });

                        user.save((err, result) => {
                            console.log(err);
                            if (err) return res.status(400).send("회원가입 시 오류가 발생했습니다.");
                            res.status(201).json(result);
                        });
                    });
                });

            } else return res.status(401).send("일치하는 회원번호가 없습니다.");
        });
    });
};

// 로그인
// - 성공 : id, password가 일치하면 성공 (200)
// - 실패 : 필수입력값이 미입력된 경우 (400: Bad Request)
//          가입되지 않은 id일 경우 (404: Not Found)
//          password가 일치하지 않는 경우 (500)
const login = (req, res) => {
    const { id, password } = req.body;
    
    if (!id || !password) return res.status(400).send("필수 값이 입력되지 않았습니다.");

    UserModel.findOne({ id }, (err, user) => {
        if (err) return res.status(500).send("사용자 조회 시 오류가 발생했습니다.");
        if (!user) return res.status(404).send("가입되지 않은 계정입니다.");
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).send("로그인 시 오류가 발생했습니다.");
            if (!isMatch) return res.status(500).send("비밀번호가 올바르지 않습니다.");

            // 비밀번호 검증 성공 => signed 토큰 생성 발급 (jsonwebtoken)
            const token = jwt.sign(user._id.toHexString(), "secretKey");
            UserModel.findByIdAndUpdate(user._id, { token }, (err, result) => {
                if (err) return res.status(500).send("로그인 시 오류가 발생했습니다.");
                // 토큰 저장 : cookie
                res.cookie("token", token, { httpOnly: true });
                res.json(result);
            });
        });
    });
};

// 인증 처리
const checkAuth = (req, res, next) => {
    // 모든 화면에서 공통으로 필요로 하는 데이터
    res.locals.user = null;

    // 쿠키로부터 토큰을 가져옴
    const token = req.cookies.token;

    if (!token) {
        // 정상적인 경우
        if (req.url === "/" || req.url === "/api/user/signup" || req.url === "/api/user/login" || req.url === "/api/book")
            return next();
        else return res.render("user/login");
    };

    // 토큰 검증
    jwt.verify(token, "secretKey", (err, _id) => {
        if (err) {
            res.clearCookie("token");
            return res.render("user/login");
        }

        UserModel.findOne({ _id, token }, (err, user) => {
            if (err) return res.status(500).send("인증 시 오류가 발생했습니다.");
            if (!user) return res.render("user/login");
            res.locals.user = { id: user.id, role: user.role };
            next();
        });
    });
};

const logout = (req, res) => {
    // 쿠키에서 토큰 가져오기
    const token = req.cookies.token;
    if (!token) return res.render("user/login");
    
    jwt.verify(token, "secretKey", (err, _id) => {
        if (err) returnres.status(500).send("로그아웃 시 오류가 발생했습니다.");
        UserModel.findByIdAndUpdate(_id, { token: "" }, (err, result) => {
            if (err) return res.status(500).send("로그아웃 시 오류가 발생했습니다.");
            res.clearCookie("token");
            res.redirect("/");
        });
    });
};

module.exports = { showSignupPage, showLoginPage, signup, login , checkAuth, logout};