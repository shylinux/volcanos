Volcanos(chat.ONFIGURE, {key: {
	_show: function(can, msg, cb, target, name) { if (msg.Length() == 0 || msg.Length() == 1 && msg.Append(name) == target.value) { return can.onmotion.hidden(can) }
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value, key, index, line) { value = line[key]
			return {text: [value, html.TD], style: msg.append && msg.append.length == 1? kit.Dict(html.MIN_WIDTH, target.offsetWidth-16): {}, onclick: function(event) {
				can._delay_hidden = false, cb(can, value, target.value), msg.Option(ice.MSG_PROCESS) == ice.PROCESS_AGAIN && can.onmotion.delay(can, function() { can._load(event, can, cb, target, name, value) })
			}}
		}), can.onappend._status(can, [mdb.TOTAL, mdb.INDEX]), can.Status(mdb.TOTAL, msg.Length())
		msg.append.length == 1 && can.page.ClassList.add(can, can._target, chat.SIMPLE)
	},
	_load: function(event, can, cb, target, name, value) { can.runAction(event, mdb.INPUTS, [name, value||""], function(msg) {
		name == ctx.INDEX && can.core.Item(can.onengine.plugin.meta, function(key) { msg.Push(ctx.INDEX, can.core.Keys(ice.CAN, key)) })
		can._show(can, msg, cb, target, name)
	}) },
	onclick: function(event, can, meta, target, cbs) { can.onfigure.key.onfocus(event, can, meta, target, cbs) },
	onfocus: function(event, can, meta, target, cbs) { cbs(function(sub, cb) { if (sub.Status(mdb.TOTAL) > 0) { return }
		meta.msg && meta.msg.Length() > 0? sub._show(sub, meta.msg, cb, target, meta.name): sub._load(event, sub, cb, target, meta.name, target.value)
	}) },
	onblur: function(event, can, sub) { can.onmotion.delay(can, function() { sub._delay_hidden || can.onmotion.hidden(can, sub._target), sub._delay_hidden = false }, 300) },
	onkeydown: function(event, can, meta, cb, target, sub, last) { if (sub.hidden()) { return }
		if (event.key == lang.ENTER && meta._enter && (!can.page.tagis(event.target, html.TEXTAREA) || event.ctrlKey) && meta._enter(event)) { return sub.close() }
		can.onkeymap.selectCtrlN(event, can, sub._output, "tr:not(.hidden)>td:first-child", function(td) { return cb(sub, td.innerText, target.value), td }) 
			|| can.onkeymap.selectInputs(event, sub, function() { sub._load(event, sub, cb, target, meta.name) }, target)
	},
}})
