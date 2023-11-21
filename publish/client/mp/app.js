const base = require("utils/lib/base.js")
const core = require("utils/lib/core.js")
const misc = require("utils/lib/misc.js")
const page = require("utils/lib/page.js")
const user = require("utils/lib/user.js")

App({
	data: {}, conf: {
		serve: "https://2021.shylinux.com", appid: "wxf4e5104d83476ed6",
		module: "shylinux.com/x/volcanos", version: "v0.2.1",
	}, base: base, core: core, misc: misc, page: page, user: user,
	onLaunch: function() {
		const res = wx.getSystemInfoSync()
		this.conf.platform = res.platform
		this.conf.brand = res.brand
		this.conf.model = res.model
		console.log("app load", this.conf, res)
	},
})
