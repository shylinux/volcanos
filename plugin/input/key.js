Volcanos(chat.ONFIGURE, {help: "控件详情", key: {
	_init: function(event, can, cbs, target, name, value) {
		can.runAction(event, mdb.INPUTS, [name, value||target.value], function(msg) {
			can.onfigure.key._show(can, msg, cbs, target, name)
		})
	},
	_show: function(can, msg, cbs, target, name) {
		if (!can.onmotion.toggle(can, can._target, msg.Length() != 0)) { return }
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value) {
			return {text: [value, html.TD], style: msg.Length() > 1? {"min-width": target.offsetWidth-16}: {}, onclick: function(event) { can.base.isFunc(cbs) && cbs(can, value, target.value)
				msg.Option(ice.MSG_PROCESS) == ice.PROCESS_AGAIN && can.onmotion.delay(can, function() {
					can.onfigure.key._init(event, can, cbs, target, name, value)
				})
			}}
		}), can.onappend._status(can, [mdb.TOTAL, mdb.INDEX]), can.Status(mdb.TOTAL, msg.Length())
		can.getActionSize(function(left, top, width, height) {
			can.page.style(can, can._target, html.MAX_HEIGHT, can.base.Max(top+height-can._target.offsetTop, 400))
		})
	},
	_make: function(event, can, meta, cb, target, last) {
		var sub = target._can; if (sub && sub._cbs) { return }
		cb(function(sub, cbs) { sub._cbs = cbs
			if (meta.msg && meta.msg.Length() > 0) {
				can.onfigure.key._show(sub, meta.msg, cbs, target, meta.name)
			} else {
				can.onfigure.key._init(event, sub, cbs, target, meta.name)
			}
		})
	},
	onclick: function(event, can, meta, cb, target) {
		target._can && target._can.close()
		can.onfigure.key._make(event, can, meta, cb, target)
		can.onmotion.focus(can, target)
	},
	onfocus: function(event, can, meta, cb, target, last) {
		can.onfigure.key._make(event, can, meta, cb, target)
	},
	onkeydown: function(event, can, meta, cb, target, last) {
		switch (event.key) {
			case "Escape": target._can? target._can.close(): target.blur(); return
			case "Tab": target._can && target._can.close(); return
			case "n":
			case "p": event.ctrlKey && can.onkeymap.prevent(event); break
			default: can.base.isFunc(last) && last(event, can)
		}
		can.onfigure.key._make(event, can, meta, cb, target)
	},
	onkeyup: function(event, can, meta, cb, target, last) { var sub = target._can; if (!sub) { return }
		switch (event.key) {
			case ice.PS: can.onfigure.key._init(event, sub, sub._cbs, target, meta.name, event.target.value); break
		}
		can.onmotion.selectInputTable(event, sub, function() { can.onfigure.key._init(event, sub, sub._cbs, target, meta.name) }, target)
	},
}})
