Volcanos(chat.ONIMPORT, {help: "导入数据", list: [], _init: function(can, msg) {
		var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM)
		can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) {
			item.height = can.ConfHeight()-can.Conf(html.MARGIN_Y)
			item.width = can.ConfWidth()-can.Conf(html.MARGIN_X)
			item.feature = can.base.Obj(item.feature||item.meta)
			item.inputs = can.base.Obj(item.inputs||item.list)

			can.onappend.plugin(can, item, function(sub, meta, skip) {
				can.onimport._plugin(can, river, storm, sub, meta), skip || next()
			})
		}, function() {
			can.onaction.layout(can, can.misc.SearchOrConf(can, chat.LAYOUT)||Volcanos.meta.args.layout, true)
			can.onimport._menu(can, msg), can.onkeymap._init(can)
		})
	},
	_plugin: function(can, river, storm, sub, meta) { sub._target._meta = meta
		meta.id && (sub._option.dataset = sub._option.dataset||{}, sub._option.dataset.id = meta.id)

		sub.run = function(event, cmds, cb) { var msg = sub.request(event)
			return can.run(event, can.misc.concat(can, [river, storm, meta.id||meta.index], cmds), function(msg) {
				can.base.isFunc(cb) && cb(msg)
			})
		}, can._plugins = can.misc.concat(can, can._plugins, [sub])

		can.page.style(can, sub._output, html.MAX_WIDTH, meta.width-(can.user.isWindows? 20: 0))
		can.onengine.listen(can, chat.ORIENTATIONCHANGE, function(event) {
			can.page.style(can, sub._output, html.MAX_WIDTH, meta.width-(can.user.isWindows? 20: 0))
		})

		can.page.Append(can, can._action, [{view: [html.TABS, html.DIV, meta.name], onclick: function(event) {
			can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, sub._target)
			can.onmotion.select(can, can._action, html.DIV_TABS, event.target)
		}, onmouseenter: sub._legend.onmouseenter, ondblclick: sub._legend.onclick}])
	},
	_menu: function(can, msg) { if (can.user.mod.isPod||can.user.isMobile) { return }
		can.setHeaderMenu(can.base.Obj(msg.Option(chat.MENUS), can.Conf(chat.MENUS)||can.onaction._menus), function(event, button, list) {
			can.core.CallFunc([can.onaction, list[0]], [can, button])
		})
	},
	_cmd: function(can, item, next) {
		can.base.Copy(item, {
			height: can._root._height-can.Conf(html.MARGIN_Y)+(can.user.isWindows? 17: 0),
			width: can._root._width,
			opts: can.misc.Search(can),
		})
		can.onappend.plugin(can, item, function(sub, meta, skip) {
			can.page.style(can, sub._output, html.MAX_WIDTH, can._root._width)
			can.user.title(meta.name), skip || next()
		})
	},
	_share: function(can, share) { share && can.run({}, ["_share", share], function(msg) {
		can.setHeader(chat.TOPIC, msg.OptionOrSearch(chat.TOPIC))
		can.user.title(msg.OptionOrSearch(chat.TITLE))

		msg.Length() == 1 && can.onengine.signal(can, chat.ONACTION_CMD)
		can.Conf(html.MARGIN_X, 0, html.MARGIN_Y, 2*html.ACTION_HEIGHT)
		can.onlayout._init(can, can._root._target)

		can.Conf(chat.RIVER, "_share", chat.STORM, share)
		msg.Length() > 0 && can.onimport._init(can, msg)
	}) },
})
Volcanos(chat.ONENGINE, {help: "解析引擎", list: [], _engine: function(event, page, msg, can, cmds, cb) {
	var storm = can.core.Value(can._root, can.core.Keys(chat.RIVER, cmds[0], chat.STORM, cmds[1]))
	if (!storm || cmds.length != 2) { return false }

	if (storm.index) { // 命令索引
		can.runAction(event, ctx.COMMAND, [storm.index], cb)
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
	}
	return true
}})
Volcanos(chat.ONPLUGIN, {help: "注册插件", list: [],
	"alert": shy("提示", {}, ["text", "list", "back"], function(can, msg, cmds) {
		can.user.alert(cmds[0])
	}),
	"parse": shy("解析", {
		"show": function(can, msg, cmds) {
			can.require(["/plugin/story/parse.js"], function() {
				can.onmotion.hidden(can, can._legend)
				can.onmotion.hidden(can, can._option)
				can.onmotion.hidden(can, can._status)

				can.ConfHeight(can.ConfHeight()+can.Conf(html.MARGIN_Y)-(can.user.isWindows? 17: 0))

				can.onengine.listen(can, "menu", function(msg) { can.user.toast(can, msg.Option(html.ITEM)) })
				can.onengine.listen(can, "高级配置", function(msg) { can.user.toast(can, msg.Option(html.ITEM)) })
				can.onengine.listen(can, "h1", function(msg) { can.user.toast(can, "h1") })

				can.onappend.parse(can, can.onappend._parse(can, cmds[0]))
			})
		},
	}, ["text", "show:button@auto"], function(can, msg, cmds, cb) { can.run({}, cmds, cb, true) }),

	"cookie": shy("提示", {}, ["text", "list", "back"], function(can, msg, cmds) {
		can.core.Item(can.misc.Cookie(can), function(key, value) {
			msg.Push("key", key)
			msg.Push("value", value)
		})
	}),
	"plugin": shy("插件", {}, ["text", "list", "back"], function(can, msg, cmds) {
		msg.Echo("hello world")
	}),
	"info": shy("信息", {}, ["text", "list", "back"], function(can, msg, cmds) {
		msg.Echo("hello world")
	}),
	"log": shy("日志", {}, ["text", "list", "back"], function(can, msg, cmds) {
		console.log(cmds[0])
	}),

	"nfs.save": shy("保存文件", {}, ["file=hi.txt", "text:textarea='hello world'", "save:button"], function(can, msg, cmds, cb) {
		can.misc.runAction(can, msg, cmds, cb, kit.Dict(
			"save", function(cmds) { can.user.downloads(can, cmds[1], cmds[0]) }
		))
	}),

	"pie": shy("比例图", {}, ["list", "back"], function(can, msg, cmds) {
		msg.DisplayStory("pie.js")
		msg.Push("value", 200)
		msg.Push("value", 300)
		msg.Push("value", 400)
	}),
	"can.code.inner.plugin": shy("插件", {}, [{type: "button", name: "list", action: "auto"}, "back"], function(can, msg, cmds) {}),
})
Volcanos(chat.ONKEYMAP, {help: "键盘交互", list: [], _focus: [], _init: function(can, target) {
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

			" ": function(event, can, target) {
				can.onengine.signal(can, "onsearchfocus"), can.onkeymap.prevent(event)
			},
			":": function(event, can, target) {
				can.onengine.signal(can, "oncommandfocus"), can.onkeymap.prevent(event)
			},
			enter: function(event, can, target) { can.misc.Log("enter") },
			escape: function(event, can, target) {
				can.page.Select(can, can._root._target, can.page.Keys(html.FIELDSET_FLOAT, html.DIV_FLOAT), function(item) {
					can.page.Remove(can, item)
				})
			},
		},
	}, _engine: {},
})
Volcanos(chat.ONACTION, {help: "交互操作", list: [], _init: function(can, cb, target) {
		can.Conf(html.MARGIN_Y, 4*html.PLUGIN_MARGIN+2*html.ACTION_HEIGHT+html.ACTION_MARGIN)
		can.Conf(html.MARGIN_X, 4*html.PLUGIN_MARGIN)

		if (can.user.mod.isPod || can.user.isMobile) {
			var gt = "&#10095;", lt = "&#10094;"; function toggle(view) { return !can.setRiver("display") }
			can.page.Append(can, target, [{view: [[html.TOGGLE, chat.PROJECT]], list: [{text: [gt, html.DIV]}], onclick: function(event) {
				event.target.innerHTML = toggle()? gt: lt
			}}])
		}

		target.ontouchstart = function(event) { can.onengine.signal(can, chat.ONACTION_TOUCH, can.request(event)) }
		can.base.isFunc(cb) && cb()
	},
	_menus: [
		[chat.LAYOUT, "auto", "tabs", "grid", "free", "flow", "page", "toimage"],
		[ice.HELP, "tutor", "manual", "service", "devops", "refer"],
	],
	_trans: {
		"layout": "布局",
		"auto": "默认布局",
		"flow": "流动布局",
		"grid": "网格布局",
		"tabs": "标签布局",
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
	onlogin: function(can) { if (!can.Conf(chat.TOOL) && !can.user.mod.isCmd) { return }
		can.Conf(html.MARGIN_X, 0, html.MARGIN_Y, 2*html.ACTION_HEIGHT)
		can.page.ClassList.add(can, can._target, ice.CMD)
		can.onlayout._init(can)

		can._names = location.pathname
		can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(item, next) {
			can.onimport._cmd(can, item, next)
		}): can.runAction(can.request(), ctx.COMMAND, [], function(msg) { can.core.Next(msg.Table(), function(item, next) {
			can.onimport._cmd(can, item, next)
		}) })
	},
	onsize: function(can, msg, height, width) { can.Conf({height: height, width: width}) },
	onsearch: function(can, msg, word) {
		if (word[0] == mdb.PLUGIN || word[1] != "") { can.onexport.plugin(can, msg, word) }
	},
	onstorm_select: function(can, msg, river, storm) {
		if (can.onmotion.cache(can, function() {
			return can.core.Keys(can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm))
		}, can._action, can._output)) {
			var conf = can.core.Value(can._root, can.core.Keys(chat.RIVER, river, chat.STORM, storm))||{}
			return can.onaction.layout(can, can.misc.SearchOrConf(can, chat.LAYOUT)||Volcanos.meta.args.layout||conf.layout, true)
		}

		can.run({}, [river, storm], function(msg) { if (msg.Length() > 0) { return can.onimport._init(can, msg) }
			can.onengine.signal(can, chat.ONACTION_NOTOOL, can.request({}, {river: river, storm: storm}))
		})
	},
	onaction_cmd: function(can, msg) {
		can.page.ClassList.add(can, can._target, "cmd")
		can.ConfHeight(can._root._height)
		can.ConfWidth(can._root._width)
	},

	layout: function(can, button, silent) { button = button||ice.AUTO
		var cb = can.onlayout[button]; if (can.base.isFunc(cb) && cb(can, silent)) { return }
		can.page.ClassList.del(can, can._target, can.Conf(chat.LAYOUT))
		can.page.ClassList.add(can, can._target, can.Conf(chat.LAYOUT, button))
		can.onlayout._init(can)
	},
	help: function(can, button) { can.user.open("/help/"+button+".shy") },
})
Volcanos(chat.ONLAYOUT, {help: "导出数据", list: [],
	toimage: function(can) {
		return can.onmotion.toimage(event, can, can.Conf(chat.STORM), can._output), true
	},
	auto: function(can) {
		can.Conf(chat.LAYOUT, "")
	},
	tabs: function(can) {
		can.onmotion.select(can, can._action, html.DIV_TABS, 0)
		can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, 0)
	},
	free: function(can) {
		can.page.Select(can, can._target, [[html.DIV_OUTPUT, html.FIELDSET_PLUGIN]], function(item, index) {
			can.page.style(can, item, {left: 40*index, top: 40*index})
			can.onmotion.move(can, item, {left: 40*index, top: 40*index})
		})
	},
	grid: function(can, silent) {
		var ACTION_LAYOUT_FMT = " fieldset.Action.grid>div.output fieldset.plugin { width:_width; height:_height; } fieldset.Action.grid>div.output fieldset.plugin>div.output { width:_width; height:_height; } "
		can.user.input(event, can, [{name: "m", value: 2}, {name: "n", value: 2}], function(event, button, data, list, args) {
			can.getActionSize(function(height, width) { var m = parseInt(data.m)||2, n = parseInt(data.n)||2
				can.page.css(can.base.replaceAll(ACTION_LAYOUT_FMT, "_width", (width-(4*m+1)*html.PLUGIN_MARGIN)/m+"px", "_height", (height-(4*n+1)*html.PLUGIN_MARGIN)/n+"px"))
			})
		}, silent)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: [],
	args: function(can, msg, cb, target) {
		can.core.Next(can.page.Select(can, target, [[html.FIELDSET_PLUGIN, html.FORM_OPTION]]), function(item, next, index, array) {
			item.dataset.args = JSON.stringify(can.page.Select(can, item, html.OPTION_ARGS, function(item) { return item.value||"" }))
			cb(item, next, index, array)
		})
	},
	size: function(can, msg) {
		msg.Option(html.TOP, can._target.offsetTop)
		msg.Option(html.LEFT, can._target.offsetLeft)
		msg.Option(html.WIDTH, can._target.offsetWidth)
		if (msg.Option(html.HEIGHT, can._target.offsetHeight-can._action.offsetHeight) > can._root._height) {
			msg.Option(html.HEIGHT, can._root._height-2*html.ACTION_HEIGHT)
		}
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

			var data = {ctx: "web.chat", cmd: ctx.ACTION,
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
