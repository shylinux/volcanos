const base = require("utils/lib/base.js")
const core = require("utils/lib/core.js")
const misc = require("utils/lib/misc.js")
const page = require("utils/lib/page.js")
const user = require("utils/lib/user.js")
const misc_wx = require("utils/lib/misc-wx.js")
const page_wx = require("utils/lib/page-wx.js")
const user_wx = require("utils/lib/user-wx.js")
const zh_cn = require("utils/lib/zh-cn.js")
const conf = require("conf.js")

App({conf: conf,
	base: base, core: core,
	misc: base.Copy(misc, misc_wx),
	page: base.Copy(page, page_wx),
	user: base.Copy(user, base.Copy(user_wx, zh_cn)),
	onLaunch: function() { const res = wx.getSystemInfoSync()
		this.conf.platform = res.platform
		this.conf.brand = res.brand
		this.conf.model = res.model
		this.misc.Info("app load", this.conf, res)
	},
})
