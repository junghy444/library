const { Router } = require("express");
const router = Router();
const ctrl = require("./book.ctrl");


router.get("/", ctrl.list);         // 목록조회

router.get("/new", ctrl.showCreatePage);    //등록페이지, id값을 받는 함수보다 위에 위치시키기

router.get("/:id", ctrl.checkId, ctrl.detail);    // 상세조회
router.get("/:id/edit", ctrl.checkId, ctrl.showUpdatePage);    // 수정페이지

router.post("/", ctrl.create);      // 등록
router.put("/:id", ctrl.checkId, ctrl.update);    // 수정
router.delete("/:id", ctrl.checkId, ctrl.remove);   // 삭제


module.exports = router;
