Volcanos(chat.ONFIGURE, {help: "控件详情", key: {
	_init: function(can, msg, cbs, target, name) { can.onmotion.hidden(can, can._target, msg.Length() != 0)
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value) {
			return {text: [value, html.TD], onclick: function(event) { can.base.isFunc(cbs) && cbs(can, value, target.value) }}
		}), can.onappend._status(can, [mdb.TOTAL, mdb.INDEX]), can.Status(mdb.TOTAL, msg.Length())
		can.getActionSize(function(left, top, width, height) {
			can.page.style(can, can._target, html.MAX_HEIGHT, top+height-can._target.offsetTop)
		})
	},
	_show: function(event, can, cbs, target, name, value) {
		can.runAction(event, mdb.INPUTS, [name, value||target.value], function(msg) {
			can.onfigure.key._init(can, msg, cbs, target, name)
		})
	},
	onclick: function(event, can, meta, cb, target) { can.onmotion.focus(can, target)
		cb(function(sub, cbs) {
			if (meta.msg && meta.msg.Length() > 0) {
				can.onfigure.key._init(sub, meta.msg, cbs, target, meta.name)
			} else {
				can.onfigure.key._show(event, sub, cbs, target, meta.name)
			}
		})
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
			can.onfigure.key._show(event, sub, null, target, meta.name)
		}, target), can.base.isFunc(last) && last(event, can)
	},
	onblur: function(event, can, meta, cb, target) {
		target._hold || can.onmotion.delay(can, function() { target._can && target._can.close() }), target._hold = false
	},
}})
