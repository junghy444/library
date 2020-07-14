const BookModel = require("../../models/book");
const mongoose = require("mongoose");
const UserModel = require("../../models/user");

// id 유효성 체크
const checkId = (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(500).end();
    }
    next();
}

// 목록조회 (localhost:3000/api/book?limit=10)
// - 성공 : limit 수만큼 book 객체를 담은 결과를 리턴 (200: OK)
// - 실패 : limit가 숫자형이 아닐 경우 400 응답 (400: Bad Request)
const list = (req, res) => {
    let limit = req.query.limit || 10;    // type: string, 아무숫자도 넣지 않았을 때: 10
    limit = parseInt(limit, 10);        // type: number
    
    if (Number.isNaN(limit)) {
        return res.status(400).end();
    }

    const { q } = req.query;                // list내에서 검색
    const find = {};
    if (q) {
        find.$or = [
            {
                title: RegExp(q),
            },
            {
                author: RegExp(q),
            },
            {
                company: RegExp(q),
            }
        ];
    };
    
    BookModel.find(find, (err, result) => {
        if (err) return res.status(500).end();
        res.render("book/list", { result });
    }).limit(limit).sort({ created: -1 });
};

// 상세조회 (localhost:3000/api/book/:id)
// - 성공 : id에 해당하는 book 객체 리턴 (200: OK)
// - 실패 : 유효한 id가 아닐 경우 400 응답 (400: Bad Request)
//          해당하는 id가 없는 경우 404 응답 (404: Not Found)
const detail = (req, res) => {
    const id = req.params.id;

    BookModel.findById(id, (err, result) => {
        if (err) return res.status(500).end();
        if (!result) return res.status(404).end();
        res.render("book/detail", { result });
    });
};

// 등록 (localhost:3000/api/book)
// 관리자만 접근 가능
// - 성공 : 입력값으로 book 객체를 생성 후 배열에 추가 (201: Created)
// - 실패 : author, title, company 값 누락 시 400 응답 (400: Bad Request)
const create = (req, res) => {
    const { title, author, company } = req.body;
    if (!title || !author || !company) return res.status(400).send("필수값이 입력되지 않았습니다.");
    
    BookModel.create({ title, author, company }, (err, result) => {
        if (err) return res.status(500).send("등록 시 오류가 발생했습니다.");
        res.status(201).json(result);
    });  
};

// 수정 (localhost:3000/api/book/:id)
// 관리자만 접근 가능
// - 성공 : id에 해당하는 객체의 정보를 수정 후 반환 (200: OK)
// - 실패 : id가 유효하지 않는 경우 400 응답 (400: Bad Request)
//          해당하는 id가 없는 경우 404 응답 (404: Not Found)
const update = (req, res) => {
    const id = req.params.id;

    const { title, author, company } = req.body;

    BookModel.findByIdAndUpdate(id, { title, author, company }, { new: true },
        (err, result) => {
            if (err) return res.status(500).send("수정 시 오류가 발생했습니다.");
            if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
            res.json(result);
        });
};

// 삭제 (localhost:3000/api/book/{id})
// - 성공 : id에 해당하는 book 객체 삭제 후 배열 리턴 (200: OK)
// - 실패 : id가 유효하지 않는 경우 400 응답 (400: Bad Request)
//          해당하는 id가 없는 경우 404 응답 (404: Not Found)
const remove = (req, res) => {
    const id = req.params.id;

    BookModel.findByIdAndRemove(id, (err, result) => {
        if (err) return res.status(500).send("삭제 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.json(result);
    });
};

const showCreatePage = (req, res) => {
    res.render("book/create");
}

const showUpdatePage = (req, res) => {
    const id = req.params.id;

    BookModel.findById(id, (err, result) => {
        if (err) return res.status(500).send("조회 시 오류가 발생했습니다.");
        if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
        res.render("book/update", { result });     
    });
};

module.exports = { list, detail, create, update, remove, checkId, showCreatePage, showUpdatePage };
