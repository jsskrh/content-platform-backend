const express = require("express");
const router = express.Router();

const Pages = require("../controllers/pages");

const auth = require("../middleware/index");

router.post("/", auth.authToken, Pages.createPage);
router.put("/:id/update", auth.authToken, Pages.updatePage);
router.get("/:id", auth.authToken, Pages.getPage);
router.get("/", auth.authToken, Pages.getPages);

module.exports = router;
