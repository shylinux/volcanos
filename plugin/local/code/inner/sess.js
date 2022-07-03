Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, args, cb) { var SESS = "web.code.sess"
	can.onimport.toolkit(can, {index: SESS}, function(sub) {
		sub.run = function(event, cmds, cb) { var msg = can.request(event)
			if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
				nfs.SAVE, function(cmds) {
					can.run(event, [ctx.ACTION, ice.RUN, SESS].concat([ctx.ACTION, mdb.CREATE,
						"tool", JSON.stringify(can.onexport.tool(can)),
						"tabs", JSON.stringify(can.onexport.tabs(can)),
					]), cb, true)
				},
				nfs.LOAD, function(cmds) {
					can.onimport.sess(can, {
						tool: JSON.parse(msg.Option("tool")),
						tabs: JSON.parse(msg.Option("tabs")),
					})
				},
			))) { return }
			can.run(event, [ctx.ACTION, ice.RUN, SESS].concat(cmds), cb, true)
		}, can.base.isFunc(cb) && cb(sub)
	})
}})
