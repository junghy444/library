// 비구조화 할당
const { Router } = require("express");
const router = Router();

// 목록조회
// localhost:3000/book
router.get("/", (req, res) => {
    res.send("book list");
});

// 상세조회
// localhost:3000/book?limit=10
router.get("/:id", (req, res) => {
    res.send(`book detail: ${req.params.id}`);
});

// 등록
router.post("/", (req, res) => {
    res.send("book create");
});

// 수정
router.put("/:id", (req, res) => {
    res.send(`book update: ${req.params.id}`);
});

// 삭제
router.delete("/:id", (req, res) => {
    res.send(`book delete: ${req.params.id}`);
});

module.exports = router;
