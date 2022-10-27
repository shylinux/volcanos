Volcanos(chat.ONIMPORT, {help: "导入数据",
	_tabs: function(can) {
		can.ui._tabs = can.page.insertBefore(can, ["tabs"], can.ui._content)
		can.ui._path = can.page.insertBefore(can, ["path"], can.ui._content)
	},

	project: function(can, path) {
		can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
			if (can.base.isFunc(cb)) { return {name: name, _init: function(target, zone) { return cb(can, target, zone, path) }} }
		}), can.ui.project), can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
	},
	tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		function isCommand() { return path == ctx.COMMAND || line == ctx.INDEX || line == code.XTERM }
		function isDream() { return line == web.DREAM }

		function show(skip) { if (can.isCmdMode()) { can.onimport._title(can, path+file) }
			can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.tabview[key]
			
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can.misc.localStorage(can, "web.code.vimer:selectLine:"+path+file)||can._msg.Option(nfs.LINE)|| 1}))
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg
				can.onexport.hash(can), msg._tab && can.onmotion.select(can, msg._tab.parentNode, html.DIV_TABS, msg._tab)
				can.ui._path && (can.ui._path.innerHTML = isDream()? can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)})):
					isCommand()? can.Option(nfs.FILE): can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)))
				can.ui.current && can.onmotion.toggle(can, can.ui.current, !isCommand() && !isDream())

				can.page.Select(can, can.ui._content.parentNode, can.page.Keys(html.DIV_CONTENT, html.IFRAME), function(item) {
					if (item.parentNode != can.ui._content.parentNode) { return }
					if (can.onmotion.toggle(can, item, item == msg._content)) { can.ui.content = msg._content }
				}), can.ui.content._plugin = msg._plugin, msg._plugin && can.onmotion.delay(can, function() { msg._plugin.Focus() })

				can.page.Select(can, can.ui._profile_output.parentNode, can.page.Keys(html.DIV_OUTPUT, html.IFRAME), function(item) {
					if (item.parentNode != can.ui._profile_output.parentNode) { return }
					if (can.onmotion.toggle(can, item, item == msg._profile_output)) { can.ui.profile_output = msg._profile_output }
				})
				
				var ls = can.file.split(ice.PS); if (ls.length > 4) { ls = [ls.slice(0, 2).join(ice.PS)+"/.../"+ls.slice(-2).join(ice.PS)] }
				can.Status(kit.Dict("文件名", ls.join(ice.PS), "解析器", can.parse)), can.onimport.layout(can)
				skip || can.onaction.selectLine(can, can.Option(nfs.LINE)), can.base.isFunc(cb) && cb(), cb = null
			})
		}
		function load(msg) { can.tabview[key] = msg
			can.onimport.tabs(can, [{name: file.split(isCommand()? ice.PT: ice.PS).pop(), text: file}], function(event) {
				can._tab = msg._tab = event.target, show(true)
			}, function(item) { can.onengine.signal(can, "tabview.view.delete", msg)
				delete(can.tabview[key]), delete(can._cache_data[key]), delete(can.ui._content._cache[key])
				delete(can.ui._profile_output._cache[key]), delete(can.ui.display_output._cache[key])
				msg._content != can.ui._content && can.page.Remove(can, msg._content)
			}, can.ui._tabs)
		}

		if (can.tabview[key]) { return !can._msg._tab? load(can.tabview[key]): show() }
		isCommand()||isDream()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, record) {
		can.base.Eq(record, can.history[can.history.length-1]) || can.history.push(record)
		return can.Status("跳转数", can.history.length), record
	},
}, [""])
Volcanos(chat.ONFIGURE, {help: "索引导航", 
	source: function(can, target, zone, path) { var total = 0
		function show(target, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) { var list = msg.Table()
			can.onimport.tree(can, list, nfs.PATH, ice.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target)
			can.Status("文件数", zone._total(total += msg.Length()))
		}, true) }

		if (path.length == 1) { return show(target, path[0]) } can.page.Remove(can, target.previousSibling)
		can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(target) { show(target, path) }} }), target)
	},
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.Item(can.onengine.plugin.meta, function(key) { return total++, {index: key} }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys("can", item.index), ctx.INDEX)
		}, target), zone._total(total)
	},
})
Volcanos(chat.ONSYNTAX, {help: "语法高亮", _init: function(can, msg, cb) {
		if (can.onmotion.cache(can, function(cache_data) {
			can.file && (cache_data[can.file] = {current: can.current, max: can.max, profile_display: can.ui.profile.style.display, display_display: can.ui.display.style.display})
			can.file = can.onexport.keys(can, can.Option(nfs.PATH), can.Option(nfs.FILE))
			var p = cache_data[can.file]; if (p) { can.current = p.current, can.max = p.max }
			can.page.style(can, can.ui.profile, html.DISPLAY, p? p.profile_display: html.NONE)
			can.page.style(can, can.ui.display, html.DISPLAY, p? p.display_display: html.NONE)
			can.parse = can.base.Ext(can.file), can.Status("模式", "plugin")
			return can.file
		}, can.ui._content, can.ui._profile_output, can.ui.display_output)) {
			return can.base.isFunc(cb) && cb(msg._content)
		}

		if (msg.Option(ctx.INDEX)) { return can.onsyntax._index(can, msg, cb) }

		function init(p) {
			can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
			can.onaction.selectLine(can, can.Option(nfs.LINE)), can.current.scroll(can.current.scroll()-can.current.window()/2)
			can.onengine.signal(can, "tabview.view.init", msg), can.base.isFunc(cb) && cb(msg._content = can.ui._content)
		}
		can.require(["inner/syntax.js"], function() { can.Conf("plug") && (can.onsyntax[can.parse] = can.Conf("plug"))
			var p = can.onsyntax[can.parse]; !p? can.runAction({}, mdb.PLUGIN, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
				init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()||"{}"))
			}): init(p)
		})
	},
	_index: function(can, msg, cb) {
		if (can.Option(nfs.LINE) == web.DREAM) {
			return can.base.isFunc(cb) && cb(msg._content = msg._content||can.page.insertBefore(can, [{type: html.IFRAME,
				src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), height: can.ui.content.offsetHeight-4, width: can.ui.content.offsetWidth}], can.ui._content))
		}
		
		var meta = {index: msg.Option(ctx.INDEX), args: can.Option(nfs.PATH) == ctx.COMMAND && can.Option(nfs.LINE) != ctx.INDEX? [can.Option(nfs.LINE)]: []}
		if (can.Option(nfs.LINE) == code.XTERM) {
			meta = {index: "web.code.xterm", args: can.Option(nfs.FILE)}
		} else {
			can.onimport.layout(can)
		}

		return can.onimport.plug(can, meta, function(sub) {
			sub.onimport.size(sub, sub.ConfHeight(can.ui.content.offsetHeight-html.ACTION_HEIGHT-sub.onexport.statusHeight(sub)), sub.ConfWidth(can.ui.content.offsetWidth), true)
			msg._plugin = sub, can.base.isFunc(cb) && cb(msg._content = can.ui._content), can.onmotion.delay(can, function() { sub.Focus() })
			sub.onaction.close = function() { can.onaction.back(can), msg._tab._close() }
			sub.onimport.title = function(_, title) { can.page.Modify(can, msg._tab, title) }
			sub.onimport._open = function(sub, msg, _arg) { var url = can.base.ParseURL(_arg), ls = url.origin.split("/chat/pod/")
				if (_arg.indexOf(location.origin) == 0 && ls.length > 1) {
					return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1].split(ice.PS)[0], web.DREAM), sub.Update()
				}
				return can.user.open(_arg), sub.Update()
			}
		}, can.ui._content)
	},
	_parse: function(can, line) { line = can.page.replace(can, line||"")
		function wrap(text, type) { return can.page.Format(html.SPAN, text, type) }
		var p = can.onsyntax[can.parse]; p = can.onsyntax[p.link]||p, p.split = p.split||{}
		p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||"\t ", p.split.operator||"{[(,:;!?|<*>)]}", {detail: true}), function(item, index, array) {
			item = can.base.isObject(item)? item: {text: item}; var text = item.text, type = p.keyword[text]
			switch (item.type||type) {
				case html.SPACE: return text
				case lang.STRING: return wrap(item.left+text+item.right, lang.STRING)
				case code.COMMENT:
				case code.KEYWORD:
				case code.CONSTANT:
				case code.DATATYPE:
				case code.FUNCTION: return wrap(text, type)
				default:
					var t = can.core.Item(p.regexp, function(reg, type) { var m = text.match(new RegExp(reg)); if (m && m.length > 0 && m[0] == text) { return type} })
					return t && t.length > 0? wrap(text, t[0]): text
			}
		}).join(""))
		p.prefix && can.core.Item(p.prefix, function(pre, type) { if (can.base.beginWith(line, pre)) { line = wrap(line, type) } })
		p.suffix && can.core.Item(p.suffix, function(end, type) { if (can.base.endWith(line, end)) { line = wrap(line, type) } })
		return line
	},
})
Volcanos(chat.ONENGINE, {help: "搜索引擎",
	listen: shy("监听事件", function(can, key, cb) { arguments.callee.meta[key] = (arguments.callee.meta[key]||[]).concat(cb) }),
})
Volcanos(chat.ONACTION, {help: "控件交互",
	appendLine: function(can, value) {
		var ui = can.page.Append(can, can.ui._content, [{type: html.TR, list: [
			{view: ["line unselectable", html.TD, ++can.max], onclick: function(event) {
				can.onaction.selectLine(can, ui.tr)
			}, ondblclick: function(event) {
				can.onaction.favorLine(event, can, ui.text.innerText)
			}},
			{view: [html.TEXT, html.TD, can.onsyntax._parse(can, value)], onclick: function(event) {
				can.onaction.selectLine(can, ui.tr)
			}, ondblclick: function(event) {
				var s = document.getSelection().toString(), str = ui.text.innerText, begin = str.indexOf(s), end = begin+s.length
				for (var i = begin; i >= 0; i--) { if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break } }
				can.onaction.searchLine(event, can, s)
			}}
		]}]); return ui.tr
	},
	selectLine: function(can, line) {
		if (!line) { return can.onexport.line(can, can.page.Select(can, can.ui._content, "tr.select")[0]) }
		can.page.Select(can, can.ui._content, "tr>td.line", function(td, index) { var tr = td.parentNode, n = parseInt(td.innerText)
			if (!can.page.ClassList.set(can, tr, html.SELECT, tr == line || n == line)) { return }
			line = tr, can.Status("当前行", can.onexport.position(can, can.Option(nfs.LINE, n)))
		}); if (!can.base.isObject(line)) { return 0 }

		can.page.Select(can, line, "td.text", function(item) {
			can.current = {
				window: function() { return parseInt(can.ui._content.offsetHeight/can.current.line.offsetHeight) },
				scroll: function(count) { if (count) { can.ui._content.scrollTop += count*can.current.line.offsetHeight }
					return parseInt((can.current.line.offsetTop-can.ui._content.scrollTop)/can.current.line.offsetHeight)
				}, prev: function() { return line.previousSibling }, next: function() { return line.nextSibling },
				line: line, text: function(text) { return text != undefined && can.onaction.modifyLine(can, line, text), item.innerText },
			}
			var scroll = can.current.scroll(); if (scroll < 3) { can.current.scroll(scroll-3) } else {
				var window = can.current.window(); if (scroll > window-3) { can.current.scroll(scroll-window+3) }
			}
			can.onimport.history(can, {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)})
			can.onexport.hash(can), can.onengine.signal(can, "tabview.line.select")
		}); return can.onexport.line(can, line)
	},
	searchLine: function(event, can, value) {
		can.runAction(can.request(event, {name: value, text: can.current.text()}, can.Option()), code.NAVIGATE, [], function(msg) {
			msg.Append(nfs.FILE)? can.onimport.tabview(can, msg.Append(nfs.PATH), msg.Append(nfs.FILE), msg.Append(nfs.LINE)): can.user.toast(can, "not found")
		})
	},
	favorLine: function(event, can, value) {
		can.user.input(event, can, [{name: mdb.ZONE, value: "hi"}, {name: mdb.NAME, value: "hello"}], function(data) {
			can.runAction(event, code.FAVOR, [ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
				mdb.TYPE, can.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
				nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
			], function() { can.user.toastSuccess(can) })
		})
	},
	back: function(can) { can.history.pop(); var last = can.history.pop(); last && can.onimport.tabview(can, last.path, last.file, last.line) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数"],
	hash: function(can) { if (!can.isCmdMode()) { return }
		var list = []; if (can.Option(nfs.PATH) != can.misc.Search(can, nfs.PATH)) { list.push(can.Option(nfs.PATH)) }
		if (list.length > 0 || can.Option(nfs.FILE) != can.misc.Search(can, nfs.FILE)) { list.push(can.Option(nfs.FILE)) }
		if (list.length > 0 || can.Option(nfs.LINE) != can.misc.Search(can, nfs.LINE)) { list.push(can.Option(nfs.LINE)) }
		location.hash = list.join(ice.FS)
	},
	keys: function(can, path, file) { return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(ice.FS) },
	content: function(can) { return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL) },
	position: function(can, index, total) { total = total||can.max; return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
	text: function(can, line) { return can.core.Value(can.page.Select(can, line, "td.text")[0], "innerText") },
	line: function(can, line) { return parseInt(can.core.Value(can.page.Select(can, line, "td.line")[0], "innerText")) },
})

Volcanos(chat.ONIMPORT, {help: "导入数据",
	_profile: function(can, target) {
		var ui = can.onimport._panel(can, target, kit.Dict(
			mdb.LINK, function(event) {
				if ([nfs.ZML, nfs.IML].indexOf(can.base.Ext(can.Option(nfs.FILE))) > -1) {
					can.user.open(can.misc.MergePodCmd(can, {website: can.base.trimPrefix(can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), "src/website/")}))
				} else {
					can.user.open(can.misc.MergePodCmd(can, {cmd: can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE))}))
				}
			},
			html.WIDTH, function(event) {
				can.user.input(event, can, [{name: html.WIDTH, value: can.profile_size[can.onexport.keys(can)]*100/can.ConfWidth()||50}], function(list) {
					can.profile_size[can.onexport.keys(can)] = can.ConfWidth()*parseInt(list[0])/100, can.onaction[ice.SHOW](event, can)
				})
			},
		)); can.ui.profile_output = ui.output
	},
	_display: function(can, target) {
		var ui = can.onimport._panel(can, target, kit.Dict(
			ice.SHOW, function(event) { can.onaction[ice.EXEC](event, can) },
			html.HEIGHT, function(event) {
				can.user.input(event, can, [{name: html.HEIGHT, value: can.display_size[can.onexport.keys(can)]*100/can.ConfHeight()||50}], function(list) {
					can.display_size[can.onexport.keys(can)] = can.ConfHeight()*parseInt(list[0])/100, can.onaction[ice.EXEC](event, can)
				})
			}
		)); can.ui.display_output = ui.output, can.ui.display_status = ui.status
	},
	profile: function(can, msg) { var sup = can.tabview[can.onexport.keys(can)]
		if (msg.Result().indexOf("<iframe") > -1) { if (sup._profile_output != can.ui._profile_output) { can.page.Remove(can, sup._profile_output) }
			can.ui.profile_output = sup._profile_output = can.page.Append(can, can.ui._profile_output.parentNode, [{view: html.OUTPUT, inner: msg.Result()}]).output
			var width = can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/4*3; can.profile_size[can.onexport.keys(can)] = width
		} else {
			can.ui.profile_output = sup._profile_output = can.ui._profile_output
			var width = can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/2
			can.onimport.process(can, msg, can.ui._profile_output, can.ui.profile.offsetHeight, width)
			can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.page.Append(can, can.ui._profile_output, [html.STATUS]).first)
			can.page.Select(can, can.ui._profile_output, html.TABLE, function(target) { can.onmotion.delay(can, function() {
				if (target.offsetWidth < can.ui._profile_output.offsetWidth) { can.profile_size[can.onexport.keys(can)] = target.offsetWidth, can.onimport.layout(can) }
			}) })
		}
		can.onmotion.toggle(can, can.ui.profile_output, true)
		can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
	},
	display: function(can, msg) {
		var height = can.display_size[can.onexport.keys(can)]||can.ConfHeight()/2
		can.onimport.process(can, msg, can.ui.display_output, height, can.ui.display.offsetWidth, function(sub) {
			can.display_size[can.onexport.keys(can)] = can.base.Max(sub._output.offsetHeight, can.ConfHeight()/2)+2*html.ACTION_HEIGHT+sub.onexport.statusHeight(sub)
			can.onimport.layout(can)
		})
		can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.ui.display_status)
		can.onmotion.toggle(can, can.ui.display, true), can.onimport.layout(can)
	},
	process: function(can, msg, target, height, width, cb) { can.onmotion.clear(can, target), can.user.toastSuccess(can)
		if (msg.Option(ice.MSG_PROCESS) == "_field") {
			msg.Table(function(item) { item.display = msg.Option(ice.MSG_DISPLAY), item.height = height-3*html.ACTION_HEIGHT
				can.onimport.plug(can, item, function(sub) { sub.onaction._output = function(_sub, _msg) { can.base.isFunc(cb) && cb(_sub, _msg) }
					sub.onaction.close = function() { can.onmotion.hidden(can, target.parentNode), can.onimport.layout(can) }
					height && sub.ConfHeight(height-3*html.ACTION_HEIGHT), width && sub.ConfWidth(width), sub.Focus()
				}, target)
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), target, false, function(msg) { can.onmotion.delay(can, function() { can.onimport.layout(can) }) })
		} else if (msg.Length() > 0 || msg.Result() != "") {
			can.onappend.table(can, msg, function(value, key, index, line, array) {
				return {text: [value, html.TD], onclick: function(event) { if (line.line || line.file) {
					can.onimport.tabview(can, line.path||can.Option(nfs.PATH), line.file||can.Option(nfs.FILE), line.line||can.Option(nfs.LINE), function() {
						can.current.scroll(can.current.scroll()-9)
					})
				} }}
			}, target), can.onappend.board(can, msg, target)
		} else {
			can.onmotion.hidden(can, target.parentNode)
		}
	},
}, [""])
Volcanos(chat.ONACTION, {help: "控件交互", _trans: {link: "链接", width: "宽度", height: "高度"},
	"搜索": function(event, can) {
		can.user.input(event, can, [mdb.NAME, [ctx.ACTION, nfs.TAGS, cli.MAKE, nfs.GREP]], function(data) {
			can.ui.search.Update({}, [ctx.ACTION, data.action, data.name])
		})
	},
	"打开": function(event, can) {
		can.page.style(can, can.user.input(can.request(event, {paths: can.sup.paths.join(ice.FS)}), can, [{name: nfs.FILE, style: {width: can.ui.content.offsetWidth/2}}], function(list) {
			var ls = can.core.Split(list[0], ice.DF, ice.DF); switch (ls[0]) {
				case "_open": return can.runAction(event, "_open", ls[1])
				case ctx.INDEX:
				case web.DREAM: return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1], ls[0])
				case nfs.LINE: return can.onaction.selectLine(can, parseInt(ls[1])), can.current.scroll(can.current.scroll()-4)
				default: can.core.List(can.sup.paths, function(path) { if (list[0].indexOf(path) == 0) { can.onimport.tabview(can, path, list[0].slice(path.length)) } })
			}
		})._target, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/4-34, html.TOP, can.ui.content.offsetHeight/4, html.RIGHT, "")
	},
	show: function(event, can) {
		if (can.base.Ext(can.Option(nfs.FILE)) == nfs.JS) { delete(Volcanos.meta.cache[can.base.Path("/require/", can.Option(nfs.PATH), can.Option(nfs.FILE))]) }
		can.runAction(can.request(event, {_toast: "渲染中..."}), mdb.RENDER, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.profile(can, msg) })
	},
	exec: function(event, can) {
		can.runAction(can.request(event, {_toast: "执行中..."}), mdb.ENGINE, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.display(can, msg) })
	},
	clear: function(event, can) {
		if (can.page.Select(can, document.body, ".input.float", function(item) { return can.page.Remove(can, item) }).length > 0) { return }
		if (can.page.Select(can, can._status, "legend.select", function(item) { return item.click(), item }).length > 0) { return }
		if (can.ui.display.style.display == "") { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		if (can.ui.profile.style.display == "") { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
		if (can.page.Select(can, document.body, "div.vimer.find.float", function(item) { return can.page.Remove(can, item) }).length > 0) { return }
		can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can)
	},
})

Volcanos(chat.ONIMPORT, {help: "导入数据",
	_keydown: function(can) { if (!can.isCmdMode()) { return }
		can.onkeymap._build(can), can._root.onengine.listen(can, chat.ONKEYDOWN, function(event) {
			if (event.ctrlKey && event.key >= "0" && event.key <= "9") {
				return can.page.Select(can, can.ui._tabs, "div.tabs", function(target, index) { index+1 == event.key && target.click() })
			}
			can._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can._key_list, can.ui.content)
		})
	},
})
Volcanos(chat.ONKEYMAP, {help: "导入数据",
	_mode: {
		plugin: {
			Escape: shy("切换模式", function(event, can) { can.onaction.clear(event, can) }),
			v: shy("渲染界面", function(event, can) { can.onaction[ice.SHOW](event, can) }),
			r: shy("执行命令", function(event, can) { can.onaction[ice.EXEC](event, can) }),
			f: shy("打开文件", function(event, can) { can.onaction["打开"](event, can) }),

			x: shy("关闭标签", function(can) { can._tab._close() }),
			h: shy("打开左边标签", function(can) { var next = can._tab.previousSibling; next && next.click() }),
			l: shy("打开右边标签", function(can) { var next = can._tab.nextSibling; next && next.click() }),
		},
	}, _engine: {},
})

Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.page.ClassList.add(can, can._fields, code.INNER), can.onlayout.profile(can)
		can.onimport._profile(can, can.ui.profile), can.onimport._display(can, can.ui.display)
		if (msg.Result() == "" && can.Option(nfs.LINE) == "1") { return }
		can.page.styleWidth(can, can.ui.project, 240)

		can.isCmdMode() && can.ConfHeight(can.ConfHeight()+2*html.ACTION_HEIGHT)
		if (msg.Option(nfs.FILE)) {
			msg.Option(nfs.PATH) && can.Option(nfs.PATH, msg.Option(nfs.PATH))
			can.Option(nfs.FILE, msg.Option(nfs.FILE))
			msg.Option(nfs.LINE) && can.Option(nfs.LINE, msg.Option(nfs.LINE))
		}

		can.onengine.plugin(can, can.onplugin)
		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		can.core.List(paths.concat(msg.modules||[], can.sup.paths||[]), function(p) { if (paths.indexOf(p) == -1) { paths.push(p) } })
		can.sup.paths = paths

		can.ui._content = can.ui.content, can.ui._profile_output = can.ui.profile_output
		can.tabview = can.tabview||{}, can.history = can.history||[], can.toolkit = {}, can.extentions = {}
		can.profile_size = {}, can.display_size = {}

		if (can.user.isWebview) { var last = can.misc.localStorage(can, "web.code.inner:currentFile"); if (last) { var ls = can.core.Split(last, ice.DF) } }
		
		switch (can.Mode()) {
			case chat.SIMPLE: can.onmotion.hidden(can, can.ui.project); break
			case chat.FLOAT: can.onmotion.hidden(can, can.ui.project); break
			case chat.CMD: can.onimport._tabs(can), can.onmotion.hidden(can, can._status) // no break
			case chat.FULL: // no break
			default: can.onimport.project(can, paths)
				can.onengine.listen(can, "tabview.view.init", function() { if (can.user.isMobile) { return } var p = can.onsyntax[can.parse]
					can.Option(nfs.PATH).indexOf("src/") == 0 && p && p.render && can.onaction[ice.SHOW]({}, can); if (can.page.ClassList.has(can, can._fields, chat.PLUGIN)) {
						p && p.engine && can.onaction[ice.EXEC]({}, can)
					}
				})
				can.onimport._keydown(can), can.onimport._toolkit(can, can.ui.toolkit), can.onimport._session(can, msg, function() {
					files.length > 1 && can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) {
						can.onimport.tabview(can, can.Option(nfs.PATH), file, can.Option(nfs.LINE), next)
					}, function() { can.onimport.tabview(can, paths[0], files[0], "") }) })
					last && ls.length > 0 && can.onmotion.delay(can, function() { can.onimport.tabview(can, ls[0], ls[1], ls[2]) }, 500)
				})
		}

		var hash = location.hash; can.tabview[can.onexport.keys(can)] = msg
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() {
			if (can.isCmdMode() && hash) { var args = can.core.Split(decodeURIComponent(hash).slice(1))
				can.onmotion.delay(can, function() { can.onimport.tabview(can, args[args.length-3]||can.Option(nfs.PATH), args[args.length-2]||can.Option(nfs.FILE), args[args.length-1]) }, 500)
			}
		}), can.base.isFunc(cb) && cb(msg) 
	},
	_toolkit: function(can, target) {
		can.ui.toolkit = can.onappend.field(can, "toolkit", {}, can._output)
	},
	_session: function(can, msg, cb) {
		can.onimport.sess(can, "", function() { can.onimport.sess(can, {
			exts: can.core.Split(msg.SearchOrOption("exts")).reverse(),
			plug: can.core.Split(msg.SearchOrOption("plug")).reverse(),
			tabs: can.core.Split(msg.SearchOrOption("tabs")),
		}, cb) })
	},
	layout: function(can) {
		if (can.isSimpleMode()) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) }
		if (can.isCmdMode()) { can.ConfHeight(can.page.height()), can.ConfWidth(can.page.width()) }
		can.isFloatMode() && can.onmotion.hidden(can, can.ui.profile)

		var width = can.ConfWidth()+(can.user.isMobile && can.isCmdMode() && can.user.isLandscape()? 16: 0)-(can.user.isWindows && !can.isCmdMode()? 20: 0)
		var project_width = can.ui.project.style.display == html.NONE? 0: (can.ui.project.offsetWidth||240)
		var profile_width = can.ui.profile.style.display == html.NONE? 0: can.profile_size[can.onexport.keys(can)]||(width-project_width)/2
		var content_width = width-project_width-profile_width
		can.page.styleWidth(can, can.ui.content, content_width)
		can.page.styleWidth(can, can.ui.profile_output, profile_width)
		can.page.styleWidth(can, can.ui.display_output, width-project_width)

		var height = can.user.isMobile && can.isFloatMode()? can.page.height()-2*html.ACTION_HEIGHT: can.base.Min(can.ConfHeight(), 320)-1
		can.user.isMobile && can.isCmdMode() && can.page.style(can, can._output, html.MAX_HEIGHT, height)
		var display_height = can.ui.display.style.display == html.NONE? 0: (can.display_size[can.onexport.keys(can)]||height/2-html.ACTION_HEIGHT)
		var content_height = height-display_height; if (can.isCmdMode()) { content_height -= can.ui._tabs.offsetHeight + can.ui._path.offsetHeight + 4 }
		var profile_height = height-html.ACTION_HEIGHT-display_height
		can.page.styleHeight(can, can.ui.profile_output, profile_height)
		can.page.styleHeight(can, can.ui.display_output, display_height-html.ACTION_HEIGHT)
		can.page.styleHeight(can, can.ui.content, content_height-(can.ui.content != can.ui._content? 4: 0))
		can.page.styleHeight(can, can.ui.project, height)

		var sub = can.ui.content._plugin; sub && sub.onimport.size(sub, content_height-2*html.ACTION_HEIGHT, content_width, true)
		can.page.Select(can, can.ui.profile, html.IFRAME, function(iframe) { can.page.Modify(can, iframe, {height: profile_height-html.ACTION_HEIGHT-4, width: profile_width}) })
	},
	toolkit: function(can, meta, cb) { meta.msg = true
		can.onimport.plug(can, meta, function(sub) {
			sub.onexport.record = function(sub, line) { if (!line.file && !line.line) { return }
				can.onimport.tabview(can, line.path||can.Option(nfs.PATH), can.base.trimPrefix(line.file, nfs.PWD)||can.Option(nfs.FILE), parseInt(line.line)), can.current.scroll(can.current.scroll()-4)
			}
			sub.onimport.size(sub, can.ConfHeight()/2, can.ConfWidth() - can.ui.profile.offsetWidth, true)
			can._status.appendChild(sub._legend), sub._legend.onclick = function(event) {
				if (can.page.Select(can, can._status, ice.PT+html.SELECT)[0] == event.target) {
					can.page.ClassList.del(can, event.target, html.SELECT)
					can.page.ClassList.del(can, sub._target, html.SELECT)
					return
				}
				can.onmotion.select(can, can.ui.toolkit.output, html.FIELDSET, sub._target), sub.Focus()
				can.onmotion.select(can, can._status, html.LEGEND, event.target)
				if (meta.msg == true) { meta.msg = false, sub.Update() }
			}, sub._legend.onmouseenter = null
			sub.onaction.close = sub.select = function() { return sub._legend.click(), sub }
			can.base.isFunc(cb) && cb(sub)
		}, can.ui.toolkit.output)
	},
	exts: function(can, url, cb) {
		can.require([url], function() {}, function(can, name, sub) { sub._init(can, sub, function(sub) {
			can.extentions[url.split("?")[0]] = sub, can.base.isFunc(cb)? cb(sub): sub.select()
		}) })
	},
	sess: function(can, sess, cb) { sess = sess||can.base.Obj(can.misc.localStorage(can, "web.code.inner.sess"), {})
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
Volcanos(chat.ONEXPORT, {help: "导出数据",
	sess: function(can) { can.misc.localStorage(can, "web.code.inner.sess", {"plug": can.onexport.plug(can), "exts": can.onexport.exts(can), "tabs": can.onexport.tabs(can)}) },
	tabs: function(can) { return can.core.Item(can.tabview, function(key, msg) { return key+ice.DF+can.Option(nfs.LINE) }) },
	plug: function(can) { return can.core.Item(can.toolkit) },
	exts: function(can) { return can.core.Item(can.plugins) },
})
