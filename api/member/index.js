// 비구조화 할당
const { Router } = require("express");
const router = Router();
const ctrl = require("./member.ctrl");

router.get("/", ctrl.list);         // 목록조회

router.get("/new", ctrl.showRegisterPage); // 회원등록 페이지
router.post("/register", ctrl.register);    // 회원등록

router.get("/:id", ctrl.checkId, ctrl.detail);    // 상세조회
router.get("/:id/edit", ctrl.checkId, ctrl.showUpdatePage);    // 수정페이지

router.put("/:id", ctrl.checkId, ctrl.update);    // 수정
router.delete("/:id", ctrl.checkId, ctrl.remove);   // 삭제

module.exports = router;