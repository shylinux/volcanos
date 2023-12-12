(function() { const TABS = "tabs", TABVIEW = "tabview", HORIZON = "horizon", VERTICAL = "vertical", GRID = "grid", FREE = "free", FLOW = "flow", PAGE = "page", CAN_LAYOUT = "can.layout"
Volcanos(chat.ONIMPORT, {_init: function(can, msg) { var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM), list = can.misc.SearchHash(can)
		can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) { item.type = chat.PLUGIN, item.mode = can.Mode(); if (item.deleted == ice.TRUE) { return next() }
			item.width = can.ConfWidth()-can.Conf(html.MARGIN_X); if (item.style == html.OUTPUT) { item.width = can.ConfWidth()-2*html.PLUGIN_MARGIN-2*html.PLUGIN_PADDING }
			if (msg.Length() == 1) { item.height = can.ConfHeight()-(can.user.isMobile? 2: 1)*html.ACTION_HEIGHT-can.Conf(html.MARGIN_Y) }
			can.onappend.plugin(can, item, function(sub, meta, skip) { can._plugins = (can._plugins||[]).concat([sub]), can.onimport._tabs(can, sub, meta), skip || next()
				sub.onaction._close = function() { can.onengine.signal(can, chat.ONACTION_REMOVE, can.request({river: river, storm: storm}, item)), can.page.Remove(can, sub._target) }
				sub.run = function(event, cmds, cb) { return can.run(can.request(event, {pod: meta.space||meta.pod}), [river, storm, meta.id||meta.index].concat(cmds), cb) }
				sub.onexport.output = function() { can.page.style(can, sub._output, html.MAX_HEIGHT, "") }
			})
		}, function() { if (can.isCmdMode()) { return } can.user.mod.isCmd = false
			can.onmotion.delay(can, function() { can.onaction.layout(can), can.onappend.scroll(can, can._output), can.page.style(can, can._output, "visibility", "visible")
				can.onexport.layout(can) && list[0] == river && list[1] == storm && can.core.List(can._plugins, function(sub) { sub.Conf(ctx.INDEX) == list[2] && can.onmotion.delay(can, function() { sub._tabs.click() }) })
			}, 300)
		})
	},
	_tabs: function(can, sub, meta) {
		var tabs = [{view: [html.ITEM, "", meta.name], onclick: function(event) { can.onmotion.select(can, can._header_tabs, html.DIV_ITEM, sub._header_tabs)
			can.onmotion.select(can, can._action, html.DIV_ITEM, sub._tabs), can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, sub._target)
			if (sub._delay_refresh) { sub._delay_refresh = false, sub.onimport.size(sub, can.ConfHeight()-can.Conf(html.MARGIN_Y), can.ConfWidth()-can.Conf(html.MARGIN_X), can.onexport.isauto(can)) }
			can.onexport.layout(can) == FREE || (can._output.scrollTop = sub._target.offsetTop-10)
			can.onexport.layout(can) && can.misc.SearchHash(can, can.Conf(chat.RIVER), can.Conf(chat.STORM), meta.index)
		}, oncontextmenu: sub._legend.onclick}]; sub._header_tabs = can.page.Append(can, can._header_tabs, tabs)._target, sub._tabs = can.page.Append(can, can._action, tabs)._target
	},
	_menu: function(can, msg) { if (can.user.isMobile) { return }
		var target = can.setHeaderMenu(can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), can.onaction._menus), function(event, button, list) { list && can.core.CallFunc([can.onaction, list[0]], [can, button]) })
		can.onmotion.hidden(can, can._header_tabs = can.page.Append(can, target, [html.TABS])._target)
	},
})
Volcanos(chat.ONACTION, {_init: function(can, target) {
		can.Conf(html.MARGIN_Y, 2*html.PLUGIN_PADDING+2*html.PLUGIN_MARGIN+html.ACTION_HEIGHT)
		can.Conf(html.MARGIN_X, 2*html.PLUGIN_PADDING+2*html.PLUGIN_MARGIN)
		can.core.List(["ontouchstart", "ontouchmove", "ontouchend"], function(item) {
			can.onengine.listen(can, item, function(event, msg) { can.onaction[item](event, can), can.onengine.signal(can, chat.ONACTION_TOUCH, msg) }, target)
		})
	},
	onsize: function(can, msg, height, width) { can.Conf({height: can.base.Min(height, 240), width: width}) },
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
				can.base.isIn(item.index, web.CHAT_MACOS_DESKTOP) || can.user.title(item.index)
				can.onaction._onaction_cmd(can), item.mode = chat.CMD, item.opts = can.misc.Search(can)
				can.user.mod.isCmd && can.user.isMobile && (can.ConfHeight(can.ConfHeight()-html.ACTION_HEIGHT))
				can.onappend.style(can, item.index, document.body)
			} return item
		}), FLOW).layout(can.page.height(), can.page.width()): can.runAction(can.request(), ctx.COMMAND, [], function(msg) {
			if (msg.Length() == 1) { can.onaction._onaction_cmd(can) } can.onimport._init(can, msg) })
	},
	onstorm_select: function(can, msg, river, storm) {
		if (can.onmotion.cache(can, function(save, load) { save({plugins: can._plugins}), can._plugins = []
			return load(can.core.Keys(can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm)), function(bak) { can._plugins = bak.plugins })
		}, can._output, can._action, can._header_tabs)) { if (msg.Option("refresh") != ice.TRUE) { return can.onaction.layout(can) } }
		can.run(can.request({}, {_method: http.GET}), [river, storm], function(msg) {
			if (msg.Length() == 0) { return can.user.isLocalFile? can.user.toastFailure(can, "miss data"): can.onengine.signal(can, chat.ONACTION_NOTOOL, can.request({}, {river: river, storm: storm})) }
			return can.onimport._init(can, msg)
		})
	},
	_onaction_cmd: function(can) { can.onengine.signal(can, chat.ONACTION_CMD), can.onlayout._init(can) },
	onaction_cmd: function(can, msg) { can.user.mod.isCmd = true
		can.page.ClassList.add(can, can._target, can.Mode(chat.CMD)), can.Conf(html.MARGIN_Y, 128), can.Conf(html.MARGIN_X, 0)
	},
	onsearch: function(can, msg, arg) { var fields = msg.Option(ice.MSG_FIELDS).split(mdb.FS)
		if (arg[0] == mdb.PLUGIN) { can.onexport.plugin(can, msg, arg, fields) }
		if (arg[0] == ctx.COMMAND) { can.onexport.command(can, msg, arg, fields) }
	},
	onkeydown: function(can, msg, model) {
		if (can.isCmdMode() && !msg._event.metaKey) { var sub = can._plugins[0].sub; sub && can.core.CallFunc([sub, "onaction.onkeydown"], {event: msg._event, can: sub}); return }
		if (can.onkeymap.selectCtrlN(msg._event, can, can._action, html.DIV_ITEM)) { return }
		can._keylist = can.onkeymap._parse(msg._event, can, model, can._keylist||[], can._output)
	},
	onresize: function(can) { can.onaction.layout(can) },
	// onresize: function(can) { can.onaction.layout(can), window.setsize && window.setsize(can.page.width(), can.page.height()) },
	ontitle: function(can, msg) { can.onlayout._storage(can, "") },

	ontouchstart: function(event, can) { can.touch = can.touch || {}
		can.touch.isStart = true, can.touch.startX = event.touches[0].clientX
	},
	ontouchmove: function(event, can) {
		can.touch.isMove = true, can.touch.distanceX = event.touches[0].clientX - can.touch.startX
	},
	ontouchend: function(event, can) {
		if (can.touch.isMove && Math.abs(can.touch.distanceX) > 50) {
			if (can.touch.distanceX > 0) { can.onengine.signal(can, "onslideright") } else { can.onengine.signal(can, "onslideleft") }
		}
		can.touch.isMove = false, can.touch.distanceX = 0, can.touch.isStart = false, can.touch.startX = 0
	},

	mail: function(can) { can.user.opens("/chat/pod/20230511-golang-story/cmd/web.chat.mail.client") },
	dream: function(can) { can.user.opens(can.misc.MergePodCmd(can, {cmd: web.DREAM})) },
	cloud: function(can) { can.user.opens("https://cloud.shylinux.com/") },
	portal: function(can) { can.user.opens(can.misc.MergePodCmd(can, {cmd: web.WIKI_PORTAL})) },
	desktop: function(can) { can.user.opens(can.misc.MergePodCmd(can, {cmd: web.CHAT_MACOS_DESKTOP})) },
	layout: function(can, button, skip) { can.page.ClassList.del(can, can._target, can._layout||can.onlayout._storage(can)), can._header_tabs && can.onmotion.hidden(can, can._header_tabs)
		button = (can.onlayout._storage(can, can._layout = button == ice.AUTO? "": button))||can.misc.SearchOrConf(can, html.LAYOUT), can.page.ClassList.add(can, can._target, button)
		can.onengine.signal(can, chat.ONLAYOUT, can.request({}, {layout: button})), can._root.River && can._river_show === false && can.onmotion.hidden(can, can._root.River._target), skip || can.onlayout._init(can)
		can.isCmdMode() || can.core.List(can._plugins, function(sub) {
			sub._delay_refresh = false
			// can.page.ClassList.set(can, sub._target, html.OUTPUT, [TABVIEW, HORIZON, VERTICAL].indexOf(button) > -1)
		})
		var cb = can.onlayout[button]; can.base.isFunc(cb) && cb(can) || can.onlayout._plugin(can, button)
	},
	_menus: [[html.LAYOUT, ice.AUTO, TABS, TABVIEW, HORIZON, VERTICAL, GRID, FREE, FLOW, PAGE], web.DREAM, "desktop", "portal"],
	_trans: kit.Dict(web.DREAM, "空间", "portal", "官网", "desktop", "桌面", html.LAYOUT, "布局", ice.AUTO, "默认布局", TABS, "标签布局", TABVIEW, "标签分屏", HORIZON, "左右分屏", VERTICAL, "上下分屏", GRID, "网格布局", FREE, "自由布局", FLOW, "流动布局", PAGE, "网页布局"),
})
Volcanos(chat.ONLAYOUT, {
	tabs: function(can) { can.getActionSize(function(height, width) { can.ConfHeight(height+html.ACTION_HEIGHT), can.ConfWidth(width) })
		can.core.List(can._plugins, function(sub) { sub._delay_refresh = true })
		can.onmotion.select(can, can._action, html.DIV_ITEM, can.onmotion.select(can, can._action, html.DIV_ITEM)||0, function(target) { target.click() }); return true
	},
	tabview: function(can) { can.getActionSize(function(height, width) { can.ConfHeight(height+html.ACTION_HEIGHT), can.ConfWidth(width) })
		can.core.List(can._plugins, function(sub) { sub._delay_refresh = true }), can.onmotion.toggle(can, can._header_tabs, true)
		can.onmotion.select(can, can._action, html.DIV_ITEM, can.onmotion.select(can, can._action, html.DIV_TABS)||0, function(target) { target.click() }); return true
	},
	horizon: function(can) { can.getActionSize(function(height, width) { can.ConfHeight(height), can.ConfWidth(width/2) }) },
	vertical: function(can) { can.getActionSize(function(height, width) { can.ConfHeight(height/2), can.ConfWidth(width) }) },
	grid: function(can) { can.getActionSize(function(height, width) { var m = can.user.isMobile? 1: 2, n = 2, h = height/n, w = width/m; can.ConfHeight(h+html.ACTION_HEIGHT), can.ConfWidth(w) }) },
	free: function(can) { can.getActionSize(function(height, width) { can.ConfHeight(height*3/4), can.ConfWidth(width*3/4)
		can.core.List(can._plugins, function(sub, index, array) { can.onmotion.move(can, sub._target, {left: (width/array.length/8*5+20)*index, top: (height/array.length/8*5)*index}) }), can.onmotion.toggle(can, can._header_tabs, true)
	}) },
	flow: function(can) { can.getActionSize(function(height, width) { can.ConfHeight(height-html.ACTION_MARGIN), can.ConfWidth(width) }) },
	page: function(can) { can.page.styleHeight(can, can._output, ""), can.page.style(can, document.body, kit.Dict(html.OVERFLOW, "")) },
	_plugin: function(can, button) { can.core.List(can._plugins, function(sub) {
		if (can.page.ClassList.has(can, sub._target, html.OUTPUT)) {
			return sub.onimport.size(sub,
				can.ConfHeight()-2*html.PLUGIN_MARGIN-2*html.PLUGIN_PADDING,
				can.ConfWidth()-2*html.PLUGIN_MARGIN-2*html.PLUGIN_PADDING,
				true) }
		if (can._plugins.length == 1) { return sub.onimport.size(sub, can.ConfHeight()-(can.user.isMobile? 2: 1)*html.ACTION_HEIGHT-can.Conf(html.MARGIN_Y), can.ConfWidth()-can.Conf(html.MARGIN_X), false) }
		sub.onimport.size(sub, can.ConfHeight()-can.Conf(html.MARGIN_Y)-(button || sub.isCmdMode()? 0: html.ACTION_MARGIN), can.ConfWidth()-can.Conf(html.MARGIN_X), can.onexport.isauto(can)) && can.page.style(can, sub._output, html.MAX_HEIGHT, "")
	}) },
	_storage: function(can, value) { return can.misc.sessionStorage(can, can.core.Keys(CAN_LAYOUT, location.pathname), value) },
})
Volcanos(chat.ONEXPORT, {
	size: function(can, msg) {
		msg.Option(html.LEFT, can._output.offsetLeft), msg.Option(html.TOP, can._output.offsetTop)
		msg.Option(html.HEIGHT, can._output.offsetHeight), msg.Option(html.WIDTH, can._output.offsetWidth)
		msg.Option(html.MARGIN_Y, can.Conf(html.MARGIN_Y)), msg.Option(html.MARGIN_X, can.Conf(html.MARGIN_X))
	},
	layout: function(can) { return can._layout||can.onlayout._storage(can)||can.misc.SearchOrConf(can, html.LAYOUT)||"" },
	isauto: function(can) { return ["", FLOW, PAGE].indexOf(can.onexport.layout(can)) > -1 },
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
		can.runAction(event, ctx.COMMAND, [].concat(can.core.List(storm.index, function(item) { return item.index||item })), function(msg) {
			can.core.List(storm.index, function(item) {
				msg.Push(ctx.ARGS, JSON.stringify(item.args||[]))
				msg.Push(ctx.STYLE, item.style||"")
			}), cb(msg)
		})
	} else { can.core.List(storm.list, function(value) { can.base.isString(value) && (value = {index: value})
		msg.Push(mdb.NAME, value.name||"").Push(mdb.HELP, value.help||"").Push(ctx.INPUTS, JSON.stringify(value.inputs)).Push(ctx.FEATURE, JSON.stringify(value.feature))
		msg.Push(ctx.INDEX, value.index||"").Push(ctx.ARGS, value.args||"[]").Push(ctx.STYLE, value.style||"").Push(ctx.DISPLAY, value.display||"")
		msg.Push(web.SPACE, value.space||"")
	}), can.base.isFunc(cb) && cb(msg) } return true
}})
Volcanos(chat.ONKEYMAP, {
	_mode: {
		webview: {
			"[": function(event, can, target) { history.back() },
			"]": function(event, can, target) { history.forward() },
			r: function(event, can, target) { can.user.reload(true) },
			w: function(event, can, target) { can.user.close() },
			q: function(event, can, target) { window.terminate() },
			o: function(event, can, target) { window.openurl(location.href) },
			p: function(event, can, target) { window.openapp("QuickTime Player") },
			t: function(event, can, target) { window.opencmd("cd contexts; pwd") },
			f: function(event, can, target) { can.onengine.signal(can, chat.ONOPENSEARCH, can.request({}, {type: mdb.FOREACH})) },
		},
		normal: {
			j: function(event, can, target) { target.scrollBy(0, event.ctrlKey? 300: 30) },
			k: function(event, can, target) { target.scrollBy(0, event.ctrlKey? -300: -30) },
			r: function(event, can, target) { can.user.reload(true) },
			t: function(event, can) { can.onkeymap.toggleLayout(can, TABVIEW) },
			h: function(event, can) { can.onkeymap.toggleLayout(can, HORIZON) },
			v: function(event, can) { can.onkeymap.toggleLayout(can, VERTICAL) },
			g: function(event, can) { can.onkeymap.toggleLayout(can, GRID) },
			f: function(event, can) { can.onkeymap.toggleLayout(can, FREE) },
			b: function(event, can) { can.onkeymap.toggleTheme(can, cli.BLACK) },
			w: function(event, can) { can.onkeymap.toggleTheme(can, cli.WHITE) },
			l: function(event, can) { can.onkeymap.toggleTheme(can, html.LIGHT) },
			d: function(event, can) { can.onkeymap.toggleTheme(can, html.DARK) },
			c: function(event, can) { can.user.toimage(can, can.user.title(), can._target.parentNode, true) },
			":": function(event, can) { can.onengine.signal(can, chat.ONCOMMAND_FOCUS), can.onkeymap.prevent(event) },
			" ": function(event, can) { can.onengine.signal(can, chat.ONSEARCH_FOCUS), can.onkeymap.prevent(event) },
			Enter: function(event, can) { can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event)) },
			Escape: function(event, can) {
				can.onmotion.clearFloat(can) || can._root.Search && can.onmotion.hidden(can, can._root.Search._target)
			},
		},
	}, _engine: {},
	toggleTheme: function(can, theme) { can.setHeader(chat.THEME, can.getHeaderTheme() == theme? ice.AUTO: theme) },
	toggleLayout: function(can, layout) { can.onaction.layout(can, can.onexport.layout(can) == layout? ice.AUTO: layout) },
})
Volcanos(chat.ONPLUGIN, {_plugin: shy("默认插件", [mdb.NAME, ice.LIST, ice.BACK]),
	layout: shy("界面布局", {_init: function(can) { can.Option(chat.LAYOUT, can.getAction(chat.LAYOUT)) }}, ["layout:select=auto,tabs,tabview,horizon,vertical,grid,free,flow,page", ctx.RUN], function(can, msg, arg) {
		can.onaction.layout(can, arg[0])
	}),
	"parse": shy("生成网页", {
		"show": function(can, msg, arg) { var name = arg[1]||ice.CAN; can.isCmdMode() && can.user.title(name)
			arg && arg[0] && Volcanos(name, {_follow: can.core.Keys(can._follow, name)}, [chat.PLUGIN_STORY+"parse.js"], function(sub) {
				sub.run = can.run, sub.Option = function() {}
				can.isCmdMode() && sub.ConfHeight(can.page.height())
				can.onengine.listen(can, "menu", function(msg) { console.log(msg) })
				sub.onappend.parse(sub, sub.onappend._parse(sub, arg[0], name, sub.ConfHeight()), can._output)
			})
		},
	}, [mdb.TEXT, mdb.NAME, "show:button@auto", "clear:button"]),
	"nfs.save": shy("保存文件", {"save": function(can, msg, arg) { can.user.downloads(can, arg[1], arg[0]) }}, ["file=hi.txt", "text:textarea='hello world'", "save:button"]),
})
})()
