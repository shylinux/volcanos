(function() { var TABS = "tabs", TABVIEW = "tabview", HORIZON = "horizon", VERTICAL = "vertical", GRID = "grid", FREE = "free", FLOW = "flow", PAGE = "page"
Volcanos(chat.ONIMPORT, {_init: function(can, msg) { can.onmotion.clear(can)
		var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM); can.core.Next(msg.Table(), function(item, next) {
			item.type = chat.PLUGIN, item.inputs = can.base.Obj(item.inputs||item.list), item.feature = can.base.Obj(item.feature||item.meta)
			can.onappend.plugin(can, item, function(sub, meta, skip) { can.onimport._run(can, sub, function(event, cmds, cb) {
				return can.run(event, can.misc.concat(can, river == web.SHARE? [ctx.ACTION]: [], [river, storm, meta.id||meta.index], cmds), cb)
			}), can.onimport._tabs(can, sub, meta), skip || next() })
		}, function() { can.onaction.layout(can, can.misc.SearchOrConf(can, html.LAYOUT), true) })
	},
	_share: function(can, share) { share && can.runAction({}, web.SHARE, [share], function(msg) {
		can.Mode(web.SHARE), msg.Length() > 1? can.onlayout._init(can): can.onengine.signal(can, chat.ONACTION_CMD)
		can.user.title(msg.SearchOrOption(chat.TITLE)), can.setHeader(chat.TOPIC, msg.SearchOrOption(chat.TOPIC))
		can.Conf(chat.RIVER, web.SHARE, chat.STORM, share), can.onimport._init(can, msg)
	}) },
	_cmd: function(can, item, next) { can.base.Copy(item, {type: chat.PLUGIN, mode: chat.CMD, opts: can.misc.Search(can)}), can.onengine.signal(can, chat.ONACTION_CMD)
		can.onappend.plugin(can, item, function(sub, meta, skip) { can.onimport._run(can, sub, function(event, cmds, cb) {
			return can.runActionCommand(event, sub._index, cmds, cb)
		}), can.user.title(meta.name), skip || next() }), can.onlayout._init(can)
	},
	_run: function(can, sub, cbs) { can._plugins = can.misc.concat(can, can._plugins, [sub])
		sub.run = function(event, cmds, cb) { (!cmds || cmds[0] != ctx.ACTION) && sub.request(event, {height: sub.ConfHeight(), width: sub.ConfWidth()})
			return cbs(event, cmds, cb)
		}, sub.Mode(can.Mode()), sub.ConfHeight(can.ConfHeight()), sub.ConfWidth(can.ConfWidth()), can.page.style(can, sub._output, html.MAX_WIDTH, can.ConfWidth())
	},
	_tabs: function(can, sub, meta) {
		var tabs = [{view: [html.TABS, html.DIV, meta.name], onclick: function(event) { can.onmotion.select(can, can._header_tabs, html.DIV_TABS, sub._header_tabs)
			can.onmotion.select(can, can._action, html.DIV_TABS, sub._tabs), can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, sub._target)
			if (sub._delay_refresh) { sub._delay_refresh = false, sub.onaction._resize(sub, can.Conf(html.LAYOUT) == "", can.ConfHeight(), can.ConfWidth()) }
		}, onmouseenter: sub._legend.onmouseenter, ondblclick: sub._legend.onclick}]
		sub._header_tabs = can.page.Append(can, can._header_tabs, tabs)._target, sub._tabs = can.page.Append(can, can._action, tabs)._target
	},
	_menu: function(can, msg) { if (can.user.isMobile || can.user.mod.isPod) { return }
		can.setHeaderMenu(can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), can.onaction._menus), function(event, button, list) { can.core.CallFunc([can.onaction, list[0]], [can, button]) })
		can.page.Select(can, can._root.Header._output, html.ACTION, function(target) { can.onmotion.hidden(can, can._header_tabs = can.page.Append(can, target, [html.TABS])._target) })
	},
})
Volcanos(chat.ONKEYMAP, {_init: function(can, target) { can.onkeymap._build(can)
		can.onengine.listen(can, chat.ONKEYDOWN, function(msg, model) {
			if (event.ctrlKey && event.key >= "1" && event.key <= "9") {
				var sub = can._plugins[parseInt(event.key)-1]; if (sub) {
					can._output.scrollTop = sub._target.offsetTop-html.PLUGIN_MARGIN
					sub._header_tabs.click()
					// can.onmotion.delay(can, function() { sub.Focus() })
				}
			}
			can._keylist = can.onkeymap._parse(msg._event, can, model, can._keylist||[], can._output)
		})
	},
	_mode: { normal: {
		j: function(event, can, target) { target.scrollBy(0, event.ctrlKey? 300: 30) },
		k: function(event, can, target) { target.scrollBy(0, event.ctrlKey? -300: -30) },

		b: function(event, can) { can.search(event, ["Header.onaction.black"]) },
		w: function(event, can) { can.search(event, ["Header.onaction.white"]) },
		p: function(event, can) { can.search(event, ["Header.onaction.print"]) },
		c: function(event, can) { can.user.toimage(can, can.user.title(), can._target.parentNode, true) },
		
		t: function(event, can) { can.onaction.layout(can, can.Conf(chat.LAYOUT) == TABVIEW? ice.AUTO: TABVIEW, true) },
		h: function(event, can) { can.onaction.layout(can, can.Conf(chat.LAYOUT) == HORIZON? ice.AUTO: HORIZON, true) },
		v: function(event, can) { can.onaction.layout(can, can.Conf(chat.LAYOUT) == VERTICAL? ice.AUTO: VERTICAL, true) },

		":": function(event, can) { can.onengine.signal(can, chat.ONCOMMAND_FOCUS), can.onkeymap.prevent(event) },
		" ": function(event, can) { can.onengine.signal(can, chat.ONSEARCH_FOCUS), can.onkeymap.prevent(event) },
		Enter: function(event, can) { can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event)) },
		Escape: function(event, can, target) { can.page.Select(can, can._root._target, can.page.Keys(html.FIELDSET_FLOAT, html.DIV_FLOAT), function(target) { can.page.Remove(can, target) }) },
	}, }, _engine: {},
})
Volcanos(chat.ONACTION, {_init: function(can, target) {
		can.Conf(html.MARGIN_Y, 4*html.PLUGIN_MARGIN+2*html.ACTION_HEIGHT+html.ACTION_MARGIN), can.Conf(html.MARGIN_X, (can.user.isMobile? 2: 4)*html.PLUGIN_MARGIN)
		if (can.user.isMobile || can.user.mod.isPod) { var gt = "❯", lt = "❮"; function toggle(view) { return can.onmotion.toggle(can, can._root.River._target) }
			can.page.Append(can, target, [{view: [[html.TOGGLE, chat.PROJECT]], list: [{text: [gt, html.DIV]}], onclick: function(event) {
				event.target.innerHTML = toggle()? gt: lt, can.onaction.layout(can, can.Conf(html.LAYOUT))
			}}])
		} target.ontouchstart = function(event) { can.onengine.signal(can, chat.ONACTION_TOUCH, can.request(event)) }
	},
	_menus: [
		[html.LAYOUT, ice.AUTO, TABS, TABVIEW, HORIZON, VERTICAL, GRID, FREE, FLOW, PAGE],
		[ice.HELP, "tutor", "manual", "service", "devops", "refer"],
	],
	_trans: kit.Dict(
		html.LAYOUT, "布局",
		ice.AUTO, "默认布局",
		TABS, "标签布局",
		TABVIEW, "标签分屏",
		HORIZON, "左右分屏",
		VERTICAL, "上下分屏",
		GRID, "网格布局",
		FREE, "自由布局",
		FLOW, "流动布局",
		PAGE, "网页布局",

		ice.HELP, "帮助",
		"tutor", "入门简介",
		"manual", "使用手册",
		"service", "服务手册",
		"devops", "编程手册",
		"refer", "参考手册",
	),
	onmain: function(can) { can.onimport._share(can, can.misc.Search(can, web.SHARE)) },
	onlogin: function(can) { if (!can.Conf(chat.TOOL) && !can.user.mod.isCmd) { return }
		can._names = location.pathname, can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(item, next) {
			can.onimport._cmd(can, item, next)
		}): can.runAction(can.request(), ctx.COMMAND, [], function(msg) { can.core.Next(msg.Table(), function(item, next) {
			can.onimport._cmd(can, item, next)
		}) })
	},
	onstorm_select: function(can, msg, river, storm) {
		if (can.onmotion.cache(can, function(cache, old) {
			var key = can.core.Keys(can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm))
			return cache[old] = can._plugins, can._plugins = cache[key]||[], key
		}, can._output, can._action, can._header_tabs)) {
			var conf = can.core.Value(can._root, can.core.Keys(chat.RIVER, river, chat.STORM, storm))||{}
			return can.onaction.layout(can, can.misc.SearchOrConf(can, html.LAYOUT)||msg.Option(html.LAYOUT)||conf.layout, true)
		}
		can.run({}, [river, storm], function(msg) {
			if (msg.Length() == 0) { return can.onengine.signal(can, chat.ONACTION_NOTOOL, can.request({}, {river: river, storm: storm})) }
			can.onaction.layout(can, can.misc.SearchOrConf(can, html.LAYOUT)||msg.Option(html.LAYOUT), true)
			return can.onkeymap._init(can), can.onimport._menu(can, msg), can.onimport._init(can, msg)
		})
	},
	onaction_cmd: function(can, msg) { can.Conf(html.MARGIN_Y, 2*html.ACTION_HEIGHT), can.Conf(html.MARGIN_X, 0)
		can.page.style(can, can._target, html.HEIGHT, can.ConfHeight(can.page.height()-can.Conf(html.MARGIN_Y)), html.WIDTH, can.ConfWidth(can.page.width()))
		can.page.ClassList.add(can, can._target, can.Mode(chat.CMD)), can.page.ClassList.add(can, can._root._target, chat.SIMPLE) 
	},
	onsearch: function(can, msg, arg) { var fields = msg.Option(ice.MSG_FIELDS).split(ice.FS)
		if (arg[0] == mdb.FOREACH || arg[0] == mdb.PLUGIN) { can.onexport.plugin(can, msg, arg, fields) }
		if (arg[0] == mdb.FOREACH || arg[0] == ctx.COMMAND) { can.onexport.command(can, msg, arg, fields) }
	},
	onkeydown: function(can, msg) { var event = msg._event; if (event.ctrlKey && event.key >= "1" && event.key <= "9") { var index = parseInt(event.key)-1
		can.onmotion.select(can, can._header_tabs, html.DIV_TABS, index), can.onmotion.select(can, can._action, html.DIV_TABS, index)
		can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, index)
	} },
	onresize: function(can, height, width) { can.onlayout._init(can), can.onaction.layout(can, can.Conf(html.LAYOUT)), window.setsize && window.setsize(can.page.width(), can.page.height()) },
	onsize: function(can, msg, height, width) { can.Conf({height: height-can.Conf(html.MARGIN_Y), width: width-can.Conf(html.MARGIN_X)}) },
	onprint: function(can, msg) { can.page.styleHeight(can, can._target, "") },

	layout: function(can, button, silent) { button = button||ice.AUTO; can.page.ClassList.del(can, can._target, can.Conf(html.LAYOUT))
		if (button == ice.AUTO) { button = "" } else { can.page.ClassList.add(can, can._target, can.Conf(html.LAYOUT, button)) }
		can.user.isMobile || can.Mode() || (can.onmotion.toggle(can, can._root.River._target, true), can.onmotion.toggle(can, can._root.Footer._target, true))
		can.user.isMobile && can.Mode() && can.page.style(can, can._target, html.WIDTH, "", html.HEIGHT, "")
		can.onlayout._init(can), can._header_tabs && can.onmotion.hidden(can, can._header_tabs), can.Conf(chat.LAYOUT, button)
		var cb = can.onlayout[button]; can.base.isFunc(cb) && cb(can, silent) || can.onlayout._plugin(can, button)
	},
	help: function(can, button) { can.user.open("/help/"+button+".shy") },
})
Volcanos(chat.ONLAYOUT, {
	tabs: function(can) {
		can.getActionSize(function(height, width) { can.ConfHeight(height-can.Conf(html.MARGIN_Y)+html.ACTION_MARGIN), can.ConfWidth(width-can.Conf(html.MARGIN_X)) })
		can.onmotion.select(can, can._action, html.DIV_TABS) || can.onmotion.select(can, can._action, html.DIV_TABS, 0, function(target) { target.click() })
	},
	tabview: function(can) { can.onmotion.hidden(can, can._root.River._target), can.onmotion.hidden(can, can._root.Footer._target), can.onlayout._init(can)
		can.getActionSize(function(height, width) { can.ConfHeight(height), can.ConfWidth(width) })
		can.onmotion.toggle(can, can._header_tabs, true), can.core.List(can._plugins, function(sub) { sub._delay_refresh = true })
		can.onmotion.select(can, can._action, html.DIV_TABS) || can.onmotion.select(can, can._action, html.DIV_TABS, 0, function(target) { target.click() })
		return true
	},
	horizon: function(can) { can.onmotion.hidden(can, can._root.River._target), can.onmotion.hidden(can, can._root.Footer._target), can.onlayout._init(can)
		can.getActionSize(function(height, width) { can.ConfHeight(height), can.ConfWidth(width/2) })
	},
	vertical: function(can) { can.onmotion.hidden(can, can._root.River._target), can.onmotion.hidden(can, can._root.Footer._target), can.onlayout._init(can)
		can.getActionSize(function(height, width) { can.ConfHeight(height/2), can.ConfWidth(width) })
	},
	free: function(can) {
		can.getActionSize(function(height, width) { can.ConfHeight(height-can.Conf(html.MARGIN_Y)+html.ACTION_MARGIN), can.ConfWidth(width-can.Conf(html.MARGIN_X)) })
 		can.core.List(can._plugins, function(sub, index) { can.onmotion.move(can, sub._target, {left: 40*index, top: 40*index}) })
	},
	grid: function(can, silent) {
		return can.user.input(event, can, [{name: "m", value: 2}, {name: "n", value: 2}], function(data) { can.onlayout._grid(can, parseInt(data.m), parseInt(data.n)) }, silent), true
	},
	_grid: function(can, m, n) { can.getActionSize(function(height, width) { var h = (height-(4*n+1)*html.PLUGIN_MARGIN)/n, w = (width-(4*m+1)*html.PLUGIN_MARGIN)/m
		can.ConfHeight(h-html.ACTION_HEIGHT-3*html.PLUGIN_MARGIN), can.ConfWidth(w), can.onlayout._plugin(can, GRID)
	}) },
	_plugin: function(can, button) { can.core.List(can._plugins, function(sub) {
 		sub.onaction._resize(sub, button == "" || button == FREE || button == FLOW, can.ConfHeight(), can.ConfWidth()), button == "" && can.page.style(can, sub._output, html.MAX_HEIGHT, "")
 	}) },
})
Volcanos(chat.ONEXPORT, {
	size: function(can, msg) {
		msg.Option(html.TOP, can._output.offsetTop)
		msg.Option(html.LEFT, can._output.offsetLeft)
		msg.Option(html.WIDTH, can._output.offsetWidth)
		msg.Option(html.HEIGHT, can._output.offsetHeight)
		msg.Option(html.MARGIN_X, can.Conf(html.MARGIN_X))
		msg.Option(html.MARGIN_Y, can.Conf(html.MARGIN_Y))
		msg.Option(html.SCROLL, can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)
	},
	layout: function(can, msg) { return can.Conf(html.LAYOUT) },
	args: function(can, msg, cb, target) { can.core.Next(can._plugins, function(sub, next, index, array) {
		cb(can.page.SelectArgs(can, sub._option, "", function(target) { return target.value }), sub, next, index, array)
	}) },
	plugin: function(can, msg, arg, fields) { can.core.List(can._plugins, function(sub) { var meta = sub.Conf(); if (meta.index.indexOf(arg[1]) == -1) { return }
		var data = {ctx: ice.CAN, cmd: can._name, type: mdb.PLUGIN, name: sub._legend.innerHTML, text: shy("跳转", function(event) {
			can._output.scrollTop = sub._target.offsetTop-html.PLUGIN_MARGIN
			// sub.Focus()
		})}
		if (meta.index) { data.context = "", data.command = meta.index } else if (meta.cmd) { data.context = meta.ctx, data.command = meta.cmd } else { return }
		msg.Push(data, fields)
	}) },
	command: function(can, msg, arg, fields) { var meta = can.onengine.plugin.meta; can.core.Item(arg[1] == ""? meta: meta[arg[1]]? kit.Dict(arg[1], meta[arg[1]]): {}, function(name, command) {
		msg.Push(kit.Dict(ice.CTX, ice.CAN, ice.CMD, ctx.COMMAND, mdb.TYPE, ice.CAN, mdb.NAME, name||command.name, mdb.TEXT, command.help,
			ctx.CONTEXT, ice.CAN, ctx.COMMAND, name, ctx.INDEX, can.core.Keys(ice.CAN, name),
		), fields)
	}) }
})
Volcanos(chat.ONENGINE, {_engine: function(event, sup, msg, can, cmds, cb) {
	var storm = can.core.Value(can._root, can.core.Keys(chat.RIVER, cmds[0], chat.STORM, cmds[1])); if (!storm || cmds.length != 2) { return false }
	if (storm.index) { can.runAction(event, ctx.COMMAND, [].concat(storm.index), cb) } else { can.core.List(storm.list, function(value) {
		msg.Push(mdb.NAME, value.name||"")
		msg.Push(mdb.HELP, value.help||"")
		msg.Push(ctx.INPUTS, JSON.stringify(value.inputs))
		msg.Push(ctx.FEATURE, JSON.stringify(value.feature))
		msg.Push(ctx.INDEX, value.index||"")
		msg.Push(ctx.ARGS, value.args||"[]")
		msg.Push(ctx.STYLE, value.style||"")
		msg.Push(ctx.DISPLAY, value.display||"")
		msg.Push(ice.MSG_ACTION, value._action||"")
	}), can.base.isFunc(cb) && cb(msg) } return true
}})
Volcanos(chat.ONPLUGIN, {
	plugin: shy("默认插件", [mdb.NAME, ice.LIST, ice.BACK]),
	layout: shy("界面布局", {
		_init: function(can) {
			can.Option(chat.LAYOUT, can.getAction(chat.LAYOUT))
		},
	}, ["layout:select=auto,tabs,tabview,horizon,vertical,free,grid,flow,page", ice.RUN], function(can, msg, arg) { can.onaction.layout(can, arg[0], true) }),

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
	"nfs.save": shy("保存文件", {
		"save": function(can, msg, arg) { can.user.downloads(can, arg[1], arg[0]) }
	}, ["file=hi.txt", "text:textarea='hello world'", "save:button"]),
})
})()
