Volcanos(chat.ONFIGURE, {help: "控件详情", list: [], key: {
	_init: function(event, can, cbs, target, name, value) { var call = arguments.callee
		can.runAction(event, mdb.INPUTS, [name, value||target.value], function(msg) {
			can.onmotion.clear(can), can.onappend.table(can, msg, function(value) {
				return {text: [value, html.TD], onclick: function(event) {
					target.value = value, can.onmotion.focus(can, target)
					if (msg.Option(ice.MSG_PROCESS) != ice.PROCESS_AGAIN) { return can.close() }
					target._hold = true, call(event, can, cbs, target, name, value)
				}}
			}), can.onappend._status(can, [mdb.TOTAL, mdb.INDEX]), can.Status(mdb.TOTAL, msg.Length())
			can.base.isFunc(cbs) && cbs(can, msg.Length() == 0)
		})
	},
	onclick: function(event, can, meta, cb, target) { can.onmotion.focus(can, target)
		cb(function(sub, cbs) { can.onfigure.key._init(event, sub, cbs, target, meta.name) })
	},
	onkeydown: function(event, can, meta, cb, target, last) {
		switch (event.key) {
			case "n":
			case "p": event.ctrlKey && can.onkeymap.prevent(event); break
			default: can.base.isFunc(last) && last(event, can)
		}
	},
	onkeyup: function(event, can, meta, cb, target, last) { var sub = target._can
		sub && can.onmotion.selectInputTable(event, sub, function() {
			can.onfigure.key._init(event, sub, null, target, meta.name)
		}, target), can.base.isFunc(last) && last(event, can)
	},
	onblur: function(event, can, meta, cb, target) {
		target._hold || can.onmotion.delay(can, function() { target._can && target._can.close() }), target._hold = false
	},
}})
