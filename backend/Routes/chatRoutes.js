const express = require("express")
const {accessChat, fetchChats, fetchGroups, createGroupChat, groupExit, addSelfToGroup} = require('../Controllers/chatControllers') 

const { protect } = require('../middleware/authMiddleware')

const router = express.Router();

router.route("/").get(protect, fetchChats)
router.route("/").post(protect, accessChat)
router.route("/createGroup").post(protect, createGroupChat)
router.route("/fetchGroups").get(protect, fetchGroups)
router.route('/groupExit').put(protect,groupExit)
router.route('/addSelfToGroup').put(protect, addSelfToGroup)

module.exports = router;