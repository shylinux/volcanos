Volcanos(chat.ONACTION, {source: function(can, msg) {
	can.require(["https://res.wx.qq.com/open/js/jweixin-1.6.0.js"], function(can) {
		wx.config({debug: msg.Option("debug") == ice.TRUE,
			appId: msg.Option("appid"), signature: msg.Option("signature"),
			nonceStr: msg.Option("noncestr"), timestamp: msg.Option("timestamp"),

			jsApiList: can.core.Item({
				scanQRCode: function(cb) { wx.scanQRCode({needResult: cb? 1: 0, scanType: ["qrCode","barCode"], success: function (res) {
					can.base.isFunc(cb) && cb(res.resultStr, can.base.ParseJSON(res.resultStr))
				} }) },
				getLocation: function(cb) { wx.getLocation({type: "gcj02", success: function (res) {
					can.base.isFunc(cb) && cb({type: "gcj02", name: "当前位置", text: "当前位置", latitude: parseInt(res.latitude*100000), longitude: parseInt(res.longitude*100000) })
				} }) },
				openLocation: function(msg) { wx.openLocation({
					latitude: parseInt(msg.Option("latitude"))/100000,
					longitude: parseInt(msg.Option("longitude"))/100000,
					name: msg.Option(mdb.NAME), address: msg.Option(mdb.TEXT),
					scale: msg.Option("scale")||14, infoUrl: msg.Option(mdb.LINK),
				}) },
				chooseImage: function(cb, count) { wx.chooseImage({count: count||9, sizeType: ['original', 'compressed'], sourceType: ['album', 'camera'], success: function (res) {
					can.base.isFunc(cb) && cb(res.localIds)
				} }) },
			}, function(key, value) { return can.user.agent[key] = value, key }),
		})
		wx.error(function(err) { can.user.toast(err, "wx load") })
		wx.ready(function() { can.misc.Log("ready") })
	})
}})
