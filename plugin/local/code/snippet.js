Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can)
		if (msg.Option("content")) {
			can.onappend.plugin(can, {index: "web.code.vimer", style: "full"}, function(sub) {
				sub.run = function(event, cmds, cb) { var res = can.request(event)
					if (cmds[1] == "plugin") {
						can.runAction(event, "vimer", cmds, cb)
						return
					}
					if (cmds[1] == "main.go") { res.Echo(msg.Option("content"))
						can.onmotion.delay(can, function() { can.sub && can.sub.onaction["项目"]({}, can.sub) })
					}
					cb(res), can.sub = can.core.Value(sub, "_outputs.-1")
				}
			}, can._output)
			return
		}
		can.onappend.table(can, msg)
		can.onappend.board(can, msg)
	},
})
Volcanos(chat.ONACTION, {help: "操作数据", _init: function(can, msg, cb, target) {
	},
	run: function(event, can, msg) {
		can.runAction(event, ice.RUN, ["go", "hi.go", can.sub.onexport.content(can.sub)], function(msg) {
			can.onappend.board(can, msg)
		})
	},
})
