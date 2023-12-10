const conf = require("conf.js")
const base = require("utils/lib/base.js")
const core = require("utils/lib/core.js")
const misc = require("utils/lib/misc.js")
const page = require("utils/lib/page.js")
const user = require("utils/lib/user.js")
const misc_wx = require("utils/lib/misc-wx.js")
const page_wx = require("utils/lib/page-wx.js")
const user_wx = require("utils/lib/user-wx.js")

App({conf: conf,
	base: base, core: core,
	misc: base.Copy(misc, misc_wx),
	page: base.Copy(page, page_wx),
	user: base.Copy(user, user_wx),
	onLaunch: function() { const info = wx.getSystemInfoSync()
		switch (info.language.toLowerCase().replaceAll("_", "-")) {
			case "zh-cn": base.Copy(user, require("utils/lib/zh-cn.js")); break
			default: base.Copy(user, require("utils/lib/en-us.js"))
				user.trans = function(can, text, list, zone) { return text }
		}
		this.conf.platform = info.platform
		this.conf.brand = info.brand
		this.conf.model = info.model
		this.misc.Info("app load", this.conf, info)
	},
})
