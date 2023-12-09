const {ice, ctx, mdb, web, code, chat, http, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto.js")
Volcanos._page = {}
Volcanos(chat.ONACTION, {list: ["刷新", "扫码", "清屏"]})
Volcanos._init()
