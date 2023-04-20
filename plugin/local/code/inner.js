(function() {
const PROJECT_HIDE = "web.code.inner:project", TABVIEW_HIDE = "web.code.inner:tabview"
const CURRENT_FILE = "web.code.inner:currentFile", SELECT_LINE = "web.code.inner:selectLine"
const VIEW_CREATE = "tabview.view.create", VIEW_REMOVE = "tabview.view.remove", LINE_SELECT = "tabview.line.select"	
Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { var paths = can.core.Split(can.Option(nfs.PATH), mdb.FS); can.Option(nfs.PATH, paths[0])
		can.core.List(paths.concat(can.core.Split(msg.Option(nfs.REPOS))), function(p) { if (can.base.endWith(p, "-story/", "-dict/")) { return }
			if (p && paths.indexOf(p) == -1 && p[0] != nfs.PS) { paths.push(p) }
		}), can.onmotion.clear(can), can.onappend.style(can, code.INNER), can.sup.onimport._process = function() {}
		can.db = {paths: paths, tabview: {}, history: [], _history: [], toolkit: {}}, can.db.tabview[can.onexport.keys(can)] = msg
		can.ui = can.onappend.layout(can, [html.PROJECT, [html.TABS, nfs.PATH, [html.CONTENT, html.PROFILE], html.DISPLAY, html.PLUG]])
		can.ui._content = can.ui.content, can.ui._profile = can.ui.profile, can.ui._display = can.ui.display, can.onmotion.hidden(can, can.ui.plug)
		can.onmotion.hidden(can, can.ui.profile), can.onmotion.hidden(can, can.ui.display)
		switch (can.Mode()) {
			case chat.SIMPLE: // no break
			case chat.FLOAT: can.onmotion.hidden(can, can.ui.project); break
			case chat.CMD: can.misc.sessionStorage(can, PROJECT_HIDE) == html.HIDE && can.onmotion.hidden(can, can.ui.project)
				if (can.misc.sessionStorage(can, TABVIEW_HIDE) == html.HIDE) { can.onmotion.hidden(can, can.ui.project), can.onmotion.hidden(can, can.ui.tabs) }
				can.onappend.style(can, html.OUTPUT)
			case chat.FULL: // no break
			default: can.user.isMobile && can.onmotion.hidden(can, can.ui.project), can.onimport.project(can, paths), can.onimport._tabs(can)
		} var args = can.misc.SearchHash(can)
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() { if (args.length > 0 && can.isCmdMode()) {
			can.onimport._tabview(can, args[args.length-3], args[args.length-2]||can.Option(nfs.FILE), args[args.length-1])
		} }), can.onkeymap._build(can)
		can.ui.profile.onclick = function(event) { if (can.page.tagis(event.target, html.A)) {
			var link = can.misc.ParseURL(can, event.target.href); if (!link.cmd) { return } can.onkeymap.prevent(event)
			link.cmd == web.CODE_VIMER? can.onimport.tabview(can, link.path, link.file, link.line): can.onimport.tabview(can, link.path, link.cmd, ctx.INDEX)
		} }, can.base.isFunc(cb) && cb(msg)
	},
	_tabs: function(can) { if (!can.isCmdMode()) { return can.ui.tabs = can._action }
		can.page.Append(can, can.ui.tabs, can.core.List([
			{name: can.page.unicode.menu, onclick: function() { can.user.carte(event, can, can.onaction, can.onaction.list) }},
			{name: can.page.unicode.refresh, style: {"font-size": "24px", "padding-top": 0}, onclick: function() { location.reload() }},
		], function(item) { return can.base.Copy(item, {view: [[html.ITEM, html.ICON], "", item.name]}) })), can.page.Append(can, can.ui.tabs, can.user.header(can))
	},
	__tabPath: function(can, cache) { var target = can.ui.path
		can.onimport._tabPath(can, nfs.PS, nfs.PATH, can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), function(p) {
			var ls = can.onexport.split(can, p); can.onimport.tabview(can, ls[0], ls[1])
		}, target), can.onimport._tabFunc(can, target, cache), can.onimport._tabMode(can), can.onimport._tabIcon(can)
		target.ondblclick = function(event) {
			var show = can.onmotion.toggle(can, can.ui.tabs); can.onmotion.toggle(can, can.ui.project, show), can.onimport.layout(can)
			can.isCmdMode() && can.misc.sessionStorage(can, TABVIEW_HIDE, show? "": html.HIDE)
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
				can.user.carte(event, can, {}, msg[msg.append[0]], function(event, button) {
					can.onimport.tabview(can, "", [index, button].join(mdb.FS), ctx.INDEX)
				})
			})
		}}]) })
	},
	tabPath: function(event, can, ps, key, pre, cb, parent) { can.runAction(event, mdb.INPUTS, [key, pre, lex.SPLIT], function(msg) { var _trans = {}
		var carte = can.user[parent? "carteRight": "carte"](event, can, {_style: key}, (msg.Length() > 10? [web.FILTER]: []).concat(msg.Table(function(value) {
			var p = can.core.Split(value[key], ps).pop()+(can.base.endWith(value[key], ps)? ps: ""); return _trans[p] = value[key], p
		})), function(event, button) {
			can.base.endWith(button, ps)? can.onimport.tabPath(event, can, ps, key, pre+button, cb, carte): cb(_trans[button], pre)
		}, parent)._target, file = can.core.Split(event.target.innerHTML.trim(), nfs.PT)[0]
		can.page.Select(can, carte, html.DIV_ITEM, function(target) { target.innerHTML.trim() != event.target.innerHTML.trim() && can.base.beginWith(target.innerHTML, file+nfs.PT) && carte.insertBefore(target, carte.firstChild) })
		function remove(p) { if (p && p._sub) { remove(p._sub), can.page.Remove(can, p._sub), delete(p._sub) } } if (parent) { remove(parent), parent._sub = carte }
	}) },
	_tabFunc: function(can, target, cache) {
		if (cache) { var func = can.db._func||{list: []} } else { var func = can.onexport.func(can); can.db._func = func }
		if (func.list.length > 0) { can.db.tabFunc = can.db.tabFunc||{}
			var last = can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)]||{}; can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = last
			var carte, list = [web.FILTER]; can.core.Item(last, function(key) { list.push(key) }), list = list.concat(func.list)
		}
		can.page.Append(can, target, [{view: [[html.ITEM, "func"], html.SPAN, (func.current||"func")+nfs.PS+can.ui.content._max+func.percent+lex.SP+can.base.Size(can._msg.result[0].length)], onclick: function(event) {
			carte = can.user.carte(event, can, {_style: nfs.PATH}, list, function(ev, button) { last[button] = true, carte.close()
				can.onimport.tabview(can, "", can.Option(nfs.FILE), can.core.Split(button, nfs.DF)[1])
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
			"\u25E8 ": function(event) {
				if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) } can.onaction.show(event, can)
			},
			"\u25E8": shy({"font-size": "23px", rotate: "90deg", translate: "1px 1px"}, function(event) {
				if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) } can.onaction.exec(event, can)
			}),
			"\u25E7": function(event) {
				var show = can.onmotion.toggle(can, can.ui.project); can.onimport.layout(can)
				can.isCmdMode() && can.misc.sessionStorage(can, PROJECT_HIDE, show? "": html.HIDE)
			},
			"\u2756": shy({"font-size": "20px", translate: "0 2px"}, function(event) { can.onaction.plug(event, can) }),
			"\u271A": shy({"font-size": "20px", translate: "0 2px"}, function(event) { can.onaction.open(event, can) }),
		}, function(text, cb) { return cb && {text: [text, html.SPAN, html.VIEW], style: cb.meta, onclick: cb} }))
	},
	_tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		if (!can.user.isWebview) { return can.onimport.tabview(can, path, file, line, cb) }
		if (!can.db.tabview[key]) { return can.onimport.tabview(can, path, file, line, cb), can.db.tabview[key] = true }
	},
	tabview: function(can, path, file, line, cb) { path = path||can.Option(nfs.PATH); var key = can.onexport.keys(can, path, file)
		function isIndex() { return line == ctx.INDEX } function isSpace() { return line == web.SPACE }
		function show(skip) { can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.db.tabview[key]
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can.misc.sessionStorage(can, SELECT_LINE+nfs.DF+path+file)||can._msg.Option(nfs.LINE)||1}))
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg; can.onexport.hash(can)
				can.isCmdMode() && can.onexport.title(can, path+file), can.onmotion.select(can, can.ui.tabs, html.DIV_TABS, msg._tab), can.isCmdMode() && msg._tab.scrollIntoView()
				if (isSpace()) { can.ui.path.innerHTML = can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)})) } else if (isIndex()) {
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
		function load(msg) { var skip = false; can.db.tabview[key] = msg
			can.onimport.tabs(can, [{name: can.base.beginWith(file, "http://")? file.split(web.QS)[0]: file.split(mdb.FS)[0].split(isIndex()? nfs.PT: nfs.PS).pop(), text: file, _menu: shy([
				nfs.SAVE, nfs.TRASH, web.REFRESH,
			], function(event, button, meta) { can.onaction[button](event, can, button) })}], function(event, tabs) {
				can._tab = msg._tab = tabs._target, show(skip), skip = true
			}, function(tabs) { can.onengine.signal(can, VIEW_REMOVE, msg), can.ui.zone.source.refresh()
				msg.__content || can.page.Remove(can, msg._content), msg._profile != can.ui._profile && can.page.Remove(can, msg._profile)
				can.ui._profile._cache && delete(can.ui._profile._cache[key]), can.ui._display._cache && delete(can.ui._display._cache[key])
				delete(can.db.tabview[key]), can._cache_data && delete(can._cache_data[key])
			}, can.ui.tabs)
		}
		if (can.db.tabview[key]) { return !can._msg._tab && !can.isSimpleMode()? load(can.db.tabview[key]): show() }
		isIndex()||isSpace()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, record) { can.base.Eq(record, can.db.history[can.db.history.length-1], mdb.TEXT) || can.db.history.push(record)
		return can.Status(ice.BACK, can.db.history.length), record
	},
	project: function(can, path) { can.onmotion.clear(can, can.ui.project), can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
		if (can.base.isFunc(cb)) { return {name: name, _trans: can.onfigure._trans? can.onfigure._trans[name]||"": "", _init: function(target, zone) { return cb(can, target, zone, path) }} }
	}), can.ui.project) },
	profile: function(can, msg) { var _msg = can.db.tabview[can.onexport.keys(can)]; _msg.Option(html.WIDTH, msg.Option(html.WIDTH)||0.5)
		if (msg.Result().indexOf("<iframe src=") > -1) { if (_msg._profile != can.ui._profile) { can.page.Remove(can, _msg._profile) }
			var src = can.page.Select(can, can.page.Create(can, html.DIV, msg.Result()), html.IFRAME, function(target) { return target.src })[0]
			can.ui.profile = _msg._profile = can.page.Append(can, can.ui._profile.parentNode, [{view: [html.PROFILE, html.IFRAME], src: src}])._target
			can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
		} else { var height = can.ui.profile.offsetHeight||can.ui._content.offsetHeight; can.ui.profile = _msg._profile = can.ui._profile
			var width = can.onexport.size(can, _msg.Option(html.WIDTH), can.ConfWidth()-can.ui.project.offsetWidth)
			can.onimport.process(can, msg, can.ui.profile, height, width, function(sub) { can.ui.profile._plugin = can._msg._profile = sub
				can.page.style(can, sub._output, html.MAX_WIDTH, ""); var _width = can.base.Max(sub._target.offsetWidth, width)
				_msg.Option(html.WIDTH, _width), can.onimport.layout(can), sub.onimport.size(sub, height, _width == width? _width-1: _width, true)
			})
			msg.Append(ctx.INDEX) == "" && can.page.Select(can, can.ui.profile, html.TABLE, function(target) { can.onmotion.delay(can, function() {
				if (target.offsetWidth < can.ui._profile.offsetWidth) { _msg.Option(html.WIDTH, target.offsetWidth+1), can.onimport.layout(can) }
			}) })
		}
	},
	display: function(can, msg) { var _msg = can.db.tabview[can.onexport.keys(can)]; _msg.Option(html.HEIGHT, msg.Option(html.HEIGHT))
		var height = can.onexport.size(can, _msg.Option(html.HEIGHT)||0.5, can.ui._content.offsetHeight||can.ConfHeight()); can.page.style(can, can.ui.display, html.MAX_HEIGHT, height)
		var width = can.ConfWidth()-can.ui.project.offsetWidth
		can.onimport.process(can, msg, can.ui.display, height, width, function(sub) { if (sub.ConfHeight() < can.ui._content.offsetHeight-100) { can.page.style(can, sub._output, html.MAX_HEIGHT, "") }
			can.onmotion.delay(can, function() { var _height = can.base.Max(sub._target.offsetHeight, height)
				_msg.Option(html.HEIGHT, _height), can.onimport.layout(can), sub.onimport.size(sub, _height == height? _height-1: _height, width, true)
			})
		})
	},
	process: function(can, msg, target, height, width, cb) { can.onmotion.clear(can, target)
		if (msg.Option(ice.MSG_PROCESS) == ice.PROCESS_FIELD) {
			msg.Table(function(item) { item.type = chat.STORY, item.height = height, item.width = width, item.display = msg.Option(ice.MSG_DISPLAY)
				can.onimport.plug(can, item, function(sub) {
					sub.onaction.close = function() { can.onmotion.hidden(can, target), can.onimport.layout(can) }
					sub.onexport.output = function(_sub, _msg) { can.onmotion.delay(can, function() { can.base.isFunc(cb) && cb(_sub, _msg) }) }
					sub.run = function(event, cmds, cb) { can.runActionCommand(event, item.index, cmds, function(msg) {
						if (sub == (msg._can._fields? msg._can.sup: msg._can)) { if (cmds && cmds[0] == ctx.ACTION) {
							if (can.base.isIn(cmds[1], mdb.IMPORT, mdb.EXPORT, "imports", "exports")) { return can.user.toastSuccess(can, cmds[1]), sub.Update() }
						} } can.base.isFunc(cb) && cb(msg)
					}) }
				}, target)
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), target, false, function(msg) { can.onimport.layout(can) })
		} else if (msg.Result().indexOf("<iframe src=") > -1) {
			var src = can.page.Select(can, can.page.Create(can, html.DIV, msg.Result()), html.IFRAME, function(target) { return target.src })[0]
			can.page.Append(can, target, [{type: html.IFRAME, src: src, style: {height: height, width: width}}])
		} else if (msg.Length() > 0 || msg.Result() != "") {
			can.onappend.table(can, msg, function(value, key, index, item) { return {text: [value, html.TD], onclick: function(event) {
				item.file && can.onimport.tabview(can, item.path, item.file||can.Option(nfs.FILE), item.line)
			}} }, target), can.onappend.board(can, msg, target), msg.Option(ice.MSG_STATUS) && can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.page.Append(can, target, [html.STATUS])._target)
		} else {
			return can.onmotion.toggle(can, target, false), can.onimport.layout(can), can.user.toastFailure(can, "nothing to display")
		} return can.onmotion.toggle(can, target, true), can.onmotion.delay(can, function() { can.onimport.layout(can), can.user.toastSuccess(can) })
	},
	toolkit: function(can, meta, cb) {
		can.onimport.tool(can, [meta], function(sub) { sub.onexport.record = function(sub, value, key, item) { if (!item.file) { return }
			if (item.file.indexOf("require/src") == 0) { item.path = nfs.SRC, item.file = line.file.slice(12) }
			can.onimport.tabview(can, item.path, can.base.trimPrefix(item.file, nfs.PWD), parseInt(item.line)); return true
		}, can.base.isFunc(cb) && cb(sub) }, can.ui.plug.parentNode, can.ui.plug), can.page.isDisplay(can.ui.plug) || can.onmotion.toggle(can, can.ui.plug, true) && can.onimport.layout(can)
	},
	layout: function(can) { if (can.isSimpleMode()) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) } if (can.isCmdMode()) { can.ConfHeight(can.page.height()) }
		var content = can.ui.content; if (content._root) { can.ui.content = content._root } can.ui.size = {profile: can._msg.Option(html.WIDTH), display: can._msg.Option(html.HEIGHT)}
		can.ui.layout(can.ConfHeight(), can.ConfWidth(), 0, function(height, width) { can.ui.content = content, can.onlayout.layout(can, height, width)
			var sub = can.ui.profile._plugin; sub && can.page.isDisplay(can.ui.profile) && sub.onimport.size(sub, can.ui.profile.offsetHeight, can.ui.profileWidth, true)
			var sub = can.ui.content._plugin; if (!sub) { return } if (height == sub.ConfHeight()+sub.onexport.actionHeight(sub)+sub.onexport.statusHeight(sub) && width == sub.ConfWidth()) { return }
			content._root || sub.onimport.size(sub, height, width, true), can.onlayout.layout(can)
		})
	},
	exts: function(can, url, cb) { var sub = can.db.toolkit[url.split(web.QS)[0]]; if (sub) { return can.base.isFunc(cb)? cb(sub): sub.select() }
		can.onimport.toolkit(can, {index: ice.CAN_PLUGIN, display: (url[0] == nfs.PS || url.indexOf(web.HTTP) == 0? "": can.base.Dir(can._path))+url}, function(sub) {
			sub.run = function(event, cmds, cb) {
				if (cmds.length > 0 && cmds[0] == ctx.ACTION) {
					can.run(can.request(event, can.Option()), cmds, cb||function(msg) { can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY)) }, true)
				} else { can.onappend._output(sub, can.request(event), sub.Conf(ctx.DISPLAY)) }
			}, can.db.toolkit[url.split(web.QS)[0]] = sub, can.base.isFunc(cb)? cb(sub): sub.select(), can.page.Modify(can, sub._legend, can.base.trimPrefix(url, "inner/"))
		})
	},
}, [""])
Volcanos(chat.ONFIGURE, { 
	source: function(can, target, zone, path) { var args = can.base.getValid(can.misc.SearchHash(can), [can.Option(nfs.PATH), can.Option(nfs.FILE)])
		function show(target, zone, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) { can.onmotion.clear(can, target)
			can.onimport.tree(can, can.core.List(msg.Table(), function(item) {
				if (path == args[0] && args[1].indexOf(item.path) == 0) { item.expand = true } return item
			}), nfs.PATH, nfs.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target), zone._total(msg.Length())
		}, true) } if (path.length == 1) { return show(target, zone, path[0]) } can.page.Remove(can, zone._action)
		can.onimport.zone(can, can.core.List(path, function(path) { return kit.Dict(mdb.NAME, path, path == args[0]? chat._INIT: chat._DELAY_INIT, function(target, zone) { show(target, zone, path) }) }), target)
	},
	module: function(can, target, zone) { zone._delay_init = function() { can.runAction({}, mdb.INPUTS, [ctx.INDEX], function(msg) {
		can.onimport.tree(can, msg.Table(), ctx.INDEX, nfs.PT, function(event, item) { can.onimport.tabview(can, "", item.index, ctx.INDEX) }, target), zone._total(msg.Length())
	}) } },
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.ItemKeys(can.onengine.plugin.meta, function(key) { if (key[0] != "_") { return total++, {index: key} } }), ctx.INDEX, nfs.PT, function(event, item) {
			can.onimport.tabview(can, "", can.core.Keys(ice.CAN, item.index), ctx.INDEX)
		}, target), zone._total(total)
	},
})
Volcanos(chat.ONLAYOUT, {
	_split: function(can, type) { var target = can.ui.content, msg = target._msg, scroll = target.scrollTop
		var style = type == html.FLOW? {height: target.offsetHeight/2, width: target.offsetWidth}: {height: target.offsetHeight, width: parseInt(target.offsetWidth/2)}
		var layout = can.page.insertBefore(can, [{view: [[html.LAYOUT, type]]}], target); layout.appendChild(target), can.page.style(can, target, style)
		var right = can.page.Append(can, layout, [{view: html.CONTENT, style: style}])._target; can.onmotion.cache(can, function() { return can.onexport.keys(can) }, right)
		can.ui.content = right, right._max = 0, can.page.SelectChild(can, target, "tr.line", function(target) { can.onaction.appendLine(can, can.page.SelectOne(can, target, "td.text").innerText, right) })
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
Volcanos(chat.ONSYNTAX, {_init: function(can, msg, cb) { var key = can.onexport.keys(can), path = msg.Option(nfs.PATH, can.Option(nfs.PATH)), file = msg.Option(nfs.FILE, can.Option(nfs.FILE))
		if (msg._content) { var list = can.page.Select(can, msg._content, html.DIV_CONTENT, function(target) { if (target._cache_key == key) { return target } })
			if (list.length > 0) { can.onmotion.select(can, msg._content, html.DIV_CONTENT, list[0]) } else {
				var list = can.page.Select(can, msg._content, html.DIV_CONTENT, function(target) { if (target._cache && target._cache[key]) { return target } })
				if (list.length > 0) { can.onmotion.cache(can, function(cache_data) { return key }, list[0]) }
			} return can.ui.content = list[0]||msg._content, cb(msg._content)
		} var content = can.ui.content; if (content._root) { can.onmotion.cache(can, function(cache_data) { return key }, content) }
		if (can.onexport.parse(can) == nfs.SVG) { msg.Option(ctx.INDEX, web.WIKI_DRAW+mdb.FS+path+file) }
		if (msg.Option(ctx.INDEX)) { return can.onsyntax._index(can, msg, function(target) { can.ui.content = target, cb(msg._content = content._root? (target._root = content._root): target) }, content._root? content: can.ui._profile.parentNode) }
		function show(p) {
			if (!content._root && can.db.history.length > 1) { content = can.ui.content = can.page.insertBefore(can, [{view: html.CONTENT, style: {width: can.ui.content.offsetWidth}}], can.ui._profile), content._cache_key = key }
			content._max = 0, content._msg = msg, msg.__content = content, can.page.Appends(can, content, [{view: ["tips", "", msg.Option(nfs.FILE)]}])
			if (msg.Length() > 0) { can.onsyntax._change(can, msg), can.onaction.rerankLine(can, "tr.line:not(.delete)>td.line")
				can.page.Select(can, content, "tr.line.delete>td.line", function(target) { target.innerHTML = "" })
			} else { can.core.List(msg.Result().split(lex.NL), function(item) { can.onaction.appendLine(can, item) }) }
			can.onengine.signal(can, VIEW_CREATE, msg), can.base.isFunc(cb) && cb(msg._content = content._root? content._root: content)
		} can.require(["inner/syntax.js"], function() { var parse = can.onexport.parse(can); can.Conf(chat.PLUG) && (can.onsyntax[parse] = can.Conf(chat.PLUG))
			var p = can.onsyntax[parse]; !p? can.runAction({}, mdb.PLUGIN, [parse, file, path], function(msg) { show(p = can.onsyntax[parse] = can.base.Obj(msg.Result()||"{}")) }): show(p)
		})
	},
	_space: function(can, msg, cb, parent) { if (can.Option(nfs.LINE) == web.SPACE) { can.ui.zone.space && can.onmotion.delay(can, function() { can.ui.zone.space.refresh() }, 1000)
		var target = can.page.Append(can, parent, [{view: [html.CONTENT, html.IFRAME], src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), height: can.ui.content.offsetHeight, width: can.ui.content.offsetWidth}])._target
		return can.base.isFunc(cb) && cb(target), true
	} },
	_index: function(can, msg, cb, parent) { if (can.onsyntax._space(can, msg, cb, parent)) { return }
		var index = msg.Option(ctx.INDEX).split(mdb.FS), item = {type: chat.STORY, index: index[0], args: index.slice(1)}
		if (item.index == web.CODE_XTERM && item.args.length > 0) { item.style = html.OUTPUT }
		can.onimport.plug(can, item, function(sub) { sub.onimport.size(sub, can.ui.content.offsetHeight, can.ui.content.offsetWidth, true)
			sub.onimport._open = function(sub, msg, arg) { can.onimport.tabview(can, "", arg, web.SPACE), sub.Update() }
			sub.onaction.close = function() { msg._tab._close() }
			sub.onexport.title = function(_, title) { can.page.Modify(can, can.page.SelectOne(can, msg._tab, html.SPAN_NAME), title) }
			sub.onexport.record = function(_, value, key, item) { item.file && can.onimport.tabview(can, item.path, item.file, item.line); return true }
			sub.onexport.output = function() { can.onimport.layout(can) }
			msg._plugin = sub, can.base.isFunc(cb) && cb(sub._target), sub.Focus()
		}, parent)
	},
	_parse: function(can, line) { var parse = can.onexport.parse(can)
		function wrap(text, type) { return can.page.Format(html.SPAN, can.page.trans(can, text), type) }
		var p = can.onsyntax[parse]||{}; p = can.onsyntax[p.link]||p, p.split = p.split||{}
		if (p.prefix && can.core.Item(p.prefix, function(pre, type) { if (can.base.beginWith(line, pre)) { return line = wrap(line, type) } }).length > 0) { return line }
		if (p.suffix && can.core.Item(p.suffix, function(end, type) { if (can.base.endWith(line, end)) { return line = wrap(line, type) } }).length > 0) { return line }
		p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||"\t ", p.split.operator||"{[(.,:;!?|&*/+-<=>)]}", {detail: true}), function(item, index, array) {
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
		}).join("")); return line
	},
	_change: function(can, msg) { var _delete = [], _insert = [], deletes = [], inserts = []
		function append() { var rest = []
			while (deletes.length > 0 && inserts.length > 0 && deletes[0] == inserts[0]) {
				can.onaction.appendLine(can, deletes[0]), deletes = deletes.slice(1), inserts = inserts.slice(1)
			}
			while (deletes.length > 0 && inserts.length > 0 && deletes[deletes.length-1] == inserts[inserts.length-1]) {
				can.onaction.appendLine(can, deletes[deletes.length-1]), deletes.pop(), inserts.pop()
			}
			while (deletes.length > 0 && inserts.length > 0 && deletes[0] == inserts[inserts.length-1]) {
				rest.push(deletes[0]), deletes = deletes.slice(1), inserts.pop()
			}
			can.core.List(deletes, function(item) { can.onappend.style(can, mdb.DELETE, can.onaction.appendLine(can, item)) }), deletes = []
			can.core.List(inserts, function(item) { can.onappend.style(can, mdb.INSERT, can.onaction.appendLine(can, item)) }), inserts = []
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
	},
})
Volcanos(chat.ONACTION, {
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
			can.isCmdMode() && can.misc.sessionStorage(can, SELECT_LINE+nfs.DF+can.Option(nfs.PATH)+can.Option(nfs.FILE), can.onexport.line(can, can.current.line))
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
	show: function(event, can) { can.runAction(can.request(event, {_toast: "渲染中..."}), mdb.RENDER, [can.onexport.parse(can), can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.profile(can, msg) }) },
	exec: function(event, can) { can.runAction(can.request(event, {_toast: "执行中..."}), mdb.ENGINE, [can.onexport.parse(can), can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.display(can, msg) }) },
	plug: function(event, can) {
		function show(value) { input.cancel(); var sub = can.db.toolkit[value]; if (sub) { sub.select(); return } can.onimport.toolkit(can, {index: value}, function(sub) { can.db.toolkit[value] = sub.select() }) }
		var input = can.user.input(event, can, [{type: html.TEXT, name: ctx.INDEX, run: function(event, cmds, cb) { can.run(event, cmds, function(msg) {
			if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS && cmds[2] == ctx.INDEX) { var _msg = can.request({})
				can.core.Item(can.db.toolkit, function(index) { _msg.Push(ctx.INDEX, index).Push("cb", show) }), _msg.Push(ctx.INDEX, "").Push("cb", show)
				can.core.List(msg.index, function() { msg.Push("cb", show) }), _msg.Copy(msg), cb(_msg)
			} else { cb(msg) }
		}, true) }}], function(list) { show(list[0]) })
	},
	open: function(event, can) {
		var input = can.user.input(event, can, [{name: nfs.FILE, style: {width: (can._output.offsetWidth-can.ui.project.offsetWidth)/2}, select: function(item) { input.submit(event, can, web.SUBMIT) }, run: function(event, cmds, cb) {
			can.run(can.request(event, {paths: can.db.paths.join(mdb.FS)}), cmds, function(msg) { function push(type, name) { _msg.Push(nfs.PATH, can.core.List(arguments).join(nfs.DF)) }
				if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS) { var _msg = can.onengine.signal(can, "tabview.open.inputs"), func = can.onexport.func(can)
					can.core.Item(can.db.tabview, function(key) { var ls = can.core.Split(key, nfs.DF); push(ls[0]+ls[1]) }), _msg.Copy(msg)
					can.core.List(func.list, function(item) { var ls = can.core.Split(item, nfs.DF, nfs.DF); push(nfs.LINE, ""+ls[1]+nfs.DF+ls[0]) })
					can.core.Item(can.onengine.plugin.meta, function(key, value) { push(ctx.INDEX, "can."+key) }), cb(_msg)
				} else { cb(msg) }
			}, true)
		}}], function(list, input) { input.cancel(); var ls = can.core.Split(list[0], nfs.DF, nfs.DF); switch (ls[0]) {
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
				if (can.base.isObject(value)) { if (value.type == lang.SPACE) { return }
					value.type == lang.STRING && msg.Push(mdb.VALUE, value.left+value.text+value.right), msg.Push(mdb.VALUE, value.text)
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
		// if (can.page.tagis(event.target, html.TD)) { return }
		if (can.onkeymap.selectCtrlN(event, can, can.ui.tabs, html.DIV_TABS)) { return }
		can.db._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can.db._key_list, can.ui.content)
	},
})
Volcanos(chat.ONEXPORT, {list: [nfs.FILE, nfs.LINE, ice.BACK],
	path: function(can) { return can.Option(nfs.PATH)+can.Option(nfs.FILE) },
	line: function(can, line) { return parseInt(can.core.Value(can.page.SelectOne(can, line, "td.line"), "innerText")) },
	text: function(can, line) { return can.core.Value(can.page.SelectOne(can, line, "td.text"), "innerText") },
	content: function(can) { return can.page.Select(can, can.current&&can.current.content||can.ui.content, "td.text", function(item) { return item.innerText }).join(lex.NL) },
	position: function(can, index, total) { total = total||can.ui.content._max; return (parseInt(index))+nfs.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
	size: function(can, size, full) { if (size > 1) { return size } if (size > 0) { return size*full } },
	keys: function(can, path, file) { return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(nfs.DF) },
	hash: function(can) { return can.misc.SearchHash(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE)) },
	selection: function(can, str) { var s = document.getSelection().toString(), begin = str.indexOf(s), end = begin+s.length
		for (var i = begin; i >= 0; i--) { if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break } } return s
	},
	parse: function(can) { return can.base.Ext(can.Option(nfs.FILE)) },
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
