Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
		can.onmotion.clear(can)
		can.from = can.onimport._plugin(can, nfs.DIR, html.LEFT, "from", "to")
		can.to = can.onimport._plugin(can, nfs.DIR, html.RIGHT, "to", "from")
		can.onmotion.delay(can, function() {
			can.from_trash = can.onimport._plugin(can, nfs.TRASH, html.LEFT, "from")
			can.to_trash = can.onimport._plugin(can, nfs.TRASH, html.RIGHT, "to")
		}, 100)
	},
	_plugin: function(can, index, pos, from, to) {
		return can.onappend.plugin(can, {type: chat.STORY, index: index}, function(sub) {
			sub.onimport.size(sub, can.ConfHeight()/2, can.ConfWidth()/2, false)
			can.page.style(can, sub._target, {float: pos, clear: pos})
			sub._legend.innerHTML = can.Option(from)+ice.SP+index

			sub.run = function(event, cmds, cb) {
				if (can.onaction[cmds[1]]) { return can.onaction[cmds[1]](can, from, to, event, cmds, cb) }
				can.runActionCommand(sub.request(event, {_pod: can.Option(from)}), index, cmds, cb)
				if (!to) { can[from].Update() } else {}
			}
		})
	},
})
Volcanos(chat.ONACTION, {
	send: function(can, from, to, event, cmds, cb) { var _from = can[from], _to = can[to]
		var path = can.request(event).Option(nfs.PATH)
		var msg = can.request(event, {_handle: ice.TRUE,
			from: can.Option(from), from_path: path,
			to: can.Option(to), to_path: _to.Option(nfs.PATH)+path.split(ice.PS).pop(),
		})
		can.run(event, cmds, function() { _to.Update() }, true)
	},
})
