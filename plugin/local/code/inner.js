(function() {
const PROJECT_HIDE = "web.code.inner:project", TABVIEW_HIDE = "web.code.inner:tabview"
const CURRENT_FILE = "web.code.inner:currentFile", SELECT_LINE = "web.code.inner:selectLine"
const VIEW_CREATE = "tabview.view.create", VIEW_REMOVE = "tabview.view.remove", LINE_SELECT = "tabview.line.select"	
Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can), can.onappend.style(can, code.INNER)
		if (msg.Option(nfs.FILE)) { can.Option(nfs.FILE, msg.Option(nfs.FILE))
			msg.Option(nfs.PATH) && can.Option(nfs.PATH, msg.Option(nfs.PATH))
			msg.Option(nfs.LINE) && can.Option(nfs.LINE, msg.Option(nfs.LINE))
		} if (msg.Result() == "" && can.Option(nfs.LINE) == "1") { return }
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		can.core.List(paths.concat(can.core.Split(msg.Option(nfs.REPOS))), function(p) { if (can.base.endWith(p, "-story/", "-dict/")) { return }
			if (p && paths.indexOf(p) == -1 && p[0] != ice.PS) { paths.push(p) }
		})
		can.db = {paths: paths, tabview: {}, history: [], _history: [], toolkit: {}}, can.onengine.plugin(can, can.onplugin), can.sup.onimport._process = function() {}
		can.ui = can.onappend.layout(can, can._output, "", [html.PROJECT, [html.TABS, nfs.PATH, [html.CONTENT, html.PROFILE], html.DISPLAY, html.PLUG]])
		can.ui._content = can.ui.content, can.ui._profile = can.ui.profile, can.ui._display = can.ui.display, can.onmotion.hidden(can, can.ui.plug)
		switch (can.Mode()) {
			case chat.SIMPLE: // no break
			case chat.FLOAT: can.onmotion.hidden(can, can.ui.project); break
			case chat.CMD: can.onmotion.hidden(can, can._status), can.onkeymap._build(can)
				can.misc.sessionStorage(can, PROJECT_HIDE) == html.HIDE && can.onmotion.hidden(can, can.ui.project)
				if (can.misc.sessionStorage(can, TABVIEW_HIDE) == html.HIDE) { can.onmotion.hidden(can, can.ui.project), can.onmotion.hidden(can, can.ui.tabs) }
			case chat.FULL: // no break
			default: can.onimport.project(can, paths), can.onimport._tabs(can)
				var last = can.misc.localStorage(can, CURRENT_FILE);
				can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) { can.onimport._tabview(can, paths[0], file, "", next) }, function() {
					if (can.user.isWebview && last) { var ls = can.core.Split(last, ice.DF); ls.length > 0 && can.onimport._tabview(can, ls[0], ls[1], ls[2]) }
				}) })
		} var args = can.misc.SearchHash(can); can.db.tabview[can.onexport.keys(can)] = msg
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() { if (!can.user.isWebview && args.length > 0 && can.isCmdMode()) {
			can.onimport._tabview(can, args[args.length-3], args[args.length-2]||can.Option(nfs.FILE), args[args.length-1])
		} }), can.base.isFunc(cb) && cb(msg)
	},
	_tabs: function(can) { if (!can.isCmdMode()) { return can.ui.tabs = can._action }
		can.page.Append(can, can.ui.tabs, can.core.List([
			{name: can.page.unicode.menu, onclick: function() { can.user.carte(event, can, can.onaction, can.onaction.list.concat(can.user.isWebview? ["全屏", "录屏", "编辑器", "浏览器"]: [])) }},
			{name: can.page.unicode.refresh, style: {"font-size": "24px", "padding-top": 0}, onclick: function() { location.reload() }},
		], function(item) { return can.base.Copy(item, {view: [[html.ITEM, html.ICON], "", item.name]}) })), can.page.Append(can, can.ui.tabs, can.user.header(can))
	},
	__tabPath: function(can, cache) {
		can.onimport._tabPath(can, ice.PS, nfs.PATH, can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), function(p) {
			var ls = can.onexport.split(can, p); can.onimport.tabview(can, ls[0], ls[1])
		}, can.ui.path), can.onimport._tabFunc(can, can.ui.path, cache), can.onimport._tabMode(can), can.onimport._tabIcon(can)
		can.ui.path.ondblclick = function(event) {
			var show = can.onmotion.toggle(can, can.ui.tabs); can.onmotion.toggle(can, can.ui.project, show), can.onimport.layout(can)
			can.isCmdMode() && can.misc.sessionStorage(can, TABVIEW_HIDE, show? "": html.HIDE)
		}
	},
	_tabPath: function(can, ps, key, value, cb, target) { can.onmotion.clear(can, can.ui.path), can.core.List(can.core.Split(value, ps), function(value, index, list) {
		can.page.Append(can, target, [{text: [value+(index<list.length-1? ps: ""), "", html.ITEM], onclick: function(event) {
			can.onimport.tabPath(event, can, ps, key, ps == ice.PT? list.slice(0, index).join(ps): (list.slice(0, index).join(ps)||ice.PT)+ps, cb)
		}}])
	}) },
	tabPath: function(event, can, ps, key, pre, cb, parent) { can.runAction(event, mdb.INPUTS, [key, pre, lex.SPLIT], function(msg) { var _trans = {}
		var carte = can.user[parent? "carteRight": "carte"](event, can, {_style: key}, (msg.Length() > 10? [web.FILTER]: []).concat(msg.Table(function(value) {
			var p = can.core.Split(value[key], ps).pop()+(can.base.endWith(value[key], ps)? ps: ""); return _trans[p] = value[key], p
		})), function(event, button) {
			can.base.endWith(button, ps)? can.onimport.tabPath(event, can, ps, key, pre+button, cb, carte): cb(_trans[button], pre)
		}, parent)._target, file = can.core.Split(event.target.innerHTML.trim(), ice.PT)[0]
		can.page.Select(can, carte, html.DIV_ITEM, function(target) { target.innerHTML.trim() != event.target.innerHTML.trim() && can.base.beginWith(target.innerHTML, file+ice.PT) && carte.insertBefore(target, carte.firstChild) })
		function remove(p) { if (p && p._sub) { remove(p._sub), can.page.Remove(can, p._sub), delete(p._sub) } } if (parent) { remove(parent), parent._sub = carte }
	}) },
	_tabFunc: function(can, target, cache) {
		if (cache) { var func = can.db._func||{list: []} } else { var func = can.onexport.func(can); can.db._func = func }
		if (func.list.length > 0) { can.db.tabFunc = can.db.tabFunc||{}
			var last = can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)]||{}; can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = last
			var carte, list = [web.FILTER]; can.core.Item(last, function(key) { list.push(key) }), list = list.concat(func.list)
		}
		can.page.Append(can, target, [{view: [[html.ITEM, "func"], html.SPAN, (func.current||"func")+ice.PS+can.db.max+func.percent+ice.SP+can.base.Size(can._msg.result[0].length)], onclick: function(event) {
			carte = can.user.carte(event, can, {_style: nfs.PATH}, list, function(ev, button) { last[button] = true, carte.close()
				can.onimport.tabview(can, "", can.Option(nfs.FILE), can.core.Split(button, ice.DF)[1])
			})
		}}])
	},
	_tabMode: function(can) {
		var mode = can.db.mode||"", target = can.ui.current; if (target && mode != mdb.PLUGIN) { mode += ice.SP+target.selectionStart+ice.PS+target.value.length }
		can.page.Append(can, can.ui.path, [{text: [mode, "", [ice.MODE, can.db.mode||""]], onclick: function(event) {
			var list = {}; can.core.Item(can.onkeymap._mode[can.db.mode], function(k, cb) { list[cb.help+ice.TB+k] = function(event, can, button) { can.core.CallFunc(cb, {event: event, can: can}) } })
			can.core.Item(can.onkeymap._mode[can.db.mode+"_ctrl"], function(k, cb) { list[cb.help+ice.TB+"C-"+k] = function(event, can, button) { can.core.CallFunc(cb, {event: event, can: can}) } })
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
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can.misc.sessionStorage(can, SELECT_LINE+ice.DF+path+file)||can._msg.Option(nfs.LINE)||1}))
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg; can.onexport.hash(can)
				can.isCmdMode() && can.onexport.title(can, path+file), can.onmotion.select(can, can.ui.tabs, html.DIV_TABS, msg._tab), can.isCmdMode() && msg._tab.scrollIntoView()
				if (isSpace()) { can.ui.path.innerHTML = can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)})) } else if (isIndex()) {
					can.onimport._tabPath(can, ice.PT, ice.CMD, can.Option(nfs.FILE), function(p, pre) {
						can.onimport.tabview(can, "", can.core.Keys(can.base.trimSuffix(pre, ice.PT), p), ctx.INDEX)
					}, can.ui.path)
				} else { can.onimport.__tabPath(can) }
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_CONTENT, html.FIELDSET_STORY, [[[html.IFRAME, html.CONTENT]]]), function(target) {
					if (can.onmotion.toggle(can, target, target == msg._content)) { can.ui.content = msg._content }
				}), can.ui.content._plugin = msg._plugin, can.ui.profile._plugin = msg._profile
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_PROFILE, [[[html.IFRAME, html.PROFILE]]]), function(target) {
					if (can.onmotion.toggle(can, target, target == msg._profile)) { can.ui.profile = msg._profile }
				}), can.onimport.layout(can), can.ui.current && can.onmotion.toggle(can, can.ui.current, !isIndex() && !isSpace())
				skip || can.onaction.selectLine(can, can.Option(nfs.LINE), true), can.base.isFunc(cb) && cb(), cb = null
				var ls = can.db.file.split(ice.PS); if (ls.length > 4) { ls = [ls.slice(0, 2).join(ice.PS)+"/.../"+ls.slice(-2).join(ice.PS)] }
				can.Status(kit.Dict(nfs.FILE, ls.join(ice.PS), mdb.TYPE, can.db.parse))
			})
		}
		function load(msg) { var skip = false; can.db.tabview[key] = msg
			can.onimport.tabs(can, [{name: can.base.beginWith(file, "http://")? file.split(ice.QS)[0]: file.split(isIndex()? ice.PT: ice.PS).pop(), text: file, _menu: shy([
				nfs.SAVE, nfs.TRASH, web.REFRESH,
			], function(event, button, meta) { can.onaction[button](event, can, button) })}], function(event, tabs) {
				can._tab = msg._tab = tabs._target, show(skip), skip = true
			}, function(tabs) { can.onengine.signal(can, VIEW_REMOVE, msg), can.ui.zone.source.refresh()
				msg._content != can.ui._content && can.page.Remove(can, msg._content), msg._profile != can.ui._profile && can.page.Remove(can, msg._profile)
				delete(can.ui._content._cache[key]), delete(can.ui._profile._cache[key]), delete(can.ui._display._cache[key])
				delete(can.db.tabview[key]), delete(can._cache_data[key])
			}, can.ui.tabs)
		}
		if (can.db.tabview[key]) { return !can._msg._tab && !can.isSimpleMode()? load(can.db.tabview[key]): show() }
		isIndex()||isSpace()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, record) { can.base.Eq(record, can.db.history[can.db.history.length-1], mdb.TEXT) || can.db.history.push(record)
		return can.Status(ice.BACK, can.db.history.length), record
	},
	project: function(can, path) { can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
		if (can.base.isFunc(cb)) { return {name: name, _trans: can.onfigure._trans? can.onfigure._trans[name]||"": "", _init: function(target, zone) { return cb(can, target, zone, path) }} }
	}), can.ui.project) },
	profile: function(can, msg) { var _msg = can.db.tabview[can.onexport.keys(can)]; _msg.Option(html.WIDTH, msg.Option(html.WIDTH)||0.5)
		if (msg.Result().indexOf("<iframe src=") > -1) { if (_msg._profile != can.ui._profile) { can.page.Remove(can, _msg._profile) }
			var src = can.page.Select(can, can.page.Create(can, html.DIV, msg.Result()), html.IFRAME, function(target) { return target.src })[0]
			can.ui.profile = _msg._profile = can.page.Append(can, can.ui._profile.parentNode, [{view: [html.PROFILE, html.IFRAME], src: src}])._target
			can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
		} else { var height = can.ui.profile.offsetHeight||can.ui.content.offsetHeight; can.ui.profile = _msg._profile = can.ui._profile
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
		var height = can.onexport.size(can, _msg.Option(html.HEIGHT)||0.5, can.ui.content.offsetHeight||can.ConfHeight()); can.page.style(can, can.ui.display, html.MAX_HEIGHT, height)
		var width = can.ui.content.offsetWidth+can.ui.profile.offsetWidth||can.ConfWidth()-can.ui.project.offsetWidth
		can.onimport.process(can, msg, can.ui.display, height, width, function(sub) { if (sub.ConfHeight() < can.ui.content.offsetHeight-100) { can.page.style(can, sub._output, html.MAX_HEIGHT, "") }
			can.onmotion.delay(can, function() { var _height = can.base.Max(sub._target.offsetHeight, height)
				_msg.Option(html.HEIGHT, _height), can.onimport.layout(can), sub.onimport.size(sub, _height == height? _height-1: _height, width, true)
			}, 300)
		})
	},
	process: function(can, msg, target, height, width, cb) { can.onmotion.clear(can, target)
		if (msg.Option(ice.MSG_PROCESS) == ice.PROCESS_FIELD) {
			msg.Table(function(item) { item.type = chat.STORY, item.height = height, item.width = width, item.display = msg.Option(ice.MSG_DISPLAY)
				// if (can.base.isIn(item.index, web.CODE_XTERM, web.WIKI_WORD)) { item.style = html.OUTPUT }
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
	layout: function(can) { if (can.isSimpleMode()) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) }
		if (can.isCmdMode()) { can.ConfHeight(can.page.height()), can.ConfWidth(can.page.width()) }
		can.ui.size = {profile: can._msg.Option(html.WIDTH)||0.5, display: can._msg.Option(html.HEIGHT)}
		can.ui.layout(can.ConfHeight(), can.ConfWidth(), 0, function(content_height, content_width) {
			var sub = can.ui.profile._plugin; sub && can.page.isDisplay(can.ui.profile) && sub.onimport.size(sub, can.ui.profile.offsetHeight, can.ui.profileWidth, true)
			var sub = can.ui.content._plugin; if (!sub) { return } if (content_height == sub.ConfHeight()+sub.onexport.actionHeight(sub)+sub.onexport.statusHeight(sub) && content_width == sub.ConfWidth()) { return }
			sub.onimport.size(sub, content_height, content_width, true)
		})
	},
	exts: function(can, url, cb) { var sub = can.db.toolkit[url.split(ice.QS)[0]]; if (sub) { return can.base.isFunc(cb)? cb(sub): sub.select() }
		can.onimport.toolkit(can, {index: ice.CAN_PLUGIN, display: (url[0] == ice.PS || url.indexOf(ice.HTTP) == 0? "": can.base.Dir(can._path))+url}, function(sub) {
			sub.run = function(event, cmds, cb) {
				if (cmds.length > 0 && cmds[0] == ctx.ACTION) {
					can.run(can.request(event, can.Option()), cmds, cb||function(msg) { can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY)) }, true)
				} else { can.onappend._output(sub, can.request(event), sub.Conf(ctx.DISPLAY)) }
			}, can.db.toolkit[url.split(ice.QS)[0]] = sub, can.base.isFunc(cb)? cb(sub): sub.select(), can.page.Modify(can, sub._legend, can.base.trimPrefix(url, "inner/"))
		})
	},
}, [""])
Volcanos(chat.ONFIGURE, { 
	source: function(can, target, zone, path) { var args = can.base.getValid(can.misc.SearchHash(can), [can.Option(nfs.PATH), can.Option(nfs.FILE)])
		function show(target, zone, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) { can.onmotion.clear(can, target)
			can.onimport.tree(can, can.core.List(msg.Table(), function(item) {
				if (path == args[0] && args[1].indexOf(item.path) == 0) { item.expand = true } return item
			}), nfs.PATH, ice.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target), zone._total(msg.Length())
		}, true) } if (path.length == 1) { return show(target, zone, path[0]) }
		can.onimport.zone(can, can.core.List(path, function(path) {
			return kit.Dict(mdb.NAME, path, path == args[0]? chat._INIT: chat._DELAY_INIT, function(target, zone) { show(target, zone, path) })
		}), target), can.page.Remove(can, zone._action)
	},
	module: function(can, target, zone) { zone._delay_init = function() { can.runAction({}, mdb.INPUTS, [ctx.INDEX], function(msg) {
		can.onimport.tree(can, msg.Table(), ctx.INDEX, ice.PT, function(event, item) { can.onimport.tabview(can, "", item.index, ctx.INDEX) }, target), zone._total(msg.Length())
	}) } },
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.ItemKeys(can.onengine.plugin.meta, function(key) { if (key[0] != "_") { return total++, {index: key} } }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, "", can.core.Keys(ice.CAN, item.index), ctx.INDEX)
		}, target), zone._total(total)
	},
})
Volcanos(chat.ONSYNTAX, {_init: function(can, msg, cb) {
		if (can.onmotion.cache(can, function(cache_data) {
			can.db.file && (cache_data[can.db.file] = {max: can.db.max, current: can.current, profile: can.ui.profile.className, display: can.ui.display.className})
			can.db.file = can.onexport.keys(can, can.Option(nfs.PATH), can.Option(nfs.FILE)); var p = cache_data[can.db.file]; if (p) {
				can.db.max = p.max, can.current = p.current, can.ui.profile.className = p.profile, can.ui.display.className = p.display
			} else { can.onmotion.hidden(can, can.ui.profile), can.onmotion.hidden(can, can.ui.display) }
			can.db.parse = can.base.Ext(can.db.file), can.Status(ice.MODE, mdb.PLUGIN); return can.db.file
		}, can.ui._content, can.ui._profile, can.ui._display)) { return can.base.isFunc(cb) && cb(msg._content) }
		if (msg.Option(ctx.INDEX)) { return can.onsyntax._index(can, msg, cb) }
		function show(p) { can.db.max = 0, can.core.List(msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
			can.onengine.signal(can, VIEW_CREATE, msg), can.base.isFunc(cb) && cb(msg._content = can.ui._content)
		} can.require(["inner/syntax.js"], function() { can.Conf(chat.PLUG) && (can.onsyntax[can.db.parse] = can.Conf(chat.PLUG))
			var p = can.onsyntax[can.db.parse]; !p? can.runAction({}, mdb.PLUGIN, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
				show(p = can.onsyntax[can.db.parse] = can.base.Obj(msg.Result()||"{}"))
			}): show(p)
		})
	},
	_space: function(can, msg, cb) { if (can.Option(nfs.LINE) == web.SPACE) { can.ui.zone.space && can.onmotion.delay(can, function() { can.ui.zone.space.refresh() }, 5000)
		return can.base.isFunc(cb) && cb(msg._content = can.page.insertBefore(can, [{view: [html.CONTENT, html.IFRAME],
			src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), height: can.ui.content.offsetHeight, width: can.ui.content.offsetWidth}], can.ui._content)), true
	} },
	_index: function(can, msg, cb) { if (msg._content) { return can.base.isFunc(cb) && cb(msg._content) } if (can.onsyntax._space(can, msg, cb)) { return }
		var index = msg.Option(ctx.INDEX).split(ice.FS), item = {type: chat.STORY, index: index[0], args: index.slice(1)}
		if (can.base.isIn(item.index, web.WIKI_WORD)) { item.style = html.OUTPUT }
		// if (can.base.isIn(item.index, web.CODE_XTERM, web.WIKI_WORD)) { item.style = html.OUTPUT }
		can.onimport.plug(can, item, function(sub) { sub.onimport.size(sub, can.ui.content.offsetHeight, can.ui.content.offsetWidth, true)
			sub.onimport._open = function(sub, msg, arg) { can.onimport.tabview(can, "", arg, web.SPACE), sub.Update() }
			sub.onaction.close = function() { can.onaction.back(can), msg._tab._close() }
			sub.onexport.title = function(_, title) { can.page.Modify(can, can.page.SelectOne(can, msg._tab, html.SPAN_NAME), title) }
			sub.onexport.record = function(_, value, key, item) { item.file && can.onimport.tabview(can, item.path, item.file, item.line); return true }
			sub.onexport.output = function() { can.onimport.layout(can) }
			msg._plugin = sub, can.base.isFunc(cb) && cb(msg._content = sub._target), sub.Focus()
		}, can.ui._content.parentNode)
	},
	_parse: function(can, line) {
		function wrap(text, type) { return can.page.Format(html.SPAN, can.page.trans(can, text), type) }
		var p = can.onsyntax[can.db.parse]||{}; p = can.onsyntax[p.link]||p, p.split = p.split||{}
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
})
Volcanos(chat.ONACTION, {list: ["调试", "首页", "官网", "源码", "百度"],
	_getLine: function(can, line) { return can.page.Select(can, can.ui.content, "tr.line>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return td.parentNode } })[0] },
	appendLine: function(can, value) { var ui = can.page.Append(can, can.ui._content, [{view: [nfs.LINE, html.TR], list: [
		{view: [nfs.LINE, html.TD, ++can.db.max], onclick: function(event) {
			can.onaction.selectLine(can, ui.tr)
		}, ondblclick: function(event) { can.onaction.find(event, can) }},
		{view: [mdb.TEXT, html.TD, can.onsyntax._parse(can, value)], onclick: function(event) {
			can.onaction.selectLine(can, ui.tr), can.onkeymap._insert && can.onkeymap._insert(event, can, 0, (event.offsetX)/12-1), can.onimport.__tabPath(can)
			if (event.metaKey) { if (ui.text.innerText.indexOf(ice.HTTP) > -1) { var ls = (/(http[^ ]+)/).exec(ui.text.innerText); if (ls && ls[1]) { can.user.open(ls[1]) } } }
		}, ondblclick: function(event) { can.onaction.searchLine(event, can, can.onexport.selection(can, ui.text.innerText)) }}
	]}]); return ui._target },
	selectLine: function(can, line, scroll) { if (!line) { return can.onexport.line(can, can.page.SelectOne(can, can.ui.content, "tr.select")) }
		can.page.Select(can, can.ui._content, "tr.line>td.line", function(target) { var n = parseInt(target.innerText); target = target.parentNode
			if (!can.page.ClassList.set(can, target, html.SELECT, n == line || target == line)) { return }
			line = target, can.Status(nfs.LINE, can.onexport.position(can, can.Option(nfs.LINE, n)))
		}); if (!can.base.isObject(line)) { return 0 }
		can.page.Select(can, line, "td.text", function(target) {
			can.current = {line: line, next: function() { return line.nextSibling }, prev: function() { return line.previousSibling },
				text: function(text) { return text != undefined && can.onaction.modifyLine(can, line, text), target.innerText },
				scroll: function(count) { if (count) { can.ui._content.scrollTop += count*can.current.line.offsetHeight }
					return parseInt((can.current.line.offsetTop-can.ui._content.scrollTop)/can.current.line.offsetHeight)
				}, window: function() { return parseInt(can.ui._content.offsetHeight/can.current.line.offsetHeight) },
			}, can.onimport.history(can, {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE), text: can.current.text()})
			can.onexport.hash(can), scroll && can.onaction.scrollIntoView(can), can.onengine.signal(can, LINE_SELECT, can._msg)
		})
		if (can.isCmdMode()) { can.misc.sessionStorage(can, SELECT_LINE+ice.DF+can.Option(nfs.PATH)+can.Option(nfs.FILE), can.onexport.line(can, can.current.line))
			can.user.isWebview && can.misc.localStorage(can, CURRENT_FILE, [can.Option(nfs.PATH), can.Option(nfs.FILE), can.onexport.line(can, can.current.line)].join(ice.DF))
		} return can.onexport.line(can, line)
	},
	scrollIntoView: function(can, offset) { var current = can.onexport.line(can, can.current.line), window = can.current.window(); offset = offset||parseInt(window/4)+2
		can.ui.content.scrollTo(0, parseInt(current/window)*can.ui.content.offsetHeight+(parseInt(current%window)-offset-1)*can.current.line.offsetHeight)
	},
	searchLine: function(event, can, value) {
		var offset = 0; can.page.Select(can, can.ui.content, "tr.line", function(tr) {
			tr == can.current.line && can.page.Select(can, tr, "td.text>span", function(span) { offset += span.innerText.length
				span == event.target && can.runAction(can.request(event, {name: value, text: can.current.text(), offset: offset-1}, can.Option()), code.NAVIGATE, [], function(msg) {
					msg.Append(nfs.FILE)? can.onimport.tabview(can, msg.Append(nfs.PATH), msg.Append(nfs.FILE), msg.Append(nfs.LINE)): can.user.toastFailure(can, "not found "+value)
				})
			}), can.page.Select(can, tr, "td.text", function(td) { offset += td.innerText.length+1 })
		})
	},
	favorLine: function(event, can, value) { can.user.input(event, can, [{name: mdb.ZONE, value: "hi"}, {name: mdb.NAME, value: "hello"}], function(data) {
		can.runAction(event, code.FAVOR, [ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
			mdb.TYPE, can.db.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
			nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
		], function() { can.user.toastSuccess(can) })
	}) },
	reback: function(can) { var last = can.db._history.pop(); last && can.onimport.tabview(can, last.path, last.file, last.line) },
	back: function(can) { can.db._history.push(can.db.history.pop()); var last = can.db.history.pop(); last && can.onimport.tabview(can, last.path, last.file, last.line) },
	exec: function(event, can) { can.runAction(can.request(event, {_toast: "执行中..."}), mdb.ENGINE, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.display(can, msg) }) },
	show: function(event, can) { can.runAction(can.request(event, {_toast: "渲染中..."}), mdb.RENDER, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.profile(can, msg) }) },
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
		var input = can.user.input(event, can, [{name: nfs.FILE, style: {width: can.ui.content.offsetWidth/2}, select: function(item) { input.submit(event, can, web.SUBMIT) }, run: function(event, cmds, cb) {
			can.run(can.request(event, {paths: can.db.paths.join(ice.FS)}), cmds, function(msg) { function push(type, name) { _msg.Push(nfs.PATH, can.core.List(arguments).join(ice.DF)) }
				if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS) { var _msg = can.onengine.signal(can, "tabview.open.inputs"), func = can.onexport.func(can)
					can.core.Item(can.db.tabview, function(key) { var ls = can.core.Split(key, ice.DF); push(ls[0]+ls[1]) }), _msg.Copy(msg)
					can.core.List(func.list, function(item) { var ls = can.core.Split(item, ice.DF, ice.DF); push(nfs.LINE, ""+ls[1]+ice.DF+ls[0]) })
					can.core.Item(can.onengine.plugin.meta, function(key, value) { push(ctx.INDEX, "can."+key) }), cb(_msg)
				} else { cb(msg) }
			}, true)
		}}], function(list, input) { input.cancel(); var ls = can.core.Split(list[0], ice.DF, ice.DF); switch (ls[0]) {
			case nfs.LINE: return can.onaction.selectLine(can, parseInt(ls[1]), true)
			case web.SPACE: return can.onimport.tabview(can, "", ls[1].indexOf(ice.HTTP) == 0? list[0].slice(6): ls[1], web.SPACE)
			case ctx.INDEX: return can.onimport.tabview(can, "", ls[1], ls[0])
			case ssh.SHELL: return can.onimport.tabview(can, "", [web.CODE_XTERM, list[0].slice(6)].join(ice.FS), ctx.INDEX)
			case cli.OPENS: return can.runAction(event, ls[0], ls[1], null, true)
			default: var ls = can.onexport.split(can, list[0]); can.onimport.tabview(can, ls[0], ls[1])
		} }); can.page.Modify(can, input._target, {"className": "input vimer open float"})
		can.page.style(can, input._target, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/4-34, html.TOP, can.ui.content.offsetHeight/4, html.RIGHT, "")
	},
	find: function(event, can) { var last = can.onexport.line(can, can.current.line)
		var ui = can.page.Append(can, can._output, [{view: "input vimer find float", list: [html.ACTION, html.OUTPUT],
			style: {left: can.ui.project.offsetWidth+can.ui.content.offsetWidth/4, top: can.ui.content.offsetHeight/2-60}}]); can.onmotion.move(can, ui._target)
		can.onmotion.delay(can, function() { can.page.style(can, ui._target, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/2-ui._target.offsetWidth/2) })
		function find(begin, text) { if (parseInt(text) > 0) { return can.onaction.selectLine(can, parseInt(text)) && meta.close() }
			for (begin; begin <= can.db.max; begin++) { if (can.onexport.text(can, can.onaction._getLine(can, begin)).indexOf(text) > -1) {
				return last = begin, can.onaction.selectLine(can, begin, true)
			} } last = 0, can.user.toast(can, "已经到最后一行")
		}
		function complete(target, button) {
			can.onappend.figure(can, {action: "key", mode: chat.SIMPLE, _enter: function(event) {
				if (event.ctrlKey) { meta.grep() } else { meta[button](), can.onmotion.delay(can, function() { target.focus() }) } return true
			}, run: function(event, cmds, cb) { var msg = can.request(event); can.core.List(can.core.Split(can.current.text(), "\t {([,:;=<>])}", {detail: true}), function(value) {
				if (can.base.isObject(value)) { if (value.type == lang.SPACE) { return }
					value.type == lang.STRING && msg.Push(mdb.VALUE, value.left+value.text+value.right), msg.Push(mdb.VALUE, value.text)
				} else {
					value.indexOf(ice.PT) > -1 && msg.Push(mdb.VALUE, value.split(ice.PT).pop()), msg.Push(mdb.VALUE, value)
				}
			}), cb(msg) }}, target)
		}
		var meta = can.onappend._action(can, [
			{type: html.TEXT, name: nfs.FROM, style: {width: 200}, _init: function(target) { from = target, complete(target, nfs.FIND), can.onmotion.delay(can, function() { target.focus() }) }},
			{type: html.BUTTON, name: nfs.FIND}, {type: html.BUTTON, name: nfs.GREP}, {type: html.TEXT, name: nfs.TO, _init: function(target) { to = target, complete(target, nfs.REPLACE) }},
			{type: html.BUTTON, name: nfs.REPLACE}, {type: html.BUTTON, name: cli.CLOSE},
		], ui.action, {_trans: {find: "查找", grep: "搜索", replace: "替换"},
			find: function() { find(last+1, from.value), can.onimport.exts(can, "inner/search.js", function(sub) {
				can.page.isDisplay(sub._target) || (sub._delay_init = false, sub.select()), meta.close()
				sub.runAction(can.request(event, {value: from.value}), nfs.GREP, [from.value, can.Option(nfs.FILE), can.Option(nfs.PATH)])
			}) },
			grep: function() { can.onimport.exts(can, "inner/search.js", function(sub) {
				can.page.isDisplay(sub._target) || (sub._delay_init = false, sub.select()), meta.close()
				sub.runAction(can.request(event, {value: from.value}), nfs.GREP, [from.value, ice.PT, can.Option(nfs.PATH)])
			}) },
			replace: function() { var text = can.current.text(), line = can.onexport.line(can, can.current.line)
				can.db.undo.push(function() { can.onaction.selectLine(can, line), can.onaction.modifyLine(can, line, text) })
				can.current.text(text.replace(from.value, to.value)), can.current.text().indexOf(from.value) == -1 && meta.find()
			}, close: function() { can.page.Remove(can, ui._target) },
		}); var from, to
	},
	clear: function(event, can) { if (can.onmotion.clearFloat(can)) { return }
		if (can.page.Select(can, document.body, "div.vimer.find.float", function(target) { return can.page.Remove(can, target) }).length > 0) { return }
		if (can.page.Select(can, can.ui.plug, "legend.select", function(target) { return target.click(), target }).length > 0) { return }
		if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
	},
	refresh: function(event, can, button) { can.run(event, [can.Option(nfs.PATH), can.Option(nfs.FILE)], function(msg) { can._msg.result = msg.result, can.onmotion.clear(can, can.ui.content)
		can.db.max = 0, can.core.List(msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) }), can.user.toastSuccess(can)
	}) },
	onkeydown: function(event, can) { if (can.onkeymap.selectCtrlN(event, can, can.ui.tabs, html.DIV_TABS)) { return }
		can.db._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can.db._key_list, can.ui.content)
	},
})
Volcanos(chat.ONEXPORT, {list: [mdb.COUNT, mdb.TYPE, nfs.FILE, nfs.LINE, ice.BACK],
	size: function(can, size, full) { if (size > 1) { return size } if (size > 0) { return size*full } },
	keys: function(can, path, file) { return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(ice.DF) },
	line: function(can, line) { return parseInt(can.core.Value(can.page.SelectOne(can, line, "td.line"), "innerText")) },
	text: function(can, line) { return can.core.Value(can.page.SelectOne(can, line, "td.text"), "innerText") },
	content: function(can) { return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL) },
	position: function(can, index, total) { total = total||can.db.max; return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
	selection: function(can, str) { var s = document.getSelection().toString(), begin = str.indexOf(s), end = begin+s.length
		for (var i = begin; i >= 0; i--) { if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break } } return s
	},
	split: function(can, file) { var ls = file.split(ice.PS); if (ls.length == 1) { return [nfs.PWD, ls[0]] }
		if (ls[0] == ice.USR) { return [ls.slice(0, 2).join(ice.PS)+ice.PS, ls.slice(2).join(ice.PS)] }
		return [ls.slice(0, 1).join(ice.PS)+ice.PS, ls.slice(1).join(ice.PS)]
	},
	hash: function(can) { return can.misc.SearchHash(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE)) },
	func: function(can) { var p = can.onsyntax[can.db.parse]||{}, opts = {}
		function indent(text) { var indent = 0; for (var i = 0; i < text.length; i++) { switch (text[i]) {
			case ice.TB: indent+=4; break
			case ice.SP: indent++; break
			default: return indent
		} } }
		var list = [], current = can.Option(nfs.LINE), percent = " = "+parseInt(can.Option(nfs.LINE)*100/(can.db.max||1))+"%"
		can.page.Select(can, can.ui.content, "tr.line>td.text", function(item, index) { var text = item.innerText, _indent = indent(text)
			function push(item) { list.push(item+(item? ice.DF+(index+1): "")); if (index < can.Option(nfs.LINE)) { current = list[list.length-1], percent = " = "+parseInt((index+1)*100/(can.db.max||1))+"%" } }
			if (p.func) { p.func(can, push, text, _indent, opts) }
		}); return {list: list, current: current, percent: percent}
	},
})
Volcanos(chat.ONKEYMAP, {
	_mode: {plugin: {
		Escape: shy("切换模式", function(event, can) { can.onaction.clear(event, can) }),
		v: shy("渲染界面", function(event, can) { can.onaction.show(event, can) }),
		r: shy("执行命令", function(event, can) { can.onaction.exec(event, can) }),
		f: shy("打开文件", function(event, can) { can.onaction.open(event, can) }),
		d: shy("查找函数", function(event, can) { can.page.Select(can, can.ui.path, "span.func", function(target) { target.click() }) }),
		g: shy("查找搜索", function(event, can) { can.onaction.find(event, can) }),
		l: shy("打开右边标签", function(can) { var next = can._tab.nextSibling; next && next.click() }),
		h: shy("打开左边标签", function(can) { var prev = can._tab.previousSibling; prev && prev.click() }),
		x: shy("关闭标签", function(can) { can._tab._close() }),
	}}, _engine: {},
})
})()
