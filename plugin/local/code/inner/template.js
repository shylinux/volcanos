Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, args, cb) {
	can.onimport.toolkit(can, {index: "web.code.template"}, function(sub) {
		sub.run = function(event, cmds, cb) { var msg = sub.request(event, can.Option())
			if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
				nfs.DEFS, function(cmds) {
					can.user.input(event, can, can.base.Obj(msg.Option("args")||"[]"), function(ev, button, data, list, args) {
						var msg = can.request(event); can.core.Item(data, function(key, value) { msg.Option(key, value) })
						can.run(event, [ctx.ACTION, ice.RUN, "web.code.template", nfs.DEFS].concat(cmds), function(msg) {
							can.base.isFunc(cb) && cb(msg)
							can.onimport.project(can, can.Option(nfs.PATH))
							can.onimport.tabview(can, can.Option(nfs.PATH), msg.Option("main"), "", function() {
								can.onimport.tabview(can, can.Option(nfs.PATH), cmds[1], 1, function() {})
							}, true)
						}, true)
					})
				}
			))) { return }
			can.run(event, [ctx.ACTION, ice.RUN, "web.code.template"].concat(cmds), function(msg) {
				can.base.isFunc(cb) && cb(msg)
			}, true)
		}, can.base.isFunc(cb) && cb(sub)
	})
}})
