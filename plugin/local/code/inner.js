Volcanos("onimport", {help: "导入数据", _init: function(can, msg, cb, target) {
		if (!can.user.isMobile) { can.page.style(can, can._action, html.HEIGHT, "31", html.DISPLAY, "block") }
		can.onengine.plugin(can, "can.code.inner.plugin", shy("插件", {}, [{type: "button", name: "list", action: "auto"}, "back"], function(msg, cmds) {}))

		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		can.tabview = can.tabview||{}, can.tabview[can.onexport.keys(can)] = msg
		can.history = can.history||[], can.toolkit = {}, can.extentions = {}, can.profile_size = {}

		can.onmotion.clear(can), can.onlayout.profile(can)
		can.onimport._project(can, can.ui.project)
		can.onimport._profile(can, can.ui.profile)
		can.onimport._display(can, can.ui.display)
		can.base.isFunc(cb) && cb(msg)

		if (can.page.ClassList.has(can, can._fields, chat.FLOAT) || can.page.ClassList.has(can, can._fields, chat.PLUGIN)) {
			if (!can.user.mod.isCmd) {
				can.page.style(can, can.ui.project, html.MIN_HEIGHT, can.ConfHeight())
				can.page.style(can, can.ui.content, html.MIN_HEIGHT, can.ConfHeight())
			}
		}

		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE))
		can.Conf("mode") == "simple"? can.onimport._simple(can): can.onimport.project(can, paths, function() {
			can.onimport._toolkit(can, can.ui.toolkit), can.onimport._session(can, msg), can.onimport._keydown(can)
			can.onmotion.delay(can, function() {
				can.core.Next(files.slice(1), function(file, next) {
					can.onimport.tabview(can, can.Option(nfs.PATH), file, can.Option(nfs.LINE), next)
				}, function() { can.onimport.tabview(can, paths[0], files[0]) })
			})
		})
	},
	_simple: function(can, target) {
		can.Conf(html.HEIGHT, ""), can.ui.project._toggle()
		can.page.ClassList.add(can, can._fields, chat.OUTPUT)
	},
	_project: function(can, target) {
		target._toggle = function(event) { can.onmotion.toggle(can, target), can.onimport.layout(can) }
	},
	_profile: function(can, target) {
		var ui = can.page.Append(can, target, [{view: html.ACTION}, {view: html.OUTPUT}]); can.ui.profile_output = ui.output
		var action = can.onappend._action(can, [], ui.action, kit.Dict(
			cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
			cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
			cli.SHOW, function(event) { can.onaction["展示"](event, can) },
			"加载", function(event) { can.onaction["加载"](event, can), can.user.ToastSuccess(can) },
			mdb.PLUGIN, function(event) {
				can.user.input(event, can, [ctx.INDEX], function(event, button, data) {
					can.onimport.plugin(can, data, ui.output)
				})
			},
			html.WIDTH, function(event) {
				can.user.input(event, can, [{name: html.WIDTH, value: 50}], function(event, button, data) {
					can.profile_size[can.onexport.keys(can)] = can.ConfWidth()*parseInt(data.width)/100
					can.onaction["展示"](event, can)
				})
			},
		))
		target._toggle = function(event, show) { action[show? cli.SHOW: cli.CLOSE](event) }
	},
	_display: function(can, target) {
		var ui = can.page.Append(can, target, [{view: html.ACTION}, {view: html.OUTPUT}, {view: html.STATUS}])
		can.ui.display_output = ui.output, can.ui.display_status = ui.status
		var action = can.onappend._action(can, [], ui.action, kit.Dict(
			cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
			cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
			cli.EXEC, function(event) { can.onaction["执行"](event, can) },
			mdb.PLUGIN, function(event) {
				can.user.input(event, can, [ctx.INDEX], function(event, button, data) {
					can.onimport.plugin(can, data, ui.output)
				})
			},
			html.HEIGHT, function(event) {
				can.user.input(event, can, [{name: html.HEIGHT, value: 50}], function(event, button, data) {
					can.profile_size[can.onexport.keys(can)] = can.ConfHeight()*parseInt(data.height)/100
					can.onaction["执行"](event, can)
				})
			},
		))
		target._toggle = function(event, show) { action[show? cli.EXEC: cli.CLOSE](event) }
	},
	_toolkit: function(can, target) {
		can.ui.toolkit = can.onappend.field(can, "toolkit", {}, can._output)
	},
	_session: function(can, msg) { can.user.isMobile || can.onimport.sess(can, "", function() { can.onimport.sess(can, {
		plug: can.core.Split(msg.OptionOrSearch("plug")).reverse(),
		exts: can.core.Split(msg.OptionOrSearch("exts")).reverse(),
		tabs: can.core.Split(msg.OptionOrSearch("tabs")),
	}) }) },
	_keydown: function(can) { can.onkeymap._build(can)
		can.user.mod.isCmd && can.onengine.listen(can, chat.ONKEYDOWN, function(event) {
			can._key_list = can.onkeymap._parse(event, can, "plugin", can._key_list, can.ui.content)
		})
	},

	project: function(can, path, cb) { can.onmotion.clear(can, can.ui.project)
		can.core.Next(path, function(path, next, index, array) {
			var list = can.ui.project; if (array.length > 1) {
				var ui = can.page.Append(can, can.ui.project, [{view: [html.ITEM, html.DIV, path], onclick: function(event) {
					can.onmotion.toggle(can, ui.list)
				}}, {view: html.LIST}]); list = ui.list
				if (index > 0) { ui.item.click() }
			}
			can.run(can.request({}, {dir_root: path, dir_deep: true})._event, [ice.PWD], function(msg) {
				can.onappend.tree(can, can._file = msg.Table(), nfs.PATH, ice.PS, function(event, item) {
					can.onimport.tabview(can, path, item.path)
				}, list), can.onimport.layout(can), can.Status("文件数", msg.Length()), next()
			}, true)
		}, function() {
			can.base.isFunc(cb) && cb()
		})
	},
	tabview: function(can, path, file, line, cb, skip, skip2) { var key = can.onexport.keys(can, file, path)
		if (!skip && can.tabview[key]) { can.user.mod.isCmd && can.user.title(path+file)
			can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.tabview[key]
			can.Option({path: path, file: file, line: line||can._msg.Option(nfs.LINE)||1})
			return can._msg.Option(can.Option()), can.onsyntax._init(can, can._msg, cb, skip2)
		}

		function show(msg) { can.tabview[key] = msg
			var skip2 = skip
			msg._tab = can.onappend.tabs(can, [{name: file.split(ice.PS).pop(), text: file}], function(event, meta) {
				can.onimport.tabview(can, path, file, "", cb, false, skip2), cb = null, skip2 = false
			}, function(item) { delete(can.tabview[key]) })
		}

		can.Option({path: path, file: file, line: line||1})
		line == ctx.INDEX? show(can.request({}, {index: file, line: line})): can.run({}, [path, file], show, true)
	},
	profile: function(can, msg) {
		var width = can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/2
		msg && can.onimport.process(can, msg, can.ui.profile_output, width-32)
		can.onmotion.hidden(can, can.ui.profile, true), can.onimport.layout(can)
	},
	display: function(can, msg) {
		var height = can.profile_size[can.onexport.keys(can)]||{sh: can.ConfHeight()/2}[can.parse]||can.ConfHeight()/4
		msg && can.onimport.process(can, msg, can.ui.display_output, can.ConfWidth())
		can.page.style(can, can.ui.display_output, html.MAX_HEIGHT, height)
		can.onmotion.hidden(can, can.ui.display, true), can.onimport.layout(can)
	},
	toolkit: function(can, meta, cb) {
		meta.opts = meta.opts||{repos: can.base.trimSuffix(can.base.trimPrefix(can.Option(nfs.PATH), "usr/"), ice.PS) }
		can.onimport.plugin(can, meta, can.ui.toolkit.output, function(sub) {
			sub.ConfHeight(can.ConfHeight()-4*html.ACTION_HEIGHT), sub.ConfWidth(can.ConfWidth())
			sub.page.style(sub, sub._output, html.MAX_HEIGHT, sub.ConfHeight())
			sub.page.style(sub, sub._output, html.MAX_WIDTH, sub.ConfWidth())
			sub.select = function() { return sub._legend.click(), sub }

			// var status = can.user.mod.isCmd? can._status: can.ui.toolkit.status
			var status = can._status
			status.appendChild(sub._legend), sub._legend.onclick = function(event) {
				if (can.page.Select(can, status, ice.PT+html.SELECT)[0] == event.target) {
					can.page.ClassList.del(can, event.target, html.SELECT)
					can.page.ClassList.del(can, sub._target, html.SELECT)
					return
				}
				can.onmotion.select(can, status, html.LEGEND, event.target)
				can.onmotion.select(can, can.ui.toolkit.output, html.FIELDSET, sub._target)
				can.onmotion.focus(can, can.page.Select(can, sub._option, html.OPTION_ARGS)[0])
			}, can.base.isFunc(cb) && cb(sub)
		})
	},
	process: function(can, msg, target, width) {
		can.user.toastSuccess(can)
		can.onmotion.clear(can, target)
		if (msg.Option("_process") == "_field") {
			msg.Table(function(meta) { meta.display = msg.Option("_display")
				// delete(Volcanos.meta.cache[meta.display])
				can.onimport.plugin(can, meta, target, function(sub) {
					can.onmotion.focus(can, can.page.Select(can, sub._option, html.OPTION_ARGS)[0])
					width && sub.ConfWidth(width)
				})
			})
		} else {
			can.onappend.table(can, msg, null, target)
			can.onappend.board(can, msg.Result(), target)
		}
	},
	plugin: function(can, meta, target, cb) {
		can.onappend.plugin(can, meta, function(sub) {
			sub.run = function(event, cmds, cb) { can.request(event, can.Option())
				can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, meta.index], cmds), cb, true)
			}, can.base.isFunc(cb) && cb(sub)
		}, target)
	},
	layout: function(can) { var height = can.ConfHeight(), width = can.ConfWidth()
		can.page.styleWidth(can, can.ui.profile_output, can.profile_size[can.onexport.keys(can)]||(width-can.ui.project.offsetWidth)/2)
		can.page.styleWidth(can, can.ui.content, width-can.ui.project.offsetWidth-can.ui.profile.offsetWidth-26)

		if (!height) { return }
		can.page.style(can, can.ui.content, can.user.mod.isCmd? html.HEIGHT: html.MAX_HEIGHT, height)
		if (can.ui.project.style.display != html.NONE) {
			can.page.styleHeight(can, can.ui.project, can.ui.content.offsetHeight)
		}
		if (can.user.mod.isCmd) {
			can.page.styleHeight(can, can.ui.content, (can.ui.project.offsetHeight||height)
				-can.ui.display.offsetHeight-(can.ui.display.style.display != html.NONE && can.ui.display_status.innerText? html.ACTION_HEIGHT: 0))
		}

		if (can.page.ClassList.has(can, can._fields, "full")) {
			can.page.styleHeight(can, can.ui.profile_output, can.ui.content.offsetHeight)
		} else {
			can.page.styleHeight(can, can.ui.profile_output, can.ui.content.offsetHeight-html.ACTION_HEIGHT-2)
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
	exts: function(can, url, cb) {
		can.require([url], function() {}, function(can, name, sub) { sub._init(can, can.base.ParseURL(sub._path), function(sub) {
			can.extentions[url.split("?")[0]] = sub, can.base.isFunc(cb) && cb(sub)
		}) })
	},
	sess: function(can, sess, cb) { sess = sess||can.base.Obj(localStorage.getItem("web.code.inner.sess"), {})
		can.core.Next(sess.plug, function(item, next) { can.onimport.toolkit(can, {index: item}, function(sub) { can.toolkit[item] = sub, next() }) }, function() {
			can.core.Next(sess.exts, function(item, next) { can.onimport.exts(can, item, next) }, function() {
				can.core.Next(sess.tabs, function(item, next) { var ls = item.split(ice.DF); can.onimport.tabview(can, ls[0], ls[1], ls[2], next) }, cb)
			})
		})
	},
}, [""])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg, cb, skip) {
		if (can.onmotion.cache(can, function(cache_data) {
			can.file && (cache_data[can.file] = {current: can.current, max: can.max,
				profile_display: can.ui.profile.style.display, display_display: can.ui.display.style.display,
			})
			can.file = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
			can.parse = can.base.Ext(can.file), can.Status("模式", "plugin")

			var p = cache_data[can.file]; p && (can.current = p.current, can.max = p.max)
			can.page.Modify(can, can.ui.profile, {style: {display: p? p.profile_display: html.NONE}})
			can.page.Modify(can, can.ui.display, {style: {display: p? p.display_display: html.NONE}})
			can.onmotion.select(can, can._action, html.DIV_TABS, msg._tab)
			can.onmotion.delay(can, function() { can.onimport.layout(can)
				msg.Option(ctx.INDEX) && can.onmotion.focus(can, can.page.Select(can, can.ui.content, html.OPTION_ARGS)[0])
			})
			return can.file
		}, can.ui.content, can.ui.profile_output, can.ui.display_output) && !skip) {
			return can.onaction.selectLine(null, can, msg.Option(nfs.LINE)), can.base.isFunc(cb) && cb()
		}

		if (msg.Option(ctx.INDEX)) {
			can.onimport.plugin(can, {index: msg.Option(ctx.INDEX)}, can.ui.content, function(sub) {
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
			msg.Option(nfs.FILE).indexOf("website/") == 0 && can.onaction["展示"]({}, can)
			p && p.render && can.onaction["展示"]({}, can)
			p && p.engine && can.onaction["执行"]({}, can)
		}

		var p = can.onsyntax[can.parse]; !p? can.run({}, [ctx.ACTION, mdb.PLUGIN, can.parse, msg.Option(nfs.FILE), msg.Option(nfs.PATH)], function(msg) {
			init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
		}, true): init(p)
	},
	_parse: function(can, line) { if (line.indexOf("<html") == 0) { return line }
		line = can.page.replace(can, line||"")

		function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }
		var p = can.onsyntax[can.parse]; if (!p) { return line } p = can.onsyntax[p.link]||p, p.split = p.split||{}
		p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||ice.SP, p.split.operator||"{[(|)]}", {detail: true}), function(item, index, array) {
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
Volcanos("onkeymap", {help: "导入数据", _init: function(can, msg, cb, target) {
	},
	_plugin: function(event, can) {},
	_normal: function(event, can) {},
	_insert: function(event, can) {},
	_mode: {
		plugin: {
			Escape: function(event, can) { can.actions(event, "清屏") },
			g: function(event, can) { can.actions(event, "搜索") },
			f: function(event, can) { can.actions(event, "打开") },
			t: function(event, can) { can.actions(event, "添加") },
			p: function(event, can) { can.actions(event, "插件") },
			e: function(event, can) { can.actions(event, "扩展") },

			m: function(event, can) { can.actions(event, "autogen") },
			c: function(event, can) { can.actions(event, "compile") },
			w: function(event, can) { can.actions(event, "website") },

			r: function(event, can) { can.actions(event, "执行") },
			v: function(event, can) { can.actions(event, "展示") },
			// s: function(event, can) { can.actions(event, "保存") },
			a: function(event, can) { can.actions(event, "全屏") },

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
Volcanos("onaction", {help: "控件交互", list: ["搜索", "打开", "添加", "插件", "扩展"],
	_trans: {width: "宽度", height: "高度", website: "网页"},
	"加载": function(event, can) {
		var file = "/require/shylinux.com/x/contexts/"+can.Option(nfs.PATH)+can.Option(nfs.FILE)
		delete(Volcanos.meta.cache[file]), eval(`\n_can_name = "`+file+`"\n`+can.onexport.content(can)+`\n_can_name = ""\nconsole.log("once")`)
	},
	"刷新": function(event, can) { can.onimport.tabview(can, "src/", "main.go", "", function() {}, skip) },
	"搜索": function(event, can) {
		can.user.input(event, can, [mdb.NAME, [ctx.ACTION, nfs.TAGS, nfs.GREP, cli.MAKE]], function(event, button, data) {
			can.ui.search.Update({}, [ctx.ACTION, data.action, data.name])
		})
	},
	"打开": function(event, can) {
		can.user.input(event, can, [nfs.FILE], function(event, button, data) {
			can.onimport.tabview(can, can.Option(nfs.PATH), data.file)
		})
	},
	"添加": function(event, can) {
		can.user.input(event, can, [ctx.INDEX], function(event, button, data) {
			can.onimport.tabview(can, can.Option(nfs.PATH), data.index, ctx.INDEX)
		})
	},
	"插件": function(event, can) {
		can.user.input(event, can, [ctx.INDEX], function(event, button, data) {
			var sub = can.toolkit[data.index]; if (sub) { sub.select(); return }
			can.onimport.toolkit(can, data, function(sub) { can.toolkit[data.index] = sub.select() })
		})
	},
	"扩展": function(event, can) {
		can.user.input(event, can, ["url"], function(event, button, data) {
			var sub = can.extentions[data.url]; if (sub) { sub.select(); return }
			can.onimport.exts(can, data.url, function(sub) { can.extentions[data.url] = sub.select() })
		})
	},
	"保存": function(event, can) { can.onexport.sess(can), can.user.toastSuccess(can) },
	"项目": function(event, can) { can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can) },
	"工具": function(event, can) { can.onmotion.toggle(can, can.ui.toolkit.fieldset) },
	"执行": function(event, can) { can.onimport.display(can), can.request(event, {_toast: "执行中..."})
		can.run(event, [ctx.ACTION, mdb.ENGINE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.ui.display_status)
			can.onimport.display(can, msg), can.onimport.layout(can) 
		}, true)
	},
	"展示": function(event, can) { can.onimport.profile(can), can.request(event, {_toast: "渲染中..."})
		if (can.Option(nfs.FILE).indexOf("website/") == 0) {
			can.profile_size[can.onexport.keys(can)] = can.profile_size[can.onexport.keys(can)] || can.ConfWidth()*parseInt(70)/100
		}
		can.parse == "js" && can.onaction["加载"](event, can)
		can.run(event, [ctx.ACTION, mdb.RENDER, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onimport.profile(can, msg)
		}, true)
	},
	"清屏": function(event, can) {
		if (can.page.Select(can, document.body, ".input.float", function(item) {
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
		if (can.page.ClassList.neg(can, can._fields, "full")) {
			can.onmotion.hidden(can, can.ui.project)
			can.ConfHeight(window.innerHeight)
		} else {
			can.onmotion.hidden(can, can.ui.project, true)
			can.ConfHeight(window.innerHeight-2*html.ACTION_HEIGHT)
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

			{view: [html.TEXT, html.TD], list: [can.onsyntax._parse(can, value)], onclick: function(event) {
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
	selectLine: function(event, can, line) { if (!line) { return parseInt(can.core.Value(can.page.Select(can, can.ui.content, [[[html.TR, html.SELECT], [html.TD, "line"]]])[0], "innerText")) }
		can.page.Select(can, can.ui.content, html.TR, function(item, index, array) { if (line < 0 || line > array.length) { return }
			if (!can.page.ClassList.set(can, item, html.SELECT, item == line || index+1 == line)) { return }
			line = item, can.Status(kit.Dict("文件名", can.file, "解析器", can.parse, "当前行", can.onexport.position(can, can.Option(nfs.LINE, index+1))))
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
		})
	},
	_selectLine: function(event, can) { },
	searchLine: function(event, can, value) { if (!can.ui.search) { return }
		can.ui.search.Update(event, [ctx.ACTION, nfs.TAGS, value.trim()])
	},
	favorLine: function(can, value) {
		can.user.input(event, can, [{name: "zone", value: "hi"}, {name: "name", value: "hello"}], function(event, button, data) {
			can.run(event, [ctx.ACTION, code.FAVOR, ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
				mdb.TYPE, can.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
				nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
			], function(msg) { can.user.toastSuccess(can) }, true)
		})
	},
})
Volcanos("onexport", {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
	sess: function(can) {
		localStorage.setItem("web.code.inner.sess", JSON.stringify({
			"tabs": can.onexport.tabs(can), "plug": can.onexport.plug(can), "exts": can.onexport.exts(can),
		}))
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

