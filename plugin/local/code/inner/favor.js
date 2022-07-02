Volcanos("onimport", {help: "导入数据", _init: function(can, args, cb) {
	can.onimport.toolkit(can, {index: "web.code.favor"}, function(sub) {
		sub.run = function(event, cmds, cb) { var msg = can.request(event)
			if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
				code.INNER, function(cmds) {
					can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE), msg.Option(nfs.LINE))
				},
			))) { return }

			can.run(event, can.misc.concat(can, [ctx.ACTION, code.FAVOR], cmds), function(msg) { var sub = msg._can
				sub.onmotion.clear(sub), sub.onappend.table(sub, msg, function(value, key, index, line) {
					if (msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE) {
						if (key == mdb.VALUE) { key = line.key }
					}
					if (key != ctx.ACTION) { value = sub.page.replace(sub, value, ice.PWD, "") }

					return {text: ["", html.TD], list: [{text: [value, html.DIV]}], onclick: function(event) { var target = event.target
						if ([mdb.ZONE, mdb.ID].indexOf(key) > -1) { return sub.onaction.change(event, sub, key, value) }

						if (target.tagName == "INPUT" && target.type == html.BUTTON) { var msg = sub.request(event, line, sub.Option())
							return sub.run(event, [ctx.ACTION, target.name], function(msg) { sub.run() }, true)
						}

						line.line && can.onimport.tabview(can, line.path, line.file.replace(ice.PWD, ""), parseInt(line.line))
					}}
				}, sub._output), sub.onappend._status(sub, msg.Option(ice.MSG_STATUS)), can.Status("标签数", msg.Length())
			}, true)
		}, can.base.isFunc(cb) && cb(sub)
	})
}})
