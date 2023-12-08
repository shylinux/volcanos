(function() {
const RECOVER_TABS = "recover:tabs"
const RECOVER_TOOL = "recover:tool"
const PROJECT_HIDE = "project:hide", TABVIEW_HIDE = "tabview:hide"
const PROFILE_ARGS = "profile:args:", DISPLAY_ARGS = "display:args:"
const CURRENT_FILE = "web.code.inner:currentFile", SELECT_LINE = "selectLine"
const VIEW_CREATE = "tabview.view.create", VIEW_REMOVE = "tabview.view.remove", LINE_SELECT = "tabview.line.select"
Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { var paths = can.core.Split(can.Option(nfs.PATH), mdb.FS); can.Option(nfs.PATH, paths[0])
		can.Mode(msg.Option("mode")||can.Mode()), can.Option(nfs.FILE) == lex.SP && can.Option(nfs.FILE, "")
		if (can.Mode() == ice.MSG_RESULT) { msg.result = msg.result||[can._output.innerHTML], can.Mode(chat.SIMPLE), can.sup.Mode(chat.SIMPLE) }
		can.core.List(paths.concat(can.core.Split(msg.Option(nfs.REPOS))), function(p) {
			if (can.base.beginWith(p, nfs.USR_LOCAL_WORK) || can.base.endWith(p, "-dict/") || can.base.isIn(p,
				nfs.USR_WEBSOCKET, nfs.USR_GO_QRCODE, nfs.USR_GO_GIT, nfs.USR_ICONS, nfs.USR_GEOAREA, nfs.USR_LEARNING, nfs.USR_INTSHELL,
			)) { return }
			if (p && paths.indexOf(p) == -1 && p[0] != nfs.PS) { paths.push(p) }
		}), can.onmotion.clear(can), can.onappend.style(can, code.INNER), can.sup.onimport._process = function(_can, msg) {
			if (msg.OptionProcess() == ice.PROCESS_HOLD) { return true }
			if (msg.OptionProcess() == ice.PROCESS_REWRITE) {
				var args = {}, arg = msg._arg; for (var i = 0; i < arg.length; i += 2) { args[arg[i]] = arg[i+1] }
				can.onimport.tabview(can, args.path, args.file, args.line)
			}
		}
		can.db = {paths: paths, tabview: {}, history: [], _history: [], toolkit: {}}, can.db.tabview[can.onexport.keys(can)] = msg
		can.ui = can.onappend.layout(can, [html.PROJECT, [html.TABS, nfs.PATH, [html.CONTENT, html.PROFILE], html.DISPLAY, html.PLUG]])
		can.ui._content = can.ui.content, can.ui._profile = can.ui.profile, can.ui._display = can.ui.display, can.onmotion.hidden(can, can.ui.plug)
		can.onmotion.hidden(can, can.ui.profile), can.onmotion.hidden(can, can.ui.display)
		if (can.Conf(ctx.STYLE) == html.OUTPUT) { can.onmotion.hidden(can, can.ui.project), can.page.style(can, can.ui.content, html.HEIGHT, "") }
		var args = can.misc.SearchHash(can), tabs = can.onexport.session(can, RECOVER_TABS), tool = can.onexport.session(can, RECOVER_TOOL)
		switch (can.Mode()) {
			case chat.SIMPLE: // no break
			case chat.FLOAT: can.onmotion.hidden(can, can.ui.project); break
			case chat.CMD: can.onappend.style(can, html.OUTPUT)
				can.onexport.session(can, PROJECT_HIDE) == html.HIDE && can.onmotion.hidden(can, can.ui.project)
				if (can.onexport.session(can, TABVIEW_HIDE) == html.HIDE) { can.onmotion.hidden(can, can.ui.project), can.onmotion.hidden(can, can.ui.tabs) }
				can.onengine.listen(can, chat.ONUNLOAD, function() { can.onexport.recover(can) })
				tool = tool||(can.base.Obj(msg.Option(ice.MSG_TOOLKIT), []).reverse()), msg.Option(ice.MSG_TOOLKIT, "[]")
			case chat.FULL: // no break
			default: can.user.isMobile && can.onmotion.hidden(can, can.ui.project), can.onimport.project(can, paths), can.onimport._tabs(can)
		}
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() { if (!can.isCmdMode()) { return }
			if (tabs) {
				can.core.Next(tabs, function(item, next) { can.onimport.tabview(can, item[0], item[1], item[2], function() { can.onmotion.delay(can, next, 300) }) }, function() {
					args.length > 0 && can.onimport.tabview(can, args[args.length-3], args[args.length-2]||can.Option(nfs.FILE), args[args.length-1])
				})
			} else {
				args.length > 0 && can.onimport.tabview(can, args[args.length-3], args[args.length-2]||can.Option(nfs.FILE), args[args.length-1])
			}
			tool && can.core.Next(tool, function(item, next) { can.onimport.toolkit(can, item, next) })
		}), can.onkeymap._build(can)
		can.ui.profile.onclick = function(event) { if (can.page.tagis(event.target, html.A)) {
			var link = can.misc.ParseURL(can, event.target.href); if (!link.cmd) { return } can.onkeymap.prevent(event)
			link.cmd == web.CODE_VIMER? can.onimport.tabview(can, link.path, link.file, link.line): can.onimport.tabview(can, link.path, link.cmd, ctx.INDEX)
		} }, can.base.isFunc(cb) && cb(msg)
	},
	_tabs: function(can) { if (!can.isCmdMode()) { return can.ui.tabs = can._action }
		var ui = can.page.Append(can, can.ui.tabs, ["icon", "tabs", "head"]); can.ui.tabs = ui.tabs
		can.page.Append(can, ui.icon, can.core.List([
			{name: can.page.unicode.menu, onclick: function() { can.user.carte(event, can, can.onaction, can.onaction.list) }},
			{name: can.page.unicode.refresh, style: {"font-size": 26, "padding-top": 2}, onclick: function() { location.reload() }},
		], function(item) { return can.base.Copy(item, {view: [[html.ITEM, html.ICON], "", item.name]}) }))
		can.onappend.style(can, html.FLEX, ui.head)
		can.onappend.style(can, html.FLEX, ui.tabs)
		can.onappend.style(can, html.FLEX, ui.icon)
		can.page.Append(can, ui.head, can.user.header(can).reverse())
	},
	__tabPath: function(can, cache) { var target = can.ui.path; can.onappend.style(can, html.FLEX, can.ui.path)
		can.onimport._tabPath(can, nfs.PS, nfs.PATH, can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), function(p) {
			var ls = can.onexport.split(can, p); can.onimport.tabview(can, ls[0], ls[1])
		}, target), can.onimport._tabFunc(can, target, cache), can.onimport._tabMode(can)
		can.page.Append(can, target, [{view: [["item", "space"], html.SPAN]}])
		can.onimport._tabIcon(can)
		target.ondblclick = function(event) { if (event.target != target) { return }
			var show = can.onmotion.toggle(can, can.ui.tabs); can.onmotion.toggle(can, can.ui.project, show), can.onimport.layout(can)
			can.isCmdMode() && can.onexport.session(can, TABVIEW_HIDE, show? "": html.HIDE)
		}
	},
	_tabPath: function(can, ps, key, value, cb, target) { var args = value.split(mdb.FS); can.onmotion.clear(can, can.ui.path)
		can.core.List(can.core.Split(args[0], ps), function(value, index, list) {
			can.page.Append(can, target, [{text: [value+(index<list.length-1? ps: ""), "", html.ITEM], onclick: function(event) {
				can.onimport.tabPath(event, can, ps, key, ps == nfs.PT? list.slice(0, index).join(ps): (list.slice(0, index).join(ps)||nfs.PT)+ps, cb)
			}}])
		}); var index = args[0]
		can.core.List(args.slice(1), function(val) { can.page.Append(can, target, [{text: [val, "", html.ITEM], onclick: function(event) {
			can.runAction(can.request(event, {index: index}), mdb.INPUTS, [ctx.ARGS], function(msg) {
				can.user.carte(event, can, {}, msg[msg.append[0]], function(event, button) { can.onimport.tabview(can, "", [index, button].join(mdb.FS), ctx.INDEX) })
			})
		}}]) })
	},
	tabPath: function(event, can, ps, key, pre, cb, parent) { can.runAction(event, mdb.INPUTS, [key, pre, lex.SPLIT], function(msg) { var _trans = {}
		var carte = can.user[parent? "carteRight": "carte"](event, can, {_style: key}, (msg.Length() > 10? [web.FILTER]: []).concat(msg.Table(function(value) {
			var p = can.core.Split(value[key], ps).pop()+(can.base.endWith(value[key], ps)? ps: ""); return _trans[p] = value[key], p
		})), function(event, button) {
			if (can.base.endWith(button, ps)) { can.onimport.tabPath(event, can, ps, key, pre+button, cb, carte); return true } else { cb(_trans[button], pre) }
		}, parent)._target, file = can.core.Split(event.target.innerHTML.trim(), nfs.PT)[0]
		can.page.Select(can, carte, html.DIV_ITEM, function(target) {
			target.innerHTML.trim() != event.target.innerHTML.trim() && can.base.beginWith(target.innerHTML, file+nfs.PT) && carte.insertBefore(target, carte.firstChild)
			target.innerHTML.trim() == event.target.innerHTML.trim() && can.onappend.style(can, html.SELECT, target)
		})
	}) },
	_tabFunc: function(can, target, cache) {
		if (cache) { var func = can.db._func||{list: []} } else { var func = can.onexport.func(can); can.db._func = func }
		if (func.list.length > 0) { can.db.tabFunc = can.db.tabFunc||{}
			var last = can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)]||{}; can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = last
			var carte, list = [web.FILTER]; can.core.Item(last, function(key) { list.push(key) }), list = list.concat(func.list)
		}
		can.page.Append(can, target, [{view: [[html.ITEM, "func"], html.SPAN, (func.current||"func")+nfs.PS+can.ui.content._max+func.percent+lex.SP+can.base.Size(can._msg.result[0].length)], onclick: function(event) {
			carte = can.user.carte(event, can, {_style: nfs.PATH}, list, function(ev, button) { last[button] = true, carte.close()
				can.onimport.tabview(can, "", can.Option(nfs.FILE), can.core.Split(button, nfs.DF, nfs.DF).pop())
			})
		}}])
	},
	_tabMode: function(can) {
		var mode = can.db.mode||"", target = can.ui.current; if (target && mode != mdb.PLUGIN) { mode += lex.SP+target.selectionStart+nfs.PS+target.value.length }
		can.page.Append(can, can.ui.path, [{text: [mode, "", [ice.MODE, can.db.mode||""]], onclick: function(event) {
			var list = {}; can.core.Item(can.onkeymap._mode[can.db.mode], function(k, cb) { list[cb.help+lex.TB+k] = function(event, can, button) { can.core.CallFunc(cb, {event: event, can: can}) } })
			can.core.Item(can.onkeymap._mode[can.db.mode+"_ctrl"], function(k, cb) { list[cb.help+lex.TB+"C-"+k] = function(event, can, button) { can.core.CallFunc(cb, {event: event, can: can}) } })
			can.user.carte(event, can, list, [])
		}}])
	},
	_tabIcon: function(can) {
		can.user.isWindows || can.page.Append(can, can.ui.path, can.core.Item({
			"\u271A": shy({translate: "0 2px"}, function(event) { can.onaction.open(event, can, "open") }),
			"\u2756": shy({translate: "0 2px"}, function(event) { can.onaction.plug(event, can, "plug") }),
			"\u25E7": function(event) { var show = can.onmotion.toggle(can, can.ui.project); can.onimport.layout(can), can.isCmdMode() && can.onexport.session(can, PROJECT_HIDE, show? "": html.HIDE) },
			"\u25E8": shy({translate: "0 2px", rotate: "90deg"}, function(event) { if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) } can.onaction.exec(event, can) }),
			"\u25E8 ": function(event) { if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) } can.onaction.show(event, can) },
		}, function(text, cb) { return cb && {text: [text, html.SPAN, html.VIEW], style: cb.meta, onclick: cb} }))
	},
	tabview: function(can, path, file, line, cb) { path = path||can.Option(nfs.PATH); var key = can.onexport.keys(can, path, file)
		function isIndex() { return line == ctx.INDEX } function isSpace() { return line == web.SPACE }
		function show(skip) { can._msg && can._msg.Option && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.db.tabview[key]
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can.onexport.session(can, SELECT_LINE+nfs.DF+path+file)||can._msg.Option(nfs.LINE)||1}))
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg; can.onexport.hash(can)
				can.isCmdMode() && can.onexport.title(can, (isIndex()||isSpace()? "": path)+file), can.onmotion.select(can, can.ui.tabs, html.DIV_TABS, msg._tab), can.isCmdMode() && msg._tab.scrollIntoView()
				if (isSpace()) {
					can.ui.path.innerHTML = can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}))
				} else if (isIndex()) {
					can.onimport._tabPath(can, nfs.PT, ice.CMD, can.Option(nfs.FILE), function(p, pre) {
						can.onimport.tabview(can, "", can.core.Keys(can.base.trimSuffix(pre, nfs.PT), p), ctx.INDEX)
					}, can.ui.path)
				} else { can.onimport.__tabPath(can) }
				can.page.SelectChild(can, can.ui._profile.parentNode, can.page.Keys(html.DIV_LAYOUT, html.DIV_CONTENT, html.FIELDSET_STORY, [[[html.IFRAME, html.CONTENT]]]), function(target) {
					can.onmotion.toggle(can, target, target == content)
				}), can.ui.content._plugin = msg._plugin, can.ui.profile._plugin = msg._profile
				can.page.SelectChild(can, can.ui._profile.parentNode, can.page.Keys(html.DIV_PROFILE, [[[html.IFRAME, html.PROFILE]]]), function(target) {
					if (can.onmotion.toggle(can, target, target == msg._profile)) { can.ui.profile = msg._profile }
				})
				can.onimport.layout(can), can.ui.current && can.onmotion.toggle(can, can.ui.current, !isIndex() && !isSpace())
				skip || can.onmotion.delay(can, function() { can.onaction.selectLine(can, can.Option(nfs.LINE), true) }), can.base.isFunc(cb) && cb(), cb = null
				var ls = can.onexport.path(can).split(nfs.PS); if (ls.length > 4) { ls = [ls.slice(0, 2).join(nfs.PS)+"/.../"+ls.slice(-2).join(nfs.PS)] }
				can.Status(kit.Dict(nfs.FILE, ls.join(nfs.PS)))
			})
		}
		function load(msg) { var skip = false; can.db.tabview[key] = msg; var name = file
			if (can.base.beginWith(file, web.HTTP)) { name = decodeURI(file.split(web.QS)[0])
				var link = can.misc.ParseURL(can, name); if (link.pod) { name = link.pod }
				name = can.base.trimPrefix(name, location.origin)
			} else {
				name = file.split(mdb.FS)[0].split(isIndex()? nfs.PT: nfs.PS).pop()
			}
			var tabs = can.onimport.tabs(can, [{name: name, text: file, _menu: shy([nfs.SAVE, nfs.TRASH, web.REFRESH], function(event, button, meta) {
				can.request(event, msg)
				can.onaction[button](event, can, button) })}], function(event, tabs) {
				can._tab = msg._tab = tabs._target, show(skip), skip = true
			}, function(tabs) { can.onengine.signal(can, VIEW_REMOVE, msg) // , can.ui.zone.source.refresh()
				msg.__content || can.page.Remove(can, msg._content), msg._profile != can.ui._profile && can.page.Remove(can, msg._profile)
				can.ui._profile._cache && delete(can.ui._profile._cache[key]), can.ui._display._cache && delete(can.ui._display._cache[key])
				delete(can.db.tabview[key]), can._cache_data && delete(can._cache_data[key])
				can.onmotion.delay(can, function() { can.user.isWebview && can.onexport.recover(can) })
			}, can.ui.tabs); tabs._list = [path, file, line], can.user.isWebview && can.onexport.recover(can)
		}
		if (can.db.tabview[key]) { return !can._msg._tab && !can.isSimpleMode()? load(can.db.tabview[key]): show() }
		isIndex()||isSpace()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, record) { can.base.Eq(record, can.db.history[can.db.history.length-1], mdb.TEXT) || can.db.history.push(record)
		return can.Status(ice.BACK, can.db.history.length), record
	},
	project: function(can, path) { can.onmotion.clear(can, can.ui.project), can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
		if (can.base.isFunc(cb)) { return {name: name, icon: cb.meta? cb.meta.icon: "", _trans: can.onfigure._trans? can.onfigure._trans[name]||"": "", _toggle: function() { can.onimport.layout(can) }, _init: function(target, zone) { return cb(can, target, zone, path) }} }
	}), can.ui.project) },
	profile: function(can, msg) { var _msg = can.db.tabview[can.onexport.keys(can)]; _msg.Option(html.WIDTH, msg.Option(html.WIDTH)), border = 1
		var height = (can.ui.content._root||can.ui.content).offsetHeight, width = can.onexport.size(can, _msg.Option(html.WIDTH)||0.5, can.ConfWidth()-can.ui.project.offsetWidth)+border
		if (msg.Result().indexOf("<iframe src=") > -1) { if (_msg._profile != can.ui._profile) { can.page.Remove(can, _msg._profile) }
			var src = can.page.Select(can, can.page.Create(can, html.DIV, msg.Result()), html.IFRAME, function(target) { return target.src })[0]
			can.ui.profile = _msg._profile = can.page.Append(can, can.ui._profile.parentNode, [{view: [html.PROFILE, html.IFRAME], src: src, style: {height: height, width: width}}])._target
			can.onmotion.toggle(can, can.ui.profile, true), can.onmotion.delay(can, function() { can.onimport.layout(can)})
		} else {
			can.page.style(can, can.ui.profile, html.HEIGHT, height, html.WIDTH, width, html.FLEX, "0 0 "+width+"px"), can.ui.profile = _msg._profile = can.ui._profile
			if (can.ui.profile._plugin && can.base.isIn(msg.Append(ctx.INDEX), web.CODE_XTERM)) {
				if (can.onexport.session(can, PROFILE_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE))) {
					return can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
				}
			}
			can.onimport.process(can, msg, can.ui.profile, height, width-border, function(sub) { can.page.style(can, sub._output, html.MAX_WIDTH, "")
				can.ui.profile._plugin = sub
				sub.Conf(ctx.ARGS) && can.onexport.session(can, PROFILE_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE), JSON.stringify(sub.Conf(ctx.ARGS)))
				sub.onaction.close = function() { can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can)
					can.onexport.session(can, PROFILE_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE), "")
				}
				if (sub._index == web.WIKI_WORD) { can.page.style(can, can.ui.profile, html.WIDTH, width+border, html.MAX_WIDTH, width+border), can.onimport.layout(can); return }
				can.page.style(can, can.ui.profile, html.WIDTH, width+border, html.MAX_WIDTH, width+border), can.onimport.layout(can)
			})
		}
	},
	display: function(can, msg) { var _msg = can.db.tabview[can.onexport.keys(can)]; _msg.Option(html.HEIGHT, msg.Option(html.HEIGHT)), border = 1
		var height = can.onexport.size(can, _msg.Option(html.HEIGHT)||0.5, can.ui.project.offsetHeight||can.ConfHeight())+border, width = can.ConfWidth()-can.ui.project.offsetWidth
		can.page.style(can, can.ui.display, html.MAX_HEIGHT, height, html.MAX_WIDTH, width), can.ui.display = _msg._display = can.ui._display
		if (can.ui.display._plugin && can.base.isIn(msg.Append(ctx.INDEX), web.CODE_XTERM)) {
			if (can.onexport.session(can, DISPLAY_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE))) {
				return can.onmotion.toggle(can, can.ui.display, true), can.onimport.layout(can)
			}
		}
		can.onimport.process(can, msg, can.ui.display, height-border, width, function(sub) { can.page.style(can, sub._output, html.MAX_HEIGHT, ""), can.ui.display._plugin = _msg._display = sub
			sub.Conf(ctx.ARGS) && can.onexport.session(can, DISPLAY_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE), JSON.stringify(sub.Conf(ctx.ARGS)))
			sub.onaction.close = function() { can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can)
				can.onexport.session(can, DISPLAY_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE), "")
			}
			if (sub._index == web.WIKI_WORD) { can.page.style(can, can.ui.display, html.HEIGHT, height+border, html.MAX_HEIGHT, height+border), can.onimport.layout(can); return }
			var _height = can.base.Max(sub._target.offsetHeight+border, height); _msg.Option(html.HEIGHT, _height), sub.onimport.size(sub, _height-border, width, true), can.onimport.layout(can)
		})
	},
	process: function(can, msg, target, height, width, cb) { can.onmotion.clear(can, target)
		if (msg.Option(ice.MSG_PROCESS) == ice.PROCESS_FIELD) {
			msg.Table(function(item) { item.type = chat.STORY, item.height = height, item.width = width, item.display = msg.Option(ice.MSG_DISPLAY)
				if (can.base.isIn(item.index, web.WIKI_WORD)) { item.style = html.OUTPUT }
				can.onimport.plug(can, item, function(sub) {
					sub.onaction.close = function() { can.onmotion.hidden(can, target), can.onimport.layout(can) }
					sub.onexport.output = function(_sub, _msg) { can.base.isFunc(cb) && cb(_sub.sup, _msg) }
				}, target)
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), function(msg) { can.onimport.layout(can) }, target)
		} else if (msg.Result().indexOf("<iframe src=") > -1) {
			var src = can.page.Select(can, can.page.Create(can, html.DIV, msg.Result()), html.IFRAME, function(target) { return target.src })[0]
			can.page.Append(can, target, [{type: html.IFRAME, src: src, style: {height: height, width: width}}])
		} else if (msg.Length() > 0 || msg.Result() != "") {
			can.onappend.table(can, msg, function(value, key, index, item) { return {text: [value, html.TD], onclick: function(event) {
				if (event.target.type == html.BUTTON) { return can.runAction(can.request(event, item), event.target.name, [], function() {

				}) }
				item.file && can.onimport.tabview(can, item.path, item.file||can.Option(nfs.FILE), item.line)
			}} }, target), can.onappend.board(can, msg, target), msg.Option(ice.MSG_STATUS) && can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.page.Append(can, target, [html.STATUS])._target)
			can.onmotion.delay(can, function() {
				can.page.Select(can, target, html.IMG, function(target) {
					var src = can.base.trimPrefix(target.src, location.origin)
					if (can.base.beginWith(src, "/require/", web.HTTP)) { return }
					target.src = "/require/"+can.Option(nfs.PATH)+can.base.trimPrefix(src, location.pathname.slice(0, location.pathname.lastIndexOf("/")+1))
				})
			})
		} else {
			return can.onmotion.toggle(can, target, false), can.onimport.layout(can), can.user.toastFailure(can, "nothing to display")
		} return can.onmotion.toggle(can, target, true), can.onmotion.delay(can, function() { can.onimport.layout(can), can.user.toastSuccess(can) }, 0)
	},
	toolkit: function(can, meta, cb) { can.base.isString(meta) && (meta = {index: meta})
		var key = [meta.index].concat(meta.args).join(","), sub = can.db.toolkit[key]; if (sub) { sub.select(); return }
		can.onimport.tool(can, [meta], function(sub) { can.db.toolkit[key] = sub
			sub.onaction._close = function() { delete(can.db.toolkit[key]), can.page.Remove(can, sub._target), can.page.Remove(can, sub._legend) }
			sub.onexport.record = function(sub, value, key, data) { if (!data.file) { return }
				if (data.file.indexOf("require/src") == 0) { data.path = nfs.SRC, data.file = line.file.slice(12) }
				can.onimport.tabview(can, data.path, can.base.trimPrefix(data.file, nfs.PWD), parseInt(data.line)); return true
			}, meta.index != ice.CAN_PLUGIN && (sub._legend._list = {index: meta.index, args: meta.args}), can.user.isWebview && can.onexport.recover(can), cb && cb(sub)
		}, can.ui.plug.parentNode, can.ui.plug), can.page.isDisplay(can.ui.plug) || can.onmotion.toggle(can, can.ui.plug, true) && can.onimport.layout(can)
	},
	layout: function(can) {
		if (can.isSimpleMode()) { can.page.style(can, can._output, html.MAX_HEIGHT, "") }
		if (can.isSimpleMode() || can.Conf(ctx.STYLE) == html.OUTPUT) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) } if (can.isCmdMode()) { can.ConfHeight(can.page.height()) }
		var content = can.ui.content; if (!content) { return } if (content._root) { can.ui.content = content._root } can.ui.size = {profile: can._msg.Option(html.WIDTH), display: can._msg.Option(html.HEIGHT)}
		can.ui.layout(can.ConfHeight(), can.ConfWidth(), 0, function(height, width) { can.ui.content = content, can.onlayout.layout(can, height, width)
			can.ui.tabs.style.width = ""
			var sub = can.ui.profile._plugin; sub && can.page.isDisplay(can.ui.profile) && sub.onimport && sub.onimport.size(sub, can.ui.profile.offsetHeight, can.ui.profile.offsetWidth-1, true)
			var sub = can.ui.content._plugin; if (!sub) { return } if (height == sub.ConfHeight()+sub.onexport.actionHeight(sub)+sub.onexport.statusHeight(sub) && width == sub.ConfWidth()) { return }
			content._root || sub.onimport.size(sub, height, width, true), can.onlayout.layout(can, height, width)
		})
		if (can.isCmdMode()) {
			can.page.style(can, can.ui.tabs.parentNode, html.WIDTH, can.ui.path.offsetWidth)
			can.page.style(can, can.ui.display, html.WIDTH, can.ui.path.offsetWidth)
			can.page.style(can, can.ui.display.parentNode, html.WIDTH, can.ui.path.offsetWidth)
			can.ui.zone.source._layout(), can.ui.zone[can.Option(nfs.PATH)] && can.ui.zone[can.Option(nfs.PATH)]._layout()
		}
		try { can.isCmdMode() && can._msg._tab.scrollIntoView() } catch (e) {}
	},
	exts: function(can, url, cb) { var sub = can.db.toolkit[url.split(web.QS)[0]]; if (sub) { return can.base.isFunc(cb)? cb(sub): sub.select() }
		can.onimport.toolkit(can, {index: ice.CAN_PLUGIN, display: (url[0] == nfs.PS || url.indexOf(web.HTTP) == 0? "": can.base.Dir(can._path))+url,
			style: url.split(nfs.PS).pop().split(nfs.PT)[0]}, function(sub) {
			sub.run = function(event, cmds, cb) {
				if (cmds.length > 0 && cmds[0] == ctx.ACTION) {
					can.run(can.request(event, can.Option()), cmds, cb||function(msg) { can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY)) })
				} else { can.onappend._output(sub, can.request(event), sub.Conf(ctx.DISPLAY)) }
			}, can.db.toolkit[url.split(web.QS)[0]] = sub, can.base.isFunc(cb)? cb(sub): sub.select(), can.page.Modify(can, sub._legend, can.base.trimPrefix(url, "inner/"))
		})
	},
	grow: function(can, msg, arg) { can.onimport.exts(can, "inner/output.js", function(sub) { sub.Conf(ctx.INDEX, can.ConfIndex())
		sub.select(true), can.onmotion.delay(can, function() {
			can.page.Append(can, sub._output, [{text: arg}]), sub._output.scrollTop = sub._output.scrollHeight
			can.misc.sessionStorage(can, [can.ConfIndex(), "output"], sub._output.innerHTML)
		})
	}) },
}, [""])
Volcanos(chat.ONFIGURE, {
	source: function(can, target, zone, path) { var args = can.base.getValid(can.misc.SearchHash(can), [can.Option(nfs.PATH), can.Option(nfs.FILE)])
		function show(target, zone, path) { can.run(can.request({}, {dir_root: path, dir_deep: true, "_toast": "目录加载中..."}), [nfs.PWD], function(msg) { can.onmotion.clear(can, target)
			can.onimport.tree(can, can.core.List(msg.Table(), function(item) {
				if (path == args[0] && args[1].indexOf(item.path) == 0) { item.expand = true } return item
			}), nfs.PATH, nfs.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target), zone._total(msg.Length())
		}, true) } if (path.length == 1) { return show(target, zone, path[0]) } can.page.Remove(can, zone._action)
		can.onimport.zone(can, can.core.List(path, function(path) { return kit.Dict(mdb.NAME, path, path == args[0]? chat._INIT: chat._DELAY_INIT, function(target, zone) { show(target, zone, path) }) }), target)
	},
	module: function(can, target, zone) { zone._delay_init = function() { can.runAction({}, mdb.INPUTS, [ctx.INDEX], function(msg) {
		can.onimport.tree(can, msg.Table(), ctx.INDEX, nfs.PT, function(event, item) { can.onimport.tabview(can, "", item.index, ctx.INDEX) }, target), zone._total(msg.Length())
	}) }, zone.toggle(false) },
	plugin: function(can, target, zone) { zone._delay_init = function() { var total = 0
		can.onimport.tree(can, can.core.ItemKeys(can.onengine.plugin.meta, function(key) { if (key[0] != "_") { return total++, {index: key} } }), ctx.INDEX, nfs.PT, function(event, item) {
			can.onimport.tabview(can, "", can.core.Keys(ice.CAN, item.index), ctx.INDEX)
		}, target), zone._total(total)
	}, zone.toggle(false) },
})
Volcanos(chat.ONLAYOUT, {
	_split: function(can, type) { var target = can.ui.content, msg = target._msg, scroll = target.scrollTop
		var style = type == html.FLOW? {height: target.offsetHeight/2, width: target.offsetWidth}: {height: target.offsetHeight, width: parseInt(target.offsetWidth/2)}
		var layout = can.page.insertBefore(can, [{view: [[html.LAYOUT, type]]}], target); layout.appendChild(target), can.page.style(can, target, style)
		var right = can.page.Append(can, layout, [{view: html.CONTENT, style: style}])._target; can.onmotion.cache(can, function() { return can.onexport.keys(can) }, right)
		can.ui.content = right, right._max = 0
		can.page.Appends(can, right, [{view: ["tips", "", msg.Option(nfs.FILE).split(nfs.PS).slice(-2).join(nfs.PS)]}])
		can.page.SelectChild(can, target, "tr.line", function(target) { can.onaction.appendLine(can, can.page.SelectOne(can, target, "td.text").innerText, right) })
		right.scrollTop = target.scrollTop = scroll, right._msg = msg, msg._content = layout._root = right._root = target._root = target._root||layout
	},
	split: function(can) { can.onlayout._split(can, html.FLOW) },
	vsplit: function(can) { can.onlayout._split(can, html.FLEX) },
	close: function(can) { var target = can.ui.content, close = target._msg._tab._close; if (!target._root) { return close() }
		var list = can.core.Item(target._cache); if (list.length > 0) { var key = target._cache_key, msg = can.db.tabview[key]
			return can.onmotion.cache(can, function() { return list[0] }, target), delete(target._cache[key]), msg._tab._close()
		} var right = target.nextSibling||target.previousSibling; if (can.page.ClassList.has(can, target.parentNode, html.FLEX)) { can.page.style(can, right, html.WIDTH, right.offsetWidth+target.offsetWidth) } else { can.page.style(can, right, html.HEIGHT, right.offsetHeight+target.offsetHeight) }
		if (target.parentNode.childElementCount == 2) { if (target.parentNode.parentNode == can.ui._profile.parentNode && right._msg) { right._msg._content = right }
			can.page.insertBefore(can, right, target.parentNode), can.page.Remove(can, target.parentNode)
		} else {
			can.page.Remove(can, target)
		} close(), can.ui.content = right, can.onimport.layout(can)
	},
	layout: function(can, height, width) { var target = can.ui.content._root||can.ui.content
		function layout(target, height, width) { can.page.style(can, target, html.HEIGHT, height, html.WIDTH, width)
			can.page.ClassList.has(can, target, html.LAYOUT) && can.page.SelectChild(can, target, "*", function(content, index, list) {
				var h = height/list.length, w = width; if (can.page.ClassList.has(can, target, html.FLEX)) { h = height, w = parseInt(width/list.length) }
				layout(content, h, w), content._msg && content._msg._plugin && can.onimport.size(content._msg._plugin, h, w, true)
			})
		} layout(target, height||target.offsetHeight, width||target.offsetWidth)
	},
})
Volcanos(chat.ONSYNTAX, {_init: function(can, msg, cb) { if (!msg) { return }
		var key = can.onexport.keys(can), path = msg.Option(nfs.PATH, can.Option(nfs.PATH)), file = msg.Option(nfs.FILE, can.Option(nfs.FILE))
		can.onmotion.cache(can, function(save, load) { save({profile: can.ui.profile.className, display: can.ui.display.className})
			can.onmotion.hidden(can, can.ui.profile), can.onmotion.hidden(can, can.ui.display)
			return load(key, function(bak) { can.ui.profile.className = bak.profile, can.ui.display.className = bak.display })
		}, can.ui.profile, can.ui.display)
		if (msg._content) { var list = can.page.Select(can, msg._content, html.DIV_CONTENT, function(target) { if (target._cache_key == key) { return target } })
			if (list.length > 0) { can.onmotion.select(can, msg._content, html.DIV_CONTENT, list[0]) } else {
				var list = can.page.Select(can, msg._content, html.DIV_CONTENT, function(target) { if (target._cache && target._cache[key]) { return target } })
				if (list.length > 0) { can.onmotion.cache(can, function() { return key }, list[0]) }
			} return can.ui.content = list[0]||msg._content, cb(msg._content)
		} var content = can.ui.content; if (content._root) { can.onmotion.cache(can, function() { return key }, content) }
		if (can.onexport.parse(can) == nfs.SVG) { msg.Option(ctx.INDEX, web.WIKI_DRAW+mdb.FS+path+file) }
		if (msg.Option(ctx.INDEX)) { return can.onsyntax._index(can, msg, function(target) { can.ui.content = target, cb(msg._content = content._root? (target._root = content._root): target) }, content._root? content: can.ui._profile.parentNode) }
		if (can.base.beginWith(msg.Results(), "<img")) { return can.onsyntax._image(can, msg, content, cb, key) }
		can.onsyntax._split(can, msg, content, cb, key)
	},
	_image: function(can, msg, content, cb, key) {
		if (!content._root && can.db.history.length > 1) { content = can.ui.content = can.page.insertBefore(can, [{view: html.CONTENT, style: {width: can.ui.content.offsetWidth}}], can.ui._profile), content._cache_key = key }
		content._max = 0, content._msg = msg, msg.__content = content, content.innerHTML = msg.Results()
		can.onengine.signal(can, VIEW_CREATE, msg), can.base.isFunc(cb) && cb(msg._content = content._root? content._root: content)
	},
	_split: function(can, msg, content, cb, key) {
		var path = msg.Option(nfs.PATH, can.Option(nfs.PATH)), file = msg.Option(nfs.FILE, can.Option(nfs.FILE))
		function show(p) {
			function include(list) { if (!list || list.length == 0) { return }
				can.core.List(list, function(from) {
					p.split = p.split|| can.onsyntax[from].split
					include(can.onsyntax[from].include)
					p.keyword = p.keyword||{}, can.core.Item(can.onsyntax[from].keyword, function(key, value) { p.keyword[key] = p.keyword[key] || value })
					can.core.Item(can.onsyntax[from], function(key, value) { p[key] = p[key] || value })
				})
			} p && include(p.include)
			p && p.prepare && can.core.ItemForm(p.prepare, function(value, index, key) { p.keyword = p.keyword||{}, p.keyword[value] = key })
			if (!content._root && can.db.history.length > 1) { content = can.ui.content = can.page.insertBefore(can, [{view: html.CONTENT, style: {width: can.ui.content.offsetWidth}}], can.ui._profile), content._cache_key = key }
			content._max = 0, content._msg = msg, msg.__content = content, can.page.Appends(can, content, [{view: ["tips", "", msg.Option(nfs.FILE).split(nfs.PS).slice(-2).join(nfs.PS)]}])
			if (msg.Length() > 0) { can.onsyntax._change(can, msg), can.onaction.rerankLine(can, "tr.line:not(.delete)>td.line")
				can.page.Select(can, content, "tr.line.delete>td.line", function(target) { target.innerHTML = "" })
			} else {
				can.core.List(msg.Result().split(lex.NL), function(item) { can.onaction.appendLine(can, item) })
			}
			can.onmotion.delay(can, function() { can.onappend.scroll(can, can.ui.content) })
			can.onengine.signal(can, VIEW_CREATE, msg), can.base.isFunc(cb) && cb(msg._content = content._root? content._root: content)
		} can.require([chat.PLUGIN_LOCAL+"code/inner/syntax.js"], function() { var parse = can.onexport.parse(can); can.Conf(chat.PLUG) && (can.onsyntax[parse] = can.Conf(chat.PLUG))
			var p = can.onsyntax[parse]; !p? can.runAction({}, mdb.PLUGIN, [parse, file, path], function(msg) {
				p = can.base.Obj(msg.Result())
				if (p && p.script) { can._msg.Option(lex.PARSE, msg.Option(lex.PARSE))
					can.require([p.script], function() { show(can.onsyntax[msg.Option(lex.PARSE)||parse]) })
				} else {
					show(can.onsyntax[parse] = p)
				}
			}): show(p)
		})
	},
	_space: function(can, msg, cb, parent) { if (can.Option(nfs.LINE) == web.SPACE) { can.ui.zone.space && can.onmotion.delay(can, function() { can.ui.zone.space.refresh() }, 1000)
		var target = can.page.Append(can, parent, [{view: [html.CONTENT, html.IFRAME], src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), height: can.ui.content.offsetHeight, width: can.ui.content.offsetWidth}])._target
		return can.base.isFunc(cb) && cb(target), true
	} },
	_index: function(can, msg, cb, parent) { if (can.onsyntax._space(can, msg, cb, parent)) { return }
		var index = msg.Option(ctx.INDEX).split(mdb.FS), item = {type: chat.STORY, index: index[0], args: index.slice(1)}
		if (item.index == web.CODE_XTERM && item.args.length > 0) { item.style = html.OUTPUT }
		if (item.index == web.CHAT_MACOS_SESSION && item.args.length > 0) { item.style = html.OUTPUT }
		if (item.index == web.CHAT_MACOS_DESKTOP) { item.style = html.OUTPUT }
		can.onimport.plug(can, item, function(sub) { sub.onimport.size(sub, can.ui.content.offsetHeight, can.ui.content.offsetWidth, true)
			sub.onimport._open = function(_, msg, arg) {
				var link = can.misc.ParseURL(can, arg); if (link.pod && arg.indexOf(location.origin) == 0) { can.onimport.tabview(can, "", link.pod, web.SPACE), sub.Update(); return }
				can.onimport.tabview(can, "", arg, web.SPACE), sub.Update()
			}
			sub.onaction.close = function() { msg._tab._close() }
			sub.onexport.title = function(_, title) { can.page.Modify(can, can.page.SelectOne(can, msg._tab, html.SPAN_NAME), title) }
			sub.onexport.record = function(_, value, key, item) { item.file && can.onimport.tabview(can, item.path, item.file, item.line); return true }
			sub.onexport.output = function() { can.onimport.layout(can) }
			msg._plugin = sub, can.base.isFunc(cb) && cb(sub._target), sub.Focus()
		}, parent)
	},
	_parse: function(can, line) { var parse = can.onexport.parse(can)
		function wrap(text, type) { return can.page.Format(html.SPAN, can.page.trans(can, text), type) }
		var p = can.onsyntax[parse]; if (!p) { return can.page.trans(can, line) } p = can.onsyntax[p.link]||p, p.split = p.split||{}, p.keyword = p.keyword||{}
		if (p.prefix && can.core.Item(p.prefix, function(pre, type) { if (can.base.beginWith(line, pre)) { return line = wrap(line, type) } }).length > 0) { return line }
		if (p.suffix && can.core.Item(p.suffix, function(end, type) { if (can.base.endWith(line, end)) { return line = wrap(line, type) } }).length > 0) { return line }
		if (p.parse) { var text = p.parse(can, line, wrap); if (text != undefined) { return text } }
		if (!p.keyword) { return line }
		line = can.core.List(can.core.Split(line, p.split.space||"\t ", p.split.operator||"{[(.,:;!?|$@&*+-<=>)]}", {detail: true}), function(item, index, array) {
			item = can.base.isObject(item)? item: {text: item}; var text = item.text, type = p.keyword[text]
			switch (item.type||type) {
				case code.STRING: return wrap(item.left+text+item.right, code.STRING)
				case code.COMMENT:
				case code.KEYWORD:
				case code.PACKAGE:
				case code.DATATYPE:
				case code.FUNCTION:
				case code.CONSTANT:
				case code.OBJECT: return wrap(text, type)
				default: var t = can.core.Item(p.regexp, function(reg, type) { var m = text.match(new RegExp(reg)); if (m && m.length > 0 && m[0] == text) { return type} })
					return t && t.length > 0? wrap(text, t[0]): type? wrap(text, type): wrap(text, "_")
			}
		}).join(""); return line
	},
	_change: function(can, msg) { var _delete = [], _insert = [], deletes = [], inserts = []
		function scroll(item, type, length, index) {
			var tr = can.onaction.appendLine(can, item); can.onappend.style(can, type, tr)
			if (index > 0) { return }
			var line = can.onexport.line(can, tr)||can.onexport.line(can, tr.previousSibling)
			can.onmotion.delay(can, function() {
				var bar = can.onappend.scroll(can, can.ui.content, line/can.ui.content._max, length/can.ui.content._max); can.onappend.style(can, type, bar)
				bar && (bar.onclick = function() { can.onimport.tabview(can, "", can.Option(nfs.FILE), line) })
			})
		}
		function append() { var rest = []
			while (deletes.length > 0 && inserts.length > 0 && deletes[0] == inserts[0]) { can.onaction.appendLine(can, deletes[0]), deletes = deletes.slice(1), inserts = inserts.slice(1) }
			while (deletes.length > 0 && inserts.length > 0 && deletes[deletes.length-1] == inserts[inserts.length-1]) { can.onaction.appendLine(can, deletes[deletes.length-1]), deletes.pop(), inserts.pop() }
			while (deletes.length > 0 && inserts.length > 0 && deletes[0] == inserts[inserts.length-1]) { rest.push(deletes[0]), deletes = deletes.slice(1), inserts.pop() }
			can.core.List(deletes, function(item, index, list) { scroll(item, mdb.DELETE, list.length, index) }), deletes = []
			can.core.List(inserts, function(item, index, list) { scroll(item, mdb.INSERT, list.length, index) }), inserts = []
			can.core.List(rest, function(item) { can.onaction.appendLine(can, item) })
		}
		msg.Table(function(value) { can.core.List(value.text.split(lex.NL), function(item, index, list) {
			if (index == list.length-1 && !can.base.endWith(value.text, lex.NL)) {
				if (value.type == mdb.DELETE) { _delete.push(item) } else if (value.type == mdb.INSERT) { _insert.push(item) } else { _delete.push(item), _insert.push(item) }
			} else if (value.type == mdb.DELETE) {
				_delete.push(item), deletes.push(_delete.join("")), _delete = []
			} else if (value.type == mdb.INSERT) {
				_insert.push(item), inserts.push(_insert.join("")), _insert = []
			} else if (_delete.length > 0 || _insert.length > 0) {
				_delete.push(item), _insert.push(item), deletes.push(_delete.join("")), _delete = [], inserts.push(_insert.join("")), _insert = []
			} else { append(), can.onaction.appendLine(can, item) }
		}) }), _delete.length > 0 && deletes.push(_delete.join("")), _insert.length > 0 && inserts.push(_insert.join("")), append()
		var list = can.page.Select(can, can.ui.content, "tr.insert,tr.delete")
		list && list[0] && can.onmotion.delay(can, function() {
			can.onimport.tabview(can, "", can.Option(nfs.FILE), can.onexport.line(can, list[0].previousSibling))
		})
	},
})
Volcanos(chat.ONACTION, {
	_trans: {show: "预览", exec: "展示"},
	_getLine: function(can, line) { return can.page.Select(can, can.ui.content, "tr.line>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return td.parentNode } })[0] },
	_getContent: function(can, line) {
		can.ui.content = line.parentNode, can._msg = can.ui.content._msg, can.Option(nfs.PATH, can._msg.Option(nfs.PATH)), can.Option(nfs.FILE, can._msg.Option(nfs.FILE))
		can.onaction.selectContent(can, function(target) {
			can.page.ClassList.set(can, target, html.SELECT, target == can.ui.content)
		}), can.onimport.__tabPath(can)
	},
	selectContent: function(can, cb) {
		function select(target) { target && can.core.List(target.children, function(target) {
				cb(target), can.page.ClassList.has(can, target, html.LAYOUT) && select(target)
		}) } select(can.ui.content._root)
	},
	appendLine: function(can, value, target) { var ui = can.page.Append(can, target||can.ui.content, [{view: [nfs.LINE, html.TR], list: [
		{view: [nfs.LINE, html.TD, ++can.ui.content._max], onclick: function(event) {
			can.onaction._getContent(can, ui._target), can.onaction.selectLine(can, ui.tr)
		}, ondblclick: function(event) { can.onaction.find(event, can) }},
		{view: [mdb.TEXT, html.TD, can.onsyntax._parse(can, value)], onclick: function(event) {
			can.onaction._getContent(can, ui._target), can.onaction.selectLine(can, ui.tr), can.onkeymap._insert && can.onkeymap._insert(event, can, 0, (event.offsetX)/8.5)
		}, ondblclick: function(event) { can.onaction.searchLine(event, can, can.onexport.selection(can, ui.text.innerText)) }}
	]}]); return ui._target },
	modifyLine: function(can, line, value) { can.page.Select(can, can.onaction._getLine(can, line), "td.text", function(td) { td.innerHTML = can.onsyntax._parse(can, value) }) },
	rerankLine: function(can, which, target) { can.ui.content._max = can.page.Select(can, target||can.ui.content, which||"tr.line:not(.delete)>td.line", function(td, index) { return td.innerText = index+1 }).length },
	selectLine: function(can, line, scroll) { var content = can.ui.content; if (!line) { return can.onexport.line(can, can.page.SelectOne(can, content, "tr.select")) }
		can.page.Select(can, content, "tr.line>td.line", function(target) { var n = parseInt(target.innerText); target = target.parentNode
			if (!can.page.ClassList.set(can, target, html.SELECT, n == line || target == line)) { return }
			line = target, can.Status(nfs.LINE, can.onexport.position(can, can.Option(nfs.LINE, n)))
		}); if (!can.base.isObject(line)) { return 0 }
		can.page.Select(can, line, "td.text", function(target) {
			can.current = {line: line, next: function() { return line.nextSibling }, prev: function() { return line.previousSibling },
				text: function(text) { return text != undefined && can.onaction.modifyLine(can, line, text), target.innerText },
				scroll: function(count) { if (count) { content.scrollTop += count*can.current.line.offsetHeight }
					return parseFloat((can.current.line.offsetTop-content.scrollTop)/can.current.line.offsetHeight)
				}, window: function() { return parseFloat(content.offsetHeight/can.current.line.offsetHeight) },
			}, can.onimport.history(can, {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE), text: can.current.text()})
			can.isCmdMode() && can.onexport.session(can, SELECT_LINE+nfs.DF+can.Option(nfs.PATH)+can.Option(nfs.FILE), can.onexport.line(can, can.current.line))
			can.onexport.hash(can), scroll && can.onaction.scrollIntoView(can), can.onengine.signal(can, LINE_SELECT, can._msg)
		}); return can.onexport.line(can, line)
	},
	scrollIntoView: function(can, offset) { can.ui.content.scrollTo(0, (can.onexport.line(can, can.current.line)-can.current.window()/4)*can.current.line.offsetHeight) },
	searchLine: function(event, can, value) { var offset = 0; can.page.Select(can, can.ui.content, "tr.line", function(tr) {
		tr == can.current.line && can.page.Select(can, tr, "td.text>span", function(span) { offset += span.innerText.length;
			(span == event.target || span.innerText == value) && can.runAction(can.request(event, {name: value, text: can.current.text(), offset: offset-1}, can.Option()), code.NAVIGATE, [], function(msg) {
				msg.Append(nfs.FILE)? can.onimport.tabview(can, msg.Append(nfs.PATH), msg.Append(nfs.FILE), msg.Append(nfs.LINE)): can.user.toastFailure(can, "not found "+value)
			})
		}), can.page.Select(can, tr, "td.text", function(td) { offset += td.innerText.length+1 })
	}) },
	show: function(event, can) { can.runAction(can.request(event, {_toast: "渲染中...", args: can.onexport.session(can, PROFILE_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE))}), mdb.RENDER, [can.onexport.parse(can), can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.profile(can, msg) }) },
	exec: function(event, can) { can.runAction(can.request(event, {_toast: "执行中...", args: can.onexport.session(can, DISPLAY_ARGS+can.Option(nfs.PATH)+can.Option(nfs.FILE))}), mdb.ENGINE, [can.onexport.parse(can), can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.display(can, msg) }) },
	plug: function(event, can, button) {
		function show(index, args) { input.cancel(); can.onimport.toolkit(can, {index: index, args: can.core.Split(args||"")}, function(sub) { sub.select() }) }
		var input = can.user.input(can.request(event, {type: button}), can, [{type: html.TEXT, name: ctx.INDEX, run: function(event, cmds, cb) { can.run(event, cmds, function(msg) {
			if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS && cmds[2] == ctx.INDEX) { var _msg = can.request({})
				can.core.Item(can.db.toolkit, function(index) { _msg.Push(ctx.INDEX, index) }), _msg.Push(ctx.INDEX, ""), _msg.Copy(msg), cb(_msg)
			} else { cb(msg) }
		}, true) }}, ctx.ARGS], function(list) { show(list[0], list[1]) })
	},
	open: function(event, can, button) {
		var input = can.user.input(can.request(event, {type: button}), can, [{name: nfs.FILE, style: {width: (can._output.offsetWidth-can.ui.project.offsetWidth)/2}, select: function(item) { input.submit(event, can, web.SUBMIT) }, run: function(event, cmds, cb) {
			can.run(can.request(event, {paths: can.db.paths.join(mdb.FS)}), cmds, function(msg) { function push(type, name) { _msg.Push(nfs.PATH, can.core.List(arguments).join(nfs.DF)) }
				if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS) { var _msg = can.onengine.signal(can, "tabview.open.inputs"), func = can.onexport.func(can)
					can.core.Item(can.db.tabview, function(key) { var ls = can.core.Split(key, nfs.DF); push(ls[0]+ls[1]) }), _msg.Copy(msg)
					can.core.List(func.list, function(item) { var ls = can.core.Split(item, nfs.DF, nfs.DF); push(nfs.LINE, ""+ls[1]+nfs.DF+ls[0]) })
					can.core.Item(can.onengine.plugin.meta, function(key, value) { push(ctx.INDEX, "can."+key) }), cb(_msg)
				} else { cb(msg) }
			}, true)
		}}], function(list, input) { input.cancel(); var ls = can.core.Split(list[0], nfs.DF, nfs.DF); switch (ls[0]) {
			case web.HTTP: return can.onimport.tabview(can, "", list[0], web.SPACE)
			case nfs.LINE: return can.onaction.selectLine(can, parseInt(ls[1]), true)
			case web.SPACE: return can.onimport.tabview(can, "", ls[1].indexOf(web.HTTP) == 0? list[0].slice(6): ls[1], web.SPACE)
			case ctx.INDEX: return can.onimport.tabview(can, "", ls[1], ls[0])
			case ssh.SHELL: return can.onimport.tabview(can, "", [web.CODE_XTERM, list[0].slice(6)].join(mdb.FS), ctx.INDEX)
			case cli.OPENS: return can.runAction(event, ls[0], ls[1], null, true)
			default: var ls = can.onexport.split(can, list[0]); can.onimport.tabview(can, ls[0], ls[1])
		} }); can.page.Modify(can, input._target, {className: "input vimer open float"})
		can.page.style(can, input._target, html.LEFT, can.ui.project.offsetWidth+(can._output.offsetWidth)/4-34, html.TOP, can._output.offsetHeight/4, html.RIGHT, "")
	},
	find: function(event, can) { var last = can.onexport.line(can, can.current.line)
		var ui = can.page.Append(can, can._output, [{view: "input vimer find float", list: [html.ACTION, html.OUTPUT],
			style: {left: can.ui.project.offsetWidth+can._output.offsetWidth/4-34, top: can._output.offsetHeight/2-60}}]); can.onmotion.move(can, ui._target)
		function find(begin, text) { for (begin; begin <= can.ui.content._max; begin++) { if (can.onexport.text(can, can.onaction._getLine(can, begin)).indexOf(text) > -1) {
			return last = begin, can.onaction.selectLine(can, begin, true)
		} } last = 0, can.user.toast(can, "已经到最后一行") }
		function complete(target, button) {
			can.onappend.figure(can, {action: "key", mode: chat.SIMPLE, _enter: function(event) {
				if (event.ctrlKey) { meta.grep() } else { meta[button](), can.onmotion.delay(can, function() { target.focus() }) } return true
			}, run: function(event, cmds, cb) { var msg = can.request(event); can.core.List(can.core.Split(can.current.text(), "\t {([,:;=<>])}", {detail: true}), function(value) {
				if (can.base.isObject(value)) { if (value.type == code.SPACE) { return }
					value.type == code.STRING && msg.Push(mdb.VALUE, value.left+value.text+value.right), msg.Push(mdb.VALUE, value.text)
				} else {
					value.indexOf(nfs.PT) > -1 && msg.Push(mdb.VALUE, value.split(nfs.PT).pop()), msg.Push(mdb.VALUE, value)
				}
			}), cb(msg) }}, target)
		}
		function grep(value, file, path) { var arg = can.core.List(arguments); can.onimport.exts(can, "inner/search.js", function(sub) {
			can.page.isDisplay(sub._target) || (sub._delay_init = false, sub.select()), sub.runAction(can.request({}, {value: value}), nfs.GREP, arg)
		}) }
		var from, to; var meta = can.onappend._action(can, [
			{type: html.TEXT, name: nfs.FROM, style: {width: 200}, _init: function(target) { from = target, complete(target, nfs.FIND), can.onmotion.delay(can, function() { target.focus() }) }},
			{type: html.BUTTON, name: nfs.FIND}, {type: html.BUTTON, name: nfs.GREP}, {type: html.TEXT, name: nfs.TO, _init: function(target) { to = target, complete(target, nfs.REPLACE) }},
			{type: html.BUTTON, name: nfs.REPLACE}, {type: html.BUTTON, name: cli.CLOSE},
		], ui.action, {_trans: {find: "查找", grep: "搜索", replace: "替换"},
			find: function() { grep(from.value, can.Option(nfs.FILE), can.Option(nfs.PATH)), find(last+1, from.value) },
			grep: function() { grep(from.value, nfs.PT, can.Option(nfs.PATH)) },
			replace: function() { var text = can.current.text(), line = can.onexport.line(can, can.current.line)
				can.db.undo.push(function() { can.onaction.selectLine(can, line), can.onaction.modifyLine(can, line, text) })
				grep(from.value, can.Option(nfs.FILE), can.Option(nfs.PATH))
				can.current.text(text.replace(from.value, to.value)), can.current.text().indexOf(from.value) == -1, find(last+1, from.value)
			}, close: function() { can.page.Remove(can, ui._target) },
		})
	},
	clear: function(event, can) { if (can.onmotion.clearFloat(can)) { return }
		if (can.page.Select(can, document.body, "div.vimer.find.float", function(target) { return can.page.Remove(can, target) }).length > 0) { return }
		if (can.page.Select(can, can.ui.plug, "legend.select", function(target) { return target.click(), target }).length > 0) { return }
		if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
	},
	onkeydown: function(event, can) {
		if (can.onkeymap.selectCtrlN(event, can, can.ui.tabs, html.DIV_TABS)) { return }
		can.db._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can.db._key_list, can.ui.content)
	},
})
Volcanos(chat.ONEXPORT, {
	// list: [mdb.TIME, nfs.FILE, nfs.LINE, ice.BACK],
	path: function(can) { return can.Option(nfs.PATH)+can.Option(nfs.FILE) },
	line: function(can, line) { return parseInt(can.core.Value(can.page.SelectOne(can, line, "td.line"), "innerText")) },
	text: function(can, line) { return can.core.Value(can.page.SelectOne(can, line, "td.text"), "innerText") },
	content: function(can) { return can.page.Select(can, can.current&&can.current.content||can.ui.content, "td.text", function(item) { return item.innerText.trimEnd() }).join(lex.NL) },
	position: function(can, index, total) { total = total||can.ui.content._max; return (parseInt(index))+nfs.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
	size: function(can, size, full) { if (size > 1) { return size } if (size > 0) { return size*full } },
	keys: function(can, path, file) { return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(nfs.DF) },
	hash: function(can) { return can.misc.SearchHash(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE)) },
	selection: function(can, str) { var s = document.getSelection().toString(), begin = str.indexOf(s), end = begin+s.length
		for (var i = begin; i >= 0; i--) { if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break } } return s
	},
	recover: function(can) {
		can.onexport.session(can, RECOVER_TABS, can.page.SelectChild(can, can.ui.tabs, "", function(target) { return target._list }))
		can.onexport.session(can, RECOVER_TOOL, can.page.SelectChild(can, can.ui.plug, "", function(target) { return target._list }))
	},
	parse: function(can) { return can._msg.Option("parse")||can.base.Ext(can.Option(nfs.FILE)) },
	split: function(can, file) { var ls = file.split(nfs.PS); if (ls.length == 1) { return [nfs.PWD, ls[0]] }
		if (ls[0] == ice.USR) { return [ls.slice(0, 2).join(nfs.PS)+nfs.PS, ls.slice(2).join(nfs.PS)] }
		return [ls.slice(0, 1).join(nfs.PS)+nfs.PS, ls.slice(1).join(nfs.PS)]
	},
	func: function(can) { var p = can.onsyntax[can.onexport.parse(can)]||{}, opts = {}
		function indent(text) { var indent = 0; for (var i = 0; i < text.length; i++) { switch (text[i]) {
			case lex.TB: indent+=4; break
			case lex.SP: indent++; break
			default: return indent
		} } }
		var list = [], current = can.Option(nfs.LINE), percent = " = "+parseInt(can.Option(nfs.LINE)*100/(can.ui.content._max||1))+"%"
		can.page.Select(can, can.ui.content, "tr.line>td.text", function(item, index) { var text = item.innerText, _indent = indent(text)
			function push(item) { list.push(item+(item? nfs.DF+(index+1): "")); if (index < can.Option(nfs.LINE)) { current = list[list.length-1], percent = " = "+parseInt((index+1)*100/(can.ui.content._max||1))+"%" } }
			p.func && p.func(can, push, text, _indent, opts)
		}); return {list: list, current: current, percent: percent}
	},
})
Volcanos(chat.ONKEYMAP, {
	_mode: {plugin: {
		Escape: shy("清除浮窗", function(event, can) { can.onaction.clear(event, can) }),
		f: shy("打开文件", function(event, can) { can.onaction.open(event, can) }),
		g: shy("查找搜索", function(event, can) { can.onaction.find(event, can) }),
		d: shy("查找函数", function(event, can) { can.page.Select(can, can.ui.path, "span.func", function(target) { target.click() }) }),
		v: shy("渲染界面", function(event, can) { can.onaction.show(event, can) }),
		r: shy("执行命令", function(event, can) { can.onaction.exec(event, can) }),
		l: shy("打开右边标签", function(can) { var next = can._tab.nextSibling; next && next.click() }),
		h: shy("打开左边标签", function(can) { var prev = can._tab.previousSibling; prev && prev.click() }),
		x: shy("关闭标签", function(can) { can._tab._close() }),
	}}, _engine: {},
})
})()
