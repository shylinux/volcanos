const {ice, ctx, mdb, web, chat} = require("../const.js")
const {shy, Volcanos} = require("../proto.js")
module.exports =
Volcanos("user", {
	agent: {
		getLocation: function(can, cb) {
			wx.chooseLocation({success: function(res) {
				cb && cb({
					latitude: parseInt(res.latitude * 100000),
					longitude: parseInt(res.longitude * 100000),
					type: "gcj02", name: res.name, text: res.address,
				})
			}})
		},
		getClipboard: function(can, cb) {
			wx.getClipboardData({success: function(res) {
				cb && cb(can.base.ParseJSON(res.data))
			}})
		},
		scanQRCode: function(can, cb) {
			wx.scanCode({success: function(res) {
				if (res.result.indexOf("WIFI:") == 0) {
					var ls = can.core.Split(res.result, ":;"), data = {}
					for (var i = 1; i < ls.length; i += 2) { data[ls[i]] = ls[i+1] }
					console.log("scan", data)
					can.user.agent.connectWifi(can, data.S, data.P, function() {
						can.user.toast(can, "success")
					})
					return
				}
				var data = can.base.ParseJSON(res.result)
				if (data.type == web.LINK && data._origin) { can.base.Copy(data, can.misc.ParseURL(can, res.result)) }
				console.log("scan", data)
				if (cb && cb(data)) { return }
				if (data.type == web.LINK && data._origin) { delete(data.type), delete(data.name), delete(data.text)
					var ls = new RegExp("(https?://[^/]+)([^?#]*)([^#]*)(.*)").exec(data._origin); delete(data._origin)
					data.serve = ls[1]; if (ls[2].indexOf("/pages/") == 0) { data.pages = ls[2] }
				}
				if (data.cmd||data.index||data.share) {
					can.user.jumps(can.base.MergeURL(data.pages||chat.PAGES_ACTION, data))
				} else if (data.pod||data.space||data.serve) {
					can.user.jumps(can.base.MergeURL(data.pages||chat.PAGES_RIVER, data))
				} else {
					can.misc.request(can, can.request(), chat.WX_LOGIN_SCAN, data)
				}
			}})
		},
		connectWifi: function(can, ssid, password, cb, cbs) { wx.showLoading()
			wx.startWifi({success: function(res) {
				wx.connectWifi({SSID: ssid, password: password, success: function(res) { wx.hideLoading()
					console.log("wifi", res), cb && cb(res)
				}, fail: function(res) {
					console.log("wifi", res), cbs && cbs(res)
				}})
			}, fail: function(res) {
				console.log("wifi", res), cbs && cbs(res)
			}})
		},
	}, info: {},
	jumps: function(url, cb) { wx.navigateTo({url: url, success: cb}) },
	title: function(text, cb) { text && wx.setNavigationBarTitle({title: text, success: cb}) },
	toast: function(can, title) { wx.showToast({title: title||""}) },
	modal: function(can, content, title, cb) { wx.showModal({title: title||"", content: content||"", success: cb}) },
	login: function(can, cb) {
		can.conf.sessid = can.conf.sessid||can.misc.localStorage(can, ice.MSG_SESSID)
		if (can.conf.sessid) { return cb && cb() }
		wx.login({success: function(res) { can.misc.request(can, can.request(), chat.WX_LOGIN_SESS, {code: res.code}, function(msg) {
			wx.setStorage({key: ice.MSG_SESSID, data: can.conf.sessid = msg.Result()}), cb && cb()
		}) }})
	},
	userinfo: function(can, cb) {
		can.user.info.userNick? can.misc.request(can, can.request(), chat.WX_LOGIN_USER, {}, function(msg) {
			cb && cb(can.user.info)
		}): can.user.login(can, function() { wx.getSetting({success: function(res) {
			res.authSetting['scope.userInfo'] && wx.getUserInfo({success: function(res) {
				can.misc.request(can, can.request(), chat.WX_LOGIN_USER, can.user.info = res.userInfo, function(msg) {
					cb && cb(can.user.info)
				})
			}})
		}}) })
	},
	trans: function(can, text, list, zone) { if (!text) { return text }
		return can.core.Value(list, can.core.Keys(zone, text))||can.core.Value({
			"run": "执行", "list": "查看", "back": "返回",
			"create": "创建", "remove": "删除",
			"prunes": "清理",
			"start": "启动", "stop": "停止", "open": "打开",
			"trash": "清理",
			input: {
				"hash": "索引",
				"time": "时间", "link": "链接", "status": "状态", "action": "操作",
				"type": "类型", "name": "名称", "text": "内容", "icon": "图标",
				"repos": "仓库", "binary": "程序", "script": "脚本", "template": "仓库", "version": "版本",
				"path": "路径", "size": "大小",
			},
			value: {
				"start": "启动", "stop": "停止",
			},
		}, can.core.Keys(zone, text))||text
	},
})
