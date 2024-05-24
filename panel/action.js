(function() { const ALL = "all", TABS = "tabs", TABVIEW = "tabview", VERTICAL = "vertical", HORIZON = "horizon", GRID = "grid", FREE = "free", FLOW = "flow", PAGE = "page", CAN_LAYOUT = "can.layout"
Volcanos(chat.ONIMPORT, {_init: function(can, msg) { var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM), list = can.db.list
		var _select; can.onmotion.clear(can), can.onaction.layout(can, list[3])
		can.core.Next(msg.Table(), function(item, next, index) { item.type = chat.PLUGIN, item.mode = can.Mode(); if (item.deleted == ice.TRUE) { return next() }
			if (msg.Length() == 1) { item.height = can.ConfHeight()-can.Conf(html.MARGIN_Y), can.base.isIn(item.index, web.CHAT_MACOS_DESKTOP, web.CHAT_MESSAGE, web.WIKI_PORTAL) && (item.style = html.OUTPUT) }
			can.base.isIn(item.index, ssh.CLOUD_PROFILE) && (item.style = html.OUTPUT)
			if (list.length == 0) {
				can.user.info.nodetype == web.SERVER && item._command == web.DREAM && (list = [river, storm, item._command])
				can.user.info.nodetype == web.WORKER && item._command == web.WORD && (list = [river, storm, item._command])
			}
			can.onappend.plugin(can, item, function(sub, meta, skip) {
				if (msg.detail && can.base.isIn(meta.index, "can._notfound")) { sub.Conf(ctx.INDEX, msg.detail[index+3]) }
				sub.run = function(event, cmds, cb) { return can.run(can.request(event, {pod: meta.pod||meta.space}), (can.base.beginWith(meta.index, "can.")? [meta.index]: [river, storm, meta.id||meta.index]).concat(cmds), cb) }
				sub.onexport.output = function() { msg.Length() > 1 && can.onexport.isauto(can) && can.page.style(can, sub._output, html.HEIGHT, "", html.MAX_HEIGHT, ""), can.onaction.layout(can, list[3]) }
				can.onaction.layout(can, list[3]), can.onimport._tabs(can, sub, meta), can._plugins = (can._plugins||[]).concat([sub])
				can.onexport.layout(can) && list[0] == river && list[1] == storm? (can.base.isIn(list[2], sub.ConfIndex()) && (_select = sub)): (index == 0 && (_select = sub)), _select = _select||sub, skip || next()
			})
		}, function() { can.onaction.layout(can, list[3]), _select._tabs.click() })
	},
	_tabs: function(can, sub, meta) {
		var _init = true
		var tabs = [{view: [[html.TABS, meta.name], "", can.user.trans(can, meta.name, meta.help)], title: meta.help, onclick: function(event) { can._current = sub
			can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, sub._target)
			can.onmotion.select(can, can._action, html.DIV_ITEM, sub._tabs)
			can.onmotion.select(can, can._header_tabs, html.DIV_TABS, sub._header_tabs)
			// can.onmotion.delay(can, function() { sub._header_tabs.scrollIntoViewIfNeeded() })
			var layout = can.onexport.layout(can); layout == FREE || (can._output.scrollTop = sub._target.offsetTop-10)
			can.isCmdMode() || can.misc.SearchHash(can, can.Conf(chat.RIVER), can.Conf(chat.STORM), sub.ConfIndex(), layout)
			sub.onimport.size(sub, can.ConfHeight()-can.Conf(html.MARGIN_Y), can.ConfWidth()-can.Conf(html.MARGIN_X), can.onexport.isauto(can))
			can.onengine.signal(can, "onindex", can.request(_init? {target: event.target, type: "click", isTrusted: true}: event, {index: sub.ConfIndex()})), _init = false
			// can.onengine.signal(can, "onevent", can.request(_init? {target: event.target, type: "click", isTrusted: true}: event)), _init = false
		}, oncontextmenu: sub._legend.onclick}]; sub._header_tabs = can.page.Append(can, can._header_tabs, tabs)._target, sub._tabs = can.page.Append(can, can._action, tabs)._target
	},
	_menu: function(can, msg) { if (can.user.isMobile) { return }
		if (!can.user.isTechOrRoot(can)) { return }
		var target = can.setHeaderMenu(can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), can.onaction._menus), function(event, button, list) { list && can.core.CallFunc([can.onaction, list[0]], [can, button]) })
		can.onmotion.hidden(can, can._header_tabs = can.page.Append(can, target, ["_tabs"])._target)
	},
})
Volcanos(chat.ONACTION, {_init: function(can, target) { can.db.list = can.misc.SearchHash(can)
		can.db.list.length == 0 && can.misc.Search(can, chat.RIVER) && can.misc.Search(can, chat.STORM) && (can.db.list = [can.misc.Search(can, chat.RIVER), can.misc.Search(can, chat.STORM)])
		can.Conf(html.MARGIN_X, 2*html.PLUGIN_PADDING+2*html.PLUGIN_MARGIN), can.Conf(html.MARGIN_Y, 2*html.PLUGIN_PADDING+2*html.PLUGIN_MARGIN+html.ACTION_HEIGHT)
		can.core.List(["ontouchstart", "ontouchmove", "ontouchend"], function(item) {
			can.onengine.listen(can, item, function(event, msg) { can.onaction[item](event, can), can.onengine.signal(can, chat.ONACTION_TOUCH, msg) }, target)
		})
		can._toast = can.page.Append(can, can._target, ["toast"])._target
	},
	onsize: function(can, msg, height, width) { can.Conf({height: can.base.Min(height, 240), width: width})
		can.page.style(can, can._toast, html.MAX_HEIGHT, can.page.height()-can.getHeaderHeight()-can.getFooterHeight()-(html.PLUGIN_MARGIN+html.PLUGIN_PADDING+html.ACTION_HEIGHT))
	},
	onlogin: function(can, msg) {
		can.Conf(html.MARGIN_Y, 2*html.PLUGIN_PADDING+2*html.PLUGIN_MARGIN+html.ACTION_HEIGHT)
		can.Conf(html.MARGIN_X, 2*html.PLUGIN_PADDING+2*html.PLUGIN_MARGIN)
		can.onimport._menu(can, msg), can.onkeymap._build(can)
		can._root.River && can.onmotion.delay(can, function() { if (can.Mode()) { return }
			var gt = can.page.unicode.next, lt = can.page.unicode.prev, river = can._root.River._target
			var target = can.page.Append(can, can._target, [{view: [[html.TOGGLE, chat.PROJECT], "", can.page.isDisplay(river)? lt: gt], onclick: function(event) {
				can.page.Modify(can, target, (can._river_show = can.onmotion.toggle(can, river))? lt: gt), can.onaction.layout(can)
				can.misc.sessionStorage(can, "river:hide", can._river_show? "": ice.TRUE)
			}}])._target; can._toggle = target
			can.misc.sessionStorage(can, "river:hide") == ice.TRUE && target.click()
		}); if (!can.Conf(chat.TOOL) && !can.user.mod.isCmd) { return }
		if (can.base.beginWith(location.pathname, "/share/")) { can._names = location.pathname }
		can.Conf(chat.TOOL)? can.onappend.layout(can, can.core.List(can.Conf(chat.TOOL), function(item, index, list) { item.type = chat.PLUGIN
			if (list.length == 1) { can.user.mod.cmd = item.index
				can.onaction._onaction_cmd(can), item.mode = chat.CMD, item.opts = can.misc.Search(can)
				can.onappend.style(can, ice.CMD, document.body), can.onappend.style(can, item.index, document.body)
			} return item
		}), FLOW).layout(can.page.height(), can.page.width()): can.runAction(can.request(), ctx.COMMAND, [], function(msg) {
			if (msg.Length() == 1) { can.onaction._onaction_cmd(can) } can.onimport._init(can, msg)
		})
	},
	onstorm_select: function(can, msg, river, storm) { can.misc.SearchHash(can, river, storm)
		if (can.onmotion.cache(can, function(save, load) { save({plugins: can._plugins, current: can._current}), can._plugins = []
			return load(can.core.Keys(can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm)), function(bak) { can._plugins = bak.plugins, can._current = bak.current })
		}, can._output, can._action, can._header_tabs)) {
			if (msg.Option(web.REFRESH) != ice.TRUE) { return can._current && can._current._tabs.click(), can.onaction.layout(can) }
		}
		can.run(can.request({}, {_method: http.GET}), [river, storm], function(msg) {
			if (msg.Length() == 0) { return can.user.isLocalFile? can.user.toastFailure(can, "miss data"): can.onengine.signal(can, chat.ONACTION_NOTOOL, can.request({}, {river: river, storm: storm})) }
			return can.onimport._init(can, msg)
		})
	},
	_onaction_cmd: function(can) { can.onengine.signal(can, chat.ONACTION_CMD), can.onlayout._init(can) },
	onaction_cmd: function(can, msg) { can.user.mod.isCmd = true, can.page.ClassList.add(can, can._target, can.Mode(chat.CMD)), can.Conf(html.MARGIN_Y, 128), can.Conf(html.MARGIN_X, 0) },
	onsearch: function(can, msg, arg) { var fields = msg.Option(ice.MSG_FIELDS).split(mdb.FS); if (arg[0] == mdb.PLUGIN) { can.onexport.plugin(can, msg, arg, fields) } if (arg[0] == ctx.COMMAND) { can.onexport.command(can, msg, arg, fields) } },
	onresize: function(can) { can.onaction.layout(can) },
	onkeydown: function(event, can, mode) {
		if (can.isCmdMode() && !event.metaKey) { var sub = can._plugins[0].sub; sub && can.core.CallFunc([sub, "onaction.onkeydown"], {event: event, can: sub}); return }
		// if (can._current && !event.metaKey) { var sub = can._current.sub; sub && can.core.CallFunc([sub, "onaction.onkeydown"], {event: event, can: sub}); return }
		can.onkeymap.selectCtrlN(event, can, can._action, html.DIV_TABS) || can.onkeymap._parse(event, can, mode)
	},

	ontouchstart: function(event, can) { can.touch = can.touch || {}, can.touch.isStart = true, can.touch.startX = event.touches[0].clientX },
	ontouchmove: function(event, can) { can.touch.isMove = true, can.touch.distanceX = event.touches[0].clientX - can.touch.startX },
	ontouchend: function(event, can) {
		if (can.touch.isMove && Math.abs(can.touch.distanceX) > 50) {
			if (can.touch.distanceX > 0) { can.onengine.signal(can, "onslideright") } else { can.onengine.signal(can, "onslideleft") }
		} can.touch.isMove = false, can.touch.distanceX = 0, can.touch.isStart = false, can.touch.startX = 0
	},

	store: function(can) { can.user.opens(can.misc.MergePodCmd(can, {cmd: web.STORE})) },
	dream: function(can) { can.user.opens(can.misc.MergePodCmd(can, {cmd: web.DREAM})) },
	portal: function(can) { can.user.opens(can.misc.MergePodCmd(can, {cmd: web.PORTAL})) },
	desktop: function(can) { can.user.opens(can.misc.MergePodCmd(can, {cmd: web.DESKTOP})) },
	layout: function(can, button, skip) { var before = can._layout||can.onlayout._storage(can); button = button||before||(can.user.isMobile? ALL: TABVIEW)
		var list = can.misc.SearchHash(can); list.length > 2 && (list[3] = button); can.isCmdMode() || can.misc.SearchHash(can, list[0], list[1], list[2], list[3])
		can.page.ClassList.del(can, can._target, before), can._header_tabs && can.onmotion.hidden(can, can._header_tabs)
		button = (can.onlayout._storage(can, can._layout = button))||can.misc.SearchOrConf(can, html.LAYOUT), can.page.ClassList.add(can, can._target, button)
		can.onengine.signal(can, chat.ONLAYOUT, can.request({}, {layout: button, before: before}))
		can._root.River && can._river_show === false && can.onmotion.hidden(can, can._root.River._target), skip || can.onlayout._init(can)
		can.getActionSize(function(height, width) { var cb = can.onlayout[button]; can.base.isFunc(cb) && cb(can, height, width) || can.onlayout._plugin(can, button) })
	},
	// _menus: [[html.LAYOUT, ALL, TABS, TABVIEW, VERTICAL, HORIZON, GRID, FREE, FLOW, PAGE]],
	_trans: kit.Dict(html.LAYOUT, "布局", ALL, "详情布局", TABS, "标签布局", TABVIEW, "标签分屏", VERTICAL, "上下分屏", HORIZON, "左右分屏", GRID, "网格布局", FREE, "自由布局", FLOW, "流动布局", PAGE, "网页布局"),
})
Volcanos(chat.ONLAYOUT, {
	tabs: function(can, height, width) { can.ConfHeight(height+html.ACTION_HEIGHT), can.ConfWidth(width) },
	tabview: function(can, height, width) { can.ConfHeight(height+html.ACTION_HEIGHT), can.ConfWidth(width), can.onmotion.toggle(can, can._header_tabs, true)
		can.page.SelectOne(can, can._header_tabs, html.DIV_ITEM_SELECT)
			// || can.page.Select(can, can._header_tabs, html.DIV_ITEM, function(target, index) { index == 0 && target.click() })
	},
	horizon: function(can, height, width) { can.ConfHeight(height), can.ConfWidth(width/2) },
	vertical: function(can, height, width) { can.ConfHeight(height/2), can.ConfWidth(width) },
	grid: function(can, height, width) { var m = can.user.isMobile? 1: 2, n = 2, h = height/n, w = width/m; can.ConfHeight(h+html.ACTION_HEIGHT), can.ConfWidth(w) },
	free: function(can, height, width) { can.ConfHeight(height*3/4), can.ConfWidth(width*3/4), can.onmotion.toggle(can, can._header_tabs, true)
		can.core.List(can._plugins, function(sub, index, array) { can.onmotion.move(can, sub._target, {left: (width/array.length/8*5+20)*index, top: (height/array.length/8*5)*index}) })
	},
	flow: function(can, height, width) { can.ConfHeight(height-html.ACTION_MARGIN), can.ConfWidth(width) },
	page: function(can) { can.page.styleHeight(can, can._output, ""), can.page.style(can, document.body, kit.Dict(html.OVERFLOW, "")) },
	_plugin: function(can, button) { can.core.List(can._plugins, function(sub) {
		if (can.isCmdMode()) { return sub.onimport.size(sub, can.page.height(), can.page.width(), false) }
		if (can.page.ClassList.has(can, sub._target, html.OUTPUT)) {
			return sub.onimport.size(sub, can.ConfHeight()-(can.user.isMobile? 2*html.PLUGIN_PADDING: can.Conf(html.MARGIN_Y)-([ALL, TABS].indexOf(can.onexport.layout(can)) > -1? html.ACTION_HEIGHT: 0)), can.ConfWidth()-can.Conf(html.MARGIN_X), can.onexport.isauto(can))
		}
		sub.onimport.size(sub, can.ConfHeight()-can.Conf(html.MARGIN_Y)-(can._plugins.length == 1 || button && button != ALL || sub.isCmdMode()? 0: html.ACTION_MARGIN),
			can.ConfWidth()-can.Conf(html.MARGIN_X), can._plugins.length > 1 && can.onexport.isauto(can)) && can.page.style(can, sub._output, html.HEIGHT, "", html.MAX_HEIGHT, "")
	}) },
	_storage: function(can, value) { return can.user.isMobile? "all": (can.misc.sessionStorage(can, can.core.Keys(CAN_LAYOUT, location.pathname), value)||[])[0] },
})
Volcanos(chat.ONEXPORT, {
	size: function(can, msg) {
		msg.Option(html.LEFT, can._output.offsetLeft), msg.Option(html.TOP, can._output.offsetTop)
		msg.Option(html.HEIGHT, can._output.offsetHeight), msg.Option(html.WIDTH, can._output.offsetWidth)
		msg.Option(html.MARGIN_Y, can.Conf(html.MARGIN_Y)), msg.Option(html.MARGIN_X, can.Conf(html.MARGIN_X))
	},
	layout: function(can) { return can._layout||can.onlayout._storage(can)||can.misc.SearchOrConf(can, html.LAYOUT)||"" },
	isauto: function(can) { return ["", ALL, FLOW, PAGE].indexOf(can.onexport.layout(can)) > -1 },
	args: function(can, msg, cb) { can.core.Next(can._plugins, function(sub, next, index, list) {
		cb(can.base.trim(can.page.SelectArgs(can, sub._option, "", function(item) { return item.value })), sub, next, index, list)
	}) },
	plugin: function(can, msg, arg, fields) { can.core.List(can._plugins, function(sub) { var meta = sub.Conf(); if (!can.base.contains(meta.index, arg[1])) { return }
		var data = {ctx: ice.CAN, cmd: can._name, type: chat.PLUGIN, name: sub._index, text: shy(sub._legend.innerHTML, function(event) { sub._target.click() })}
		if (meta.index) { data.context = "", data.command = meta.index } else if (meta.cmd) { data.context = meta.ctx, data.command = meta.cmd } else { return } msg.Push(data, fields)
	}) },
	command: function(can, msg, arg, fields) { var meta = can.onengine.plugin.meta; can.core.Item(arg[1] == ""? meta: meta[arg[1]]? kit.Dict(arg[1], meta[arg[1]]): {}, function(name, command) {
		msg.Push(kit.Dict(ice.CTX, ice.CAN, ice.CMD, ctx.COMMAND, mdb.TYPE, ice.CAN, mdb.NAME, name||command.name, mdb.TEXT, command.help, ctx.CONTEXT, ice.CAN, ctx.COMMAND, name, ctx.INDEX, can.core.Keys(ice.CAN, name)), fields)
	}) }
})
Volcanos(chat.ONENGINE, {_engine: function(event, sup, msg, can, cmds, cb) {
	var storm = can.core.Value(can._root, can.core.Keys(chat.RIVER, cmds[0], chat.STORM, cmds[1])); if (!storm || cmds.length != 2) { return false }
	if (storm.index) {
		can.runAction(event, ctx.COMMAND, [].concat(can.core.List(storm.index, function(item) {
			if (typeof item == code.FUNCTION) { item = item(can) } if (item) { return item.index||item }
		})), function(msg) {
			can.core.List(storm.index, function(item) { if (!item || typeof item == code.FUNCTION) { return }
				msg.Push(ctx.ARGS, JSON.stringify(item.args||[]))
				msg.Push(ctx.STYLE, item.style||"").Push(ctx.DISPLAY, item.display||"")
				msg.Push(web.SPACE, item.space||"").Push("_ismain", ice.TRUE)
			}), cb(msg)
		})
	} else { can.core.List(storm.list, function(item) { can.base.isString(item) && (item = {index: item})
		msg.Push(ctx.INDEX, item.index||"").Push(mdb.ICONS, item.icons||"")
		msg.Push(mdb.NAME, item.name||"").Push(mdb.HELP, item.help||"")
		msg.Push(ctx.INPUTS, JSON.stringify(item.inputs)).Push(ctx.FEATURE, JSON.stringify(item.feature))
		msg.Push(ctx.ARGS, item.args||"[]").Push(ctx.STYLE, item.style||"").Push(ctx.DISPLAY, item.display||"")
		msg.Push(web.SPACE, item.space||"").Push("_ismain", ice.TRUE)
	}), can.base.isFunc(cb) && cb(msg) } return true
}})
Volcanos(chat.ONKEYMAP, {
	_mode: {
		plugin: {
			Enter: function(event, can) { can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event, {type: "*"})) },
			Escape: function(event, can) { can.onmotion.clearFloat(can) || can._root.Search && can.onmotion.hidden(can, can._root.Search._target) },
		},
	}, _engine: {},
	toggleTheme: function(can, theme) { can.setHeader(chat.THEME, can.getHeaderTheme() == theme? ice.AUTO: theme) },
	toggleLayout: function(can, layout) { can.onaction.layout(can, can.onexport.layout(can) == layout? ice.AUTO: layout) },
})
Volcanos(chat.ONPLUGIN, {
	_filter: shy("表格", [ice.LIST, html.FILTER]),
	_plugin: shy("插件", [mdb.NAME, ice.LIST, ice.BACK]),
	_action: shy("操作", [ice.LIST]),
	_notfound: shy("缺失", [ctx.INDEX, web.SPACE, ice.LIST], function(can, msg, arg, sub) { msg.Echo("not found "+(arg[0]||sub.ConfIndex())+" "+(arg[1]||can.ConfSpace())) }),
	layout: shy("界面布局", {_init: function(can) { can.Option(chat.LAYOUT, can.getAction(chat.LAYOUT)) }}, ["layout:select=auto,tabs,tabview,horizon,vertical,grid,free,flow,page", ctx.RUN], function(can, msg, arg) { can.onaction.layout(can, arg[0]) }),
})
})()
