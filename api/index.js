const { Router } = require("express");
const router = Router();

router.use("/book", require("./book"));       // ./book/index
router.use("/proposal", require("./proposal"));
router.use("/user", require("./user"));
router.use("/member", require("./member"));

module.exports = router;
