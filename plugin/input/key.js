Volcanos(chat.ONFIGURE, {key: {
	_load: function(event, can, cb, target, name, value) {
		if (target._done && target.value) { return can.onmotion.hidden(can, can._target, can.Status("total") > 0)} target._done = true
		can.onmotion.focus(can, target), can.onmotion.hidden(can, can._target)
		can.runAction(event, mdb.INPUTS, [name, value||""], function(msg) {
			name == ctx.INDEX && can.core.Item(can.onengine.plugin.meta, function(key) { msg.Push(ctx.INDEX, can.core.Keys(ice.CAN, key)) })
			can._show(can, msg, cb, target, name)
		})
	},
	_show: function(can, msg, cb, target, name) {
		if (msg.Length() == 0 || msg.Length() == 1 && msg.Append(name) == target.value && target.value != "") { return can.onmotion.hidden(can) }
		if (can.base.isIn(msg.append[msg.append.length-1], ctx.ACTION, "cb")) { msg.append = msg.append.slice(0, -1) } var list = {}
		msg.Option(ice.TABLE_CHECKBOX, "")
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value, key, index, item) { value = item[key]
			if (msg.append.length == 1 && index < 100 && list[value]) { return } list[value] = true
			return {text: [value, html.TD, value == ""? html.HR: ""], style: msg.append && msg.append.length == 1? kit.Dict(html.MIN_WIDTH, target.offsetWidth-16): {}, onclick: function(event) {
				can.close(); if (msg.cb && msg.cb[index]) { return msg.cb[index](value) }
				var _cb = can.Conf("select"); if (_cb) { return _cb(target.value = value) } can.base.isFunc(cb) && cb(can, value, target.value)
			}}
		})
		can.showIcons = function(value, icons, title) { can.ui = can.ui||{}
			if (!can.ui.img) {
				can.ui.img = can.page.insertBefore(can, [{type: html.IMG}], target)
				can.ui.span = can.page.insertBefore(can, [{type: html.SPAN}], target)
				can.onappend.style(can, mdb.ICONS, can.page.parentNode(can, target, html.TR))
				can.page.style(can, target, html.COLOR, html.TRANSPARENT)
				target._clear = function() { can.ui.img.src = can.misc.Resource(can, "usr/icons/icebergs.png"), can.ui.span.innerHTML = "" }
			}
			can.ui.img.src = can.misc.Resource(can, icons), can.ui.span.innerText = title||value
			target.value = value, can.onmotion.hidden(can, can._target)
		}
		can.core.CallFunc([can.oninputs, "_show"], {event: event, can: can, msg: msg, target: target, name: name})
		var style = msg.Option(ice.MSG_DISPLAY)? can.base.ParseURL(msg.Option(ice.MSG_DISPLAY)).style||name: name
		can.core.CallFunc([can.sup.sub, "oninputs", style], {event: event, can: can, msg: msg, target: target, name: name})
		can.layout(msg)
	},
	onfocus: function(event, can, meta, target, cbs, mod) { meta._force && mod.onclick(event, can, meta, target, cbs) },
	onclick: function(event, can, meta, target, cbs) { (target.value == "" || meta._force) && cbs(function(sub, cb) { if (sub.Status(mdb.TOTAL) > 0) { return }
		sub.sup = can._fields? can.sup: can
		meta.msg && meta.msg.Length() > 0? sub._show(sub, meta.msg, cb, target, meta.name): sub._load(event, sub, cb, target, meta.name, target.value)
	}) },
	onblur: function(event, can, sub, cb) { sub && can.onmotion.delay(can, sub.close, 300) },
	onkeyup: function(event, can, meta, cb, target, sub, last) { if (event.key == code.TAB) { return }
		if (event.key == code.ENTER) { return meta._enter && (!can.page.tagis(event.target, html.TEXTAREA) || event.ctrlKey) && meta._enter(event, target.value)? sub && sub.close(): last(event) }
		if (!sub) { return } can.onmotion.toggle(can, sub._target, true)
		sub.hidden() || can.onkeymap.selectCtrlN(event, can, sub._output, "tr:not(.hidden)>td:first-child", function(td) { return meta.select && (sub.close(), meta.select(target.value = td.innerText)), cb(sub, td.innerText, target.value), td })
			|| can.onmotion.delayOnce(can, function() { can.onkeymap.selectInputs(event, sub, function() { sub._load(event, sub, cb, target, meta.name) }, target) }, target.value.length < 3? 500: 150)
	},
}})
