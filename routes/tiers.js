const express = require("express");
const router = express.Router();

const Tiers = require("../controllers/tiers");

const auth = require("../middleware/index");

router.post("/", auth.authToken, Tiers.createTier);
router.get("/", auth.authToken, Tiers.getTiers);
router.put("/:tierId", auth.authToken, Tiers.editTier);
router.delete("/:tierId", auth.authToken, Tiers.deleteTier);

module.exports = router;
