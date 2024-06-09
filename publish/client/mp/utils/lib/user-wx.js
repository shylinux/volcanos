const {kit, ice,
	ctx, mdb, web, aaa,
	lex, yac, ssh, gdb,
	tcp, nfs, cli, log,
	code, wiki, chat, team, mall,
	http, html, icon, svg
} = require("../const.js")
const {shy, Volcanos} = require("../proto-wx.js")
module.exports =
Volcanos("user", {
	agent: {
		enableDebug: function(can) {
			if (can.db.debug == ice.TRUE && can.conf.platform != "devtools") {
				wx.setEnableDebug({enableDebug: true})
			}
		},
		getLocation: function(can, cb) {
			wx.chooseLocation({success: function(res) {
				cb && cb({
					latitude: parseInt(res.latitude * 100000),
					longitude: parseInt(res.longitude * 100000),
					type: "gcj02", name: res.name, text: res.address,
				})
			}})
		},
		connectWifi: function(can, ssid, password, cb, cbs) { wx.showLoading()
			wx.startWifi({success: function(res) {
				wx.connectWifi({SSID: ssid, password: password, success: function(res) {
					can.core.Timer(1000, function() { wx.hideLoading()
						can.misc.Info("wifi", res), cb && cb(res)
					})
				}, fail: function(res) { can.misc.Warn("wifi", res), cbs && cbs(res) }})
			}, fail: function(res) { can.misc.Warn("wifi", res), cbs && cbs(res) }})
		},
		getClipboard: function(can, cb) {
			wx.getClipboardData({success: function(res) {
				cb && cb(can.base.ParseJSON(res.data))
			}})
		},
		scanQRCode: function(can, cb) {
			wx.scanCode({success: function(res) {
				can.misc.Info("scan", res.result)
				can.user.parse(can, res.result, cb)
			}})
		},
	}, info: {},
	scene: function(can, scene, cb) {
		function post() {
			can.misc.POST(can, can.request(), "/chat/wx/login/action/scene", {scene: scene, serve: can.db.serve}, function(msg) {
				can.misc.Info("app scene", msg.Result()), can.user.parse(can, msg.Result())
			})
		}
		function wifi(cb) { can.db.ssid && can.db.password != "******"? can.user.agent.connectWifi(can, can.db.ssid, can.db.password||"", function() { can.db.password = "******", cb() }): cb() }
		if (scene) { var ls = scene.split(nfs.PS); scene = ls[2]
			if (ls[0] == "s") { can.db.serve = "https://"+ls[1] }
			if (ls[0] == "h") { can.db.serve = "http://"+ls[1] }
			if (ls[0] == "w") {
				wx.getLocalIPAddress({success(res) {
					can.db.serve = "http://"+res.localip.split(".").slice(0,3).join(".")+"."+parseInt("0x"+ls[1])+":9020", can.db.ssid = ls[3], can.db.password = ls[4]
					wifi(function() { post() })
				} })
			} else {
				wifi(function() { post() })
			}
		} else { wifi(cb) }
	},
	parse: function(can, text, cb) {
		if (text.indexOf("WIFI:") == 0) { var data = kit.Dict(can.core.Split(text, ":;").slice(1))
			if (cb && cb(data)) { return }
			return can.user.agent.connectWifi(can, data.S, data.P, function() { can.user.toast(can, ice.SUCCESS) })
		}
		var data = can.base.ParseJSON(text)
		if (data.type == web.LINK && data._origin) { can.base.Copy(data, can.misc.ParseURL(can, text)) }
		if (cb && cb(data)) { return }
		if (data.type == web.LINK && data._origin) { delete(data.type), delete(data.name), delete(data.text)
			var ls = new RegExp("(https?://[^/]+)([^?#]*)([^#]*)(.*)").exec(data._origin); delete(data._origin)
			if (ls[1] != "https://servicewechat.com") { data.serve = ls[1] }
			if (ls[2].indexOf("/pages/") == 0) { data.pages = ls[2] }
		}
		can.misc.Info("app parse", data)
		if (data.cmd||data.index||data.share) {
			can.user.jumps(can.base.MergeURL(data.pages||chat.PAGES_ACTION, data))
		} else if (data.pod||data.space||data.serve) {
			can.user.switchTab(can, web.DREAM, data)
		} else {
			can.misc.POST(can, can.request(), chat.WX_LOGIN_SCAN, data)
		}
	},
	switchTab: function(can, name, data, force) { data = data||can.db
		if (!force && data.serve == can.db.serve) { return wx.switchTab({url: name}) }
		can.misc.localStorage(can, web.SERVE, data.serve||""), wx.reLaunch({url: name})
	},
	jumps: function(url, cb) { wx.navigateTo({url: url, success: cb, fail: function(res) { console.warn(res) }}) },
	title: function(text, cb) { text && wx.setNavigationBarTitle({title: text, success: cb}) },
	trans: function(can, text, list, zone) { if (!text) { return text }
		return can.core.Value(can.core.Value(list, ctx.FEATURE_TRANS), can.core.Keys(zone, text))||can.core.Value(can.user._trans, can.core.Keys(zone, text))||text
	}, _trans: {},
	toast: function(can, title) { wx.showToast({title: title||""}) },
	modal: function(can, content, title, cb) { wx.showModal({title: title||"", content: content||"", success: cb}) },
	login: function(can, cb, cbs) { var serve = can.misc.serveList(can, {serve: can.db.serve}); if (serve.sessid) { return cb && cb() }
		wx.login({success: function(res) { can.misc.POST(can, can.request(), chat.WX_LOGIN_SESS, {code: res.code}, function(msg) {
			can.misc.serveList(can, {serve: can.db.serve, sessid: msg.Result()}), cb && cb()
		}) }, fail: function(res) { cbs && cbs(res) }})
	},
})
