Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) {
		can.onmotion.clear(can, target), can.onappend.style(can, can.Conf(ctx.STYLE))
		if (can.isCmdMode() && can.Conf(ctx.STYLE) == html.FORM) { can.onappend.style(can, html.OUTPUT) }
		if (can.Mode() == html.ZONE) { return can.onimport._vimer_zone(can, msg, target) }
		var cbs = can.onimport[can.Conf(ctx.STYLE)||msg.Option(ctx.STYLE)]; if (can.base.isFunc(cbs)) {
			can.onappend.style(can, can._args[ctx.STYLE], target), can.core.CallFunc(cbs, {can: can, msg: msg, target: target})
		} else {
			can.onappend.table(can, msg, null, target), can.onappend.board(can, msg, target), can.onmotion.story.auto(can, target)
		}
	},
	card: function(can, msg, target, filter) { target = target||can.ui.content||can._output
		var list = msg.Table(function(value) {
			if (filter && filter(value)) { return }
			value.icon = value.icons||value.icon||value.image
			var img = can.misc.Resource(can, value.icon, msg.Option(ice.MSG_USERPOD), msg.Option(ice.MSG_USERWEB))
			if (img.indexOf("/require/") == 0 && value.origin) { img = value.origin + img }
			return {view: [[html.ITEM, value.type, value.status]], list: [
				{view: [wiki.TITLE, html.DIV], list: [
					value.icon && {className: can.base.contains(img, ".jpg")? "jpg": "", img: img}, {view: wiki.TITLE, list: [
						{text: value.name}, can.onappend.label(can, value),
					]},
				]}, {view: [wiki.CONTENT, html.DIV, value.text]},
				{view: html.ACTION, inner: value.action, _init: function(target) { can.onappend.mores(can, target, value, html.CARD_BUTTON) }},
			]}
		})
		can.onimport.layout = can.onimport.layout||function() { var height = can.onlayout.expand(can, target); can.sup.onexport.outputMargin = function() { return height } }
		can.page.Append(can, target, list), can.onmotion.orderShow(can, target)
	},
	filter: function(can, target, output) { output = output||target
		return can.onappend.input(can, {icon: icon.SEARCH, type: html.TEXT, name: web.FILTER, placeholder: "search in n items", onkeydown: function() {}, onkeyup: function(event) {
			if (event.key == code.ENTER) {
				can.page.Select(can, output, html.DIV_ITEM+":not(.hide)", function(target) { target.click() })
			} else if (event.key == code.ESCAPE) { event.currentTarget.value = "", event.currentTarget.blur()
				can.page.Select(can, output, html.DIV_ITEM, function(target) { can.onmotion.toggle(can, target, true) })
			} else { if (can.onkeymap.selectCtrlN(event, can, output, html.DIV_ITEM+":not(.filter):not(.hide)")) { return }
				can.page.Select(can, output, html.DIV_ITEM, function(target) {
					can.onmotion.toggle(can, target, target.innerText.indexOf(event.currentTarget.value) > -1 || target == event.currentTarget.parentNode)
				})
			}
		}}, "", target)
	},
	icon: function(can, msg, target, cb) {
		msg.Table(function(value) {
			var icon = can.misc.Resource(can, value.icons||value.icon||can.page.drawText(can, value.name, 80), value.space||msg.Option(ice.MSG_USERPOD), msg.Option(ice.MSG_USERWEB))
			return can.page.Append(can, target, [{view: [[html.ITEM, value.status]], list: [{view: html.ICON, list: [{img: icon}]}, {view: [mdb.NAME, "", value.name]}], _init: function(target) {
				cb && cb(target, value)
			}, onclick: function(event) { can.sup.onexport.record(can.sup, value.name, mdb.NAME, value) }}])._target
		}), can.onmotion.orderShow(can, target)
	},
	_icon: function(can, name, button, target) { can.page.Append(can, target, [{text: [can.page.unicode[name]||name, html.SPAN, [html.ICON, name]], onclick: function(event) {
		can.base.isFunc(button)? button(event, button): can.onaction[button](event, can, button), can.onkeymap.prevent(event)
	}}]) },
	_vimer_zone: function(can, msg, target) { msg.Table(function(value) { var action = can.page.parseAction(can, value)
		can.onimport.item(can, {type: value.type, status: value.status, icon: can.misc.Resource(can, value.icon||value.icons||value.avatar_url), name: can.page.Color(value[can.Conf(mdb.FIELD)||mdb.VIEW]||value[mdb.NAME]||value[mdb.TEXT]||value[mdb.TYPE]), title: value[mdb.TEXT]||value.description}, function(event) {
			can.sup.onexport.record(can, value.name, mdb.NAME, value, event)
		}, function() { return shy(action, function(event, button, meta, carte) { can.misc.Event(event, can, function(msg) { carte.close()
			can.sup.onexport.action(can, button, value) || can.run(event, [ctx.ACTION, button], function(msg) { can.sup.onimport._process(can.sup, msg) || can.Update() })
		}, value) }) }), can.onmotion.orderShow(can, target)
	}) },
	_zone: function(can, zone, index, cb, field) { zone._delay_init = function() { can.onimport.plug(can, can.base.isObject(index)? index: {index: index, style: html.OUTPUT, mode: mdb.ZONE, field: field}, function(sub) {
		sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, {mode: mdb.ZONE}), index.index||index, cmds, cb) }
		zone._icon(kit.Dict(
			web.REFRESH, function(event) { sub.Update(event) },
			mdb.CREATE, function(event) { sub.Update(event, [ctx.ACTION, mdb.CREATE]) },
			"=", function() { can.onimport.tabview(can, "", [sub.ConfIndex()].concat(sub.Conf(ctx.ARGS)).join(","), ctx.INDEX) },
		))
		var action = can.core.List(sub.Conf(ctx.INPUTS), function(item) { if (item.type == html.BUTTON && [ice.LIST, ice.BACK].indexOf(item.name) == -1) { return item.name } })
		sub.onexport.output = function(_sub, msg) {
			can.page.style(can, sub._output, html.MAX_HEIGHT, "", html.HEIGHT, "")
			zone._total(msg.Length()), cb(sub, msg)
			zone._menu = shy({_trans: sub._trans}, action.concat(can.base.Obj(msg.Option(ice.MSG_ACTION), [])), function(event, button, meta, carte) {
				sub.Update(event, [ctx.ACTION, button]), carte.close()
			}), can.user.toastSuccess(can)
		}, can.ui.zone[zone.name].refresh = function() { sub.Update() }
	}, zone._target) } },
	zone: function(can, list, target) {
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
					if (zone._delay_init) { zone._delay_init(zone._target, zone), delete(zone._delay_init) } zone.toggle(), zone._toggle && zone._toggle()
				}, oncontextmenu: function(event) { var menu = zone._menu
					menu? can.user.carteRight(event, can, menu.meta, menu.list||can.core.Item(menu.meta), can.base.isFunc(menu)? menu: function(event, button, meta, carte) {
						can.runAction(event, button), carte.close()
					}): can.onmotion.clearCarte(can)
				}},
				{view: html.ACTION, _init: function(target) { var value; zone._action = target
					can.onappend._action(can, [{icon: icon.SEARCH, type: html.TEXT, name: mdb.SEARCH, _init: function(target) { zone._search = target }, onkeyup: function(event) { value = event.target.value
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
	item: function(can, item, cb, cbs, target) { target = target||can.ui.project||can._output
		function oncontextmenu(event) {
			if (can.base.isFunc(cbs)) { var menu = cbs(event, ui._target); if (menu) { can.user.carteRight(event, can, menu.meta, menu.list, menu) } return }
			can.user.carteItem(event, can, item)
		}
		var icon = item.icon||item.icons, nick = item.nick||item.name||item.zone||item.sess
		var ui = can.page.Append(can, target, [{view: [[html.ITEM, item.type, item.role, item.status]], list: [
			icon && (can.base.contains(icon, ice.HTTP, ".ico", ".png", ".jpg")? {img: can.misc.Resource(can, icon)}: {icon: icon}),
			{text: nick}], title: item.title||nick, onclick: function(event) {
				can.onmotion.select(can, target, html.DIV_ITEM, event.currentTarget)
				cb(event, item, event.currentTarget._list && can.onmotion.toggle(can, event.currentTarget._list), ui._target)
			}, oncontextmenu: oncontextmenu,
		}])
		item._select && ui._target.click()
		return ui._target
	},
	itemtabs: function(can, list, cb, cbs, target) { can.db._list = {}
		function savetabs() { can.misc.sessionStorage(can, [can.ConfIndex(), html.TABS], can.page.Select(can, can._action, html.DIV_TABS, function(target) { return target._item.hash })) }
		var _select; can.core.List(list, function(value) {
			var _target = can.onimport.item(can, value, function(event) { if (value._tabs) { return value._tabs.click() }
				value._tabs = can.onimport.tabs(can, [value], function(event) {
					if (!cb(event, value)) { can.ui.toggle = can.onappend.toggle(can, can.ui.content) }
					can.onmotion.select(can, can.ui.project, html.DIV_ITEM, _target), can.db.current = value
					can.misc.SearchHash(can, value.hash), can.onimport.layout(can)
				}, function(event) { cbs && cbs(event, value), delete(value._tabs), delete(can.ui.content._cache[value.hash])
					can.page.Remove(can, value._profile), can.page.Remove(can, value._display)
					can.onmotion.delay(can, function() { savetabs() })
				}), savetabs()
			}); can.db._list[value.hash] = _target, (!_select || value.hash == can.db.hash[0]) && (_select = _target)
		})
		can.onmotion.delay(can, function() {
			can.core.Next(can.misc.sessionStorage(can, [can.ConfIndex(), html.TABS]), function(hash, next) {
				var _target = can.db._list[hash]; _target && _target.click(), can.onmotion.delay(can, next, 150)
			}, function() { _select && _select.click() })
		})
	},
	itemlist: function(can, list, cb, cbs, target) { if (!list || list.length == 0) { return }
		if (!target) { return can.core.List(list, function(value) { can.onimport.item(can, value, cb, cbs) }) }
		var _list = can.core.List(list, function(item) { var icon = item.icon||item.icons
			return {view: html.ITEM, list: [
				icon && (can.base.contains(icon, ice.HTTP, ".ico", ".png", ".jpg")? {img: can.misc.Resource(can, icon)}: {icon: icon}),
				{text: item.nick||item.name||item.zone}
			], _init: function(target) {
				item._select && (_select = target)
			}, onclick: function(event) { var target = event.currentTarget
				target && can.page.Select(can, can.ui.project, html.DIV_ITEM, function(target) { can.page.ClassList.del(can, target, html.SELECT) })
				for (var p = target; p; p = p.parentNode.previousElementSibling) { can.page.ClassList.add(can, p, html.SELECT) }
				cb(event, item, event.currentTarget._list && can.onmotion.toggle(can, event.currentTarget._list), event.currentTarget)
			}, oncontextmenu: function(event) {
				if (can.base.isFunc(cbs)) { var menu = cbs(event, event.currentTarget); if (menu) { return can.user.carteRight(event, can, menu.meta, menu.list, menu) } }
				can.user.carteItem(event, can, item)
			}}
		})
		var _select; if (target._list) { can.page.Append(can, target._list, _list) } else {
			target._list = can.page.insertBefore(can, [{view: html.LIST, list: _list}], target.nextSibling, target.parentNode)
		} _select && _select.click()
		return target._list
	},
	list: function(can, root, cb, cbs, target) { target = target||can._output
		can.core.List(root.list, function(item) { var ui = can.page.Append(can, target, [{view: [[html.ITEM, "open"]], list: [{text: item.meta.name}, item.list && {icon: icon.CHEVRON_DOWN}], onclick: function(event) {
			can.page.ClassList.set(can, ui.item, "open", can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list))
			can.onmotion.select(can, target, html.DIV_ITEM, event.target)
		}, _init: function(target) { if (item.meta.name == "_") { target.innerHTML = "", can.onappend.style(can, html.SPACE, target) }
			cbs && cbs(target, item)
		}}, {view: html.LIST}]); can.onimport.list(can, item, cb, cbs, ui.list) })
	},
	tree: function(can, list, cb, cbs, target, node, field, split) { node = node||{"": target||can.ui.project}
		field = field||nfs.PATH, split = split||nfs.PS
		can.core.List(list, function(item) { item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
			var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split); if (node[name]) { return }
			last && node[last] && can.page.Select(can, node[last].previousSibling, "div.expand", function(target) { target.innerHTML == "" && (target.innerHTML = can.page.unicode.closes) })
			var ui = can.page.Append(can, node[last], [{view: html.ITEM, list: [
				{view: [[html.EXPAND, item.expand? cli.OPEN: ""], html.DIV, (index==array.length-1? "": can.page.unicode.closes)]},
				{view: [mdb.NAME, html.DIV, value], _init: item._init},
			], onclick: function(event) { var target = event.currentTarget
				if (node[name].childElementCount > 0&& !can.page.ClassList.set(can, ui[html.EXPAND], cli.OPEN, !can.page.ClassList.neg(can, node[name], html.HIDE))) { return }
				target && can.page.Select(can, can.ui.project, html.DIV_ITEM, function(target) { can.page.ClassList.del(can, target, html.SELECT) })
				for (var p = target; p; p = p.parentNode.previousElementSibling) {
					can.page.ClassList.add(can, p, html.SELECT), can.onmotion.toggle(can, p.nextSibling, true)
				} can.onexport.hash(can, [item[field]]), can.base.isFunc(cb) && cb(event, item, ui.item)
				node[item[field]] && can.page.ClassList.add(can, node[item[field]].previousSibling, html.SELECT)
				if (node[name].childElementCount == 2) { can.onmotion.delay(can, function() { node[name].firstChild.click() }) }
			}, oncontextmenu: function(event) { if (!item._menu) { return }
				var menu = item._menu; can.user.carteRight(event, can, menu.meta, menu.list, menu)
			}}, {view: [[html.LIST, item.expand? "": html.HIDE]]}]); node[name] = ui.list;
			(item._select || can.db.hash && (can.db.hash[0]||"").indexOf(item[field]) == 0) && can.onmotion.delay(can, function() { ui.item.click() })
		}) });
		return node
	},
	tabsCache: function(can, msg, key, value, target, cb) { if (value._tabs) { return value._tabs.click() }
		value._tabs = can.onimport.tabs(can, [value], function() { can.onexport.hash(can, [key]), can.Status(value), can.db.value = value
			can.page.ClassList.has(can, target, html.SELECT) || can.onmotion.delay(can, function() { target.click() })
			if (can.onmotion.cache(can, function() { return key }, can.ui.content, can.ui.profile, can.ui.display)) { return can.onimport.layout(can) }
			if (cb && cb()) { return }
			if (msg.Append(ctx.INDEX)) { msg.Table(function(value, index) {
				index == 0 && can.onappend.plugin(can, value, function(sub) { can.db.value._content_plugin = sub, can.onimport.layout(can) }, can.ui.content)
				index == 1 && can.onappend.plugin(can, value, function(sub) { can.db.value._display_plugin = sub, can.onimport.layout(can) }, can.ui.display)
			}) } else { can.onappend.table(can, msg), can.onappend.board(can, msg) }
		}, function() { delete(value._tabs), can.onmotion.cacheClear(can, key, can.ui.content, can.ui.profile, can.ui.display) })
	},
	tabs: function(can, list, cb, cbs, action) { action = action||can._action; return can.page.Append(can, action, can.core.List(list, function(tabs) {
		if (typeof tabs == code.STRING) { tabs = {name: tabs} }
		function close(target) {
			if (can.page.ClassList.has(can, target, html.SELECT)) {
				var next = can.page.tagis(target.nextSibling, html.DIV_TABS)? target.nextSibling: can.page.tagis(target.previousSibling, html.DIV_TABS)? target.previousSibling: null
				if (!next) { return true } next && next.click()
			} can.page.Remove(can, target), can.onexport.tabs && can.onexport.tabs(can)
		}
		return {view: [[html.TABS, tabs.type, tabs.role, tabs.status]], title: tabs.title||tabs.text, list: [tabs.icon && {icon: tabs.icon}, {text: [tabs.nick||tabs.name, html.SPAN, mdb.NAME]}, {icon: mdb.DELETE, onclick: function(event) {
			tabs._target._close(), can.onkeymap.prevent(event)
		}}], onclick: function(event) {
			if (can.page.ClassList.has(can, tabs._target, html.SELECT)) { return }
			can.onmotion.select(can, action, html.DIV_TABS, tabs._target), can.base.isFunc(cb) && cb(event, tabs)
		}, _init: function(target) {
			if (action == can._action) {
				can.page.Select(can, can._action, "div.item._space.state", function(space) {
					can.page.insertBefore(can, target, space)
				})
			}
			var menu = tabs._menu||shy(function(event, button) { can.Update(event, [ctx.ACTION, button]) })
			target._item = tabs, tabs._target = target, target._close = function() { close(target) || cbs && cbs(tabs) }
			var _action = can.page.parseAction(can, tabs)
			can.page.Modify(can, target, {draggable: true,
				ondragstart: function(event) { action._drop = function(before) {
					before.parentNode == action && action.insertBefore(target, before), can.onexport.tabs(can)
				} },
				ondragover: function(event) { event.preventDefault(), action._drop(event.target) },
				oncontextmenu: function(event) { can.user.carte(event, can, kit.Dict(
					"Close", function(event) { target._close() },
					"Close Other", function(event) { target.click()
						can.page.SelectChild(can, action, html.DIV_TABS, function(target) { target == tabs._target || target._close() }) },
					"Rename Tabs", function(event) { can.user.input(event, can, [mdb.NAME], function(list) {
						can.page.Select(can, target, html.SPAN_NAME, function(target) { can.page.Modify(can, target, list[0]||tabs.name) })
						can.onexport.tabs && can.onexport.tabs(can)
					}) }, menu.meta,
				), ["Close", "Close Other", "Rename Tabs", ""].concat(can.base.getValid(menu.list, can.core.Item(menu.meta)), _action), function(event, button, meta) {
					(meta[button]||menu)(can.request(event, tabs), button, meta)
				}) },
			}), target.click()
		}}
	}))._target },
	tool: function(can, list, cb, target, status) { target = target||can._output, status = status||can._status
		var height = can.base.Max(html.PLUG_HEIGHT, can.ConfHeight()-3*html.ACTION_HEIGHT, 240), width = can.base.Max(html.PLUG_WIDTH, can.ConfWidth()-(can.user.isMobile? 0: html.PROJECT_WIDTH))
		can.core.Next(list.reverse(), function(meta, next) { can.base.isString(meta) && (meta = {index: meta}), meta.mode = html.FLOAT
			can.onimport.plug(can, meta, function(sub) {
				sub.onexport.output = function() {
					can.page.style(can, sub._output, html.MAX_HEIGHT, "", html.HEIGHT, "", html.WIDTH, "", html.MAX_WIDTH, "")
					sub.onimport.size(sub, height, width, false), can.onmotion.delay(can, function() { sub.onimport.size(sub, height, width, false) })
				}, sub.onimport.size(sub, height, width, false)
				can.onmotion.hidden(can, sub._target), sub._legend._target = sub._target, sub._legend._meta = {index: meta.index}
				can.page.Append(can, sub._legend,[{text: [can.page.unicode.remove, "", mdb.REMOVE], onclick: function(event) {
					can.page.Remove(can, sub._target), can.page.Remove(can, sub._legend), can.onexport.tool(can), can.onkeymap.prevent(event)
				}}])
				status.appendChild(sub._legend), sub._legend.oncontextmenu = sub._legend.onclick, sub._legend.onclick = function(event) { can.misc.Event(event, can, function(msg) {
					if (can.page.SelectOne(can, status, nfs.PT+html.SELECT, function(target) { can.onmotion.hidden(can, target._target), can.page.ClassList.del(can, target, html.SELECT); return target }) == sub._legend) { return }
					can.onmotion.select(can, status, html.LEGEND, sub._legend), can.onmotion.toggle(can, sub._target, true)
					can.onmotion.select(can, target, html.FIELDSET_PLUG, sub._target)
					sub.onimport.size(sub, sub.ConfHeight(), sub.ConfWidth(), false)
					if (sub._delay_init || meta.msg) { sub._delay_init = false, meta.msg = false, (sub._inputs && sub._inputs.list || sub._inputs && sub._inputs.refresh) && sub.Update() }
				}) }, sub._delay_init = true, sub.select = function(show) {
					if (show && can.page.ClassList.has(can, sub._legend, html.SELECT)) { return sub }
					return sub._legend.click(), sub
				}
				sub.hidden = function() { can.onmotion.hidden(can, sub._target), can.page.ClassList.del(can, sub._legend, html.SELECT) }
				sub.onaction._close = function() { can.page.Remove(can, sub._target), can.page.Remove(can, sub._legend), can.onexport.tool(can) }
				sub.onaction.close = function() { sub.select() }, can.base.isFunc(cb) && cb(sub), can.onexport.tool(can)
				next()
			}, target)
		})
	},
	plug: function(can, meta, cb, target, field) { if (!meta || !meta.index) { return }
		meta.type = meta.type||html.PLUG, meta.name = meta.index, can.onappend.plugin(can, meta, function(sub) { sub.sup = can
			// sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, can.Option(), {space: meta.space}), meta.index, cmds, cb) }
				sub.onaction.close = function() { can.onmotion.hidden(can, target) }, can.base.isFunc(cb) && cb(sub)
		}, target, field)
	},
})
Volcanos(chat.ONLAYOUT, {
	_init: function(can, height, width) {
		can.core.CallFunc([can.onimport, html.LAYOUT], {can: can, height: height, width: width})
		can.page.SelectChild(can, can._output, html.TABLE, function(table) {
			(can.isCmdMode() || table.offsetWidth > can.ConfWidth() / 2) && can.onappend.style(can, "full", table)
		})
	},
	zone: function(can, height, width) { can.onlayout._init(can, height, width) },
	result: function(can, height, width) { can.onlayout._init(can, height, width) },
	simple: function(can, height, width) { can.onlayout._init(can, height, width) },
	output: function(can, height, width) { can.onlayout._init(can, height, width) },
	float: function(can, height, width) { can.onlayout._init(can, height, width) },
	full: function(can, height, width) { can.onlayout._init(can, height, width) },
	cmd: function(can, height, width) { can.onlayout._init(can, height, width)
		can.page.style(can, can._output, html.MAX_HEIGHT, height||can.ConfHeight()||window.innerHeight-2*html.ACTION_HEIGHT)
		can.page.style(can, can._output, html.MAX_WIDTH, width||can.ConfWidth()||window.innerWidth)
	},
})
Volcanos(chat.ONEXPORT, {
	title: function(can, title) { can.sup.onexport.title(can, title) },
	table: function(can) { var msg = can._msg; if (msg.Length() == 0) { return } var res = [msg.append && msg.append.join(mdb.FS)]
		msg.Table(function(line, index, array) { res.push(can.core.Item(line, function(key, value) { return value }).join(ice.FS)) })
		return res.join(lex.NL)
	},
	board: function(can) { var msg = can._msg; return msg.Result() },
	session: function(can, key, value) { return can.misc[can.user.isWebview? "localStorage": "sessionStorage"](can, [can.Conf(ctx.INDEX), key, location.pathname].join(":"), value == ""? "": JSON.stringify(value)) },
	action_value: function(can, key, def) { var value = can.Action(key); return can.base.isIn(value, ice.AUTO, key, undefined)? def: value },
	tool: function(can) { can.misc.sessionStorage(can, [can.ConfIndex(), "tool"], JSON.stringify(can.page.Select(can, can._status, html.LEGEND, function(target) { return target._meta }))) },
	hash: function(can, hash) { hash = typeof hash == code.STRING? [hash]: hash, can.misc.SearchHash(can, hash)
		can.misc.localStorage(can, [can.ConfSpace()||can.misc.Search(can, ice.POD), can.ConfIndex(), "hash"], hash)
	},
	tabs: function(can) {},
})
Volcanos(chat.ONACTION, {
	onkeydown: function(event, can) {
		if (event.ctrlKey && "0" <= event.key && event.key <= "9") { return can.onkeymap.ctrln(event, can) }
		can._keylist = can.onkeymap._parse(event, can, mdb.PLUGIN, can._keylist||[], can._output)
	},
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
