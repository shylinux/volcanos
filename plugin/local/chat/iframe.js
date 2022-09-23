Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb) {
		can.current = msg.TableDetail(), can.onimport.layout(can), can.base.isFunc(cb) && cb(msg)
	},
	layout: function(can) { var item = can.current; can.onmotion.clear(can)
		can.page.Append(can, can._output, [{type: html.IFRAME, src: item.link, height: can.ConfHeight()-4, width: can.ConfWidth(), style: {border: 0}}])
	},
})
Volcanos(chat.ONACTION, {help: "操作数据",
	open: function(can) { can.user.open(can.current.link) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据"})
