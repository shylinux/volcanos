Volcanos(chat.ONIMPORT, {help: "导入数据",
	_tabs: function(can) {
		can.ui._tabs = can.page.insertBefore(can, ["tabs"], can.ui._content)
		can.ui._path = can.page.insertBefore(can, ["path"], can.ui._content)
	},

	project: function(can, path) {
		can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
			return can.base.isFunc(cb)? {name: name, _init: function(target, zone) { return cb(can, target, zone, path) }}: undefined
		}), can.ui.project), can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
	},
	tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		function isCommand() { return path == ctx.COMMAND || line == ctx.INDEX }
		function isDream() { return line == web.DREAM }

		function show() { if (can.isCmdMode()) { can.onimport._title(can, path+file) }
			can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.tabview[key]
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can._msg.Option(nfs.LINE)||1}))
			if (isCommand()||isDream()) { can._msg.Option(ctx.INDEX, file) }
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg
				can.ui._path && (can.ui._path.innerHTML = isDream()? can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)})):
					isCommand()? can.Option(nfs.FILE): can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)))
				can.ui.current && can.onmotion.toggle(can, can.ui.current, !isCommand() && !isDream())

				can.page.Select(can, can.ui._content.parentNode, can.page.Keys(html.DIV_CONTENT, html.IFRAME), function(item) {
					if (can.onmotion.toggle(can, item, item == msg._content)) { can.ui.content = msg._content }
				}), can.ui.content._plugin = msg._plugin
				can.page.Select(can, can.ui._profile_output.parentNode, can.page.Keys(html.DIV_OUTPUT, html.IFRAME), function(item) {
					if (can.onmotion.toggle(can, item, item == msg._profile_output)) { can.ui.profile_output = msg._profile_output }
				})
				can.onexport.hash(can), can.onimport.layout(can), can.base.isFunc(cb) && cb(), cb = null
				msg._plugin && can.onmotion.delay(can, function() { msg._plugin.Focus() })
				can.onengine.signal(can, "tabview.view.show", msg)
			})
		}
		function load(msg) { can.tabview[key] = msg
			can.onimport.tabs(can, [{name: file.split(isCommand()? ice.PT: ice.PS).pop(), text: file}], function(event) {
				can._tab = msg._tab = event.target, show()
			}, function(item) { delete(can.tabview[key])
				can.onengine.signal(can, "tabview.view.delete", msg)
				delete(can._cache_data[can.base.Path(path, file)])
				delete(can.ui._content._cache[can.base.Path(path, file)])
				delete(can.ui._profile_output._cache[can.base.Path(path, file)])
				delete(can.ui.display_output._cache[can.base.Path(path, file)])
				msg._content != can.ui._content && can.page.Remove(can, msg._content)
			}, can.ui._tabs)
		}

		if (can.tabview[key]) {
			return can.isCmdMode() && !can._msg._tab? load(can.tabview[key]): show()
		}
		isCommand()||isDream()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, push) {
		can.base.Eq(push, can.history[can.history.length-1]) || can.history.push(push)
		return can.Status("跳转数", can.history.length), push
	},
}, [""])
Volcanos(chat.ONFIGURE, {help: "索引导航", 
	source: function(can, target, zone, path) { var total = 0
		function show(path, target) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [ice.PWD], function(msg) { var list = msg.Table()
			can.core.List(list, function(item) { if (can.Option(nfs.FILE).indexOf(item.path) == 0) { item.expand = true } })
			can.onimport.tree(can, list, nfs.PATH, ice.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target)
			can.Status("文件数", total += msg.Length()), zone._total(total)
		}, true) }

		if (path.length == 1) { return show(path[0], target) }
		can.onmotion.delay(can, function() { target.previousSibling.innerHTML = "" })
		can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(target) { show(path, target) }} }), target)
	},
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.Item(can.onengine.plugin.meta, function(key) { return total++, {index: can.base.trimPrefix(key, "can.")} }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys("can", item.index), ctx.INDEX)
		}, target), zone._total(total)
	},
})
Volcanos(chat.ONSYNTAX, {help: "语法高亮", _init: function(can, msg, cb) {
		if (can.onmotion.cache(can, function(cache_data) {
			can.file && (cache_data[can.file] = {current: can.current, max: can.max,
				profile_display: can.ui.profile.style.display, display_display: can.ui.display.style.display,
			})
			can.file = can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE))
			var p = cache_data[can.file]; p && (can.current = p.current, can.max = p.max)
			can.page.style(can, can.ui.profile, {display: p? p.profile_display: html.NONE})
			can.page.style(can, can.ui.display, {display: p? p.display_display: html.NONE})
			can.parse = can.base.Ext(can.file), can.Status("模式", "plugin")
			can.onengine.signal(can, "tabview.data.load", msg)
			return can.file

		}, can.ui._content, can.ui._profile_output, can.ui.display_output)) {
			can.onengine.signal(can, "tabview.view.load", msg)
			return can.onaction.selectLine(null, can, can.Option(nfs.LINE)), can.base.isFunc(cb) && cb(msg._content)
		}

		if (msg.Option(ctx.INDEX)) { return can.onsyntax._index(can, msg, cb) }

		function init(p) {
			can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
			can.onaction.selectLine(null, can, can.Option(nfs.LINE)), can.onengine.signal(can, "tabview.view.init", msg)
			can.base.isFunc(cb) && cb(msg._content = can.ui._content)
		}
		can.require(["inner/syntax.js"], function() { can.Conf("plug") && (can.onsyntax[can.parse] = can.Conf("plug"))
			var p = can.onsyntax[can.parse]; !p? can.runAction({}, mdb.PLUGIN, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
				init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
			}): init(p)
		})
	},
	_index: function(can, msg, cb) {
		if (can.Option(nfs.LINE) == web.DREAM) {
			return can.base.isFunc(cb) && cb(msg._content = msg._content||can.page.insertBefore(can, [{type: html.IFRAME,
				src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), style: {height: can.ui.content.offsetHeight-4, width: can.ui.content.offsetWidth}}], can.ui._content))
		}

		return can.onimport.plug(can, {index: msg.Option(ctx.INDEX), args: can.Option(nfs.PATH) == ctx.COMMAND && can.Option(nfs.LINE) != ctx.INDEX? [can.Option(nfs.LINE)]: []}, can.ui._content, function(sub) {
			can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(can.ui.content.offsetHeight-2*html.ACTION_HEIGHT))
			can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth(can.ui.content.offsetWidth))
			msg._plugin = sub, can.base.isFunc(cb) && cb(msg._content = can.ui._content)
			can.onmotion.delay(can, function() { sub.Focus() })

			sub.onaction.close = function() { can.onaction.back({}, can), msg._tab._close() }
			sub.onimport._open = function(sub, msg, _arg) { var url = can.base.ParseURL(_arg), ls = url.origin.split("/chat/pod/")
				if (_arg.indexOf(location.origin) == 0 && ls.length > 1) {
					return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1].split(ice.PS)[0], web.DREAM), sub.Update()
				}
				return can.user.open(_arg), sub.Update()
			}
		})
	},
	_parse: function(can, line) { line = can.page.replace(can, line||"")
		function wrap(type, str) { return can.page.Format(html.SPAN, str, type) }
		var p = can.onsyntax[can.parse]; if (!p) { return line } p = can.onsyntax[p.link]||p, p.split = p.split||{}
		p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||"\t ", p.split.operator||"{[(,:;!|<*>)]}", {detail: true}), function(item, index, array) {
			item = can.base.isObject(item)? item: {text: item}; var text = item.text, type = p.keyword[text]
			switch (item.type||type) {
				case html.SPACE: return text
				case lang.STRING: return wrap(lang.STRING, item.left+text+item.right)
				case code.COMMENT:
				case code.KEYWORD:
				case code.CONSTANT:
				case code.DATATYPE:
				case code.FUNCTION: return wrap(type, text)
				default:
					var t = can.core.Item(p.regexp, function(reg, type) {
						var m = text.match(new RegExp(reg)); if (m && m.length > 0 && m[0] == text) { return type}
					}); if (t && t.length > 0) { return wrap(t[0], text) }
					return text
			}
		}).join(""))
		p.prefix && can.core.Item(p.prefix, function(pre, type) { if (can.base.beginWith(line, pre)) { line = wrap(type, line) } })
		p.suffix && can.core.Item(p.suffix, function(end, type) { if (can.base.endWith(line, end)) { line = wrap(type, line) } })
		return line
	},
})
Volcanos(chat.ONACTION, {help: "控件交互", list: [],
	appendLine: function(can, value) {
		var ui = can.page.Append(can, can.ui._content, [{type: html.TR, list: [
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
				for (var i = begin; i >= 0; i--) { if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break } }
				can.onaction.searchLine(event, can, s)
			}}
		]}]); return ui.tr
	},
	selectLine: function(event, can, line) { if (!line) { return parseInt(can.core.Value(can.page.Select(can, can.ui._content, [[[html.TR, html.SELECT], [html.TD, "line"]]])[0], "innerText")) }
		can.page.Select(can, can.ui._content, html.TR, function(item, index, array) {
			if (!can.page.ClassList.set(can, item, html.SELECT, item == line || index+1 == line)) { return }
			var ls = can.file.split(ice.PS); if (ls.length > 4) { ls = [ls.slice(0, 2).join(ice.PS)+"/.../"+ls.slice(-2).join(ice.PS)] }
			line = item, can.Status(kit.Dict("文件名", ls.join(ice.PS), "解析器", can.parse, "当前行", can.onexport.position(can, can.Option(nfs.LINE, index+1))))
		})
		; if (!can.base.isObject(line)) { return 1 }

		can.page.Select(can, line, "td.text", function(item) {
			can.current = {
				window: function() { return parseInt(can.ui._content.offsetHeight/can.current.line.offsetHeight) },
				scroll: function(count) { if (count) { can.ui._content.scrollTop += count*can.current.line.offsetHeight }
					return parseInt((can.current.line.offsetTop-can.ui._content.scrollTop)/can.current.line.offsetHeight)
				},
				line: line, text: function(text) { return text != undefined && can.onaction.modifyLine(can, line, text), item.innerText },
				prev: function() { return line.previousSibling }, next: function() { return line.nextSibling },
			}

			var scroll = can.current.scroll(); if (scroll < 3) { can.current.scroll(scroll-3) } else {
				var window = can.current.window(); if (scroll > window-4) { can.current.scroll(scroll-window+4) }
			}

			can.onimport.history(can, {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)})
			can.onexport.hash(can), can.onengine.signal(can, "tabview.line.select", can.request(event))
		}); return parseInt(can.page.Select(can, line, "td.line")[0].innerText)
	},
	searchLine: function(event, can, value) {
		can.runAction(can.request(event, {name: value, text: can.current.text()}, can.Option()), code.NAVIGATE, [], function(msg) {
			msg.Append(nfs.FILE)? can.onimport.tabview(can, msg.Append(nfs.PATH), msg.Append(nfs.FILE), msg.Append(nfs.LINE)):
				can.user.toast(can, "not found")
		})
	},
	favorLine: function(can, value) {
		can.user.input(event, can, [{name: "zone", value: "hi"}, {name: "name", value: "hello"}], function(data) {
			can.runAction(event, code.FAVOR, [ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
				mdb.TYPE, can.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
				nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
			], function() { can.user.toast(can, ice.SUCCESS) })
		})
	},

	back: function(event, can) { can.history.pop(); var last = can.history.pop()
		last && can.onimport.tabview(can, last.path, last.file, last.line)
		can.Status("跳转数", can.history.length)
	},
})
Volcanos(chat.ONENGINE, {help: "搜索引擎",
	listen: shy("监听事件", function(can, name, cb) { arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb) }),
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
	keys: function(can, path, file, line) {
		return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(ice.DF)
	},
	hash: function(can) { if (!can.isCmdMode()) { return }
		var list = []; if (can.Option(nfs.PATH) != can.misc.Search(can, nfs.PATH)) { list.push(can.Option(nfs.PATH)) }
		if (list.length > 0 || can.Option(nfs.FILE) != can.misc.Search(can, nfs.FILE)) { list.push(can.Option(nfs.FILE)) }
		if (list.length > 0 || can.Option(nfs.LINE) != can.misc.Search(can, nfs.LINE)) { list.push(can.Option(nfs.LINE)||1) }
		location.hash = list.join(ice.FS)
	},
	content: function(can) { return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL) },
	position: function(can, index, total) { total = total||can.max; return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
})

Volcanos(chat.ONIMPORT, {help: "导入数据",
	_profile: function(can, target) {
		var ui = can.onimport._panel(can, target, kit.Dict(
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
			html.WIDTH, function(event) {
				can.user.input(event, can, [{name: html.WIDTH, value: can.profile_size[can.onexport.keys(can)]*100/can.ConfWidth()||50}], function(list) {
					can.profile_size[can.onexport.keys(can)] = can.ConfWidth()*parseInt(list[0])/100
					can.onaction[cli.SHOW](event, can)
				})
			},
		)); can.ui.profile_output = ui.output
	},
	_display: function(can, target) {
		var ui = can.onimport._panel(can, target, kit.Dict(
			cli.SHOW, function(event) { can.onaction[cli.EXEC](event, can) },
			html.HEIGHT, function(event) {
				can.user.input(event, can, [{name: html.HEIGHT, value: can.display_size[can.onexport.keys(can)]*100/can.ConfHeight()||50}], function(list) {
					can.display_size[can.onexport.keys(can)] = can.ConfHeight()*parseInt(list[0])/100
					can.onaction[cli.EXEC](event, can)
				})
			}
		)); can.ui.display_output = ui.output, can.ui.display_status = ui.status
	},
	profile: function(can, msg) {
		if (msg) {
			var sup = can.tabview[can.onexport.keys(can)]
			can.onmotion.toggle(can, can.ui.profile_output, false)
			if (msg.Result().indexOf("<iframe") > -1) {
				var width = can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/4*3
				if (sup._profile_output != can.ui._profile_output) { can.page.Remove(can, sup._profile_output) }
				can.ui.profile_output = sup._profile_output = can.page.Append(can, can.ui._profile_output.parentNode, [{view: html.OUTPUT, inner: msg.Result()}]).output
				can.profile_size[can.onexport.keys(can)] = width
			} else {
				var width = can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/2
				can.ui.profile_output = sup._profile_output = can.ui._profile_output
				can.onimport.process(can, msg, can.ui._profile_output, width, can.ui.profile.offsetHeight)
				can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.page.Append(can, can.ui._profile_output, [html.STATUS]).first)
				can.page.Select(can, can.ui._profile_output, "table.content", function(target) { can.page.style(can, target, html.MAX_HEIGHT, "1000px") })
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
			msg.Table(function(item) { item.display = msg.Option(ice.MSG_DISPLAY)
				can.onimport.plug(can, item, target, function(sub) { width && sub.ConfWidth(width), height && sub.ConfHeight(height), sub.Focus() })
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), target, false, function(msg) { can.onmotion.delay(can, function() { can.onimport.layout(can) }) })
		} else {
			can.onappend.table(can, msg, null, target), can.onappend.board(can, msg, target)
		}
	},
}, [""])
Volcanos(chat.ONACTION, {help: "控件交互", _trans: {link: "链接", width: "宽度", height: "高度"},
	"搜索": function(event, can) {
		can.user.input(event, can, [mdb.NAME, [ctx.ACTION, nfs.TAGS, nfs.GREP, cli.MAKE]], function(data) {
			can.ui.search.Update({}, [ctx.ACTION, data.action, data.name])
		})
	},
	"打开": function(event, can) {
		can.user.input(event, can, [nfs.FILE], function(list) { can.onimport.tabview(can, can.Option(nfs.PATH), list[0]) })
	},
	show: function(event, can) { can.request(event, {_toast: "渲染中..."})
		if (can.base.endWith(can.Option(nfs.FILE), ".js")) {
			var file = can.base.Path("/require/", can.Option(nfs.PATH), can.Option(nfs.FILE))
			delete(Volcanos.meta.cache[file]), eval("\n_can_name = \""+file+"\"\n"+can.onexport.content(can)+"\n_can_name = \"\"\nconsole.log(\"once\")")
		}
		can.runAction(event, mdb.RENDER, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
			can.onimport.profile(can, msg)
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
	listTags: function(event, can, button) { var list = []
		can.core.Item(can.request(event), function(key, value) { if (key.indexOf("_") == 0) { return }
			list.push({zone: "msg", type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0],
				path: "usr/volcanos/", file: "lib/misc.js", line: 1,
			})
		})
		can.core.List([can.base, can.core, can.misc, can.page, can.user, can.onengine, can.ondaemon, can.onappend, can.onlayout, can.onmotion, can.onkeymap], function(lib) {
			can.core.Item(lib, function(key, value) { if (key.indexOf("_") == 0 || !lib.hasOwnProperty(key)) { return }
				list.push({zone: lib._name, type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0],
					path: "usr/volcanos/", file: lib._path, line: 1,
				})
			})
		})
		can.runAction(can.request(event, {text: can.base.Format(list)}), button)
	},
})
Volcanos(chat.ONIMPORT, {help: "导入数据",
	_keydown: function(can) { can.onkeymap._build(can)
		can.isCmdMode() && can._root.onengine.listen(can, chat.ONKEYDOWN, function(event) {
			can._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can._key_list, can.ui.content)
		})
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

Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.page.ClassList.add(can, can._fields, code.INNER)
		can.onmotion.clear(can), can.onlayout.profile(can)
		can.onimport._profile(can, can.ui.profile)
		can.onimport._display(can, can.ui.display)
		if (msg.Result() == "" && can.Option(nfs.LINE) == "1") { return }

		if (msg.Option(nfs.FILE)) {
			msg.Option(nfs.PATH) && can.Option(nfs.PATH, msg.Option(nfs.PATH))
			can.Option(nfs.FILE, msg.Option(nfs.FILE))
			msg.Option(nfs.LINE) && can.Option(nfs.LINE, msg.Option(nfs.LINE))
		}

		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		can.core.List(paths.concat(msg.modules||[], can.sup.paths||[]), function(p) { if (paths.indexOf(p) == -1) { paths.push(p) } })
		can.sup.paths = paths

		can.ui._content = can.ui.content, can.ui._profile_output = can.ui.profile_output
		can.tabview = can.tabview||{}, can.history = can.history||[], can.toolkit = {}, can.extentions = {}
		can.profile_size = {}, can.display_size = {}

		switch (can.Mode()) {
			case "simple": can.onmotion.hidden(can, can.ui.project); break
			case "float": can.onmotion.hidden(can, can.ui.project); break
			case "cmd": can.onimport._tabs(can), can.onmotion.hidden(can, can._status) // no break
			case "full": // no break
			default: can.onimport.project(can, paths)
				can.onengine.listen(can, "tabview.view.init", function() { var p = can.onsyntax[can.parse]
					p && p.render && can.onaction[cli.SHOW]({}, can); if (can.page.ClassList.has(can, can._fields, chat.PLUGIN)) {
						p && p.engine && can.onaction[cli.EXEC]({}, can)
					}
				})
				can.onimport._keydown(can), can.onimport._toolkit(can, can.ui.toolkit), can.onimport._session(can, msg, function() {
					files.length > 1 && can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) {
						can.onimport.tabview(can, can.Option(nfs.PATH), file, can.Option(nfs.LINE), next)
					}, function() { can.onimport.tabview(can, paths[0], files[0], "") }) })
				})
		}

		var hash = location.hash; can.tabview[can.onexport.keys(can)] = msg
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() {
			if (can.isCmdMode() && hash) { var args = can.core.Split(decodeURIComponent(hash).slice(1))
				can.onmotion.delay(can, function() { can.onimport.tabview(can, args[args.length-3]||can.Option(nfs.PATH), args[args.length-2]||can.Option(nfs.FILE), args[args.length-1]) })
			}
		}), can.base.isFunc(cb) && cb(msg) 
	},
	_toolkit: function(can, target) {
		can.ui.toolkit = can.onappend.field(can, "toolkit", {}, can._output)
	},
	_session: function(can, msg) {
		can.onimport.sess(can, "", function() { can.onimport.sess(can, {
			exts: can.core.Split(msg.SearchOrOption("exts")).reverse(),
			plug: can.core.Split(msg.SearchOrOption("plug")).reverse(),
			tabs: can.core.Split(msg.SearchOrOption("tabs")),
		}) })
	},
	layout: function(can) {
		if (can.isSimpleMode()) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) }

		var width = can.ConfWidth()+(can.user.isMobile && can.isCmdMode() && can.user.isLandscape()? 16: 0)-(can.user.isWindows && !can.isCmdMode()? 20: 0)
		var project_width = can.ui.project.style.display == html.NONE? 0: (can.ui.project.offsetWidth||240)
		var profile_width = can.ui.profile.style.display == html.NONE? 0: can.profile_size[can.onexport.keys(can)]||(width-project_width)/2
		var content_width = width-project_width-profile_width
		can.page.styleWidth(can, can.ui.content, content_width)
		can.page.styleWidth(can, can.ui.profile_output, profile_width)
		can.page.styleWidth(can, can.ui.display_output, width-project_width)

		var height = can.user.isMobile && can.isFloatMode()? window.innerHeight-2*html.ACTION_HEIGHT: can.base.Min(can.ConfHeight(), 320)-1
		var display_height = can.ui.display.style.display == html.NONE? 0: (can.display_size[can.onexport.keys(can)]||120)
		if (can.isCmdMode()) { height += html.ACTION_HEIGHT
			var content_height = height-display_height - can.ui._tabs.offsetHeight - can.ui._path.offsetHeight - 4
			can.page.style(can, can._output, html.MAX_HEIGHT, "")
		} else {
			var content_height = height-display_height
		}

		var profile_height = height-html.ACTION_HEIGHT-display_height
		can.page.styleHeight(can, can.ui.profile_output, profile_height)
		can.page.styleHeight(can, can.ui.display_output, display_height)
		can.page.styleHeight(can, can.ui.content, content_height-(can.ui.content != can.ui._content? 4: 0))
		can.page.styleHeight(can, can.ui.project, height)

		can.page.Select(can, can.ui.profile, html.IFRAME, function(iframe) {
			can.page.Modify(can, iframe, {height: profile_height-html.ACTION_HEIGHT-4, width: profile_width})
		})
		var sub = can.ui.content._plugin; if (sub) {
			sub.ConfHeight(content_height-2*html.ACTION_HEIGHT), sub.ConfWidth(content_width)
			sub && sub.onaction.refresh({}, sub)
		}
	},
	toolkit: function(can, meta, cb) { meta.msg = true
		can.onimport.plug(can, meta, can.ui.toolkit.output, function(sub) {
			sub.ConfHeight(can.ConfHeight()/2), sub.ConfWidth(can.ConfWidth()-can.ui.project.offsetWidth)
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
Volcanos(chat.ONACTION, {help: "控件交互", list: [],
	sess: function(event, can) { can.onexport.sess(can), can.user.toastSuccess(can) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	sess: function(can) { can.user.localStorage(can, "web.code.inner.sess", {"plug": can.onexport.plug(can), "exts": can.onexport.exts(can), "tabs": can.onexport.tabs(can)}) },
	tabs: function(can) { return can.core.Item(can.tabview, function(key, msg) { return key+ice.DF+can.Option(nfs.LINE) }) },
	plug: function(can) { return can.core.Item(can.toolkit) },
	exts: function(can) { return can.core.Item(can.plugins) },
})
