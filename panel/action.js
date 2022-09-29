Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg) {
		var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM)
		can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) {
			item.inputs = can.base.Obj(item.inputs||item.list),
			item.feature = can.base.Obj(item.feature||item.meta)
			can.onappend.plugin(can, item, function(sub, meta, skip) {
				can.onimport._plugin(can, river, storm, sub, meta), skip || next()
			})
		})
	},
	_plugin: function(can, river, storm, sub, meta) { sub._target._meta = meta
		meta.id && (sub._option.dataset = sub._option.dataset||{}, sub._option.dataset.id = meta.id)

		sub.run = function(event, cmds, cb) {
			return can.run(sub.request(event), can.misc.concat(can, [river, storm, meta.id||meta.index], cmds), cb)
		}, can._plugins = can.misc.concat(can, can._plugins, [sub])

		var tabs = [{view: [html.TABS, html.DIV, meta.name], onclick: function(event) {
			can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, sub._target)
			can.onmotion.select(can, can._header_tabs, html.DIV_TABS, sub._header_tabs)
			can.onmotion.select(can, can._action, html.DIV_TABS, sub._tabs)
		}, onmouseenter: sub._legend.onmouseenter, ondblclick: sub._legend.onclick}]

		sub._header_tabs = can.page.Append(can, can._header_tabs, tabs).first
		sub._tabs = can.page.Append(can, can._action, tabs).first
	},
	_share: function(can, share) { share && can.run({}, [web.SHARE, share], function(msg) {
		msg.Length() == 1? can.onengine.signal(can, chat.ONACTION_CMD): can.onlayout._init(can)
		can.setHeader(chat.TOPIC, msg.SearchOrOption(chat.TOPIC))
		can.user.title(msg.SearchOrOption(chat.TITLE))
		can.Conf(chat.RIVER, web.SHARE, chat.STORM, share)
		msg.Length() > 0 && can.onimport._init(can, msg)
	}) },
	_cmd: function(can, item, next) { can.onengine.signal(can, chat.ONACTION_CMD)
		can.onappend.plugin(can, can.base.Copy(item, {mode: "cmd", opts: can.misc.Search(can)}), function(sub, meta, skip) {
			sub.run = function(event, cmds, cb) { can.runActionCommand(event, sub._index, cmds, cb) }
			can.user.title(meta.name), skip || next()
		})
	},
	_menu: function(can, msg) { if (can.user.mod.isPod || can.user.isMobile) { return }
		can.setHeaderMenu(can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), can.onaction._menus), function(event, button, list) {
			can.core.CallFunc([can.onaction, list[0]], [can, button])
		})
		can.page.Select(can, can._root.Header._output, "action", function(target) {
			can._header_tabs = can.page.Append(can, target, ["tabs"]).first
		})
	},
})
Volcanos(chat.ONENGINE, {help: "解析引擎", _engine: function(event, page, msg, can, cmds, cb) {
	var storm = can.core.Value(can._root, can.core.Keys(chat.RIVER, cmds[0], chat.STORM, cmds[1]))
	if (!storm || cmds.length != 2) { return false }

	if (storm.index) { // 命令索引
		can.runAction(event, ctx.COMMAND, [].concat(storm.index), cb)
	} else { // 命令列表
		can.core.List(storm.list, function(value) {
			msg.Push(mdb.NAME, value.name||"")
			msg.Push(mdb.HELP, value.help||"")
			msg.Push(ctx.INPUTS, JSON.stringify(value.inputs))
			msg.Push(ctx.FEATURE, JSON.stringify(value.feature))
			msg.Push(ctx.INDEX, value.index||"")
			msg.Push(ctx.ARGS, value.args||"[]")
			msg.Push(ctx.STYLE, value.style||"")
			msg.Push(ctx.DISPLAY, value.display||"")
			msg.Push(ice.MSG_ACTION, value._action||"")
		}), can.base.isFunc(cb) && cb(msg)
	} return true
}})
Volcanos(chat.ONPLUGIN, {help: "注册插件",
	"parse": shy("解析", {
		"show": function(can, msg, cmds) { var name = cmds[1]||"can"; can.isCmdMode() && can.user.title(name)
			cmds && cmds[0] && Volcanos(name, {_follow: can.core.Keys(can._follow, name)}, ["/plugin/story/parse.js"], function(sub) {
				sub.run = can.run, sub.Option = function() {}
				can.isCmdMode() && sub.ConfHeight(window.innerHeight)
				can.onengine.listen(can, "menu", function(msg) { console.log(msg) })
				sub.onappend.parse(sub, sub.onappend._parse(sub, cmds[0], name, sub.ConfHeight()), can._output)
			})
		},
	}, ["text", "name", "show:button@auto", "clear:button"]),
	"plugin": shy("插件", {}, ["text", "list", "back"]),

	"nfs.save": shy("保存文件", {
		"save": function(can, msg, cmds) { can.user.downloads(can, cmds[1], cmds[0]) }
	}, ["file=hi.txt", "text:textarea='hello world'", "save:button"]),
})
Volcanos(chat.ONKEYMAP, {help: "键盘交互", _focus: [], _init: function(can, target) {
		can.onkeymap._build(can), can.onengine.listen(can, chat.ONKEYDOWN, function(msg, model) {
			can._keylist = can.onkeymap._parse(msg._event, can, model, can._keylist||[], can._output)
		})
	},
	_mode: {
		normal: {
			j: function(event, can, target) { target.scrollBy(0, event.ctrlKey? 300: 30) },
			k: function(event, can, target) { target.scrollBy(0, event.ctrlKey? -300: -30) },

			b: function(event, can, target) { can.search(event, ["Header.onaction.black"]) },
			w: function(event, can, target) { can.search(event, ["Header.onaction.white"]) },

			g: function(event, can, target) { can.search(event, ["River.ondetail.创建群组"]) },
			s: function(event, can, target) { can.search(event, ["River.ondetail.添加应用"]) },
			t: function(event, can, target) { can.search(event, ["River.ondetail.添加工具"]) },

			" ": function(event, can, target) { can.onengine.signal(can, chat.ONSEARCH_FOCUS), can.onkeymap.prevent(event) },
			":": function(event, can, target) { can.onengine.signal(can, chat.ONCOMMAND_FOCUS), can.onkeymap.prevent(event) },
			Enter: function(event, can, target) { can.onengine.signal(can, chat.ONOPENSEARCH, can.request(event)) },
			Escape: function(event, can, target) {
				can.page.Select(can, can._root._target, can.page.Keys(html.FIELDSET_FLOAT, html.DIV_FLOAT), function(target) {
					can.page.Remove(can, target)
				})
			},
		},
	}, _engine: {},
})
Volcanos(chat.ONACTION, {help: "操作数据", _init: function(can, cb, target) {
		can.Conf(html.MARGIN_Y, 4*html.PLUGIN_MARGIN+2*html.ACTION_HEIGHT+html.ACTION_MARGIN)
		can.Conf(html.MARGIN_X, 4*html.PLUGIN_MARGIN)

		if (can.user.mod.isPod || can.user.isMobile) {
			var gt = "&#10095;", lt = "&#10094;"; function toggle(view) { return can.onmotion.toggle(can, can._root.River._target) }
			can.page.Append(can, target, [{view: [[html.TOGGLE, chat.PROJECT]], list: [{text: [gt, html.DIV]}], onclick: function(event) {
				event.target.innerHTML = toggle()? gt: lt, can.onaction.layout(can, can.Conf(chat.LAYOUT))
			}}])
		}

		target.ontouchstart = function(event) { can.onengine.signal(can, chat.ONACTION_TOUCH, can.request(event)) }
		can.base.isFunc(cb) && cb()
	},
	_menus: [
		[chat.LAYOUT, "auto", "tabs", "tabview", "horizon", "vertical", "grid", "flow", "free", "page", "toimage"],
		[ice.HELP, "tutor", "manual", "service", "devops", "refer"],
	],
	_trans: {
		"layout": "布局",
		"auto": "默认布局",
		"tabs": "标签布局",
		"tabview": "标签分屏",
		"horizon": "左右分屏",
		"vertical": "上下分屏",
		"grid": "网格布局",
		"flow": "流动布局",
		"free": "自由布局",
		"page": "网页布局",
		"toimage": "生成图片",

		"help": "帮助",
		"tutor": "入门简介",
		"manual": "使用手册",
		"service": "服务手册",
		"devops": "编程手册",
		"refer": "参考手册",
	},
	onmain: function(can) { can.onimport._share(can, can.misc.Search(can, web.SHARE)) },
	onlogin: function(can) { if (!can.user.mod.isCmd && !can.Conf(chat.TOOL)) { return }
		can._names = location.pathname, can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(item, next) {
			can.onimport._cmd(can, item, next)
		}): can.runAction(can.request(), ctx.COMMAND, [], function(msg) { can.core.Next(msg.Table(), function(item, next) {
			can.onimport._cmd(can, item, next)
		}) })
	},
	onstorm_select: function(can, msg, river, storm) {
		if (can.onmotion.cache(can, function() {
			return can.core.Keys(can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm))
		}, can._header_tabs, can._action, can._output)) {
			var conf = can.core.Value(can._root, can.core.Keys(chat.RIVER, river, chat.STORM, storm))||{}
			return can.onaction.layout(can, can.misc.SearchOrConf(can, chat.LAYOUT)||Volcanos.meta.args.layout||conf.layout, true)
		}
		can.run({}, [river, storm], function(msg) {
			if (msg.Length() == 0) { return can.onengine.signal(can, chat.ONACTION_NOTOOL, can.request({}, {river: river, storm: storm})) }
			can.onaction.layout(can, can.misc.SearchOrConf(can, chat.LAYOUT)||Volcanos.meta.args.layout, true)
			can.onimport._menu(can, msg), can.onkeymap._init(can)
			return can.onimport._init(can, msg)
		})
	},
	onaction_cmd: function(can, msg) { can.Mode("cmd")
		can.page.style(can, can._target, html.HEIGHT, can._root._height, html.WIDTH, can._root._width)
		can.ConfHeight(can._root._height-2*html.ACTION_HEIGHT), can.ConfWidth(can._root._width)
		can.page.ClassList.add(can, can._root._target, "simple") 
		can.page.ClassList.add(can, can._target, "cmd")
	},
	onsearch: function(can, msg, word) { if (word[0] == mdb.FOREACH || word[0] == mdb.PLUGIN) { can.onexport.plugin(can, msg, word) } },
	onkeydown: function(can, msg) { var event = msg._event
		if (event.ctrlKey && event.key >= "1"  && event.key <= "9") {
			can.onmotion.select(can, can._action, html.DIV_TABS, parseInt(event.key)-1)
			can.onmotion.select(can, can._header_tabs, html.DIV_TABS, parseInt(event.key)-1)
			can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, parseInt(event.key)-1)
		}
	},
	onsize: function(can, msg, height, width) { can.Conf({height: height-can.Conf(html.MARGIN_Y), width: width-can.Conf(html.MARGIN_X)}) },
	onprint: function(can, msg) { can.page.styleHeight(can, can._target, "") },

	layout: function(can, button, silent) { button = button||ice.AUTO
		can.page.ClassList.del(can, can._target, can.Conf(chat.LAYOUT)); if (button == ice.AUTO) { button = "" }
		can.page.ClassList.add(can, can._target, can.Conf(chat.LAYOUT, button))
		can.isCmdMode() || (can.onmotion.toggle(can, can._root.River._target, true), can.onmotion.toggle(can, can._root.Footer._target, true))
		can._header_tabs && can.onmotion.hidden(can, can._header_tabs)
		can.onlayout._init(can)

		var cb = can.onlayout[button]; if (can.base.isFunc(cb)? cb(can, silent): (can.getActionSize(function(height, width) {
			can.ConfHeight(can.base.Min(200, height-can.Conf(html.MARGIN_Y)-200)), can.ConfWidth(width-can.Conf(html.MARGIN_X))
		}), false)) { return }

		can.core.Next(can._plugins, function(sub, next) { can.onmotion.delay(can, function() {
			sub.onaction._resize(sub, button == "" || button == ice.AUTO, can.ConfHeight(), can.ConfWidth()), next()
		}, 10) })
	},
	help: function(can, button) { can.user.open("/help/"+button+".shy") },
})
Volcanos(chat.ONLAYOUT, {help: "界面布局",
	tabs: function(can) {
		can.getActionSize(function(height, width) {
			can.ConfHeight(height-2*html.ACTION_HEIGHT-4*html.PLUGIN_MARGIN-1), can.ConfWidth(width-4*html.PLUGIN_MARGIN)
		})
		if (can.page.Select(can, can._output, "fieldset.plugin.select").length > 0) { return }
		can.onmotion.select(can, can._action, html.DIV_TABS, 0), can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, 0)
	},
	tabview: function(can) { can.onmotion.toggle(can, can._header_tabs, true)
		can.onmotion.hidden(can, can._root.River._target), can.onmotion.hidden(can, can._root.Footer._target), can.onlayout._init(can)
		can.getActionSize(function(height, width) { can.ConfHeight(height), can.ConfWidth(width) })
		if (can.page.Select(can, can._output, "fieldset.plugin.select").length > 0) { return }
		can.onmotion.select(can, can._header_tabs, html.DIV_TABS, 0), can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, 0)
	},
	horizon: function(can) {
		can.onmotion.hidden(can, can._root.River._target), can.onmotion.hidden(can, can._root.Footer._target), can.onlayout._init(can)
		can.getActionSize(function(height, width) { can.ConfHeight(height), can.ConfWidth(width/2) })
	},
	vertical: function(can) {
		can.onmotion.hidden(can, can._root.River._target), can.onmotion.hidden(can, can._root.Footer._target), can.onlayout._init(can)
		can.getActionSize(function(height, width) { can.ConfHeight(height/2), can.ConfWidth(width) })
	},
	_grid: function(can, m, n) {
		can.getActionSize(function(height, width) {
			var h = (height-(4*n+1)*html.PLUGIN_MARGIN)/n, w = (width-(4*m+1)*html.PLUGIN_MARGIN)/m
			can.ConfHeight(h-2*html.ACTION_HEIGHT-3*html.PLUGIN_MARGIN), can.ConfWidth(w)
		})
	},
	grid: function(can, silent) {
		can.user.input(event, can, [{name: "m", value: 2}, {name: "n", value: 2}], function(data) {
			can.onlayout._grid(can, parseInt(data.m), parseInt(data.n))
		}, silent)
		return true
	},
	free: function(can) {
		can.page.Select(can, can._target, [[html.DIV_OUTPUT, html.FIELDSET_PLUGIN]], function(item, index) {
			can.onmotion.move(can, item, {left: 40*index, top: 40*index})
		})
	},
	toimage: function(can) {
		return can.onmotion.toimage(event, can, can.Conf(chat.STORM), can._output), true
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	args: function(can, msg, cb, target) {
		can.core.Next(can.page.Select(can, target, [[html.FIELDSET_PLUGIN, html.FORM_OPTION]]), function(item, next, index, array) {
			item.dataset.args = JSON.stringify(can.page.Select(can, item, html.OPTION_ARGS, function(item) { return item.value||"" }))
			cb(item, next, index, array)
		})
	},
	size: function(can, msg) {
		msg.Option(html.TOP, can._output.offsetTop)
		msg.Option(html.LEFT, can._output.offsetLeft)
		msg.Option(html.WIDTH, can._output.offsetWidth)
		msg.Option(html.HEIGHT, can._output.offsetHeight)
		msg.Option(html.SCROLL, can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)
		msg.Option(html.MARGIN_X, can.Conf(html.MARGIN_X))
		msg.Option(html.MARGIN_Y, can.Conf(html.MARGIN_Y))
	},
	layout: function(can, msg) { return can.Conf(chat.LAYOUT) },
	plugin: function(can, msg, word) { var fields = can.core.Split(msg.Option(ice.MSG_FIELDS))
		can.page.Select(can, can._output, [[html.FIELDSET_PLUGIN, html.LEGEND]], function(item) {
			if (item.innerHTML.indexOf(word[1]) == -1) { return }

			var list = can.page.Select(can, item.nextSibling, html.OPTION_ARGS, function(item) { return item.value||"" })
			var meta = item.parentNode._meta; if (!meta) { return }

			var data = {ctx: "can", cmd: "Action",
				type: mdb.PLUGIN, name: item.innerHTML, text: shy("跳转", function(event) {
					var input = can.page.Select(can, item.parentNode, html.INPUT_ARGS)[0]; input && input.focus()
				}), argument: JSON.stringify(list),
			}
			if (meta.index) {
				data.context = "", data.command = meta.index
			} else if (meta.cmd) {
				data.context = meta.ctx, data.command = meta.cmd
			} else {
				return
			}
			msg.Push(data, fields)
		})
	},
})
