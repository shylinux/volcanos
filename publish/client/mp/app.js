const base = require("utils/lib/base.js")
const core = require("utils/lib/core.js")
const misc = require("utils/lib/misc.js")
const page = require("utils/lib/page.js")
const user = require("utils/lib/user.js")

App({
	data: {}, conf: {serve: "https://2021.shylinux.com"},
	base: base, core: core, misc: misc, page: page, user: user,
	onLaunch: function() { console.log("app load", this.conf) },
})
