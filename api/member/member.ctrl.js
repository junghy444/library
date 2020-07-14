const MemberModel = require("../../models/member");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// id 유효성 체크
const checkId = (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).end();
    }
    next();
}

const showRegisterPage = (req, res) => {
    res.render("member/register");
};

// 회원등록
// - 성공 : 201(Created) 응답, 생성된 Member 객체 반환
// - 실패 : 필수 입력값 누락 (400 : Bad Request)
//          memNum이 중복된 경우 (409 : Conflict)
const register = (req, res) => {
    const { name, birth, phone, memNum } = req.body;
    if (!name || !birth || !phone || !memNum) return res.status(400).send("필수값이 입력되지 않았습니다.");
    
    MemberModel.findOne({ memNum }, (err, result) => {
        if (err) return res.status(500).send("회원등록 시 오류가 발생했습니다.");
        if (result) return res.status(409).send("이미 사용중인 회원번호입니다.");

        const member = new MemberModel({ name, birth, phone, memNum });
        member.save((err, result) => {
            if (err) return res.status(500).send("회원등록 시 오류가 발생했습니다.");
            res.status(201).json(result);
        });
            
    });

};

// 목록조회 (localhost:3000/api/member?limit=10)
// - 성공 : limit 수만큼 member 객체를 담은 결과를 리턴 (200: OK)
// - 실패 : limit가 숫자형이 아닐 경우 400 응답 (400: Bad Request)
const list = (req, res) => {
    let limit = req.query.limit || 10;    // type: string, 아무숫자도 넣지 않았을 때: 10
    limit = parseInt(limit, 10);        // type: number
    
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }

    const { q } = req.query;
    const find = {};
    if (q) {
        find.$or = [
            {
                name: RegExp(q),
            },
            {
                birth: RegExp(q),
            },
            {
                phone: RegExp(q),
            },
            {
                memNum: RegExp(q),
            }
        ];
    };

    MemberModel.find(find, (err, result) => {
        if (err) return res.status(500).end();
        res.render("member/list", { result });
    }).limit(limit).sort({ created: -1 });
};

// 상세조회 (localhost:3000/api/member/:id)
// - 성공 : id에 해당하는 member 객체 리턴 (200: OK)
// - 실패 : 유효한 id가 아닐 경우 400 응답 (400: Bad Request)
//          해당하는 id가 없는 경우 404 응답 (404: Not Found)
const detail = (req, res) => {
    const id = req.params.id;

    MemberModel.findById(id, (err, result) => {
        if (err) return res.status(500).end();
        if (!result) return res.status(404).end();
        res.render("member/detail", { result });
    });
};

// 수정 (localhost:3000/api/member/:id)
// - 성공 : id에 해당하는 객체의 정보를 수정 후 반환 (200: OK)
// - 실패 : id가 유효하지 않는 경우 400 응답 (400: Bad Request)
//          해당하는 id가 없는 경우 404 응답 (404: Not Found)
const update = (req, res) => {
    const id = req.params.id;

    const { name, birth, phone, memNum } = req.body;

    MemberModel.findByIdAndUpdate(id, { name, birth, phone, memNum }, { new: true },
        (err, result) => {
            if (err) return res.status(500).send("수정 시 오류가 발생했습니다.");
            if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
            res.json(result);
        });
};

// 삭제 (localhost:3000/api/member/{id})
// - 성공 : id에 해당하는 member 객체 삭제 후 배열 리턴 (200: OK)
// - 실패 : id가 유효하지 않는 경우 400 응답 (400: Bad Request)
//          해당하는 id가 없는 경우 404 응답 (404: Not Found)
const remove = (req, res) => {
    const id = req.params.id;

    MemberModel.findByIdAndRemove(id, (err, result) => {
        if (err) return res.status(500).send("삭제 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.json(result);
    });
};

const showUpdatePage = (req, res) => {
    const id = req.params.id;

    MemberModel.findById(id, (err, result) => {
        if (err) return res.status(500).send("조회 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.render("member/update", { result });     
    });
};

module.exports = { checkId, showRegisterPage, register, list, detail, update, remove, showUpdatePage };