Volcanos(chat.ONIMPORT, {_init: function(can, msg) { var height = 0.6
		can.from = can.onimport._plugin(can, nfs.DIR, html.LEFT, height, "from", "to")
		can.to = can.onimport._plugin(can, nfs.DIR, html.RIGHT, height, "to", "from")
		can.onmotion.delay(can, function() {
			can.from_trash = can.onimport._plugin(can, nfs.TRASH, html.LEFT, 1-height, "from")
			can.to_trash = can.onimport._plugin(can, nfs.TRASH, html.RIGHT, 1-height, "to")
		}, 100)
	},
	_plugin: function(can, index, pos, height, from, to) {
		return can.onappend.plugin(can, {type: chat.STORY, space: can.Option(from), index: index}, function(sub) {
			sub._legend.innerHTML = can.Option(from)+nfs.PT+index, can.page.style(can, sub._target, {float: pos, clear: pos})
			sub.onexport.output = function() { sub.onimport.size(sub, can.ConfHeight()*height-20, can.ConfWidth()/2-20, false) }
			sub.onimport.size(sub, can.ConfHeight()*height-20, can.ConfWidth()/2-20, false)
			sub.run = function(event, cmds, cb) { var msg = can.request(event); msg.Option("from", can.Option(from)), msg.Option("to", can.Option(to))
				if (can.onaction[cmds[1]]) { return can.onaction[cmds[1]](can, from, to, event, cmds, cb) }
				can.runActionCommand(event, index, cmds, function(msg) { cb && cb(msg)
					if (cmds[0] == ctx.ACTION) {
						if (!to) { can[from].Update() } else { can[from+"_trash"].Update() }
					}
				})
			}
		})
	},
})
Volcanos(chat.ONACTION, {
	send: function(can, from, to, event, cmds, cb) { var msg = can.request(event, {_handle: ice.TRUE})
		msg.Option("from_path", can[from].Option(nfs.PATH)), msg.Option("to_path", can[to].Option(nfs.PATH))
		can.run(event, cmds, function() { can[to].Update() })
	},
})
