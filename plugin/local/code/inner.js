Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) { if (msg.Result() == "" && msg.Length() == 0) { can.onmotion.hidden(can, can._output); return }
		if (msg.Option(nfs.FILE)) {
			msg.Option(nfs.PATH) && can.Option(nfs.PATH, msg.Option(nfs.PATH))
			can.Option(nfs.FILE, msg.Option(nfs.FILE))
			msg.Option(nfs.LINE) && can.Option(nfs.LINE, msg.Option(nfs.LINE))
		}
		if (can.Option(nfs.PATH) == "man") {
			// msg.result = [msg.Option(mdb.TEXT)]
		}

		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		can.tabview = can.tabview||{}, can.history = can.history||[], can.toolkit = {}, can.extentions = {}
		can.profile_size = {}, can.display_size = {}

		can.onmotion.clear(can), can.onlayout.profile(can)
		can.page.styleWidth(can, can.ui.project, 240)
		can.onimport._project(can, can.ui.project)
		can.onimport._profile(can, can.ui.profile)
		can.onimport._display(can, can.ui.display)
		can.onimport._input(can)

		can.ui._content = can.ui.content
		can.ui._profile_output = can.ui.profile_output
		can.isCmdMode() && can.onmotion.hidden(can, can._status)
		can.onengine.plugin(can, can.onplugin)
		can.base.isFunc(cb) && cb(msg)

		switch (can.Mode()) {
			case "simple": can.onimport._simple(can); break
			case "float": break
			case "cmd": can.onimport._tabs(can) // no break
			case "full": // no break
			default: if (can.ConfHeight() < 320) { can.ConfHeight(320) }
				can.onimport.project(can, paths), can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
				can.onimport._toolkit(can, can.ui.toolkit), can.onimport._session(can, msg, function() {
					files.length > 1 && can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) {
						can.onimport.tabview(can, can.Option(nfs.PATH), file, can.Option(nfs.LINE), next)
					}, function() { can.onimport.tabview(can, paths[0], files[0], "") }) })
				}), can.onimport._keydown(can)
		}

		var hash = location.hash; can.isCmdMode() || (can.tabview[can.onexport.keys(can)] = msg)
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() {
			if (can.isCmdMode() && hash) { var args = can.core.Split(decodeURIComponent(hash).slice(1))
				can.onmotion.delay(can, function() { can.onimport.tabview(can, can.Option(nfs.PATH), args[0], args[1]) })
			}
		})
	},
	_input: function(can) {
	},
	_project: function(can, target) {
		target._toggle = function(event, show) { can.onimport.layout(can) }
	},
	_profile: function(can, target) {
		var ui = can.page.Append(can, target, [html.ACTION, html.OUTPUT]); can.ui.profile_output = ui.output
		var action = can.onappend._action(can, [], ui.action, kit.Dict(
			cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
			cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
			cli.SHOW, function(event) { can.onaction[cli.SHOW](event, can) },
			nfs.LOAD, function(event) { can.onaction[nfs.LOAD](event, can) },
			mdb.LINK, function(event) {
				if ([nfs.ZML, nfs.IML].indexOf(can.base.Ext(can.Option(nfs.FILE))) > -1) {
					can.user.open(can.misc.MergeURL(can, {
						pod: can.misc.Search(can, ice.POD), website: can.base.trimPrefix(can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), "src/website/"),
					}))
				} else {
					can.user.open(can.misc.MergeURL(can, {
						pod: can.misc.Search(can, ice.POD), cmd: can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE))
					}))
				}
			},
			mdb.PLUGIN, function(event) { can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) { can.onimport.plug(can, data, ui.output) }) },
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
			mdb.PLUGIN, function(event) { can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(data) { can.onimport.plug(can, data, ui.output) }) },
			html.HEIGHT, function(event) {
				can.user.input(event, can, [{name: html.HEIGHT, value: can.display_size[can.onexport.keys(can)]*100/can.ConfHeight()||50}], function(list) {
					can.display_size[can.onexport.keys(can)] = can.ConfHeight()*parseInt(list[0])/100
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
			can._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can._key_list, can.ui.content)
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

	layout: function(can) { if (can.isSimpleMode()) { return }
		if (can.isFloatMode()) { can.onmotion.hidden(can, can._action), can.onmotion.hidden(can, can.ui.project) }

		var width = can.ConfWidth()+(can.user.isMobile && can.isCmdMode() && can.user.isLandscape()? 16: 0)-(can.user.isWindows && !can.isCmdMode()? 20: 0)
		can.page.styleWidth(can, can.ui.profile_output, can.profile_size[can.onexport.keys(can)]||(width-can.ui.project.offsetWidth)/3)
		can.page.styleWidth(can, can.ui.content, width-can.ui.project.offsetWidth-can.ui.profile.offsetWidth)
		can.page.styleWidth(can, can.ui.display, width-can.ui.project.offsetWidth)

		var height = can.ConfHeight()
		if (can.user.isMobile && can.isFloatMode()) { height = can._root._height-2*html.ACTION_HEIGHT }

		if (can.isCmdMode()) {
			if (can.ui.display.display != html.NONE) {
				if (can.ui.display.offsetHeight > can.base.Min(can.ConfHeight() / 2, 200)) {
					can.page.style(can, can.ui.display_output, html.MAX_HEIGHT, can.base.Min(can.ConfHeight() / 2, 200))
				}
			}
			if (can._status.style.display == html.NONE) { height += html.ACTION_HEIGHT }
			var rest = can.ui.display.offsetHeight+can.ui._tabs.offsetHeight+can.ui._path.offsetHeight+4
			can.page.styleHeight(can, can.ui.content, height+html.ACTION_HEIGHT-rest)
			can.page.styleHeight(can, can.ui.profile_output, height-can.ui.display.offsetHeight)
			can.page.styleHeight(can, can.ui.project, height+html.ACTION_HEIGHT)
		} else { var rest = can.ui.display.offsetHeight; if (height < 320) { height = 320 }
			if (!can.isFullMode()) {
				can._min_height = can._min_height||height, height >= can._min_height && (can._min_height = height)
				can.page.style(can, can.ui.content, html.MIN_HEIGHT, can._min_height)
			}
			can.page.style(can, can.ui.content, can.user.isMobile? html.HEIGHT: html.MAX_HEIGHT, height-rest)
			can.page.styleHeight(can, can.ui.profile_output, can.ui.content.offsetHeight-html.ACTION_HEIGHT)
			can.page.styleHeight(can, can.ui.project, can.ui.content.offsetHeight+rest)
		}
		can.page.Select(can, can.ui.profile, html.IFRAME, function(iframe) {
			can.page.Modify(can, iframe, {height: can.ui.profile.offsetHeight-html.ACTION_HEIGHT-4, width: can.ui.profile.offsetWidth})
		})
	},
	project: function(can, path) {
		can.onimport.zone(can, [
			{name: "source", _init: function(target) { var total = 0
				function show(path, target) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [ice.PWD], function(msg) { var list = msg.Table()
					can.core.List(list, function(item) { if (can.Option(nfs.FILE).indexOf(item.path) == 0) { item.expand = true } })
					can.onimport.tree(can, list, nfs.PATH, ice.PS, function(event, item) {
						can.onimport.tabview(can, path, item.path) // 显示文件
					}, target), can.Status("文件数", total += msg.Length())
				}, true) } if (path.length == 1) { return show(path[0], target) }

				can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(target) { show(path, target) }} }), target)
				can.onmotion.delay(can, function() { target.previousSibling.innerHTML = "" })
			}},
			{name: "plugin", _init: function(target) {
				can.onimport.tree(can, can.core.Item(can.onengine.plugin.meta, function(key) { return {index: can.base.trimPrefix(key, "can.")} }), ctx.INDEX, ice.PT, function(event, item) {
					can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys("can", item.index), ctx.INDEX) // 显示插件
				}, target)
			}},
		], can.ui.project)
	},
	history: function(can, push) {
		can.base.Eq(push, can.history[can.history.length-1]) || can.history.push(push)
		return can.Status("跳转数", can.history.length), push
	},
	tabview: function(can, path, file, line, cb, skip, skip2) { var key = can.onexport.keys(can, file, path)
		if (can.isCmdMode()) { (location.hash = location.pathname.indexOf(file) > -1? "": file+ice.FS+(line||1)) }
		if (!skip && can.tabview[key]) { can.isCmdMode() && can.user.title(path+file)
			can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.tabview[key]
			can.Option({path: path, file: file, line: line||can._msg.Option(nfs.LINE)||1})
			return can._msg.Option(can.Option()), can.onsyntax._init(can, can._msg, cb, skip2)
		}

		function show(msg) { var skip2 = skip; can.tabview[key] = msg
			can.onimport.tabs(can, [{name: file.split(line == ctx.INDEX? ice.PT: ice.PS).pop(), text: file}], function(event, meta) {
				can._tab = msg._tab = event.target, can.onimport.tabview(can, path, file, msg.Option(nfs.LINE), cb, false, skip2), cb = null, skip2 = false
			}, function(item) {
				delete(can.tabview[key])
				delete(can._cache_data[can.base.Path(path, file)])
				delete(can.ui._content._cache[can.base.Path(path, file)])
				delete(can.ui._profile_output._cache[can.base.Path(path, file)])
				delete(can.ui.display_output._cache[can.base.Path(path, file)])
				msg._content != can.ui._content && can.page.Remove(can, msg._content)
			}, can.ui._tabs, function(item) {})
		}

		can.Option(can.onimport.history(can, {path: path, file: file, line: line}))
		line == ctx.INDEX? show(can.request({}, {index: file, line: line})):
			line == web.DREAM? show(can.request({}, {index: file, line: line})):
				can.run({}, [path, file], show, true)
	},
	profile: function(can, msg) {
		var width = can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/2
		if (msg) {
			var sup = can.tabview[can.onexport.keys(can)]
			can.onmotion.toggle(can, can.ui.profile_output, false)
			if (msg.Result().indexOf("<iframe") > -1) {
				if (sup._profile_output != can.ui._profile_output) { can.page.Remove(can, sup._profile_output) }
				can.ui.profile_output = sup._profile_output = can.page.Append(can, can.ui.profile_output.parentNode, [{view: "output", inner: msg.Result()}]).output
			} else {
				can.ui.profile_output = sup._profile_output = can.ui._profile_output
				can.onimport.process(can, msg, can.ui._profile_output, width, can.ui.profile.offsetHeight)
			}
		}
		can.onmotion.toggle(can, can.ui.profile_output, true)
		can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
	},
	display: function(can, msg) {
		var height = can.display_size[can.onexport.keys(can)]||{sh: can.ConfHeight()/2}[can.parse]||can.ConfHeight()/4
		if (msg) {
			can.onimport.process(can, msg, can.ui.display_output, can.ui.display.offsetWidth, height)
			can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.ui.display_status)
		}
		can.onmotion.toggle(can, can.ui.display, true), can.onimport.layout(can)
	},
	process: function(can, msg, target, width, height) { can.onmotion.clear(can, target), can.user.toastSuccess(can)
		if (msg.Option(ice.MSG_PROCESS) == "_field") {
			msg.Table(function(meta) { meta.display = msg.Option(ice.MSG_DISPLAY)
				can.onimport.plug(can, meta, target, function(sub) { width && sub.ConfWidth(width), height && sub.ConfHeight(height), sub.Focus() })
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), target, false, function(msg) { can.onmotion.delay(can, function() { can.onimport.layout(can) }) })
		} else {
			can.onappend.table(can, msg, null, target), can.onappend.board(can, msg, target)
		}
	},
	toolkit: function(can, meta, cb) { meta.msg = true
		can.onimport.plug(can, meta, can.ui.toolkit.output, function(sub) {
			sub.ConfHeight(can.ConfHeight()-4*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth())
			sub.page.style(sub, sub._output, html.MAX_HEIGHT, sub.ConfHeight())
			sub.page.style(sub, sub._output, html.MAX_WIDTH, sub.ConfWidth())

			can._status.appendChild(sub._legend), sub._legend.onclick = function(event) {
				if (can.page.Select(can, can._status, ice.PT+html.SELECT)[0] == event.target) {
					can.page.ClassList.del(can, event.target, html.SELECT)
					can.page.ClassList.del(can, sub._target, html.SELECT)
					return
				}
				can.onmotion.select(can, can.ui.toolkit.output, html.FIELDSET, sub._target), sub.Focus()
				can.onmotion.select(can, can._status, html.LEGEND, event.target)
				if (meta.msg == true) { meta.msg = false, sub.Update() }
			}, sub.select = function() { return sub._legend.click(), sub }
			sub.onaction.close = function() { sub.select() }
			sub._legend.onmouseenter = null
			can.base.isFunc(cb) && cb(sub)
		})
	},
	exts: function(can, url, cb) {
		can.require([url], function() {}, function(can, name, sub) { sub._init(can, can.base.ParseURL(sub._path), function(sub) {
			can.extentions[url.split("?")[0]] = sub, can.base.isFunc(cb) && cb(sub)
		}) })
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
	"can.code.inner.keymap": shy("按键", {}, ["mode", "key", ice.LIST, ice.BACK], function(can, msg, cmds) {
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
					msg.Push(kit.Dict("mode", mode, "key", key, "help", func.help||func.toString()))
				}
			})
		}), msg.StatusTimeCount()
	}),
})
Volcanos(chat.ONSYNTAX, {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg, cb, skip) {
		if (can.ui._path) {
			can.ui._path.innerHTML = msg.Option(ctx.INDEX)? msg.Option(nfs.LINE) == web.DREAM?
				/* dream */ can.page.Format(html.A, can.misc.MergeURL(can, {pod: msg.Option(nfs.FILE), topic: can.misc.Search(can, "topic")}, true)):
				/* index */ msg.Option(nfs.FILE): /* file */ can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
		}
		can.ui.current && can.onmotion.toggle(can, can.ui.current, !msg.Option(ctx.INDEX))

		if (can.onmotion.cache(can, function(cache_data) {
			can.file && (cache_data[can.file] = {current: can.current, max: can.max,
				profile_display: can.ui.profile.style.display, display_display: can.ui.display.style.display,
			})
			can.file = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
			can.parse = can.base.Ext(can.file), can.Status("模式", "plugin")

			var p = cache_data[can.file]; p && (can.current = p.current, can.max = p.max)
			can.page.style(can, can.ui.profile, {display: p? p.profile_display: html.NONE})
			can.page.style(can, can.ui.display, {display: p? p.display_display: html.NONE})
			can.onmotion.select(can, can.ui._tabs, html.DIV_TABS, msg._tab)
			can.onmotion.select(can, can._action, html.DIV_TABS, msg._tab)
			can.onmotion.delay(can, function() { can.onimport.layout(can)
				msg.Option(ctx.INDEX) && can.onmotion.focus(can, can.page.Select(can, can.ui.content, html.OPTION_ARGS)[0])
			})

			can.page.Select(can, can.ui._content.parentNode, can.page.Keys("div.content", html.IFRAME), function(item) {
				if (can.onmotion.toggle(can, item, item == msg._content)) { can.ui.content = msg._content }
			})
			can.page.Select(can, can.ui._profile_output.parentNode, can.page.Keys("div.output"), function(item) {
				if (can.onmotion.toggle(can, item, item == msg._profile_output)) { msg._profile_output }
			})
			return can.file
		}, can.ui._content, can.ui._profile_output, can.ui.display_output) && !skip) {
			return can.onaction.selectLine(null, can, msg.Option(nfs.LINE)), can.base.isFunc(cb) && cb()
		}

		can.onmotion.clear(can, can.ui.content), can.onimport.layout(can)
		if (msg.Option(ctx.INDEX)) {
			if (msg.Option(nfs.LINE) == web.DREAM) {
				if (msg._content) { return }
				can.ui.content = msg._content = can.page.insertBefore(can, [{type: html.IFRAME, src: can.misc.MergeURL(can, {pod: msg.Option(nfs.FILE), topic: can.misc.Search(can, "topic")}, true), width: can.ui.content.offsetWidth, height: can.ui.content.offsetHeight}], can.ui.content)
				return can.onimport.layout(can)
			}

			can.onmotion.toggle(can, can.ui.content = msg._content = can.ui._content, true)
			return can.onimport.plug(can, {index: msg.Option(ctx.INDEX)}, can.ui.content, function(sub) {
				can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(can.ui.content.offsetHeight-2*html.ACTION_HEIGHT))
				can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth(can.ui.content.offsetWidth))
				can.onmotion.delay(can, function() { sub.Focus() }), can.base.isFunc(cb) && cb()

				sub.onaction.close = function() { can.onaction.back({}, can), msg._tab._close() }
				sub.onimport._open = function(sub, msg, _arg) { var url = can.base.ParseURL(_arg), ls = url.origin.split("/chat/pod/")
					if (_arg.indexOf(location.origin) == 0 && ls.length > 1) {
						return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1].split("/")[0], web.DREAM), sub.Update() // 显示空间
					}
					return can.user.open(_arg), sub.Update()
				}
			})
		}
		can.onmotion.toggle(can, can.ui.content = msg._content = can.ui._content, true)

		function init(p) {
			can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
			can.onaction.selectLine(null, can, msg.Option(nfs.LINE)), can.base.isFunc(cb) && cb()

			msg.Option(nfs.FILE).indexOf("website/") == 0 && can.onaction[cli.SHOW]({}, can)
			p && p.render && can.onaction[cli.SHOW]({}, can)
			if (can.page.ClassList.has(can, can._fields, chat.PLUGIN)) {
				p && p.engine && can.onaction[cli.EXEC]({}, can)
			}
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
			item = can.base.isObject(item)? item: {text: item}; var text = item.text, type = item.keyword||p.keyword[text]

			switch (item.type) { case html.SPACE: return text
				case lang.STRING: return wrap(lang.STRING, item.left+text+item.right)
				default: return wrap(type, text)
			}
		}).join(""))

		p.prefix && can.core.Item(p.prefix, function(pre, type) { if (can.base.beginWith(line, pre)) { line = wrap(type, line) } })
		p.suffix && can.core.Item(p.suffix, function(end, type) { if (can.base.endWith(line, end)) { line = wrap(type, line) } })
		return line
	},
	go: {
		render: {},
		keyword: {
			"package": "keyword",
			"import": "keyword",
			"type": "keyword",
			"struct": "keyword",
			"interface": "keyword",
			"const": "keyword",
			"var": "keyword",
			"func": "keyword",

			"if": "keyword",
			"else": "keyword",
			"for": "keyword",
			"range": "keyword",
			"break": "keyword",
			"continue": "keyword",
			"switch": "keyword",
			"case": "keyword",
			"default": "keyword",
			"fallthrough": "keyword",
			"go": "keyword",
			"select": "keyword",
			"defer": "keyword",
			"return": "keyword",

			"false": "constant",
			"true": "constant",
			"nil": "constant",
			"iota": "constant",
			"-1": "constant",
			"0": "constant",
			"1": "constant",
			"2": "constant",
			"3": "constant",

			"int": "datatype", "int8": "datatype", "int16": "datatype", "int32": "datatype", "int64": "datatype",
			"uint": "datatype", "uint8": "datatype", "uint16": "datatype", "uint32": "datatype", "uint64": "datatype",
			"float32": "datatype", "float64": "datatype", "complex64": "datatype", "complex128": "datatype",
			"rune": "datatype", "string": "datatype", "byte": "datatype", "uintptr": "datatype",
			"bool": "datatype", "error": "datatype", "chan": "datatype", "map": "datatype",

			"msg": "function", "m": "function",
			"init": "function", "main": "function", "print": "function", "println": "function", "panic": "function", "recover": "function",
			"new": "function", "make": "function", "len": "function", "cap": "function", "copy": "function", "append": "function", "delete": "function", "close": "function",
			"complex": "function", "real": "function", "imag": "function",
		},
	},
	zml: {
		prefix: {
			"# ": "comment",
		},
		keyword: {
			"return": "keyword",

			"head": "keyword",
			"left": "keyword",
			"main": "keyword",
			"foot": "keyword",
			"tabs": "keyword",

			"index": "function",
			"action": "function",
			"args": "function",
			"type": "function",
			"style": "function",
			"width": "function",

			"auto": "constant",
			"username": "constant",
		},
	},
	css: {
		keyword: {
			"body": "keyword",
			"div": "keyword",
			"span": "keyword",
			"form": "keyword",
			"fieldset": "keyword",
			"legend": "keyword",
			"select": "keyword",
			"textarea": "keyword",
			"input": "keyword",
			"table": "keyword",
			"tr": "keyword",
			"th": "keyword",
			"td": "keyword",

			"background-color": "function",
			"font-family": "function",
			"font-weight": "function",
			"font-size": "function",
			"color": "function",
			"width": "function",
			"height": "function",
			"padding": "function",
			"border": "function",
			"margin": "function",
			"position": "function",
			"left": "function",
			"top": "function",
			"right": "function",
			"bottom": "function",
			"display": "function",
			"overflow": "function",
			"float": "function",
			"clear": "function",
			"cursor": "function",

			"z-index": "function",
			"tab-size": "function",
			"word-break": "function",
			"white-space": "function",
			"text-align": "function",
			"vertical-align": "function",
			"min-width": "function",
			"max-width": "function",
			"padding-left": "function",
			"padding-top": "function",
			"border-left": "function",
			"border-top": "function",
			"border-right": "function",
			"border-bottom": "function",
			"border-radius": "function",
			"border-spacing": "function",
			"margin-left": "function",
			"margin-top": "function",
			"margin-right": "function",
			"margin-bottom": "function",
			"box-shadow": "function",

			"0": "constant",
			"10px": "constant",
			"20px": "constant",
			"cyan": "constant",
			"gray": "constant",
			"yellow": "constant",
			"black": "constant",
			"white": "constant",
			"blue": "constant",
			"red": "constant",
			"green": "constant",
			"magenta": "constant",

			"monospace": "constant",
			"bold": "constant",
			"solid": "constant",
			"none": "constant",
			"block": "constant",
			"contexts": "constant",
			"both": "constant",
			"auto": "constant",

			"center": "constant",
			"relative": "constant",
			"absolute": "constant",
			"sticky": "constant",
			"fixed": "constant",
		},
	},
})
Volcanos(chat.ONKEYMAP, {help: "导入数据",
	_mode: {
		plugin: {
			Escape: shy("切换模式", function(event, can) { can.onaction.clear(event, can) }),
			g: shy("搜索", function(event, can) { can.onaction["搜索"](event, can) }),
			f: shy("打开文件", function(event, can) { can.onaction["打开"](event, can) }),
			r: shy("执行命令", function(event, can) { can.onaction[cli.EXEC](event, can) }),
			v: shy("渲染界面", function(event, can) { can.onaction[cli.SHOW](event, can) }),
			x: shy("关闭标签", function(event, can) { can._tab._close() }),

			h: shy("打开左边标签", function(event, can) { var next = can._tab.previousSibling; next && next.click() }),
			l: shy("打开右边标签", function(event, can) { var next = can._tab.nextSibling; next && next.click() }),
			j: shy("向下滚动", function(event, can) {
				if (can.ui.content != can.ui._content) {
					can.ui.content.contentWindow.document.body.scrollTop += 16
				} else {
					can.current.scroll(1)
				}
			}),
			k: shy("向上滚动", function(event, can) {
				if (can.ui.content != can.ui._content) {
					can.ui.content.contentWindow.document.body.scrollTop -= 16
				} else {
					can.current.scroll(-1)
				}
			}),
			J: shy("向下滚屏", function(event, can) { can.current.scroll(can.current.window()-3) }),
			K: shy("向上滚屏", function(event, can) { can.current.scroll(-can.current.window()+3) }),
		},
	}, _engine: {},
})
Volcanos(chat.ONACTION, {help: "控件交互", list: ["搜索", "打开"],
	_trans: {source: "源码", module: "模块", dreams: "空间", load: "加载", link: "链接", width: "宽度", height: "高度", website: "网页"},
	"搜索": function(event, can) {
		can.user.input(event, can, [mdb.NAME, [ctx.ACTION, nfs.TAGS, nfs.GREP, cli.MAKE]], function(data) {
			can.ui.search.Update({}, [ctx.ACTION, data.action, data.name])
		})
	},
	"打开": function(event, can) {
		can.user.input(event, can, [nfs.FILE], function(list) { can.onimport.tabview(can, can.Option(nfs.PATH), list[0]) })
	},
	sess: function(event, can) { can.onexport.sess(can), can.user.toastSuccess(can) },
	load: function(event, can) {
		var file = can.base.Path("/require/", can.Option(nfs.PATH), can.Option(nfs.FILE))
		delete(Volcanos.meta.cache[file]), eval("\n_can_name = \""+file+"\"\n"+can.onexport.content(can)+"\n_can_name = \"\"\nconsole.log(\"once\")")
		can.runAction(event, mdb.RENDER, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onimport.profile(can, msg)
		})
	},
	show: function(event, can) { can.request(event, {_toast: "渲染中..."})
		if (can.base.endWith(can.Option(nfs.FILE), ".js")) {
			var file = can.base.Path("/require/", can.Option(nfs.PATH), can.Option(nfs.FILE))
			delete(Volcanos.meta.cache[file]), eval("\n_can_name = \""+file+"\"\n"+can.onexport.content(can)+"\n_can_name = \"\"\nconsole.log(\"once\")")
		}
		can.runAction(event, mdb.RENDER, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onimport.profile(can, msg)
			can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.page.Append(can, can.ui._profile_output, ["status"]).first)
			can.page.Select(can, can.ui._profile_output, "table.content", function(target) {
				can.page.style(can, target,  "max-height", "1000px")
			})
		})
	},
	exec: function(event, can) { can.request(event, {_toast: "执行中...", "some": "run"})
		can.runAction(event, mdb.ENGINE, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onimport.display(can, msg)
		})
	},
	clear: function(event, can) {
		if (can.page.Select(can, can._root._target, ".input.float", function(item) { return can.page.Remove(can, item) }).length > 0) { return }
		if (can.page.Select(can, can._status, "legend.select", function(item) { return item.click(), item }).length > 0) { return }

		if (can.ui.display.style.display == "") { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		if (can.ui.profile.style.display == "") { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
		can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can)
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
				if (s.indexOf(ice.PT) == 0) { s = s.slice(1) }
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

			var push = can.onimport.history(can, {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE), text: can.current.text()})
			if (can.isCmdMode()) { (location.hash = location.pathname.indexOf(can.Option(nfs.FILE)) > -1? "": push.file+ice.FS+(push.line||1)) }
			can.onaction._selectLine(event, can)
		})
	},
	_selectLine: function(event, can) { },
	searchLine: function(event, can, value) {
		if (can.ui.search) {
			can.ui.search.Update(event, [ctx.ACTION, nfs.TAGS, value.trim()])
		} else {
			can.runAction(event, nfs.TAGS, [value], function(msg) {
				msg.Append(nfs.FILE)? can.onimport.tabview(can, msg.Append(nfs.PATH), msg.Append(nfs.FILE), msg.Append(nfs.LINE)):
					can.user.toast(can, "not found")
			})
		}
	},
	favorLine: function(event, can) { },
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
	sess: function(can) { can.user.localStorage(can, "web.code.inner.sess", {"plug": can.onexport.plug(can), "exts": can.onexport.exts(can), "tabs": can.onexport.tabs(can)}) },
	keys: function(can, file, path) { return (path||can.Option(nfs.PATH))+ice.DF+(file||can.Option(nfs.FILE)) },
	tabs: function(can) { return can.core.Item(can.tabview, function(key, msg) { return key+ice.DF+msg.Option(nfs.LINE) }) },
	plug: function(can) { return can.core.Item(can.toolkit) },
	exts: function(can) { return can.core.Item(can.plugins) },
	position: function(can, index, total) { total = total||can.max; return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
	content: function(can) { return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL) },
})
