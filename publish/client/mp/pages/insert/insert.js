const {kit, ice, ctx, mdb, web, nfs, code, chat, http, html} = require("../../utils/const.js")
const {shy, Volcanos} = require("../../utils/proto.js")
Volcanos._page = {}
Volcanos(chat.ONACTION, {list: ["刷新", "扫码"],
	refresh: function(event, can) {
		can.core.List(can.data.insert.list, function(input) {
			input.action = input.action || input.value
			input.value == ice.AUTO && (input.value = "")
			if (input.value && input.value.indexOf("@") == 0) {
				input.action = input.value.slice(1), input.value = ""
			}
			if (input.type == html.SELECT) {
				input.values = input.values || can.core.Split(input.value)
			}
		}), can.page.setData(can, can.data.insert.list)
	},
	onInputs: function(event, can, button, data) { var index = data.index
		var input = can.data.insert.list[index]
		input.value = event.detail.value
	},
	onChange: function(event, can, button, data) { var index = data.index
		var input = can.data.insert.list[index]
		input.value = input.values[parseInt(event.detail.value)]
	},
	onConfirm: function (event, can, button, data) {
		var res = {}; can.core.List(can.data.insert.list, function(item) { res[item.name] = item.value||"" })
		can.data.insert.cb(res), wx.navigateBack()
	},
})
Volcanos._init()
