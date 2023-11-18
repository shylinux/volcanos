const {shy, Volcanos} = require("../../utils/proto.js")
const {mdb, html} = require("../../utils/const.js")
Volcanos._page = {}
Volcanos("onimport", {
	_init: function(can, msg) {},
})

Volcanos("onaction", {list: ["刷新", "扫码"],
	"刷新": function(event, can) { can.onaction.refresh(event, can) },
	"扫码": function(event, can) { can.user.agent.scanQRCode(can) },
	refresh: function(event, can) {
		can.core.List(can.data.insert.list, function(input) {
			input.action = input.action || input.value
			input.value == "auto" && (input.value = "")
			if (input.value && input.value.indexOf("@") == 0) {
				input.action = input.value.slice(1), input.value = ""
			}
		})
		can.page.setData(can, can.data.insert.list)
	},
	onaction: function(event, can, button, data) { var name = data.name
		(can.onaction[name]||function(event) { can.run(event, [ctx.ACTION, name]) })(event, can)
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
