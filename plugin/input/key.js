Volcanos(chat.ONFIGURE, {key: {
	_load: function(event, can, cbs, target, name, value) {
		can.runAction(event, mdb.INPUTS, [name, value||target.value], function(msg) {
			if (name == ctx.INDEX) {
				can.core.Item(can.onengine.plugin.meta, function(key, cb) {
					msg.Push(ctx.INDEX, can.core.Keys("can", key))
				})
			}
			can.onfigure.key._show(can, msg, cbs, target, name)
		})
	},
	_select: function(event, can, target) {
		if (event.ctrlKey) { var sub = target._can
			if (event.key <= "9" && event.key >= "0") { 
				can.page.Select(can, sub._output, "tr:not(.hidden) td:first-child", function(td, index) {
					if (index+1 == event.key) { target.value = td.innerText }
				}); return true
			}
		} return false
	},
	_show: function(can, msg, cbs, target, name) {
		if (!can.onmotion.toggle(can, can._target, msg.Length() != 0)) { return }
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value, key, index, line) { value = line[key]
			return {text: [value, html.TD], style: msg.append && msg.append.length == 1? {"min-width": target.offsetWidth-16}: {}, onclick: function(event) { can.base.isFunc(cbs) && cbs(can, value, target.value)
				msg.Option(ice.MSG_PROCESS) == ice.PROCESS_AGAIN && can.onmotion.delay(can, function() {
					can.onfigure.key._load(event, can, cbs, target, name, value)
				})
			}}
		}), can.onappend._status(can, [mdb.TOTAL, mdb.INDEX]), can.Status(mdb.TOTAL, msg.Length())
		can.getActionSize(function(left, top, width, height) { left = left||0, top = top||0
			can.page.style(can, can._target, html.MAX_HEIGHT, can.base.Max(can.page.height()-can._target.offsetTop-html.ACTION_HEIGHT, 600))
		})
	},
	_make: function(event, can, meta, cb, target, last) {
		var sub = target._can; if (sub && sub._cbs) { return }
		cb(function(sub, cbs) { sub._cbs = cbs
			if (meta.msg && meta.msg.Length() > 0) {
				can.onfigure.key._show(sub, meta.msg, cbs, target, meta.name)
			} else {
				can.onfigure.key._load(event, sub, cbs, target, meta.name)
			}
		})
	},
	onclick: function(event, can, meta, cb, target) {
		target._can && target._can.close()
		can.onfigure.key._make(event, can, meta, cb, target)
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
			case "Enter": if (meta._enter && (!can.page.tagis(event.target, html.TEXTAREA) || event.ctrlKey)) {
				if (meta._enter(event)) { return } break
			}
			default: can.base.isFunc(last) && last(event, can)
		}
		can.onfigure.key._make(event, can, meta, cb, target)
	},
	onkeyup: function(event, can, meta, cb, target, last) { var sub = target._can; if (!sub) { return }
		if (can.onfigure.key._select(event, can, target)) { return }
		switch (event.key) {
			case ice.PS: can.onfigure.key._load(event, sub, sub._cbs, target, meta.name, event.target.value); break
		}
		can.onmotion.selectInputTable(event, sub, function() { can.onfigure.key._load(event, sub, sub._cbs, target, meta.name) }, target)
	},
}})
