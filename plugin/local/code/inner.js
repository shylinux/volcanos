Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		can.tabview = can.tabview||{}, can.history = can.history||[], can.toolkit = {}, can.extentions = {}, can.profile_size = {}

		can.onmotion.clear(can), can.onlayout.profile(can)
		can.page.styleWidth(can, can.ui.project, 180)
		can.onimport._project(can, can.ui.project)
		can.onimport._profile(can, can.ui.profile)
		can.onimport._display(can, can.ui.display)
		can.base.isFunc(cb) && cb(msg)

		switch (can.Mode()) {
			case "simple": can.onimport._simple(can); break
			case "float": break
			case "cmd": can.onimport._tabs(can) // no break
			case "full": // no break
			default: if (can.ConfHeight() < 320) { can.ConfHeight(320) }
				can.onimport.project(can, paths), can.onengine.plugin(can, can.onplugin)
				can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
				can.onimport._toolkit(can, can.ui.toolkit), can.onimport._session(can, msg, function() {
					files.length > 1 && can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) {
						can.onimport.tabview(can, can.Option(nfs.PATH), file, can.Option(nfs.LINE), next)
					}, function() { can.onimport.tabview(can, paths[0], files[0], "") }) })
				}), can.onimport._keydown(can)
		}

		if (can.isCmdMode() && location.hash) { var args = can.core.Split(decodeURIComponent(location.hash).slice(1))
			can.onimport.tabview(can, can.Option(nfs.PATH), args[0], args[1])
		} else { can.isCmdMode() || (can.tabview[can.onexport.keys(can)] = msg)
			can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE))
		}
	},
	_project: function(can, target) {
		target._toggle = function(event) { can.onmotion.toggle(can, target), can.onimport.layout(can) }
	},
	_profile: function(can, target) {
		var ui = can.page.Append(can, target, [html.ACTION, html.OUTPUT]); can.ui.profile_output = ui.output
		var action = can.onappend._action(can, [], ui.action, kit.Dict(
			cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
			cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
			cli.SHOW, function(event) { can.onaction[cli.SHOW](event, can) },
			nfs.LOAD, function(event) { can.onaction[nfs.LOAD](event, can) },
			mdb.LINK, function(event) { can.user.open(can.misc.MergeURL(can, {pod: can.misc.Search(can, ice.POD), cmd: can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE))})) },
			mdb.PLUGIN, function(event) { can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) { can.onimport.plugin(can, data, ui.output) }) },
			html.WIDTH, function(event) {
				can.user.input(event, can, [{name: html.WIDTH, value: can.profile_size[can.onexport.keys(can)]*100/can.ConfWidth()||50}], function(list) {
					can.profile_size[can.onexport.keys(can)] = can.ConfWidth()*parseInt(list[0])/100
					can.onaction[cli.SHOW](event, can)
				})
			}
		)); target._toggle = function(event, show) { action[show? cli.SHOW: cli.CLOSE](event) }
	},
	_display: function(can, target) {
		var ui = can.page.Append(can, target, [html.ACTION, html.OUTPUT, html.STATUS]); can.ui.display_output = ui.output, can.ui.display_status = ui.status
		var action = can.onappend._action(can, [], ui.action, kit.Dict(
			cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
			cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
			cli.EXEC, function(event) { can.onaction[cli.EXEC](event, can) },
			mdb.PLUGIN, function(event) { can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) { can.onimport.plugin(can, data, ui.output) }) },
			html.HEIGHT, function(event) {
				can.user.input(event, can, [{name: html.HEIGHT, value: can.profile_size[can.onexport.keys(can)]*100/can.ConfHeight()||50}], function(list) {
					can.profile_size[can.onexport.keys(can)] = can.ConfHeight()*parseInt(list[0])/100
					can.onaction[cli.EXEC](event, can)
				})
			}
		)); target._toggle = function(event, show) { action[show? cli.EXEC: cli.CLOSE](event) }
	},
	_toolkit: function(can, target) {
		can.ui.toolkit = can.onappend.field(can, "toolkit", {}, can._output)
	},
	_keydown: function(can) { can.onkeymap._build(can)
		can.isCmdMode() && can.onengine.listen(can, chat.ONKEYDOWN, function(event) {
			can._key_list = can.onkeymap._parse(event, can, "plugin", can._key_list, can.ui.content)
		})
	},
	_session: function(can, msg) {
		can.onimport.sess(can, "", function() { can.onimport.sess(can, {
			plug: can.core.Split(msg.OptionOrSearch("plug")).reverse(),
			exts: can.core.Split(msg.OptionOrSearch("exts")).reverse(),
			tabs: can.core.Split(msg.OptionOrSearch("tabs")),
		}) })
	},
	_simple: function(can) {
		can.tabview[can.onexport.keys(can)] = can._msg
		can.ConfHeight(""), can.onmotion.hidden(can, can.ui.project)
		can.page.ClassList.add(can, can._fields, html.OUTPUT)
		can.page.ClassList.add(can, can._fields, "simple")
	},
	_tabs: function(can) {
		can.ui._tabs = can.page.insertBefore(can, [{view: "tabs"}], can.ui.content)
		can.ui._path = can.page.insertBefore(can, [{view: "path"}], can.ui.content)
	},

	plugin: function(can, meta, target, cb) { meta.type = "plug"
		can.onappend.plugin(can, meta, function(sub) {
			sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, can.Option()), meta.index, cmds, cb) }
			can.base.isFunc(cb) && cb(sub)
		}, target)
	},
	layout: function(can) { if (can.isSimpleMode()) { return }
		if (can.isFloatMode()) { can.onmotion.hidden(can, can._action), can.onmotion.hidden(can, can.ui.project) }

		var width = can.ConfWidth()+(can.user.isMobile && can.isCmdMode() && can.user.isLandscape()? 16: 0)-(can.user.isWindows && !can.isCmdMode()? 20: 0)
		can.page.styleWidth(can, can.ui.profile_output, can.profile_size[can.onexport.keys(can)]||(width-can.ui.project.offsetWidth)/2)
		can.page.styleWidth(can, can.ui.content, width-can.ui.project.offsetWidth-can.ui.profile.offsetWidth)
		can.page.styleWidth(can, can.ui.display, width-can.ui.project.offsetWidth)

		var height = can.ConfHeight()
		if (can.user.isMobile && can.isFloatMode()) { height = can._root._height-2*html.ACTION_HEIGHT }

		if (can.isCmdMode()) {
			var rest = can.ui.display.offsetHeight+can.ui._tabs.offsetHeight+can.ui._path.offsetHeight+4
			can.page.styleHeight(can, can.ui.content, height+2*html.ACTION_HEIGHT-rest)
			can.page.styleHeight(can, can.ui.profile_output, height+html.ACTION_HEIGHT)
			can.page.styleHeight(can, can.ui.project, height+2*html.ACTION_HEIGHT)
		} else { var rest = can.ui.display.offsetHeight; if (height < 320) { height = 320 }
			can.isFullMode() || (can._min_height = can._min_height||height, height >= can._min_height && (can._min_height = height))
			can.page.style(can, can.ui.content, html.MIN_HEIGHT, can._min_height)
			can.page.style(can, can.ui.content, can.user.isMobile? html.HEIGHT: html.MAX_HEIGHT, height-rest)
			can.page.styleHeight(can, can.ui.profile_output, can.ui.content.offsetHeight-html.ACTION_HEIGHT)
			can.page.styleHeight(can, can.ui.project, can.ui.content.offsetHeight+rest)
		}

		can.page.Select(can, can.ui.profile_output, html.IFRAME, function(item) {
			can.page.style(can, item,
				html.HEIGHT, can.ui.profile_output.offsetHeight-4,
				html.WIDTH, can.ui.profile_output.offsetWidth-5,
				"margin-left", "-10px", "margin-top", "-10px",
				"position", "absolute", "border", "0"
			)
		})
	},
	project: function(can, path) {
		can.onimport.zone(can, [
			{name: "source", _init: function(view) { var total = 0
				var ui = can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(view) {
					can.run(can.request({}, {dir_root: path, dir_deep: true}), [ice.PWD], function(msg) { var list = msg.Table()
						can.core.List(list, function(item) { if (can.Option(nfs.FILE).indexOf(item.path) == 0) { item.expand = true } })
						can.onimport.tree(can, list, nfs.PATH, ice.PS, function(event, item) {
							can.onimport.tabview(can, path, item.path) // 显示文件
						}, view), can.Status("文件数", total += msg.Length())
					}, true)
				}} }), view)
				path.length == 1 && can.onmotion.delay(can, function() { view.previousSibling.innerHTML = "" })
			}},
			{name: "module", _init: function(view) {
				can.runAction(can.request({}, {fields: ctx.INDEX}), ctx.COMMAND, [mdb.SEARCH, ctx.COMMAND], function(msg) {
					can.onimport.tree(can, msg.Table(), ctx.INDEX, ice.PT, function(event, item) {
						can.onimport.tabview(can, can.Option(nfs.PATH), item.index, ctx.INDEX) // 显示模块
					}, view)
				})
			}},
			{name: "plugin", _init: function(view) {
				can.onimport.tree(can, can.core.Item(can.onengine.plugin.meta, function(key) { return {index: can.base.trimPrefix(key, "can.")} }), ctx.INDEX, ice.PT, function(event, item) {
					can.onimport.tabview(can, can.Option(nfs.PATH), item.index, ctx.INDEX) // 显示插件
				}, view)
			}},
		], can.ui.project)
	},
	tabview: function(can, path, file, line, cb, skip, skip2) { var key = can.onexport.keys(can, file, path)
		if (can.isCmdMode()) { location.hash = file+","+(line||1) }
		if (!skip && can.tabview[key]) { can.isCmdMode() && can.user.title(path+file)
			can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.tabview[key]
			can.Option({path: path, file: file, line: line||can._msg.Option(nfs.LINE)||1})
			return can._msg.Option(can.Option()), can.onsyntax._init(can, can._msg, cb, skip2)
		}

		function show(msg) { var skip2 = skip; can.tabview[key] = msg
			msg._tab = can.onimport.tabs(can, [{name: file.split(msg.Option(nfs.LINE) == ctx.INDEX? ice.PT: ice.PS).pop(), text: file}], function(event, meta) {
				can.onimport.tabview(can, path, file, msg.Option(nfs.LINE), cb, false, skip2), cb = null, skip2 = false
			}, function(item) { delete(can.tabview[key]) }, can.ui._tabs, function(item) {})
		}

		can.Option({path: path, file: file, line: line||1})
		line == ctx.INDEX? show(can.request({}, {index: file, line: line})): can.run({}, [path, file], show, true)
	},
	profile: function(can, msg) {
		var width = can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/2
		msg && can.onimport.process(can, msg, can.ui.profile_output, width)
		can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
	},
	display: function(can, msg) {
		var height = can.profile_size[can.onexport.keys(can)]||{sh: can.ConfHeight()/2}[can.parse]||can.ConfHeight()/4
		msg && can.onimport.process(can, msg, can.ui.display_output, can.ConfWidth())
		can.page.style(can, can.ui.display_output, html.MAX_HEIGHT, height)
		can.onmotion.toggle(can, can.ui.display, true), can.onimport.layout(can)
	},
	process: function(can, msg, target, width) {
		can.onmotion.clear(can, target), can.user.toastSuccess(can)
		if (msg.Option(ice.MSG_PROCESS) == "_field") {
			msg.Table(function(meta) { meta.display = msg.Option(ice.MSG_DISPLAY)
				can.onimport.plugin(can, meta, target, function(sub) { width && sub.ConfWidth(width), sub.Focus() })
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), target, false, function(msg) { can.onimport.layout(can) })
		} else {
			can.onappend.table(can, msg, null, target), can.onappend.board(can, msg, target)
		}
	},
	toolkit: function(can, meta, cb) { meta.msg = true
		meta.opts = meta.opts||{repos: can.base.trimSuffix(can.base.trimPrefix(can.Option(nfs.PATH), "usr/"), ice.PS) }
		can.onimport.plugin(can, meta, can.ui.toolkit.output, function(sub) {
			sub.ConfHeight(can.ConfHeight()-4*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth())
			sub.page.style(sub, sub._output, html.MAX_HEIGHT, sub.ConfHeight())
			sub.page.style(sub, sub._output, html.MAX_WIDTH, sub.ConfWidth())
			sub.select = function() {
				return sub._legend.click(), sub
			}
			sub.onaction.close = function() { sub.select() }

			can._status.appendChild(sub._legend), sub._legend.onclick = function(event) {
				if (meta.msg == true) { meta.msg = false, sub.Update() }
				if (can.page.Select(can, can._status, ice.PT+html.SELECT)[0] == event.target) {
					can.page.ClassList.del(can, event.target, html.SELECT)
					can.page.ClassList.del(can, sub._target, html.SELECT)
					return
				}
				can.onmotion.select(can, can.ui.toolkit.output, html.FIELDSET, sub._target), sub.Focus()
				can.onmotion.select(can, can._status, html.LEGEND, event.target)
			}, can.base.isFunc(cb) && cb(sub), sub._legend.onmouseenter = null
		})
	},
	exts: function(can, url, cb) {
		can.require([url], function() {}, function(can, name, sub) { sub._init(can, can.base.ParseURL(sub._path), function(sub) {
			can.extentions[url.split("?")[0]] = sub, can.base.isFunc(cb) && cb(sub)
		}) })
	},
	tabs: function(can, list, cb, cbs, action, each) { action = action||can._action
		return can.page.Append(can, action, can.core.List(list, function(meta) {
			return {text: [meta.name, html.DIV, html.TABS], title: meta.text, onclick: function(event) {
				can.onmotion.select(can, action, html.DIV_TABS, event.target)
				can.base.isFunc(cb) && cb(event, meta)
			}, _init: function(item) { const OVER = "over"
				function close(item) { var next = item.nextSibling||item.previousSibling
					item._close(item) || can.page.Remove(can, item), next && next.click()
				}
				can.page.Modify(can, item, {draggable: true, _close: cbs,
					onmouseenter: function(event) {
						can.user.carte(event, can, kit.Dict(
							"close tab", function(event) { close(item) },
							"close other", function(event) {
								can.page.Select(can, action, html.DIV_TABS, function(_item) { _item == item || close(_item) })
							},
							"close all", function(event) { can.page.Select(can, action, html.DIV_TABS, close) }
						), ["close tab", "close other", "close all"])
					},
					ondragstart: function(event) { var target = event.target; target.click()
						action._drop = function(event, before) { action.insertBefore(target, before) }
					},
					ondragover: function(event) { event.preventDefault(), action._drop(event, event.target) },
					ondrop: function(event) { event.preventDefault(), action._drop(event, event.target) },
				}), can.core.Timer(10, function() { item.click() })
				can.base.isFunc(each) && each(item)
			}}
		})).first
	},
	sess: function(can, sess, cb) { sess = sess||can.user.localStorage(can, "web.code.inner.sess")
		can.core.Next(sess.plug, function(item, next) { can.onimport.toolkit(can, {index: item}, function(sub) { can.toolkit[item] = sub, next() }) }, function() {
			can.core.Next(sess.exts, function(item, next) { can.onimport.exts(can, item, next) }, function() {
				var path = can.Option(nfs.PATH), file = can.Option(nfs.FILE), line = can.Option(nfs.LINE)
				can.base.getValid(sess.tabs)? can.core.Next(sess.tabs, function(item, next) { var ls = item.split(ice.DF); can.onimport.tabview(can, ls[0], ls[1], ls[2], next) },
					function() { can.onimport.tabview(can, path, file, line, cb) }): can.base.isFunc(cb) && cb()
			})
		})
	},
}, [""])
Volcanos(chat.ONPLUGIN, {help: "注册插件", 
	"code.inner.keymap": shy("按键", {}, ["mode", "key", ice.LIST, ice.BACK], function(msg, cmds) {
		can.core.Item(can.onkeymap._mode, function(mode, value) {
			(!cmds[0] || cmds[0] == mode) && can.core.Item(value, function(key, func) {
				if (cmds[0] == mode && cmds[1] == key) {
					msg.Push("key", "mode")
					msg.Push("value", mode)
					msg.Push("key", "key")
					msg.Push("value", key)
					msg.Push("key", "help")
					msg.Push("value", func.help)
					msg.Push("key", "func")
					msg.Push("value", func.toString())
				} else if (!cmds[0] || !cmds[1]) {
					func.help && msg.Push(kit.Dict("mode", mode, "key", key, "help", func.help))
				}
			})
		}), msg.StatusTimeCount()
	}),
})
Volcanos(chat.ONSYNTAX, {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg, cb, skip) {
		if (can.isCmdMode()) {
			if (msg.Option(ctx.INDEX)) {
				can.ui._path.innerText = msg.Option(nfs.FILE)
			} else {
				can.ui._path.innerText = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
			}
		}

		if (can.onmotion.cache(can, function(cache_data) {
			can.file && (cache_data[can.file] = {current: can.current, max: can.max,
				profile_display: can.ui.profile.style.display, display_display: can.ui.display.style.display,
			})
			can.file = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
			can.parse = can.base.Ext(can.file), can.Status("模式", "plugin")

			var p = cache_data[can.file]; p && (can.current = p.current, can.max = p.max)
			can.page.style(can, can.ui.profile, {display: p? p.profile_display: html.NONE})
			can.page.style(can, can.ui.display, {display: p? p.display_display: html.NONE})
			can.onmotion.select(can, can._action, html.DIV_TABS, msg._tab)
			can.onmotion.select(can, can.ui._tabs, html.DIV_TABS, msg._tab)
			can.onmotion.delay(can, function() { can.onimport.layout(can)
				msg.Option(ctx.INDEX) && can.onmotion.focus(can, can.page.Select(can, can.ui.content, html.OPTION_ARGS)[0])
			})
			return can.file
		}, can.ui.content, can.ui.profile_output, can.ui.display_output) && !skip) {
			return can.onaction.selectLine(null, can, msg.Option(nfs.LINE)), can.base.isFunc(cb) && cb()
		}

		if (msg.Option(ctx.INDEX)) {
			// can.onmotion.clear(can, can.ui.content)
			can.onimport.plugin(can, {index: msg.Option(ctx.INDEX)}, can.ui.content, function(sub) {
				can.onimport.layout(can)
				can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth(can.ui.content.offsetWidth-40))
				can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(can.ui.content.offsetHeight-2*html.ACTION_HEIGHT))
				can.onmotion.delay(can, function() {
					can.onmotion.focus(can, can.page.Select(can, can.ui.content, html.OPTION_ARGS)[0])
				}), can.base.isFunc(cb) && cb()
			})
			return
		}

		can.onmotion.clear(can, can.ui.content)
		function init(p) { can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) {
			can.onaction.appendLine(can, item)
		}), can.onaction.selectLine(null, can, msg.Option(nfs.LINE)), can.base.isFunc(cb) && cb()
			msg.Option(nfs.FILE).indexOf("website/") == 0 && can.onaction[cli.SHOW]({}, can)
			if (can.page.ClassList.has(can, can._fields, chat.PLUGIN)) {
				p && p.render && can.onaction[cli.SHOW]({}, can)
				p && p.engine && can.onaction[cli.EXEC]({}, can)
			}
			can.onimport.layout(can)
		}
		can.Conf("plug") && (can.onsyntax[can.parse] = can.Conf("plug"))
		var p = can.onsyntax[can.parse]; !p? can.runAction({}, mdb.PLUGIN, [can.parse, msg.Option(nfs.FILE), msg.Option(nfs.PATH)], function(msg) {
			init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
		}): init(p)
	},
	_parse: function(can, line) { if (line.indexOf("<html") == 0) { return line }
		line = can.page.replace(can, line||"")

		function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }
		var p = can.onsyntax[can.parse]; if (!p) { return line } p = can.onsyntax[p.link]||p, p.split = p.split||{}
		p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||"\t ", p.split.operator||"{[(.,:;!|<>)]}", {detail: true}), function(item, index, array) {
			item = can.base.isObject(item)? item: {text: item}
			var text = item.text; var type = item.keyword||p.keyword[text]

			switch (item.type) { case html.SPACE: return text
				case lang.STRING: return wrap(lang.STRING, item.left+text+item.right)
				default: return wrap(type, text)
			}
		}).join(""))

		p.prefix && can.core.Item(p.prefix, function(pre, type) {
			if (can.base.beginWith(line, pre)) {
				line = wrap(type, line)
			} else {
				var ls = line.split(pre); if (ls.length > 1) {
					line = ls[0] + wrap(type, pre + ls[1])
				}
			}
		})
		p.suffix && can.core.Item(p.suffix, function(end, type) {
			if (can.base.endWith(line, end)) { line = wrap(type, line) }
		})
		return line
	},
})
Volcanos(chat.ONKEYMAP, {help: "导入数据", _init: function(can, msg, cb, target) {
	},
	_plugin: function(event, can) {},
	_normal: function(event, can) {},
	_insert: function(event, can) {},
	_mode: {
		plugin: {
			Escape: shy(cli.CLEAR, function(event, can) { can.actions(event, cli.CLEAR) }),
			g: shy("搜索", function(event, can) { can.actions(event, "搜索") }),
			f: shy("打开文件", function(event, can) { can.actions(event, "打开") }),
			t: shy("添加命令", function(event, can) { can.actions(event, "添加") }),
			p: shy("添加插件", function(event, can) { can.actions(event, "插件") }),
			e: shy("添加扩展", function(event, can) { can.actions(event, "扩展") }),

			m: function(event, can) { can.actions(event, "autogen") },
			c: function(event, can) { can.actions(event, "compile") },
			w: function(event, can) { can.actions(event, "website") },

			r: shy(cli.EXEC, function(event, can) { can.actions(event, cli.EXEC) }),
			v: shy(cli.SHOW, function(event, can) { can.actions(event, cli.SHOW) }),
			a: shy("全屏", function(event, can) { can.actions(event, "全屏") }),

			j: function(event, can) { can.current.scroll(1) },
			k: function(event, can) { can.current.scroll(-1) },
			J: function(event, can) { can.current.scroll(can.current.window()-3) },
			K: function(event, can) { can.current.scroll(-can.current.window()+3) },

			i: function(event, can) { can.onkeymap._insert(event, can) },
			n: function(event, can) { can.onkeymap._normal(event, can) },
			":": function(event, can) { can.onimport.toolkit(can, {index: "cli.system"}, function(sub) { can.toolkit["cli.system"] = sub.select() }) },
		},
	}, _engine: {},
})
Volcanos(chat.ONACTION, {help: "控件交互", list: ["搜索", "打开", "添加", "插件", "扩展"],
	_trans: {width: "宽度", height: "高度", website: "网页"},
	load: function(event, can) {
		var file = can.base.Path("/require/", can.Option(nfs.PATH), can.Option(nfs.FILE))
		delete(Volcanos.meta.cache[file]), eval("\n_can_name = \""+file+"\"\n"+can.onexport.content(can)+"\n_can_name = \"\"\nconsole.log(\"once\")")
	},
	"刷新": function(event, can) { can.onimport.tabview(can, "src/", "main.go", "", function() {}, skip) },
	"搜索": function(event, can) {
		can.user.input(event, can, [mdb.NAME, [ctx.ACTION, nfs.TAGS, nfs.GREP, cli.MAKE]], function(data) {
			can.ui.search.Update({}, [ctx.ACTION, data.action, data.name])
		})
	},
	"打开": function(event, can) {
		can.user.input(event, can, [nfs.FILE], function(list) {
			can.onimport.tabview(can, can.Option(nfs.PATH), list[0])
			can.onimport.project(can, can.Option(nfs.PATH))
		})
	},
	"添加": function(event, can) {
		can.user.input(event, can, [ctx.INDEX], function(list) {
			can.onimport.tabview(can, can.Option(nfs.PATH), list[0], ctx.INDEX)
		})
	},
	"插件": function(event, can) {
		can.user.input(event, can, [ctx.INDEX], function(data) {
			var sub = can.toolkit[data.index]; if (sub) { sub.select(); return }
			can.onimport.toolkit(can, data, function(sub) { can.toolkit[data.index] = sub.select() })
		})
	},
	"扩展": function(event, can) {
		can.user.input(event, can, ["url"], function(data) {
			var sub = can.extentions[data.url]; if (sub) { sub.select(); return }
			can.onimport.exts(can, data.url, function(sub) { can.extentions[data.url] = sub.select() })
		})
	},
	"保存": function(event, can) { can.onexport.sess(can), can.user.toastSuccess(can) },
	"项目": function(event, can) { can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can) },
	"工具": function(event, can) { can.onmotion.toggle(can, can.ui.toolkit.fieldset) },
	exec: function(event, can) { can.onimport.display(can), can.request(event, {_toast: "执行中..."})
		can.runAction(event, mdb.ENGINE, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.ui.display_status)
			can.onimport.display(can, msg), can.onimport.layout(can) 
		})
	},
	show: function(event, can) { can.onimport.profile(can), can.request(event, {_toast: "渲染中..."})
		if (can.Option(nfs.FILE).indexOf("website/") == 0) {
			can.profile_size[can.onexport.keys(can)] = can.profile_size[can.onexport.keys(can)] || can.ConfWidth()*parseInt(70)/100
		}
		can.parse == nfs.JS && can.onaction[nfs.LOAD](event, can)
		can.runAction(event, mdb.RENDER, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onimport.profile(can, msg)
		})
	},
	clear: function(event, can) {
		if (can.page.Select(can, can._root._target, ".input.float", function(item) {
			return can.page.Remove(can, item)
		}).length > 0) { return }

		if (can.page.Select(can, can.ui.toolkit.status, "legend.select", function(item) {
			return item.click(), item
		}).length > 0) { return }
		if (can.page.Select(can, can._status, "legend.select", function(item) {
			return item.click(), item
		}).length > 0) { return }

		if (can.ui.profile.style.display == "") {
			can.onmotion.hidden(can, can.ui.profile)
		} else if (can.ui.display.style.display == "") {
			can.onmotion.hidden(can, can.ui.display)
		} else if (can.ui.project.style.display == "") {
			can.onmotion.hidden(can, can.ui.project)
		} else {
			can.onaction["全屏"](event, can)
		}
		can.onimport.layout(can)
	},
	"全屏": function(event, can) {
		if (can.page.ClassList.neg(can, can._fields, "Full")) {
			can.onmotion.hidden(can, can.ui.project)
			can.ConfHeight(can._root._height)
		} else {
			can.onmotion.toggle(can, can.ui.project, true)
			can.ConfHeight(can._root._height-2*html.ACTION_HEIGHT)
		}
		can.onimport.layout(can)
	},
	back: function(event, can) { can.history.pop(); var last = can.history.pop()
		last && can.onimport.tabview(can, last.path, last.file, last.line)
		can.Status("跳转数", can.history.length)
	},

	scrollLine: function(can, count) { var size = 20; can.current.scroll(count*size) },
	appendLine: function(can, value) {
		var ui = can.page.Append(can, can.ui.content, [{type: html.TR, list: [
			{view: ["line unselectable", html.TD, ++can.max], onclick: function(event) {
				can.onaction.selectLine(event, can, ui.tr)
			}, ondblclick: function(event) {
				can.onaction.favorLine(can, ui.text.innerText)
			}},

			{view: [html.TEXT, html.TD], inner: can.onsyntax._parse(can, value), onclick: function(event) {
				can.onaction.selectLine(event, can, ui.tr)

			}, ondblclick: function(event) {
				var s = document.getSelection().toString(), str = ui.text.innerText
				var begin = str.indexOf(s), end = begin+s.length

				for (var i = begin; i >= 0; i--) {
					if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break }
				}

				if (s.indexOf("kit.") == 0) { s = s.replace("kit.", "toolkits.") }
				if (s.indexOf(".") == 0) { s = s.slice(1) }
				can.onaction.searchLine(event, can, s)
			}}
		]}]); return ui.tr
	},
	_getLine: function(can, line) {
		return can.page.Select(can, can.ui.content, html.TR, function(item, index, array) { if (item == line || index+1 == line) { return item } })[0]
	},
	_getLineno: function(can, line) {
		return can.page.Select(can, can.ui.content, html.TR, function(item, index, array) { if (item == line || index+1 == line) { return index+1 } })[0]
	},
	selectLine: function(event, can, line) { if (!line) { return parseInt(can.core.Value(can.page.Select(can, can.ui.content, [[[html.TR, html.SELECT], [html.TD, "line"]]])[0], "innerText")) }
		can.page.Select(can, can.ui.content, html.TR, function(item, index, array) { if (line < 0 || line > array.length) { return }
			if (!can.page.ClassList.set(can, item, html.SELECT, item == line || index+1 == line)) { return }
			var ls = can.file.split(ice.PS)
			if (ls.length > 4) { ls = [ls.slice(0, 2).join(ice.PS)+"/.../"+ls.slice(-2).join(ice.PS)] }
			line = item, can.Status(kit.Dict("文件名", ls.join(ice.PS), "解析器", can.parse, "当前行", can.onexport.position(can, can.Option(nfs.LINE, index+1))))
		})

		can.base.isObject(line) && can.page.Select(can, line, "td.text", function(item) {
			can.current = {
				window: function() { return parseInt(can.ui.content.offsetHeight/can.current.line.offsetHeight) },
				scroll: function(count) { if (count) { can.ui.content.scrollTop += count*can.current.line.offsetHeight }
					return parseInt((can.current.line.offsetTop-can.ui.content.scrollTop)/can.current.line.offsetHeight)
				},

				prev: function() { return line.previousSibling },
				next: function() { return line.nextSibling },
				line: line, text: function(text) {
					return text != undefined && can.onaction.modifyLine(can, line, text), item.innerText
				},
			}

			if (!event) {
				var scroll = can.current.scroll(); if (scroll < 5) { can.current.scroll(scroll-5) } else {
					var window = can.current.window(); if (scroll > window/2) { can.current.scroll(scroll-window/2) }
				}
			} else {
				var scroll = can.current.scroll(); if (scroll < 3) { can.current.scroll(scroll-3) } else {
					var window = can.current.window(); if (scroll > window-4) { can.current.scroll(scroll-window+4) }
				}
			}

			var push = {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE), text: can.current.text()}
			can.base.Eq({path: push.path, file: push.file, line: push.line}, can.history[can.history.length-1]) || can.history.push(push)
			can.Status("跳转数", can.history.length)
			can.onaction._selectLine(event, can)
			if (can.isCmdMode()) { location.hash = push.file+","+(push.line||1) }
		})
	},
	_selectLine: function(event, can) { },
	searchLine: function(event, can, value) { if (!can.ui.search) { return }
		can.ui.search.Update(event, [ctx.ACTION, nfs.TAGS, value.trim()])
	},
	favorLine: function(can, value) {
		can.user.input(event, can, [{name: "zone", value: "hi"}, {name: "name", value: "hello"}], function(data) {
			can.runAction(event, code.FAVOR, [ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
				mdb.TYPE, can.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
				nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
			])
		})
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
	sess: function(can) {
		can.user.localStorage(can, "web.code.inner.sess", {
			"plug": can.onexport.plug(can), "exts": can.onexport.exts(can), "tabs": can.onexport.tabs(can),
		})
	},
	keys: function(can, file, path) { return (path||can.Option(nfs.PATH))+":"+(file||can.Option(nfs.FILE)) },
	tabs: function(can) { return can.core.Item(can.tabview, function(key, msg) { return key+ice.DF+msg.Option(nfs.LINE) }) },
	plug: function(can) { return can.core.Item(can.toolkit) },
	exts: function(can) { return can.core.Item(can.plugins) },
	position: function(can, index, total) { total = total||can.max
		return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%"
	},
	content: function(can) {
		return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL)
	},
})
