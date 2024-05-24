Volcanos(chat.ONIMPORT, {_init: function(can, msg, target, cb) {
		if (msg.index && msg.meta && msg.list) { return cb && cb(msg), can.sup.onimport._field(can.sup, msg) }
		if (can.isCmdMode() && can.Conf(ctx.STYLE) == html.FORM) { can.onappend.style(can, html.OUTPUT) }
		if (can.Mode() == html.ZONE) { return can.onimport._vimer_zone(can, msg, target), cb && cb(msg) }
		var cbs = can.onimport[can.Conf(ctx.STYLE)||msg.Option(ctx.STYLE)]; if (can.base.isFunc(cbs)) {
			can.onappend.style(can, can._args[ctx.STYLE], target), can.core.CallFunc(cbs, {can: can, msg: msg, target: target})
		} else {
			can.onappend.table(can, msg, null, target), can.onappend.board(can, msg, target), can.onmotion.story.auto(can, target)
		} cb && cb(msg)
	},
	card: function(can, msg, target, filter) { target = target||can.ui.content||can._output
		can.page.Append(can, target, msg.Table(function(value) { if (filter && filter(value)) { return }
			var img = can.misc.Resource(can, value.icon = value.icons||value.icon||value.image, msg.Option(ice.MSG_USERPOD), msg.Option(ice.MSG_USERWEB))
			return {view: [[html.ITEM, value.type, value.status, "s-"+value.name]], list: [
				{view: [wiki.TITLE, html.DIV], list: [
					value.icon && {className: can.base.contains(img, ".jpg")? "jpg": "", img: img},
					{view: wiki.TITLE, list: [{text: value.name}, can.onappend.label(can, value)]},
				]}, {view: [wiki.CONTENT, html.DIV, value.text]},
				{view: html.ACTION, inner: value.action, _init: function(target) { can.onappend.mores(can, target, value, html.CARD_BUTTON)
					can.page.Select(can, target, html.INPUT, function(target) { can.onappend.style(can, target.name, target) })
				}},
			]}
		})), can.onimport.layout = can.onimport.layout||function() { var height = can.onlayout.expand(can, target); can.sup.onexport.outputMargin = function() { return height } }
	},
	icon: function(can, msg, target, cb) { msg.Table(function(value) {
		var icon = can.misc.Resource(can, value.icons||value.icon||can.page.drawText(can, value.name, 80), value.space||msg.Option(ice.MSG_USERPOD), msg.Option(ice.MSG_USERWEB))
		return can.page.Append(can, target, [{view: [[html.ITEM, value.status]], list: [{view: html.ICON, list: [{img: icon}]}, {view: [mdb.NAME, "", value.name]}], _init: function(target) {
			cb && cb(target, value)
		}, onclick: function(event) { can.sup.onexport.record(can.sup, value.name, mdb.NAME, value) }}])._target
	}) },
	_icon: function(can, name, button, target) {
		var _icon = can.page.icons(can, name) || (can.page.unicode[name] && {text: [can.page.unicode[name]||name, html.SPAN, [html.ICON, name]]})
		if (!_icon) { return }
		_icon.onclick = function(event) { can.base.isFunc(button)? button(event, button): can.onaction[button](event, can, button), can.onkeymap.prevent(event) }
		can.page.Append(can, target, [_icon])
	},
	_vimer_zone: function(can, msg, target) { msg.Table(function(value) { value._select = value.name == can.Conf("_select")
		can.onimport.item(can, value, function(event) { can.sup.onexport.record(can, value.name, mdb.NAME, value, event, event.currentTarget||event.target) })
	}) },
	_zone_icon: function(can, msg, zone, cb) {
		var action = can.core.List(can.Conf(ctx.INPUTS), function(item) { if (item.type == html.BUTTON && [ice.LIST, ice.BACK].indexOf(item.name) == -1) { return item.name } })
		var _menu = shy({}, action.concat(can.base.Obj(msg.Option(ice.MSG_ACTION), [])), function(event, button, meta, carte) {
			cb? cb(event, button): can.Update(event, [ctx.ACTION, button]), carte.close() })
		if (_menu.list.length == 0) {
			zone._icon(kit.Dict(web.REFRESH, function(event) { zone.refresh() }))
			return
		}
		zone._icon(kit.Dict(web.REFRESH, function(event) { zone.refresh() }, "menu", function() { can.user.carte(event, can, _menu.meta, _menu.list, _menu) }))
	},
	_zone: function(can, zone, index, field, hash) { zone._delay_init = function() { can.onimport.plug(can, can.base.isObject(index)? index: {
		index: index, style: html.OUTPUT, mode: mdb.ZONE, field: field, _select: hash[2] == zone.name? hash[1]: "",
	}, function(sub) { sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, {mode: mdb.ZONE}), index.index||index, cmds, cb) }
		sub.onexport.output = function(_sub, msg) { can.onimport._zone_icon(sub, msg, zone), zone._total(msg.Length())
			sub.onimport.size(sub, zone._target.offsetHeight, zone._target.offsetWidth, false), can.page.style(can, sub._output, html.MAX_HEIGHT, "", html.HEIGHT, "")
			can.user.toastSuccess(can)
		}, can.ui.zone[zone.name].refresh = function() { sub.Update() }
		sub.onimport._field = function(msg) {
			msg.Table(function(value) { var pod = msg.Option(ice.MSG_USERPOD), cmd = value._command||value.index, args = can.base.Obj(value.args, [])
				can.onimport.tabview(can, "", cmd == chat.IFRAME && args.length > 0? args[0]: "/s/"+pod+"/c/"+cmd, web.SPACE, function(msg) {
					can.page.SelectOne(can, msg._tab, html.SPAN, function(target) { can.page.Modify(can, target, value.title||can.core.Keys(pod, cmd)) })
				})
			})
		}
		sub.onimport._open = function(msg, arg) { can.onimport.tabview(can, "", arg, web.SPACE, function(msg) {}) }
		sub.onexport.record = function(sub, value, key, item, event, target) { can.onimport.tabview(can, "", value, zone.name, function(msg) {
			can.onappend.style(can, [item.type, item.status], msg._tab)
			msg._item = target
		}) }
	}, zone._target) } },
	zone: function(can, list, target) { target = target||can.ui.project
		return can.page.Append(can, target, can.core.List(list, function(zone) { can.base.isString(zone) && (zone = {name: zone}); if (!zone) { return }
			zone._layout = function() { var height = target.offsetHeight, count = 0
				can.page.SelectChild(can, target, "", function(target) {
					can.page.SelectChild(can, target, html.DIV_ITEM, function(target) { height -= target.offsetHeight })
					can.page.SelectChild(can, target, html.DIV_ACTION, function(target) { height -= target.offsetHeight })
					can.page.SelectChild(can, target, html.DIV_LIST, function(target) { count += can.page.isDisplay(target)? 1: 0 })
				})
				count && can.page.SelectChild(can, target, "", function(target) {
					can.page.SelectChild(can, target, html.DIV_LIST, function(target) {
						can.page.style(can, target, html.HEIGHT, can.page.isDisplay(target)? can.base.Min(height/count, 180): "")
					})
				})
			}
			return {view: [[html.ZONE, zone.name]], list: [
				{view: html.ITEM, list: [{text: can.user.trans(can, zone.name)}], _init: function(target) { zone._legend = target }, onclick: function() {
					if (zone._delay_init) { zone._delay_init(zone._target, zone), delete(zone._delay_init) } zone.toggle(), zone._toggle && zone._toggle(zone)
				}, oncontextmenu: function(event) { var menu = zone._menu
					menu? can.user.carteRight(event, can, menu.meta, menu.list||can.core.Item(menu.meta), can.base.isFunc(menu)? menu: function(event, button, meta, carte) {
						can.runAction(event, button), carte.close()
					}): can.onmotion.clearCarte(can)
				}},
				{view: html.ACTION, _init: function(target) { var value; zone._action = target
					can.onappend._action(can, [{type: html.TEXT, name: mdb.SEARCH, icon: icon.SEARCH, _init: function(target) { zone._search = target }, onkeyup: function(event) { value = event.target.value
						can.page.Select(can, zone._target, html.DIV_EXPAND, function(target) { can.page.ClassList.set(can, target, cli.OPEN, value != "") })
						can.page.Select(can, zone._target, html.DIV_LIST, function(item) { can.onmotion.toggle(can, item, value != "") })
						can.onmotion.delayOnce(can, function() { value && can.onkeymap.selectItems(event, can, zone._target) }, value.length<3? 500: 150)
					}}], target, {})
				}},
				{view: html.LIST, _init: function(target) { can.ui.zone = can.ui.zone||{}, can.ui.zone[zone.name] = zone, zone._target = target
					zone._total = function(total) { return can.page.Modify(can, zone._search, {placeholder: "search in "+total+" items"}), total }
					zone._icon = function(list) { can.page.Select(can, zone._legend, html.SPAN_ICON, function(target) { can.page.Remove(can, target) })
						can.core.Item(list, function(name, button) { can.onimport._icon(can, name, button, zone._legend) })
					}
					zone.refresh = function() { can.onmotion.clear(can, target), zone._init(target, zone) }
					zone.toggle = function(show) { can.onmotion.toggle(can, zone._target, show), can.onmotion.toggle(can, zone._action, show) }
					can.base.isFunc(zone._init)? (zone._menu = zone._init(target, zone)||zone._menu): zone.toggle(false)
				}},
			]}
		}))
	},
	_icons: function(can, item) { var icon = item.icons||item.icon||item.image
		return icon && (can.base.contains(icon, ice.HTTP, ".ico", ".png", ".jpg")? {img: can.misc.Resource(can, icon)}: {icon: icon})
	},
	_nick: function(can, item) {
		return {text: [item.nick||item.name||item.zone||item.sess, "", html.NAME], className: html.NAME}
	},
	_menu: function(event, can, item, cbs, target) { target = target||event.currentTarget
		if (can.base.isFunc(cbs)) { var menu = cbs(event, item, target); if (menu) { return can.user.carteRight(event, can, menu.meta, menu.list, menu) } }
		can.user.carteItem(event, can, item)
	},
	_item: function(can, item, cb, cbs) {
		return {view: [[html.ITEM, item.type, item.role, item.status]], title: item.title||item.nick, list: [
			can.onimport._icons(can, item), can.onimport._nick(can, item),
		].concat(item._label||[], [
			item.action && {icon: "bi bi-three-dots", onclick: function(event) { can.onimport._menu(event, can, item, cbs) }},
		]), _init: function(target) {
			target._item = item, item._item = target, can.ui[item.path] = target
			item._select && can.onmotion.delay(can, function() { target.click() })
		}, onclick: function(event) {
			cb(event)
		}, oncontextmenu: function(event) {
			can.onimport._menu(event, can, item, cbs)
		}}
	},
	item: function(can, item, cb, cbs, _target) {
		return can.page.Append(can, _target||can.ui.project||can._output, [can.onimport._item(can, item, function(event) { var target = event.currentTarget
			can.onmotion.select(can, target.parentNode, html.DIV_ITEM, target)
			can.onengine.signal(can, "onproject", can.request(event, {type: "item", query: can.page.getquery(can, can._fields)+","+item.path}))
			var show = target._list && can.onmotion.toggle(can, target._list);
			if (show === false) { return } cb(event, item, show, target)
		}, cbs)])._target
	},
	_itemselect: function(can, target) {
		can.page.Select(can, can.ui.project, html.DIV_ITEM, function(target) { can.page.ClassList.del(can, target, html.SELECT) })
		for (var p = target; p; p = p.parentNode.previousElementSibling) { can.page.ClassList.add(can, p, html.SELECT), can.onmotion.toggle(can, p.nextSibling, true) }
	},
	itemlist: function(can, list, cb, cbs, target) { if (!list || list.length == 0) { return }
		if (!target) { return can.core.List(list, function(value) { can.onimport.item(can, value, cb, cbs) }) }
		if (!target._list) { target._list = can.page.insertBefore(can, [html.LIST], target.nextSibling, target.parentNode) }
		return can.page.Append(can, target._list, can.core.List(list, function(item) {
			return can.onimport._item(can, item, function(event) { var target = event.currentTarget
				if (target._list && target._list.childElementCount > 0 && target._list && can.onmotion.toggle(can, target._list) == false) { return }
				can.onimport._itemselect(can, target), cb && cb(event, item, target._list && true, target)
			}, cbs)
		})), target._list
	},
	tree: function(can, list, cb, cbs, target, node, field, split) { node = node||{"": target||can.ui.project||can._output}, field = field||nfs.PATH, split = split||nfs.PS
		can.core.List(list, function(item) { var key = item[field]; key && can.core.List(key.split(split), function(value, index, array) { if (!value) { return }
			var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split); if (node[name]) { return }
			last && node[last] && can.page.Select(can, node[last].previousSibling, "div.expand", function(target) { target.innerHTML == "" && (target.innerHTML = can.page.unicode.closes) })
			item.expand = item.expand||item._select||(can.db.hash && (can.db.hash[0] == key))
			var ui = can.page.Append(can, node[last], [{view: html.ITEM, list: [
				{view: [[html.EXPAND], html.DIV, (index==array.length-1? "": can.page.unicode.closes)]},
				{view: [mdb.NAME], list: [{text: [value, "", html.NAME]}].concat(item._label||[])},
				item.action && {view: [mdb.ICON], list: [{icon: "bi bi-three-dots", onclick: function(event) { can.onimport._menu(event, can, item, cbs) }}]},
			], onclick: function(event) { var target = event.currentTarget
				if (index < array.length-1 && !can.page.ClassList.set(can, ui[html.EXPAND], cli.OPEN, !can.page.ClassList.neg(can, node[name], html.HIDE))) { return }
				can.onexport.hash(can, [key]), can.onimport._itemselect(can, target), can.base.isFunc(cb) && cb(event, item, ui.item)
				node[key] && can.page.ClassList.add(can, node[key].previousSibling, html.SELECT)
				if (node[name].childElementCount == 2) { can.onmotion.delay(can, function() { node[name].firstChild.click() }) }
			}, oncontextmenu: function(event) {
				can.onimport._menu(event, can, item, cbs)
			}, _init: item._init}, {view: [[html.LIST, html.HIDE]]}]); node[name] = ui.list, item.expand && ui.item.click()
		}) }); return node
	},
	tabs: function(can, list, cb, cbs, action) { action = action||can.ui.tabs||can._action; return can.page.Append(can, action, can.core.List(list, function(tabs) { if (typeof tabs == code.STRING) { tabs = {name: tabs} }
		function close(target) {
			if (can.page.ClassList.has(can, target, html.SELECT)) {
				var next = can.page.tagis(target.nextSibling, html.DIV_TABS)? target.nextSibling: can.page.tagis(target.previousSibling, html.DIV_TABS)? target.previousSibling: null
				if (!next) { return true } next && next.click()
			} can.page.Remove(can, target), can.onexport.tabs && can.onexport.tabs(can)
		}
		return {view: [[html.TABS, tabs.type, tabs.role, tabs.status]], title: tabs.title||tabs.text, list: [
			can.onimport._icons(can, tabs), can.onimport._nick(can, tabs), {icon: mdb.DELETE, onclick: function(event) { tabs._target._close(), can.onkeymap.prevent(event) }},
		], onclick: function(event) {
			can.onmotion.delay(can, function() { can.onmotion.scrollIntoView(can, tabs._target) })
			if (can.page.ClassList.has(can, tabs._target, html.SELECT)) { return }
			can.onmotion.select(can, action, html.DIV_TABS, tabs._target), can.base.isFunc(cb) && cb(event, tabs)
		}, oncontextmenu: function(event) { var target = tabs._target, _action = can.page.parseAction(can, tabs)
			var menu = tabs._menu||shy(function(event, button) { can.Update(event, [ctx.ACTION, button]) })
			can.user.carte(event, can, kit.Dict(
				"Close", function(event) { target._close() },
				"Close Other", function(event) { target.click(), can.page.SelectChild(can, action, html.DIV_TABS, function(target) { target == tabs._target || target._close() }) },
				"Rename Tabs", function(event) { can.user.input(event, can, [mdb.NAME], function(list) {
					can.page.SelectOne(can, target, html.SPAN, function(target) { can.page.Modify(can, target, list[0]||tabs.name) })
				}) }, menu.meta
			), ["Close", "Close Other", "Rename Tabs", ""].concat(can.base.getValid(menu.list, can.core.Item(menu.meta)), _action), function(event, button, meta) {
				(meta[button]||menu)(can.request(event, tabs), button, meta)
			})
		}, _init: function(target) {
			action == can._action && can.page.Select(can, can._action, "div.item._space.state", function(space) { can.page.insertBefore(can, target, space) })
			target._item = tabs, tabs._target = target, target._close = function() { close(target) || cbs && cbs(tabs) }, target.click()
			can.page.Modify(can, target, {draggable: true,
				ondragstart: function(event) { action._drop = function(before) { before.parentNode == action && action.insertBefore(target, before), can.onexport.tabs(can) } },
				ondragover: function(event) { event.preventDefault(), action._drop(event.target) },
			})
		}}
	}))._target },
	tabsCache: function(can, msg, key, value, target, cb) { if (value._tabs) { return value._tabs.click() }
		value._tabs = can.onimport.tabs(can, [value], function() { can.onexport.hash(can, key), can.Status(value), can.db.value = value
			can.page.isSelect(target) || can.onmotion.delay(can, function() { target.click() })
			if (can.onmotion.cache(can, function() { return key }, can.ui.content, can.ui.profile, can.ui.display, can._status)) { return can.onimport.layout(can) }
			if (cb && cb()) { return }
			if (msg.Append(ctx.INDEX)) { msg.Table(function(value, index) {
				index == 0 && can.onappend.plugin(can, value, function(sub) { can.db.value._content_plugin = sub, can.onimport.layout(can) }, can.ui.content)
				index == 1 && can.onappend.plugin(can, value, function(sub) { can.db.value._display_plugin = sub, can.onimport.layout(can) }, can.ui.display)
				index == 2 && can.onappend.plugin(can, value, function(sub) { can.db.value._profile_plugin = sub, can.onimport.layout(can) }, can.ui.profile)
				can.onmotion.delay(can, function() { can.onimport.layout(can) })
				can.onmotion.delay(can, function() { can.onimport.layout(can) }, 100)
				can.onmotion.delay(can, function() { can.onimport.layout(can) }, 300)
			}) } else { can.onappend.table(can, msg), can.onappend.board(can, msg) }
		}, function() { delete(value._tabs), can.onmotion.cacheClear(can, key, can.ui.content, can.ui.profile, can.ui.display) })
	},
	tool: function(can, list, cb, target, status) { target = target||can._output, status = status||can._status
		var height = can.base.Max(html.PLUG_HEIGHT, can.ConfHeight()-3*html.ACTION_HEIGHT, 240), width = can.base.Max(html.PLUG_WIDTH, can.ConfWidth()-(can.user.isMobile? 0: html.PROJECT_WIDTH))
		can.core.Next(list.reverse(), function(meta, next) { can.base.isString(meta) && (meta = {index: meta}), meta.mode = html.FLOAT
			can.onimport.plug(can, meta, function(sub) {
				sub.onexport.output = function() {
					can.page.style(can, sub._output, html.MAX_HEIGHT, "", html.HEIGHT, "", html.WIDTH, "", html.MAX_WIDTH, "")
					sub.onimport.size(sub, height, width, false), can.onmotion.delay(can, function() { sub.onimport.size(sub, height, width, false) })
				}, sub.onimport.size(sub, height, width, false)
				can.page.Append(can, sub._legend,[{text: [can.page.unicode.remove, "", mdb.REMOVE], onclick: function(event) {
					can.page.Remove(can, sub._target), can.page.Remove(can, sub._legend), can.onexport.tool(can), can.onkeymap.prevent(event)
				}}]), sub._legend._target = sub._target, sub._legend._meta = {index: meta.index}
				status.appendChild(sub._legend), sub._legend.oncontextmenu = sub._legend.onclick, sub._legend.onclick = function(event) { can.misc.Event(event, can, function(msg) {
					if (can.page.SelectOne(can, status, nfs.PT+html.SELECT, function(target) { can.onmotion.hidden(can, target._target), can.page.ClassList.del(can, target, html.SELECT); return target }) == sub._legend) { return }
					can.onmotion.select(can, status, html.LEGEND, sub._legend), can.onmotion.toggle(can, sub._target, true)
					can.onmotion.select(can, target, html.FIELDSET_PLUG, sub._target)
					sub.onimport.size(sub, sub.ConfHeight(), sub.ConfWidth(), false)
					if (sub._delay_init || meta.msg) { sub._delay_init = false, meta.msg = false, (sub._inputs && sub._inputs.list || sub._inputs && sub._inputs.refresh) && sub.Update() }
				}) }, sub._delay_init = true, sub.select = function(show) {
					if (show && can.page.ClassList.has(can, sub._legend, html.SELECT)) { return sub }
					return sub._legend.click(), sub
				}, can.onmotion.hidden(can, sub._target)
				sub.hidden = function() { can.onmotion.hidden(can, sub._target), can.page.ClassList.del(can, sub._legend, html.SELECT) }
				sub.onaction._close = function() { can.page.Remove(can, sub._target), can.page.Remove(can, sub._legend), can.onexport.tool(can) }
				sub.onaction.close = function() { sub.select() }, can.base.isFunc(cb) && cb(sub), can.onexport.tool(can)
				next()
			}, target)
		})
	},
	plug: function(can, meta, cb, target, field) { if (!meta || !meta.index) { return }
		meta.type = meta.type||html.PLUG, meta.name = meta.index, can.onappend.plugin(can, meta, function(sub) { sub.sup = can
			sub.onaction.close = function() { can.onmotion.hidden(can, target) }, can.base.isFunc(cb) && cb(sub)
		}, target, field)
	},
})
Volcanos(chat.ONLAYOUT, {
	_init: function(can, height, width) { can.core.CallFunc([can.onimport, html.LAYOUT], {can: can, height: height, width: width}) },
	zone: function(can, height, width) { can.onlayout._init(can, height, width) },
	result: function(can, height, width) { can.onlayout._init(can, height, width) },
	simple: function(can, height, width) { can.onlayout._init(can, height, width) },
	output: function(can, height, width) { can.onlayout._init(can, height, width) },
	float: function(can, height, width) { can.onlayout._init(can, height, width) },
	full: function(can, height, width) { can.onlayout._init(can, height, width) },
	cmd: function(can, height, width) { can.onlayout._init(can, height, width) },
})
Volcanos(chat.ONEXPORT, {
	title: function(can, title) { can.sup.onexport.title(can, title) },
	action_value: function(can, key, def) { var value = can.Action(key); return can.base.isIn(value, ice.AUTO, key, undefined)? def: value },
	tabs: function(can) {},
	tool: function(can) { can.misc.sessionStorage(can, [can.ConfIndex(), "tool"], JSON.stringify(can.page.Select(can, can._status, html.LEGEND, function(target) { return target._meta }))) },
	hash: function(can, hash) { hash = typeof hash == code.STRING? hash.split(":").concat(can.core.List(arguments).slice(2)||[]): hash || can.core.Item(can.Option(), function(key, value) { return value||"" })
		can.misc.SearchHash(can, hash), can.misc.localStorage(can, [can.ConfSpace()||can.misc.Search(can, ice.POD), can.ConfIndex(), "hash"], hash)
		return hash
	},
	session: function(can, key, value) { return can.sup.onexport.session(can.sup, key, value) },
	table: function(can) { var msg = can._msg; if (msg.Length() == 0) { return } var res = [msg.append && msg.append.join(mdb.FS)]
		msg.Table(function(line, index, array) { res.push(can.core.Item(line, function(key, value) { return value }).join(ice.FS)) })
		return res.join(lex.NL)
	},
	board: function(can) { var msg = can._msg; return msg.Result() },
})
Volcanos(chat.ONACTION, {
	onkeydown: function(event, can) {
		if (can.onkeymap.selectCtrlN(event, can, can.ui.tabs||can._action, html.DIV_TABS)) { return }
		can.onkeymap._parse(event, can)
	},
})
Volcanos(chat.ONKEYMAP, {
	escape: function(event, can) {}, enter: function(event, can) {},
	ctrln: function(event, can) { can.onkeymap.selectCtrlN(event, can, can._action, html.DIV_TABS) },
	space: function(event, can) { can.ui.filter && (can.ui.filter.focus(), can.onkeymap.prevent(event)) },
	tabx: function(event, can) { can.page.Select(can, can._action, html.DIV_TABS_SELECT, function(target) { target._close() }) },
	tabs: function(event, can) {},
	_mode: {
		plugin: {
			Escape: shy("清理屏幕", function(event, can) { can.onkeymap.escape(event, can) }),
			Enter: shy("执行操作", function(event, can) { can.onkeymap.enter(event, can) }),
			" ": shy("搜索项目", function(event, can) { can.onkeymap.space(event, can) }),
			f: shy("搜索项目", function(event, can) { can.ui.filter && (can.ui.filter.focus(), can.onkeymap.prevent(event)) }),
			a: shy("展示项目", function(event, can) { can.ui.project && (can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can)) }),
			v: shy("展示预览", function(event, can) { can.ui.profile && (can.onmotion.toggle(can, can.ui.profile), can.onimport.layout(can)) }),
			r: shy("展示输出", function(event, can) { can.ui.display && (can.onmotion.toggle(can, can.ui.display), can.onimport.layout(can)) }),
			p: shy("添加插件", function(event, can) { can.sup.onaction["添加工具"](event, can.sup) }),
			t: shy("添加标签", function(event, can) { can.onkeymap.tabs(event, can) }),
			x: shy("添加标签", function(event, can) { can.onkeymap.tabx(event, can) }),
			l: shy("打开右边标签", function(event, can) { can.page.Select(can, can._action, html.DIV_TABS_SELECT, function(target) {
				var next = target.nextSibling; next && can.page.ClassList.has(can, next, html.TABS) && next.click()
			}) }),
			h: shy("打开左边标签", function(event, can) { can.page.Select(can, can._action, html.DIV_TABS_SELECT, function(target) {
				var prev = target.previousSibling; prev && can.page.ClassList.has(can, prev, html.TABS) && prev.click()
			}) }),
		},
	}, _engine: {},
})
Volcanos(chat.ONINPUTS, {
	_nameicon: function(event, can, msg, target, name) {
		can.page.Appends(can, can._output, msg.Table(function(value) {
			return {view: html.ITEM, list: [{img: can.misc.Resource(can, value.icons)},
				{view: html.CONTAINER, list: [{view: [html.TITLE, "", value[name]||value[mdb.NAME]]},
					can.onappend.label(can, value, {version: icon.version, time: icon.compile}),
				]},
			], onclick: function(event) { can.showIcons(value[name]||value[mdb.NAME], value.icons) }}
		}))
	},
	dream: function(event, can, msg, target, name) { can.sup.sub.oninputs._nameicon(event, can, msg, target, name) },
})
