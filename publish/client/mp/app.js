const base = require("utils/lib/base.js")
const core = require("utils/lib/core.js")
const misc = require("utils/lib/misc.js")
const page = require("utils/lib/page.js")
const user = require("utils/lib/user.js")
const conf = require("conf.js")

App({
	data: {}, conf: conf, base: base, core: core, misc: misc, page: page, user: user,
	onLaunch: function() {
		const res = wx.getSystemInfoSync()
		this.conf.platform = res.platform
		this.conf.brand = res.brand
		this.conf.model = res.model
		this.misc.Info("app load", this.conf, res)
	},
})
