// 비구조화 할당
const { Router } = require("express");
const router = Router();

// 목록조회
// localhost:3000/proposal
router.get("/", (req, res) => {
    res.send("proposal list");
});

// 상세조회
// localhost:3000/proposal?limit=10
router.get("/:id", (req, res) => {
    res.send(`proposal detail: ${req.params.id}`);
});

// 등록
router.post("/", (req, res) => {
    res.send("proposal create");
});

// 수정
router.put("/:id", (req, res) => {
    res.send(`proposal update: ${req.params.id}`);
});

// 삭제
router.delete("/:id", (req, res) => {
    res.send(`proposal delete: ${req.params.id}`);
});

module.exports = router;
