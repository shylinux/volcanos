Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can), can.page.ClassList.add(can, can._fields, code.INNER)
		if (msg.Option(nfs.FILE)) { can.Option(nfs.FILE, msg.Option(nfs.FILE))
			msg.Option(nfs.PATH) && can.Option(nfs.PATH, msg.Option(nfs.PATH))
			msg.Option(nfs.LINE) && can.Option(nfs.LINE, msg.Option(nfs.LINE))
		} if (msg.Result() == "" && can.Option(nfs.LINE) == "1") { return }
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		can.core.List(paths.concat(msg.modules||[], can.core.Split(msg.Option(nfs.REPOS)), can.sup.paths||[]), function(p) { if (p && paths.indexOf(p) == -1 && p[0] != ice.PS) { paths.push(p) } }), can.sup.paths = paths
		can.toolkit = {}, can.extentions = {}, can.onengine.plugin(can, can.onplugin)
		can.tabview = can.tabview||{}, can.history = can.history||[], can.profile_size = {}, can.display_size = {}
		can.ui = can.onappend.layout(can, can._output, "", [html.PROJECT, [html.TABS, nfs.PATH, [html.CONTENT, html.PROFILE], html.DISPLAY]])
		can.ui._content = can.ui.content, can.ui._profile = can.ui.profile, can.ui._display = can.ui.display
		switch (can.Mode()) {
			case chat.SIMPLE: can.onmotion.hidden(can, can.ui.project); break
			case chat.FLOAT: can.onmotion.hidden(can, can.ui.project); break
			case chat.CMD: can.onmotion.hidden(can, can._status), can.onimport._keydown(can) // no break
			case chat.FULL: // no break
			default: can.onimport.project(can, paths), can.onimport._tabs(can)
				can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) {
					can.onimport.tabview(can, can.Option(nfs.PATH), file, "", next)
				}, function() { files.length > 1 && can.onimport.tabview(can, paths[0], files[0], "")
					if (can.user.isWebview) { var last = can.misc.localStorage(can, "web.code.inner:currentFile"); if (!last) { return } }
					var ls = can.core.Split(last, ice.DF); ls.length > 0 && can.onmotion.delayLong(can, function() { can.onimport.tabview(can, ls[0], ls[1], ls[2]) })
				}) })
		}
		var hash = location.hash; can.tabview[can.onexport.keys(can)] = msg
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() {
			if (can.isCmdMode() && hash) { var args = can.core.Split(decodeURIComponent(hash).slice(1))
				can.onmotion.delayLong(can, function() { can.onimport.tabview(can, args[args.length-3]||can.Option(nfs.PATH), args[args.length-2]||can.Option(nfs.FILE), args[args.length-1]) })
			}
		}), can.base.isFunc(cb) && cb(msg) 
	},
	_keydown: function(can) {
		can.onkeymap._build(can), can._root.onengine.listen(can, chat.ONKEYDOWN, function(event) {
			if (can.onkeymap.selectCtrlN(event, can, can.ui.tabs, html.DIV_TABS)) { return }
			can._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can._key_list, can.ui.content)
		})
	},
	_tabs: function(can) { if (!can.isCmdMode()) { return can.ui.tabs = can._action }
		can.page.Append(can, can.ui.tabs, [{view: [[mdb.TIME, html.SELECT]], _init: function(target) {
			can.core.Timer({interval: 100}, function() { can.page.Modify(can, target, can.base.Time()) })
			can.onappend.figure(can, {action: "date", _hold: true}, target, function(sub, value) { can.onimport.tabview(can, can.Option(nfs.PATH), "web.team.plan", ctx.INDEX) })
		}}])
		can.page.Append(can, can.ui.tabs, [{view: [aaa.AVATAR], list: [{img: can.user.info.avatar}]}])
	},
	_tabInputs: function(can, ps, key, value, cb) {
		can.core.List(can.core.Split(value, ps), function(value, index, array) {
			can.page.Append(can, can.ui.path, [{text: [value, html.SPAN, html.ITEM], onclick: function(event) {
				can.onimport.tabInputs(event, can, ps, key, array.slice(0, index).join(ps)+ps, cb)
			}}, index < array.length-1? {text: ps}: null])
		})
	},
	tabInputs: function(event, can, ps, key, pre, cb, parent) {
		can.runAction(event, mdb.INPUTS, [key, pre], function(msg) { var _trans = {}
			var carte = can.user[parent? "carteRight": "carte"](event, can, {}, msg.Table(function(value) {
				var p = can.core.Split(value[key], ice.PS).pop()+(can.base.endWith(value[key], ice.PS)? ice.PS: ""); return _trans[p] = value[key], p
			}), function(event, button) {
				can.base.endWith(button, ps)? can.onimport.tabInputs(event, can, ps, key, pre+button, cb, carte): cb(can.core.Split(_trans[button], ps))
			}, parent)._target, _p = can.core.Split(event.target.innerHTML.trim(), ice.PT)[0]
			can.page.Select(can, carte, html.DIV_ITEM, function(target) { target.innerHTML.trim() != event.target.innerHTML.trim() && can.base.beginWith(target.innerHTML, _p) && carte.insertBefore(target, carte.firstChild) })
			function remove(p) { if (p && p._sub) { remove(p._sub), can.page.Remove(can, p._sub), delete(p._sub) } } if (parent) { remove(parent), parent._sub = carte }
		})
	},
	tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		function isCommand() { return path == ctx.COMMAND || line == ctx.INDEX }
		function isDream() { return line == web.DREAM }
		function show(skip) { if (can.isCmdMode()) { can.onimport._title(can, path+file) }
			can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.tabview[key]
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can.misc.localStorage(can, "web.code.vimer:selectLine:"+path+file)||can._msg.Option(nfs.LINE)||1}))
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg
				can.onexport.hash(can), can.onmotion.select(can, can.ui.tabs, html.DIV_TABS, msg._tab)
				if (can.ui.path) { can.ui.path.innerHTML = ""
					if (isCommand()) {
						can.ui.path.innerHTML = can.Option(nfs.FILE)
					} else if (isDream()) {
						can.ui.path.innerHTML = can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}))
					} else {
						can.onimport._tabInputs(can, ice.PS, nfs.PATH, can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), function(ls) {
							if (ls[0] == ice.SRC) {
								can.onimport.tabview(can, ls.slice(0, 1).join(ice.PS)+ice.PS, ls.slice(1).join(ice.PS))
							} else {
								can.onimport.tabview(can, ls.slice(0, 2).join(ice.PS)+ice.PS, ls.slice(2).join(ice.PS))
							}
						})
					}
				}
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_CONTENT, [[[html.IFRAME, html.CONTENT]]]), function(item) {
					if (can.onmotion.toggle(can, item, item == msg._content)) { can.ui.content = msg._content }
				}), can.ui.content._plugin = msg._plugin, msg._plugin && can.onmotion.delay(can, function() { msg._plugin.Focus() })
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_PROFILE, [[[html.IFRAME, html.PROFILE]]]), function(item) {
					if (can.onmotion.toggle(can, item, item == msg._profile)) { can.ui.profile = msg._profile }
				}), can.ui.current && can.onmotion.toggle(can, can.ui.current, !isCommand() && !isDream())
				var ls = can.file.split(ice.PS); if (ls.length > 4) { ls = [ls.slice(0, 2).join(ice.PS)+"/.../"+ls.slice(-2).join(ice.PS)] }
				can.Status(kit.Dict("文件名", ls.join(ice.PS), "解析器", can.parse)), can.onimport.layout(can)
				skip || can.onaction.selectLine(can, can.Option(nfs.LINE)), can.base.isFunc(cb) && cb(), cb = null
			})
		}
		function load(msg) { can.tabview[key] = msg
			can.onimport.tabs(can, [{name: file.split(isCommand()? ice.PT: ice.PS).pop(), text: file}], function(event) {
				can._tab = msg._tab = event.target, show(true)
			}, function(item) { can.onengine.signal(can, "tabview.view.delete", msg)
				msg._content != can.ui._content && can.page.Remove(can, msg._content), msg._profile != can.ui._profile && can.page.Remove(can, msg._profile)
				delete(can.ui._content._cache[key]), delete(can.ui._profile._cache[key]), delete(can.ui.display._cache[key])
				delete(can._cache_data[key]), delete(can.tabview[key])
			}, can.ui.tabs)
		}
		if (can.tabview[key]) { return !can._msg._tab && !can.isSimpleMode()? load(can.tabview[key]): show() }
		isCommand()||isDream()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, record) {
		can.base.Eq(record, can.history[can.history.length-1]) || can.history.push(record)
		return can.Status("跳转数", can.history.length), record
	},
	project: function(can, path) {
		can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
			if (can.base.isFunc(cb)) { return {name: name, _init: function(target, zone) { return cb(can, target, zone, path) }} }
		}), can.ui.project), can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
	},
	profile: function(can, msg) { var sup = can.tabview[can.onexport.keys(can)]
		if (msg.Result().indexOf("<iframe ") > -1) { if (sup._profile != can.ui._profile) { can.page.Remove(can, sup._profile) }
			can.ui.profile = sup._profile = can.page.Append(can, can.ui._profile.parentNode, [{view: [html.PROFILE, html.IFRAME], src: msg.Append(mdb.LINK)}])._target
		} else { can.ui.profile = sup._profile = can.ui._profile
			can.onimport.process(can, msg, can.ui.profile, can.ui.profile.offsetHeight, can.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/2)
			can.page.Select(can, can.ui.profile, html.TABLE, function(target) { can.onmotion.delay(can, function() {
				if (target.offsetWidth < can.ui._profile.offsetWidth) { can.profile_size[can.onexport.keys(can)] = target.offsetWidth, can.onimport.layout(can) }
			}) })
		} can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
	},
	display: function(can, msg) { var target = can.ui.display
		can.onimport.process(can, msg, target, can.display_size[can.onexport.keys(can)]||can.ConfHeight()/2, target.offsetWidth, function(sub) {
			can.onmotion.delay(can, function() { can.page.style(can, sub._output, html.HEIGHT, "", html.MAX_HEIGHT, "")
				can.display_size[can.onexport.keys(can)] = can.base.Max(sub._output.offsetHeight, can.ConfHeight()/2)+html.ACTION_HEIGHT+sub.onexport.statusHeight(sub)
				can.page.style(can, sub._output, html.MAX_HEIGHT, can.display_size[can.onexport.keys(can)]-html.ACTION_HEIGHT-sub.onexport.statusHeight(sub))
				can.onimport.layout(can)
			}), sub.onaction.close = function() { can.onmotion.hidden(can, target), can.onimport.layout(can) }
		}), can.onmotion.toggle(can, target, true), can.onimport.layout(can)
		if (msg.Option(ice.MSG_PROCESS) != "_field") {
			can.onmotion.delay(can, function() { can.page.style(can, target, html.HEIGHT, "", html.MAX_HEIGHT, "")
				can.display_size[can.onexport.keys(can)] = can.base.Max(target.offsetHeight, can.ConfHeight()/2)
				can.page.style(can, target, html.MAX_HEIGHT, can.display_size[can.onexport.keys(can)]), can.onimport.layout(can)
			})
		}
	},
	process: function(can, msg, target, height, width, cb) { can.onmotion.clear(can, target), can.user.toastSuccess(can)
		if (msg.Option(ice.MSG_PROCESS) == "_field") {
			msg.Table(function(item) { item.display = msg.Option(ice.MSG_DISPLAY), item.height = height-2*html.ACTION_HEIGHT
				can.onimport.plug(can, item, function(sub) {
					sub.onaction.close = function() { can.onmotion.hidden(can, target), can.onimport.layout(can) }
					sub.onaction._output = function(_sub, _msg) { can.base.isFunc(cb) && cb(_sub, _msg) }
					height && sub.ConfHeight(height-2*html.ACTION_HEIGHT), width && sub.ConfWidth(width)
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
			}, target), can.onappend.board(can, msg, target), can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.page.Append(can, target, [html.STATUS])._target)
		} else {
			can.onmotion.hidden(can, target)
		}
	},
	toolkit: function(can, meta, cb) { meta._delay_init = true
		can.onimport.plug(can, meta, function(sub) {
			can._status.appendChild(sub._legend), sub._legend.onclick = function(event) {
				if (can.page.SelectOne(can, can._status, ice.PT+html.SELECT) == event.target) {
					can.page.ClassList.del(can, event.target, html.SELECT), can.page.ClassList.del(can, sub._target, html.SELECT)
				} else {
					can.page.SelectChild(can, can._output, can.core.Keys(html.FIELDSET, "plug"), function(target) {
						can.page.ClassList.set(can, target, html.SELECT, target == sub._target)
					}), can.onmotion.select(can, can._status, html.LEGEND, event.target)
					if (meta._delay_init == true) { meta._delay_init = false, sub.Update() }
				}
			}, sub._legend.onmouseenter = null
			sub.onaction.close = sub.select = function() { return sub._legend.click(), sub }
			sub.onexport.record = function(sub, line) { if (!line.file && !line.line) { return }
				can.onimport.tabview(can, line.path||can.Option(nfs.PATH), can.base.trimPrefix(line.file, nfs.PWD)||can.Option(nfs.FILE), parseInt(line.line)), can.current.scroll(can.current.scroll()-4)
			}, sub.onimport.size(sub, can.ConfHeight()/2, can.ConfWidth() - can.ui.project.offsetWidth, true)
			can.base.isFunc(cb) && cb(sub)
		}, can._output)
	},
	layout: function(can) {
		if (can.isSimpleMode()) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) }
		if (can.isCmdMode()) { can.ConfHeight(can.page.height()), can.ConfWidth(can.page.width()) }
		can.isFloatMode() && can.onmotion.hidden(can, can.ui.profile)
		var width = can.ConfWidth()+(can.user.isMobile && can.isCmdMode() && can.user.isLandscape()? 16: 0)-(can.user.isWindows && !can.isCmdMode()? 20: 0)
		var height = can.user.isMobile && can.isFloatMode()? can.page.height()-2*html.ACTION_HEIGHT: can.base.Min(can.ConfHeight(), 320)-1
		can.user.isMobile && can.isCmdMode() && can.page.style(can, can._output, html.MAX_HEIGHT, height)
		can.ui.size = {profile: can.profile_size[can.onexport.keys(can)]||0.5, display: can.display_size[can.onexport.keys(can)]||3*html.ACTION_HEIGHT}
		can.ui.layout(width, height)
		var sub = can.ui.content._plugin; sub && sub.onimport.size(sub, can.ui.content.offsetHeight-2*html.ACTION_HEIGHT, can.ui.content.offsetWidth, true)
	},
	exts: function(can, url, cb) {
		can.require([url], function() {}, function(can, name, sub) { sub._init(can, sub, function(sub) {
			can.extentions[url.split("?")[0]] = sub, can.base.isFunc(cb)? cb(sub): sub.select()
		}) })
	},
}, [""])
Volcanos(chat.ONFIGURE, { 
	source: function(can, target, zone, path) { var total = 0
		function show(target, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) {
			can.onimport.tree(can, msg.Table(), nfs.PATH, ice.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target)
			can.Status("文件数", zone._total(total += msg.Length()))
		}, true) } if (path.length == 1) { return show(target, path[0]) } can.page.Remove(can, target.previousSibling)
		can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(target) { show(target, path) }} }), target)
	},
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.Item(can.onengine.plugin.meta, function(key) { return total++, {index: key} }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys("can", item.index), ctx.INDEX)
		}, target), zone._total(total)
	},
})
Volcanos(chat.ONSYNTAX, {_init: function(can, msg, cb) {
		if (can.onmotion.cache(can, function(cache_data) {
			can.file && (cache_data[can.file] = {current: can.current, max: can.max, profile_display: can.ui.profile.style.display, display_display: can.ui.display.style.display})
			can.file = can.onexport.keys(can, can.Option(nfs.PATH), can.Option(nfs.FILE))
			var p = cache_data[can.file]; if (p) { can.current = p.current, can.max = p.max }
			can.page.style(can, can.ui.profile, html.DISPLAY, p? p.profile_display: html.NONE)
			can.page.style(can, can.ui.display, html.DISPLAY, p? p.display_display: html.NONE)
			can.parse = can.base.Ext(can.file), can.Status("模式", mdb.PLUGIN); return can.file
		}, can.ui._content, can.ui._profile, can.ui._display)) { return can.base.isFunc(cb) && cb(msg._content) }
		if (msg.Option(ctx.INDEX)) { return can.onsyntax._index(can, msg, cb) }
		function init(p) {
			can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
			can.onaction.selectLine(can, can.Option(nfs.LINE)), can.current.scroll(can.current.scroll()-can.current.window()/4)
			can.onengine.signal(can, "tabview.view.init", msg), can.base.isFunc(cb) && cb(msg._content = can.ui._content)
		} can.require(["inner/syntax.js"], function() { can.Conf("plug") && (can.onsyntax[can.parse] = can.Conf("plug"))
			var p = can.onsyntax[can.parse]; !p? can.runAction({}, mdb.PLUGIN, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
				init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()||"{}"))
			}): init(p)
		})
	},
	_index: function(can, msg, cb) {
		if (can.Option(nfs.LINE) == web.DREAM) {
			return can.base.isFunc(cb) && cb(msg._content = msg._content||can.page.insertBefore(can, [{view: [html.CONTENT, html.IFRAME],
				src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), height: can.ui.content.offsetHeight, width: can.ui.content.offsetWidth}], can.ui._content))
		} var meta = {index: msg.Option(ctx.INDEX), args: can.Option(nfs.PATH) == ctx.COMMAND && can.Option(nfs.LINE) != ctx.INDEX? [can.Option(nfs.LINE)]: []}
		return can.onimport.plug(can, meta, function(sub) {
			sub.onaction.close = function() { can.onaction.back(can), msg._tab._close() }
			sub.onimport.title = function(_, title) { can.page.Modify(can, msg._tab, title) }
			sub.onimport._open = function(sub, msg, _arg) { var url = can.base.ParseURL(_arg), ls = url.origin.split("/chat/pod/")
				if (_arg.indexOf(location.origin) == 0 && ls.length > 1) {
					return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1].split(ice.PS)[0], web.DREAM), sub.Update()
				} return can.user.open(_arg), sub.Update()
			}, sub.onimport.size(sub, sub.ConfHeight(can.ui.content.offsetHeight-html.ACTION_HEIGHT-sub.onexport.statusHeight(sub)), sub.ConfWidth(can.ui.content.offsetWidth), true)
			msg._plugin = sub, can.base.isFunc(cb) && cb(msg._content = can.ui._content), can.onmotion.delay(can, function() { sub.Focus() })
		}, can.ui._content)
	},
	_parse: function(can, line) { line = can.page.replace(can, line||"")
		function wrap(text, type) { return can.page.Format(html.SPAN, text, type) }
		var p = can.onsyntax[can.parse]||{}; p = can.onsyntax[p.link]||p, p.split = p.split||{}
		p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||"\t ", p.split.operator||"{[(.,:;!?|&*/+-<=>)]}", {detail: true}), function(item, index, array) {
			item = can.base.isObject(item)? item: {text: item}; var text = item.text, type = p.keyword[text]
			switch (item.type||type) {
				case html.SPACE: return text
				case lang.STRING: return wrap(item.left+text+item.right, lang.STRING)
				case code.COMMENT:
				case code.KEYWORD:
				case code.PACKAGE:
				case code.DATATYPE:
				case code.FUNCTION:
				case code.CONSTANT:
				case code.OBJECT: return wrap(text, type)
				default:
					var t = can.core.Item(p.regexp, function(reg, type) { var m = text.match(new RegExp(reg)); if (m && m.length > 0 && m[0] == text) { return type} })
					return t && t.length > 0? wrap(text, t[0]): type? wrap(text, type): text
			}
		}).join(""))
		p.prefix && can.core.Item(p.prefix, function(pre, type) { if (can.base.beginWith(line, pre)) { line = wrap(line, type) } })
		p.suffix && can.core.Item(p.suffix, function(end, type) { if (can.base.endWith(line, end)) { line = wrap(line, type) } })
		return line
	},
})
Volcanos(chat.ONACTION, {
	appendLine: function(can, value) {
		var ui = can.page.Append(can, can.ui._content, [{type: html.TR, list: [
			{view: [[nfs.LINE, "unselectable"], html.TD, ++can.max], onclick: function(event) {
				can.onaction.selectLine(can, ui.tr)
			}, ondblclick: function(event) {
				can.onaction["查找"](event, can)
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
	selectLine: function(can, line) { if (!line) { return can.onexport.line(can, can.page.SelectOne(can, can.ui._content, "tr.select")) }
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
	listTags: function(event, can, button) { var list = []
		can.core.Item(can.request(event), function(key, value) { if (key.indexOf("_") == 0) { return }
			list.push({zone: "msg", type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0],
				path: "usr/volcanos/", file: "lib/misc.js", line: 1,
			})
		}), can.page._path = "/lib/page.js"
		can.core.Item(can, function(zone, lib) { if (zone.indexOf("_") == 0) { return }
			can.core.Item(lib, function(key, value) { if (!lib.hasOwnProperty(key)) { return }
				lib._path && list.push({zone: zone, type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0],
					path: "usr/volcanos/", file: lib._path, line: 1,
				})
			})
		}), can.runAction(can.request(event, {text: can.base.Format(list)}), button)
	},
	back: function(can) { can.history.pop(); var last = can.history.pop(); last && can.onimport.tabview(can, last.path, last.file, last.line) },
	show: function(event, can) {
		if (can.base.Ext(can.Option(nfs.FILE)) == nfs.JS) { delete(Volcanos.meta.cache[can.base.Path("/require/", can.Option(nfs.PATH), can.Option(nfs.FILE))]) }
		can.runAction(can.request(event, {_toast: "渲染中..."}), mdb.RENDER, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.profile(can, msg) })
	},
	exec: function(event, can) {
		if (can.base.Ext(can.Option(nfs.FILE)) == nfs.JS) { delete(Volcanos.meta.cache[can.base.Path("/require/", can.Option(nfs.PATH), can.Option(nfs.FILE))]) }
		can.runAction(can.request(event, {_toast: "执行中..."}), mdb.ENGINE, [can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.display(can, msg) })
	},
	clear: function(event, can) {
		if (can.page.Select(can, can._root._target, "div.vimer.find.float", function(item) { return can.page.Remove(can, item) }).length > 0) { return }
		if (can.page.Select(can, can._root._target, ".input.float", function(item) { return can.page.Remove(can, item) }).length > 0) { return }
		if (can.page.Select(can, can._status, "legend.select", function(item) { return item.click(), item }).length > 0) { return }
		if (can.ui.display.style.display == "") { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		if (can.ui.profile.style.display == "") { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
		can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can)
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
	"查找": function(event, can) {
		var ui = can.page.Append(can, can._output, [{view: "vimer find float", list: [html.ACTION, html.OUTPUT],
			style: {left: can.ui.project.offsetWidth+can.ui.content.offsetWidth/2, top: can.ui.content.offsetHeight/4}}])
		can.onmotion.delay(can, function() { can.page.style(can, ui._target, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/2-ui._target.offsetWidth/2) }, 10)
		can.onmotion.move(can, ui._target)
		var last = can.onaction._getLineno(can, can.current.line)
		function find(begin, text) { if (parseInt(text) > 0) { return can.onaction.selectLine(can, parseInt(text)) && meta.close() }
			for (begin; begin <= can.max; begin++) {
				if (can.onexport.text(can, can.onaction._getLine(can, begin)).indexOf(text) > -1) {
					last = begin, can.onaction.selectLine(can, begin)
					var scroll = can.current.scroll(); if (scroll < 3) { can.current.scroll(scroll-3) } else {
						var window = can.current.window(); if (scroll > window-3) { can.current.scroll(scroll-window+3) }
					}
					return
				}
			} last = 0, can.user.toast(can, "已经到最后一行")
		}
		function complete(target, button) {
			can.onappend.figure(can, {action: "key", mode: chat.SIMPLE, _enter: function(event) {
				if (event.ctrlKey) { meta.grep() } else { meta[button](), can.onmotion.delay(can, function() { target.focus() }) }
				return true
			}, run: function(event, cmds, cb) {
				var msg = can.request(event); can.core.List(can.core.Split(can.current.text(), "\t \n{[(,:;=)]}", {detail: true}), function(value) {
					if (can.base.isObject(value)) { if (value.type == html.SPACE) { return }
						value.type == lang.STRING && msg.Push(mdb.VALUE, value.left+value.text+value.right), msg.Push(mdb.VALUE, value.text)
					} else {
						msg.Push(mdb.VALUE, value)
					}
				}), cb(msg)
			}}, target)
		}
		var meta = can.onappend._action(can, [
			{type: html.TEXT, name: "from", style: {width: 200}, _init: function(target) { from = target, complete(target, "find"), can.onmotion.delay(can, function() { target.focus() }) }},
			"find", "grep",
			{type: html.TEXT, name: "to", _init: function(target) { to = target, complete(target, "replace") }},
			"replace", "close",
		], ui.action, {_trans: {find: "查找", grep: "搜索", replace: "替换"},
			find: function() { find(last+1, from.value) },
			grep: function() { can.onimport.exts(can, "inner/search.js", function(sub) { meta.close(), sub.runAction(event, nfs.GREP, [from.value]) }) },
			replace: function() { var text = can.current.text(), line = can.onaction._getLineno(can, can.current.line)
				can.undo.push(function() { can.onaction.selectLine(can, line), can.onaction.modifyLine(can, line, text) })
				can.current.text(text.replace(from.value, to.value))
				can.current.text().indexOf(from.value) == -1 && meta.find()
			}, close: function() { can.page.Remove(can, ui._target) },
		}); var from, to
	},
	"搜索": function(event, can) {
		can.user.input(event, can, [mdb.NAME, [ctx.ACTION, nfs.TAGS, cli.MAKE, nfs.GREP]], function(data) {
			can.ui.search.Update({}, [ctx.ACTION, data.action, data.name])
		})
	},
})
Volcanos(chat.ONEXPORT, {list: ["文件数", "解析器", "文件名", "当前行", "跳转数"],
	hash: function(can) { if (!can.isCmdMode()) { return }
		var list = []; if (can.Option(nfs.PATH) != can.misc.Search(can, nfs.PATH)) { list.push(can.Option(nfs.PATH)) }
		if (list.length > 0 || can.Option(nfs.FILE) != can.misc.Search(can, nfs.FILE)) { list.push(can.Option(nfs.FILE)) }
		if (list.length > 0 || can.Option(nfs.LINE) != can.misc.Search(can, nfs.LINE)) { list.push(can.Option(nfs.LINE)) }
		location.hash = list.join(ice.FS)
	},
	keys: function(can, path, file) { return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(ice.FS) },
	line: function(can, line) { return parseInt(can.core.Value(can.page.Select(can, line, "td.line")[0], "innerText")) },
	position: function(can, index, total) { total = total||can.max; return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
})
Volcanos(chat.ONENGINE, {
	listen: shy("监听事件", function(can, key, cb) { arguments.callee.meta[key] = (arguments.callee.meta[key]||[]).concat(cb) }),
})
Volcanos(chat.ONKEYMAP, {
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
