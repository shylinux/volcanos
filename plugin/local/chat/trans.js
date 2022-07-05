Volcanos(chat.ONIMPORT, {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
		can.onmotion.clear(can)
		can.from = can.onimport._plugin(can, nfs.DIR, html.LEFT, "from", "to")
		can.to = can.onimport._plugin(can, nfs.DIR, html.RIGHT, "to", "from")
		can.onimport._plugin(can, nfs.TRASH, html.LEFT, "from")
		can.onimport._plugin(can, nfs.TRASH, html.RIGHT, "to")
	},
	_plugin: function(can, index, pos, from, to) {
		return can.onappend.plugin(can, {type: chat.STORY, index: index}, function(sub) {
			can.page.style(can, sub._target, {float: pos, clear: pos})
			sub.ConfWidth(can.ConfWidth()/2)
			sub._legend.innerHTML = can.Option(from)+ice.SP+index
			can.page.style(can, sub._output, "max-width", can.ConfWidth()/2)

			sub.run = function(event, cmds, cb) {
				if (can.onaction[cmds[1]]) { return can.onaction[cmds[1]](can, from, to, event, cmds, cb) }

				var msg = sub.request(event, {_pod: can.Option(from)})
				can.runActionCommand(event, index, cmds, cb)
			}
		})
	},
})
Volcanos(chat.ONACTION, {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
	},
	send: function(can, from, to, event, cmds, cb) { var _from = can[from], _to = can[to]
		var path = can.request(event).Option(nfs.PATH)
		var msg = can.request(event, {_handle: ice.TRUE,
			from: can.Option(from), from_path: path,
			to: can.Option(to), to_path: _to.Option(nfs.PATH)+path.split(ice.PS).pop(),
		})
		can.run(event, cmds, function() { _to.Update() }, true)
	},
})
