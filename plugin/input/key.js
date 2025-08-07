Volcanos(chat.ONFIGURE, {key: {
	_load: function(event, can, cb, target, name, value) {
		// if (target._done && target.value) { return can.onmotion.hidden(can, can._target, can.Status("total") > 0)} target._done = true
		// can.onmotion.focus(can, target)
		can.onmotion.hidden(can, can._target)
		can.runAction(event, mdb.INPUTS, [name, value||""], function(msg) {
			if (can.sup.ConfIndex() != "web.team.production.case") {
				name == ctx.INDEX && can.core.Item(can.onengine.plugin.meta, function(key) { msg.Push(ctx.INDEX, can.core.Keys(ice.CAN, key)) })
			}
			can._show(can, msg, cb, target, name)
		})
	},
	_show: function(can, msg, cb, target, name) {
		// msg.Option(ice.TABLE_CHECKBOX, "")
		if (msg.Option(ice.TABLE_CHECKBOX) == ice.TRUE) { target._hold = true
			can.onappend._action(can, [html.CANCEL, html.CONFIRM, msg.Length() > 5? html.FILTER: ""], can._action, {
				cancel: function() { can.onmotion.focus(can, target), can.onmotion.hidden(can, can._target) },
				confirm: function() { var list = msg.Table()
					can.base.isFunc(cb) && cb(can, can.page.Select(can, can._output, html.TR, function(target) {
						if (can.page.ClassList.has(can, target, html.SELECT)) {
							return list[target.dataset.index][msg.append[0]]
						}
					}).join(","), target.value)
					can.onmotion.focus(can, target), can.onmotion.hidden(can, can._target)
				},
			})
		}
		if (msg.Length() == 0 || msg.Length() == 1 && msg.Append(name) == target.value && target.value != "") { return can.onmotion.hidden(can) }
		if (can.base.isIn(msg.append[msg.append.length-1], ctx.ACTION, "cb")) { msg.append = msg.append.slice(0, -1) } var list = {}
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
		if (msg.Option("_display") && !can.base.beginWith(msg.Option("_display"), "/plugin/input/key.js") && !can.base.contains(msg.Option("_display"), "src/gonganxitong/common.js")) {
			target._selectonly = true, can.ConfWidth(target.offsetWidth)
			can.run = function(event, cmds, cb) { var list = msg["_input_args"]||msg.append, _msg = can.request(event)
				can.showIcons(_msg.Option(list[0]), _msg.Option(list[2]||mdb.ICONS)||_msg.Option(mdb.ICONS)||_msg.Option(mdb.ICON)||_msg.Option("user_avatar"), _msg.Option(list[1]))
			}
			can.Conf("feature", can.sup.Conf("feature"))
			can.onappend._output(can, msg, (msg[ice.MSG_DISPLAY]||[]).concat("/plugin/table.js").join(","), function(msg) { can.layout(msg) })
			return
		}
		can.onmotion.clear(can), can.onappend.table(can.sup, msg, function(value, key, index, item) { value = item[key]
			if (msg.append.length == 1 && index < 100 && list[value]) { return } list[value] = true
			return {text: [value, html.TD, [value == ""? html.HR: "", key]], style: msg.append && msg.append.length == 1? kit.Dict(html.MIN_WIDTH, target.offsetWidth-16): {}, onclick: function(event) {
				can.onengine.signal(can, "onevent", can.request(event))
				can.close(); if (msg.cb && msg.cb[index]) { return msg.cb[index](value) }
				var _cb = can.Conf("select"); if (_cb) { return _cb(target.value = value) } can.base.isFunc(cb) && cb(can, value, target.value)
			}, _init: function(target) {
				can.onappend.style(can, "i-"+index, target.parentNode)
				// can.onappend.style(can, "s-"+can.base.replaceAll(item[name], "/", "_"), target.parentNode)
			}}
		}, can._output)
		can.core.CallFunc([can.oninputs, "_show"], {event: event, can: can, msg: msg, target: target, name: name})
		var display = msg.Option(ice.MSG_DISPLAY)? can.base.ParseURL(msg.Option(ice.MSG_DISPLAY)): {name: name}
		if (display.title && !msg[display.title]) { display.title = msg.append[1] }
		var args = msg._input_args||[]
		display.title = args[1]||display.title
		display.style && can.core.CallFunc([can.sup.sub, "oninputs", display.style], {event: event, can: can, msg: msg, target: target, name: display.name||name, title: display.title})
		can.layout(msg)
	},
	onfocus: function(event, can, meta, target, cbs, mod) {
		// can.onengine.signal(can, "onevent", can.request(event));
		if (target._selectonly) { can.onmotion.delay(can, function() { target.blur() }) }
		meta._force && mod.onclick(event, can, meta, target, cbs)
	},
	onclick: function(event, can, meta, target, cbs) {
		// can.onengine.signal(can, "onevent", can.request(event));
		if (target._selectonly) { can.onmotion.delay(can, function() { target.blur() }) }
		(target.value == "" || meta._force || target._selectonly) && cbs(function(sub, cb) { if (sub.Status(mdb.TOTAL) > 0) { return }
		sub.sup = can._fields? can.sup: can
		meta.msg && meta.msg.Length() > 0? sub._show(sub, meta.msg, cb, target, meta.name): sub._load(event, sub, cb, target, meta.name, target.value)
	}) },
	onblur: function(event, can, sub, cb, target) {
		return
		if (target._hold) { return }
		if (target._selectonly) { return }
		// can.onengine.signal(can, "onevent", can.request(event, {query: can.page.getquery(can, target)+","+target.value}))
		sub && can.onmotion.delay(can, sub.close, 300)
	},
	onkeyup: function(event, can, meta, cb, target, sub, last) { if (event.key == code.TAB) { return }
		if (event.key == code.ENTER) { return meta._enter && (!can.page.tagis(event.target, html.TEXTAREA) || event.ctrlKey) && meta._enter(event, target.value)? sub && sub.close(): last(event) }
		if (event.key == code.ESCAPE && meta._escape) { return meta._escape() }
		if (!sub) { return }
		// can.onmotion.toggle(can, sub._target, true)
		// sub.hidden() ||
		can.onkeymap.selectCtrlN(event, can, sub._output, "tr:not(.hidden)>td:first-child", function(td) {
			return meta.select && (sub.close(), meta.select(target.value = td.innerText)), cb(sub, td.innerText, target.value), td
		}) || can.onmotion.delayOnce(can, function() {
			can.onkeymap.selectInputs(event, sub, function() { sub._load(event, sub, cb, target, meta.name) }, target) > 0 && can.onmotion.toggle(can, sub._target, true)
		}, target.value.length < 3? 300: 30)
	},
}})
