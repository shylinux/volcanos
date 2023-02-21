(function() { const CURRENT_FILE = "web.code.inner:currentFile", SELECT_LINE = "web.code.inner.selectLine"
const VIEW_CREATE = "tabview.view.create", VIEW_REMOVE = "tabview.view.remove", LINE_SELECT = "tabview.line.select"
Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can), can.onappend.style(can, code.INNER)
		if (msg.Option(nfs.FILE)) { can.Option(nfs.FILE, msg.Option(nfs.FILE))
			msg.Option(nfs.PATH) && can.Option(nfs.PATH, msg.Option(nfs.PATH))
			msg.Option(nfs.LINE) && can.Option(nfs.LINE, msg.Option(nfs.LINE))
		} if (msg.Result() == "" && can.Option(nfs.LINE) == "1") { return }
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		can.core.List(paths.concat(can.core.Split(msg.Option(nfs.REPOS))), function(p) {
			if (can.base.endWith(p, "-story/", "-dict/")) { return }
			if (p && paths.indexOf(p) == -1 && p[0] != ice.PS) { paths.push(p) }
		})
		can.db = {paths: paths, tabview: {}, _history: [], history: [], profile_size: {}, display_size: {}, toolkit: {}}, can.onengine.plugin(can, can.onplugin)
		can.ui = can.onappend.layout(can, can._output, "", [html.PROJECT, [html.TABS, nfs.PATH, [html.CONTENT, html.PROFILE], html.DISPLAY, html.PLUG]])
		can.ui._content = can.ui.content, can.ui._profile = can.ui.profile, can.ui._display = can.ui.display, can.onmotion.hidden(can, can.ui.plug)
		switch (can.Mode()) {
			case chat.SIMPLE: // no break
			case chat.FLOAT: can.onmotion.hidden(can, can.ui.project); break
			case chat.CMD: can.onimport._keydown(can), can.onmotion.hidden(can, can._status)
				var plug = can.base.Obj(msg.Option(html.PLUG), []).concat(can.misc.Search(can, log.DEBUG) == ice.TRUE? ["can.debug", "log.debug"]: [])
				plug.length > 0 && can.run({}, [ctx.ACTION, ctx.COMMAND].concat(plug.reverse()), function(msg) { msg.Table(function(value) { can.onimport.toolkit(can, value) }) })
			case chat.FULL: // no break
			default: can.onimport.project(can, paths), can.onimport._tabs(can)
				can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) { can.onimport._tabview(can, paths[0], file, "", next) }, function() {
					can.core.List(can.base.Obj(msg.Option(html.TABS)), function(item) { can.onimport.tabview(can, paths[0], item, ctx.INDEX) })
					if (can.user.isWebview) { var last = can.misc.localStorage(can, CURRENT_FILE); if (last) {
						var ls = can.core.Split(last, ice.DF); ls.length > 0 && can.onimport._tabview(can, ls[0], ls[1], ls[2])
					} }
				}) })
		} var args = can.misc.SearchHash(can); can.db.tabview[can.onexport.keys(can)] = msg
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() { if (!can.user.isWebview && args.length > 0) {
			can.onimport._tabview(can, args[args.length-3]||can.Option(nfs.PATH), args[args.length-2]||can.Option(nfs.FILE), args[args.length-1])
		} }), can.base.isFunc(cb) && cb(msg)
	},
	_keydown: function(can) { can.onkeymap._build(can), can._root.onengine.listen(can, chat.ONKEYDOWN, function(event) {
		if (can.onkeymap.selectCtrlN(event, can, can.ui.tabs, html.DIV_TABS)) { return }
		can.db._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can.db._key_list, can.ui.content)
	}) },
	_tabs: function(can) { if (!can.isCmdMode()) { return can.ui.tabs = can._action }
		can.user.isMobile || can.core.List([
			{name: can.page.unicode.menu, onclick: function() {
				can.user.carte(event, can, can.onaction, can.onaction.list.concat(can.user.isWebview? ["全屏", "录屏", "编辑器", "浏览器"]: []))
			}},
			{name: can.page.unicode.back, style: {"font-size": "14px", "padding-top": "3px"}, onclick: function(event) {
				var list = {}; can.user.carte(event, can, {_style: "history"}, can.core.List(can.db.history, function(item) {
					var value = [item.path, item.file, item.line, ice.TB+(item.text&&item.text.length>30? item.text.slice(0, 30)+"...": item.text||"")].join(ice.DF); if (!list[value]) { list[value] = item; return value }
				}).reverse(), function(event, button, meta, carte) { carte.close()
					var ls = button.split(ice.DF); can.onimport.tabview(can, ls[0], ls[1], ls[2])
				})
			}},
			{name: can.page.unicode.refresh, style: {"font-size": "24px", "padding-top": "1px"}, onclick: function() { location.reload() }},
			{name: can.page.unicode.reback, style: {"font-size": "14px", "padding-top": "3px"}, onclick: function() {
				var list = {}; can.user.carte(event, can, {_style: "tabview"}, can.core.Item(can.db.tabview), function(event, button, meta, carte) { carte.close()
					var ls = button.split(ice.DF); can.onimport.tabview(can, ls[0], ls[1])
				})
			}},
		], function(item) { can.page.Append(can, can.ui.tabs, [can.base.Copy(item, {view: [[html.ICON, web.WEBSITE], html.DIV, item.name]})]) })
		can.user.isMobile || can.page.Append(can, can.ui.tabs, [{view: mdb.TIME, _init: function(target) {
			can.core.Timer({interval: 100}, function() { can.page.Modify(can, target, can.user.time(can, null, "%H:%M:%S %w")) })
			can.onappend.figure(can, {action: "date", _hold: true}, target, function(sub, value) {})
		}}]), can.user.info.avatar && can.page.Append(can, can.ui.tabs, [{view: aaa.AVATAR, list: [{img: can.user.info.avatar}]}])
	},
	_tabPath: function(can, ps, key, value, cb, target) { can.core.List(can.core.Split(value, ps), function(value, index, array) {
		can.page.Append(can, target, [{text: [value+(index<array.length-1? ps: ""), html.SPAN, html.ITEM], onclick: function(event) {
			can.onimport.tabPath(event, can, ps, key, (array.slice(0, index).join(ps)||ice.PT)+ps, cb)
		}}])
	}) },
	tabPath: function(event, can, ps, key, pre, cb, parent) { can.runAction(event, mdb.INPUTS, [key, pre], function(msg) { var _trans = {}
		var carte = can.user[parent? "carteRight": "carte"](event, can, {_style: nfs.PATH}, msg.Table(function(value) {
			var p = can.core.Split(value[key], ps).pop()+(can.base.endWith(value[key], ps)? ps: ""); return _trans[p] = value[key], p
		}), function(event, button) {
			can.base.endWith(button, ps)? can.onimport.tabPath(event, can, ps, key, pre+button, cb, carte): cb(can.core.Split(_trans[button], ps))
		}, parent)._target, file = can.core.Split(event.target.innerHTML.trim(), ice.PT)[0]
		can.page.Select(can, carte, html.DIV_ITEM, function(target) { target.innerHTML.trim() != event.target.innerHTML.trim() && can.base.beginWith(target.innerHTML, file+ice.PT) && carte.insertBefore(target, carte.firstChild) })
		function remove(p) { if (p && p._sub) { remove(p._sub), can.page.Remove(can, p._sub), delete(p._sub) } } if (parent) { remove(parent), parent._sub = carte }
	}) },
	_tabFunc: function(can, target) {
		can.user.isWindows || can.page.Append(can, can.ui.path, can.core.Item({
			"\u25E8 ": function(event) {
				if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) } can.onaction.show(event, can)
			},
			"\u25E8": shy({"font-size": "23px", rotate: "90deg", translate: "1px 1px"}, function(event) {
				if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) } can.onaction.exec(event, can)
			}),
			"\u25E7": function(event) { can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can) },
			"\u2756": !can.user.isMobile && shy({"font-size": "20px", translate: "0 2px"}, function(event) { can.onaction.plug(event, can) }),
			"\u271A": !can.user.isMobile && shy({"font-size": "20px", translate: "0 2px"}, function(event) { can.onaction.open(event, can) }),
		}, function(text, cb) { return cb && {text: [text, html.SPAN, html.VIEW], style: cb.meta, onclick: cb} }))
		var func = can.onexport.func(can); if (func.list.length == 0) { return } can.db.tabFunc = can.db.tabFunc||{}
		var last = can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)]||{}; can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = last
		var carte, list = [{input: [html.FILTER, function(event) { if (event.key == lang.ESCAPE) { return carte.close() } can.onkeymap.selectItems(event, can, carte._target)
		}], _init: function(target) { can.onmotion.delay(can, function() { target.placeholder = "search in "+(can.core.List(list, function(item) { if (item) { return item } }).length-1)+" items", target.focus() }) }}]
		can.core.Item(last, function(key) { list.push(key) }), list = list.concat(func.list)
		can.page.Append(can, target, [{view: [[html.ITEM, "func"], html.SPAN, (func.current||"func")+" / "+can.db.max+func.percent+ice.SP+can.base.Size(can._msg.result[0].length)], onclick: function(event) {
			carte = can.user.carte(event, can, {_style: nfs.PATH}, list, function(ev, button) { last[button] = true, carte.close()
				can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.core.Split(button, ice.DF)[1])
			})
		}}]), can.ui.path.ondblclick = function(event) { can.onmotion.toggle(can, can.ui.project), can.onmotion.toggle(can, can.ui.tabs), can.onmotion.toggle(can, can.ui.plug), can.onimport.layout(can) }
	},
	_tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		if (!can.user.isWebview) { return can.onimport.tabview(can, path, file, line, cb) }
		if (!can.db.tabview[key]) { return can.onimport.tabview(can, path, file, line, cb), can.db.tabview[key] = true }
	},
	tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		function isIndex() { return line == ctx.INDEX } function isDream() { return line == web.DREAM }
		function show(skip) { can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.db.tabview[key]
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can.misc.sessionStorage(can, SELECT_LINE+ice.DF+path+file)||can._msg.Option(nfs.LINE)||1}))
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg; can.onexport.hash(can)
				can.isCmdMode() && can.onexport.title(can, path+file), can.onmotion.select(can, can.ui.tabs, html.DIV_TABS, msg._tab), can.isCmdMode() && msg._tab.scrollIntoView()
				if (isIndex()) {
					can.ui.path.innerHTML = can.Option(nfs.FILE)
				} else if (isDream()) {
					can.ui.path.innerHTML = can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}))
				} else { can.ui.path.innerHTML = ""
					can.onimport._tabPath(can, ice.PS, nfs.PATH, can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), function(ls) {
						if (ls[0] == ice.USR && ls.length > 2) {
							can.onimport.tabview(can, ls.slice(0, 2).join(ice.PS)+ice.PS, ls.slice(2).join(ice.PS))
						} else if (ls.length > 1) {
							can.onimport.tabview(can, ls.slice(0, 1).join(ice.PS)+ice.PS, ls.slice(1).join(ice.PS))
						} else {
							can.onimport.tabview(can, nfs.PWD, ls[0])
						}
					}, can.ui.path), can.onimport._tabFunc(can, can.ui.path)
				}
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_CONTENT, html.FIELDSET_STORY, [[[html.IFRAME, html.CONTENT]]]), function(target) {
					if (can.onmotion.toggle(can, target, target == msg._content)) { can.ui.content = msg._content }
				}), can.ui.content._plugin = msg._plugin
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_PROFILE, [[[html.IFRAME, html.PROFILE]]]), function(target) {
					if (can.onmotion.toggle(can, target, target == msg._profile)) { can.ui.profile = msg._profile }
				}), can.onimport.layout(can), can.ui.current && can.onmotion.toggle(can, can.ui.current, !isIndex() && !isDream())
				skip || can.onaction.selectLine(can, can.Option(nfs.LINE), true), can.base.isFunc(cb) && cb(), cb = null
				var ls = can.db.file.split(ice.PS); if (ls.length > 4) { ls = [ls.slice(0, 2).join(ice.PS)+"/.../"+ls.slice(-2).join(ice.PS)] }
				can.Status(kit.Dict(nfs.FILE, ls.join(ice.PS), mdb.TYPE, can.db.parse))
			})
		}
		function load(msg) { var skip = false; can.db.tabview[key] = msg
			can.onimport.tabs(can, [{name: file.split(isIndex()? ice.PT: ice.PS).pop(), text: file, _menu: shy([nfs.SAVE, code.COMPILE], function(event, button, meta) {
				can.onaction[button](event, can, button)
			})}], function(event, tabs) {
				can._tab = msg._tab = tabs._target, show(skip), skip = true
			}, function(tabs) { can.onengine.signal(can, VIEW_REMOVE, msg)
				msg._content != can.ui._content && can.page.Remove(can, msg._content), msg._profile != can.ui._profile && can.page.Remove(can, msg._profile)
				delete(can.ui._content._cache[key]), delete(can.ui._profile._cache[key]), delete(can.ui.display._cache[key])
				delete(can._cache_data[key]), delete(can.db.tabview[key])
			}, can.ui.tabs)
		}
		if (can.db.tabview[key]) { return !can._msg._tab && !can.isSimpleMode()? load(can.db.tabview[key]): show() }
		isIndex()||isDream()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, record) {
		can.base.Eq(record, can.db.history[can.db.history.length-1], mdb.TEXT) || can.db.history.push(record)
		return can.Status(ice.BACK, can.db.history.length), record
	},
	project: function(can, path) {
		can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
			if (can.base.isFunc(cb)) { return {name: name, _trans: can.onfigure._trans? can.onfigure._trans[name]||"": "", _init: function(target, zone) { return cb(can, target, zone, path) }} }
		}), can.ui.project), can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
	},
	profile: function(can, msg) { var _msg = can.db.tabview[can.onexport.keys(can)]
		if (msg.Result().indexOf("<iframe src=") > -1) { if (_msg._profile != can.ui._profile) { can.page.Remove(can, _msg._profile) }
			var src = can.page.Select(can, can.page.Create(can, html.DIV, msg.Result()), html.IFRAME, function(target) { return target.src })[0]
			can.ui.profile = _msg._profile = can.page.Append(can, can.ui._profile.parentNode, [{view: [html.PROFILE, html.IFRAME], src: src}])._target
			can.onmotion.toggle(can, can.ui.profile, true), can.db.profile_size[can.onexport.keys(can)] = 0.8, can.onimport.layout(can)
		} else { can.ui.profile = _msg._profile = can.ui._profile
			var height = can.ui.profile.offsetHeight||can.ui.content.offsetHeight
			var width = can.onexport.size(can, can.db.profile_size[can.onexport.keys(can)]||0.5, can.ConfWidth()-can.ui.project.offsetWidth)
			can.onimport.process(can, msg, can.ui.profile, height, width, function(sub) { var _width = can.base.Max(sub._target.offsetWidth, width)
				can.db.profile_size[can.onexport.keys(can)] = _width, can.onimport.layout(can), sub.onimport.size(sub, height, _width, true)
			})
			can.page.Select(can, can.ui.profile, html.TABLE, function(target) { can.onmotion.delay(can, function() {
				if (target.offsetWidth < can.ui._profile.offsetWidth) { can.db.profile_size[can.onexport.keys(can)] = target.offsetWidth, can.onimport.layout(can) }
			}) })
		}
	},
	display: function(can, msg) { var width = can.ui.content.offsetWidth+can.ui.profile.offsetWidth||can.ConfWidth()-can.ui.project.offsetWidth
		var height = can.onexport.size(can, can.db.display_size[can.onexport.keys(can)]||0.5, can.ui.content.offsetHeight||can.ConfHeight())
		can.onimport.process(can, msg, can.ui.display, height, width, function(sub) { var _height = can.base.Max(sub._target.offsetHeight, height)
			can.page.style(can, sub._target, html.MIN_HEIGHT, _height = can.base.Min(_height, can.ConfHeight()/4))
			can.db.display_size[can.onexport.keys(can)] = _height, can.onimport.layout(can), sub.onimport.size(sub, _height, width, true)
		})
	},
	process: function(can, msg, target, height, width, cb) { can.onmotion.clear(can, target)
		if (msg.Option(ice.MSG_PROCESS) == ice.PROCESS_FIELD) {
			msg.Table(function(item) { item.type = chat.STORY, item.display = msg.Option(ice.MSG_DISPLAY), item.height = height-2*html.ACTION_HEIGHT, item.width = width
				can.onimport.plug(can, item, function(sub) { height && sub.ConfHeight(item.height), width && sub.ConfWidth(item.width)
					sub.onaction.close = function() { can.onmotion.hidden(can, target), can.onimport.layout(can) }
					sub.onexport.output = function(_sub, _msg) { can.base.isFunc(cb) && cb(_sub, _msg) }
					sub.run = function(event, cmds, cb) { can.runActionCommand(can.request(event, can.Option()), item.index, cmds, function(msg) {
						height && sub.ConfHeight(item.height), width && sub.ConfWidth(item.width), can.page.style(can, sub._output, html.MAX_HEIGHT, "", html.MAX_WIDTH, "")
						can.base.isFunc(cb) && cb(msg)
					}) }
				}, target)
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), target, false, function(msg) { can.onimport.layout(can) })
		} else if (msg.Length() > 0 || msg.Result() != "") {
			can.onappend.table(can, msg, function(value, key, index, line, array) {
				return {text: [value, html.TD], onclick: function(event) { if (line.line || line.file) {
					can.onimport.tabview(can, line.path||can.Option(nfs.PATH), line.file||can.Option(nfs.FILE), line.line||can.Option(nfs.LINE))
				} }}
			}, target), can.onappend.board(can, msg, target), can.onappend._status(can, msg.Option(ice.MSG_STATUS), can.page.Append(can, target, [html.STATUS])._target)
		} else {
			return can.onmotion.toggle(can, target, false), can.onimport.layout(can), can.user.toastFailure(can, "nothing to display")
		} return can.onmotion.toggle(can, target, true), can.onimport.layout(can), can.user.toastSuccess(can)
	},
	toolkit: function(can, meta, cb) { can.page.isDisplay(can.ui.plug) || can.onmotion.toggle(can, can.ui.plug, true) && can.onimport.layout(can)
		can.onimport.plug(can, meta, function(sub) { can.onappend.style(sub, [html.FLOAT, html.HIDE]), sub._legend._target = sub._target
			can.ui.plug.appendChild(sub._legend), sub._legend.onclick = function(event) { can.misc.Event(event, can, function(msg) {
				if (can.page.SelectOne(can, can.ui.plug, ice.PT+html.SELECT, function(target) {
					can.onmotion.hidden(can, target._target), can.page.ClassList.del(can, target, html.SELECT); return target
				}) == sub._legend) { return } can.onmotion.toggle(can, sub._target, true), can.page.ClassList.add(can, sub._legend, html.SELECT)
				if (sub._delay_init == true) { sub._delay_init = false, sub.Update() }
			}) }, sub._delay_init = true
			sub.onexport.record = function(sub, value, key, line) { if (!line.file && !line.line) { return }
				if (line.file.indexOf("require/src") == 0) {
					line.path = nfs.SRC, line.file = line.file.slice(12)
				}
				can.onimport.tabview(can, line.path||can.Option(nfs.PATH), can.base.trimPrefix(line.file, nfs.PWD)||can.Option(nfs.FILE), parseInt(line.line))
				return true
			}, sub.onaction.close = sub.select = function() { return sub._legend.click(), sub }
			sub.hidden = function() { can.onmotion.hidden(can, sub._target), can.page.ClassList.del(can, sub._legend, html.SELECT) }
			sub.onimport.size(sub, can.ConfHeight()/2, can.ConfWidth()-can.ui.project.offsetWidth, true), can.base.isFunc(cb) && cb(sub)
		}, can.ui.plug.parentNode)
	},
	layout: function(can) { if (can.isSimpleMode()) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) }
		if (can.isCmdMode()) { can.ConfHeight(can.page.height()), can.ConfWidth(can.page.width()) }
		can.ui.size = {profile: can.db.profile_size[can.onexport.keys(can)]||0.5, display: can.db.display_size[can.onexport.keys(can)]||3*html.ACTION_HEIGHT}
		can.ui.layout(can.ConfHeight(), can.ConfWidth(), 0, function(content_height, content_width) { var sub = can.ui.content._plugin; if (!sub) { return }
			if (content_height == sub.ConfHeight()+sub.onexport.actionHeight(sub)+sub.onexport.statusHeight(sub) && content_width == sub.ConfWidth()) { return }
			sub.onimport.size(sub, content_height, content_width, true)
		})
	},
	exts: function(can, url, cb) { var sub = can.db.toolkit[url.split("?")[0]]; if (sub) { return can.base.isFunc(cb)? cb(sub): sub.select() }
		can.onimport.toolkit(can, {index: ice.CAN_PLUGIN, display: (url[0] == ice.PS || url.indexOf(ice.HTTP) == 0? "": can.base.Dir(can._path))+url}, function(sub) {
			sub.run = function(event, cmds, cb) {
				if (cmds.length > 0 && cmds[0] == ctx.ACTION) {
					can.run(can.request(event, can.Option()), cmds, cb||function(msg) { can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY)) }, true)
				} else { can.onappend._output(sub, can.request(event), sub.Conf(ctx.DISPLAY)) }
			}, can.db.toolkit[url.split("?")[0]] = sub, can.base.isFunc(cb)? cb(sub): sub.select(), can.page.Modify(can, sub._legend, url)
		})
	},
}, [""])
Volcanos(chat.ONFIGURE, { 
	source: function(can, target, zone, path) { var args = can.base.getValid(can.misc.SearchHash(can), [can.Option(nfs.PATH), can.Option(nfs.FILE)])
		function show(target, zone, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) {
			can.onimport.tree(can, can.core.List(msg.Table(), function(item) {
				if (args[1] && args[1].indexOf(item.path) == 0) { item.expand = true } return item
			}), nfs.PATH, ice.PS, function(event, item) {
				can.onimport.tabview(can, path, item.path)
			}, target), zone._total(msg.Length())
		}, true) } if (path.length == 1) { return show(target, zone, path[0]) }
		can.onimport.zone(can, can.core.List(path, function(path) {
			return {name: path, _init: function(target, zone) { path == args[0] && show(target, zone, path) },
				_delay_show: path == args[0]? undefined: function(target, zone) { show(target, zone, path) }}
		}), target), can.page.Remove(can, zone._action)
	},
	module: function(can, target, zone) { zone._delay_show = function() {
		can.runAction(can.request({}, {fields: ctx.INDEX}), ctx.COMMAND, [mdb.SEARCH, ctx.COMMAND], function(msg) {
			can.onimport.tree(can, msg.Table(), ctx.INDEX, ice.PT, function(event, item) {
				can.onimport.tabview(can, can.Option(nfs.PATH), item.index, ctx.INDEX)
			}, target), zone._total(msg.Length())
		})
	} },
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.ItemKeys(can.onengine.plugin.meta, function(key) { if (key[0] != "_") { return total++, {index: key} } }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys(ice.CAN, item.index), ctx.INDEX)
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
		function init(p) { msg._can = can
			can.db.max = 0, can.core.List(msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
			can.onengine.signal(can, VIEW_CREATE, msg), can.base.isFunc(cb) && cb(msg._content = can.ui._content)
		} can.require(["inner/syntax.js"], function() { can.Conf(chat.PLUG) && (can.onsyntax[can.db.parse] = can.Conf(chat.PLUG))
			var p = can.onsyntax[can.db.parse]; !p? can.runAction({}, mdb.PLUGIN, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
				init(p = can.onsyntax[can.db.parse] = can.base.Obj(msg.Result()||"{}"))
			}): init(p)
		})
	},
	_index: function(can, msg, cb) { if (msg._content) { return can.base.isFunc(cb) && cb(msg._content) }
		if (can.Option(nfs.LINE) == web.DREAM) { can.ui.zone.dream && can.onmotion.delay(can, function() { can.ui.dream.refresh() }, 5000)
			return can.base.isFunc(cb) && cb(msg._content = can.page.insertBefore(can, [{view: [html.CONTENT, html.IFRAME],
				src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), height: can.ui.content.offsetHeight, width: can.ui.content.offsetWidth}], can.ui._content))
		} var index = msg.Option(ctx.INDEX).split(ice.FS), meta = {type: chat.STORY, index: index[0], args: index.slice(1)}
		return can.onimport.plug(can, meta, function(sub) { sub.onimport.size(sub, can.ui.content.offsetHeight, can.ui.content.offsetWidth, true)
			sub.onimport._open = function(sub, msg, arg) { var url = can.base.ParseURL(arg), ls = url.origin.split("/chat/pod/")
				arg.indexOf(location.origin) == 0 && ls.length > 1? can.onimport.tabview(can, can.Option(nfs.PATH), ls[1].split(ice.PS)[0], web.DREAM): can.user.open(arg), sub.Update()
			}
			sub.onaction["打开链接"] = function() { can.onimport.tabview(can, can.Option(nfs.PATH), [meta.index].concat(sub.Input([], false)).join(ice.FS), ctx.INDEX) }
			sub.onaction.close = function() { can.onaction.back(can), msg._tab._close() }
			sub.onexport.title = function(_, title) { can.page.Modify(can, can.page.SelectOne(can, msg._tab, "span.name"), title) }
			sub.onexport.record = function(_, value, key, line) { line.path && can.onimport.tabview(can, line.path, line.file, line.line); return true }
			sub.onexport.output = function() { can.onimport.layout(can) }
			msg._plugin = sub, can.base.isFunc(cb) && cb(msg._content = sub._target), sub.Focus()
		}, can.ui._content.parentNode)
	},
	_parse: function(can, line) { line = can.page.replace(can, line||"")
		function wrap(text, type) { return can.page.Format(html.SPAN, text, type) }
		var p = can.onsyntax[can.db.parse]||{}; p = can.onsyntax[p.link]||p, p.split = p.split||{}
		if (p.prefix && can.core.Item(p.prefix, function(pre, type) { if (can.base.beginWith(line, pre)) { return line = wrap(line, type) } }).length > 0) { return line }
		if (p.suffix && can.core.Item(p.suffix, function(end, type) { if (can.base.endWith(line, end)) { return line = wrap(line, type) } }).length > 0) { return line }
		p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||"\t ", p.split.operator||"{[(.,:;!?|&*/+-<=>)]}", {detail: true}), function(item, index, array) {
			item = can.base.isObject(item)? item: {text: item}; var text = item.text, type = p.keyword[text]
			switch (item.type||type) {
				case lang.STRING: return wrap(item.left+text+item.right, lang.STRING)
				case code.COMMENT:
				case code.KEYWORD:
				case code.PACKAGE:
				case code.DATATYPE:
				case code.FUNCTION:
				case code.CONSTANT:
				case code.OBJECT: return wrap(text, type)
				default: var t = can.core.Item(p.regexp, function(reg, type) { var m = text.match(new RegExp(reg)); if (m && m.length > 0 && m[0] == text) { return type} })
					return t && t.length > 0? wrap(text, t[0]): type? wrap(text, type): text
			}
		}).join("")); return line
	},
})
Volcanos(chat.ONACTION, {list: ["调试", "首页", "官网", "源码", "百度"],
	_getLine: function(can, line) { return can.page.Select(can, can.ui.content, "tr.line>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return td.parentNode } })[0] },
	_getLineno: function(can, line) { return can.page.Select(can, can.ui.content, "tr.line>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return index+1 } })[0] },
	appendLine: function(can, value) { var ui = can.page.Append(can, can.ui._content, [{view: [nfs.LINE, html.TR], list: [
		{view: [nfs.LINE, html.TD, ++can.db.max], onclick: function(event) {
			can.onaction.selectLine(can, ui.tr)
		}, ondblclick: function(event) {
			can.onaction.find(event, can)
		}},
		{view: [mdb.TEXT, html.TD, can.onsyntax._parse(can, value)], onclick: function(event) {
			can.onaction.selectLine(can, ui.tr)
			if (event.metaKey) { if (ui.text.innerText.indexOf(ice.HTTP) > -1) { var ls = (/(http[^ ]+)/).exec(ui.text.innerText); if (ls && ls[1]) { can.user.open(ls[1]) } } }
		}, ondblclick: function(event) {
			can.onaction.searchLine(event, can, can.onexport.selection(can, ui.text.innerText))
		}}
	]}]); return ui._target },
	selectLine: function(can, line, scroll) { if (!line) { return can.onexport.line(can, can.page.SelectOne(can, can.ui._content, "tr.select")) }
		can.page.Select(can, can.ui._content, "tr.line>td.line", function(td, index) { var tr = td.parentNode, n = parseInt(td.innerText)
			if (!can.page.ClassList.set(can, tr, html.SELECT, tr == line || n == line)) { return }
			line = tr, can.Status(nfs.LINE, can.onexport.position(can, can.Option(nfs.LINE, n)))
		}); if (!can.base.isObject(line)) { return 0 }
		can.page.Select(can, line, "td.text", function(item) {
			can.current = {line: line, next: function() { return line.nextSibling }, prev: function() { return line.previousSibling },
				text: function(text) { return text != undefined && can.onaction.modifyLine(can, line, text), item.innerText },
				scroll: function(count) { if (count) { can.ui._content.scrollTop += count*can.current.line.offsetHeight }
					return parseInt((can.current.line.offsetTop-can.ui._content.scrollTop)/can.current.line.offsetHeight)
				}, window: function() { return parseInt(can.ui._content.offsetHeight/can.current.line.offsetHeight) },
			}, can.onimport.history(can, {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE), text: can.current.text()})
			can.onexport.hash(can), scroll && can.onaction.scrollIntoView(can), can.onengine.signal(can, LINE_SELECT, can._msg)
		})
		if (can.isCmdMode()) {
			if (can.user.isWebview) {
				can.misc.localStorage(can, CURRENT_FILE, [can.Option(nfs.PATH), can.Option(nfs.FILE), can.onaction._getLineno(can, can.current.line)].join(ice.DF))
			}
			can.misc.sessionStorage(can, SELECT_LINE+ice.DF+can.Option(nfs.PATH)+can.Option(nfs.FILE), can.onaction._getLineno(can, can.current.line))
		}
		return can.onexport.line(can, line)
	},
	scrollIntoView: function(can, offset) { var current = can.onaction._getLineno(can, can.current.line), window = can.current.window(); offset = offset||parseInt(window/4)+2
		can.ui.content.scrollTo(0, parseInt(current/window)*can.ui.content.offsetHeight+(parseInt(current%window)-offset-1)*can.current.line.offsetHeight)
	},
	searchLine: function(event, can, value) { can.runAction(can.request(event, {name: value, text: can.current.text()}, can.Option()), code.NAVIGATE, [], function(msg) {
		msg.Append(nfs.FILE)? can.onimport.tabview(can, msg.Append(nfs.PATH), msg.Append(nfs.FILE), msg.Append(nfs.LINE)): can.user.toastFailure(can, "not found "+value)
	}) },
	favorLine: function(event, can, value) { can.user.input(event, can, [{name: mdb.ZONE, value: "hi"}, {name: mdb.NAME, value: "hello"}], function(data) {
		can.runAction(event, code.FAVOR, [ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
			mdb.TYPE, can.db.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
			nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
		], function() { can.user.toastSuccess(can) })
	}) },
	listTags: function(event, can, button) { var list = []
		can.core.Item(can.request(event), function(key, value) { if (key.indexOf("_") == 0) { return }
			list.push({zone: ice.MSG, type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0], path: ice.USR_VOLCANOS, file: ice.LIB_MISC, line: 1})
		}), can.page._path = ice.LIB_PAGE
		can.core.Item(can, function(zone, lib) { if (zone.indexOf("_") == 0) { return }
			can.core.Item(lib, function(key, value) { if (!lib.hasOwnProperty(key)) { return }
				lib._path && list.push({zone: zone, type: typeof value, name: key, text: can.base.isObject(value)? "": (value+"").split(ice.NL)[0], path: ice.USR_VOLCANOS, file: lib._path, line: 1})
			})
		}), can.runAction(can.request(event, {text: can.base.Format(list)}), button)
	},
	clear: function(event, can) { if (can.onmotion.clearFloat(can)) { return }
		if (can.page.Select(can, document.body, "div.vimer.find.float", function(target) { return can.page.Remove(can, target) }).length > 0) { return }
		if (can.page.Select(can, can.ui.plug, "legend.select", function(target) { return target.click(), target }).length > 0) { return }
		if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
	},
	reback: function(can) {
		var last = can.db._history.pop(); last && can.onimport.tabview(can, last.path, last.file, last.line)
	},
	back: function(can) { can.db._history.push(can.db.history.pop())
		var last = can.db.history.pop(); last && can.onimport.tabview(can, last.path, last.file, last.line)
	},
	exec: function(event, can) {
		if (can.base.Ext(can.Option(nfs.FILE)) == nfs.JS) { delete(Volcanos.meta.cache[can.base.Path(ice.PS, ice.REQUIRE, can.Option(nfs.PATH), can.Option(nfs.FILE))]) }
		can.runAction(can.request(event, {_toast: "执行中..."}), mdb.ENGINE, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.display(can, msg) })
	},
	show: function(event, can) {
		if (can.base.Ext(can.Option(nfs.FILE)) == nfs.JS) { delete(Volcanos.meta.cache[can.base.Path(ice.PS, ice.REQUIRE, can.Option(nfs.PATH), can.Option(nfs.FILE))]) }
		can.runAction(can.request(event, {_toast: "渲染中..."}), mdb.RENDER, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) { can.onimport.profile(can, msg) })
	},
	plug: function(event, can) {
		function show(value) { input.cancel()
			var sub = can.db.toolkit[value]; if (sub) { sub.select(); return }
			can.onimport.toolkit(can, {index: value}, function(sub) { can.db.toolkit[value] = sub.select() })
		}
		var input = can.user.input(event, can, [{type: html.TEXT, name: ctx.INDEX, run: function(event, cmds, cb) { can.run(event, cmds, function(msg) {
			if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS && cmds[2] == ctx.INDEX) { var _msg = can.request({})
				can.core.Item(can.db.toolkit, function(index) { _msg.Push(ctx.INDEX, index).Push("cb", show) }), _msg.Push(ctx.INDEX, "").Push("cb", show)
				can.core.List(msg.index, function() { msg.Push("cb", show) }), _msg.Copy(msg), cb(_msg)
			} else { cb(msg) }
		}, true) }}], function(list) { show(list[0]) })
	},
	open: function(event, can) {
		var paths = can.core.List(can.db.paths, function(item) { if (can.base.endWith(item, "-story/", "-dict/")) { return } return item }).join(ice.FS)
		// paths = "src/,usr/icebergs/,usr/volcanos/"
		var input = can.user.input(can.request(event, {paths: paths}), can, [{name: nfs.FILE, style: {width: can.ui.content.offsetWidth/2}, run: function(event, cmds, cb) {
			can.run(can.request(event, {paths: paths}), cmds, function(msg) {
				if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS) { var _msg = can.onengine.signal(can, "tabview.open.inputs"), func = can.onexport.func(can)
					can.core.Item(can.db.tabview, function(key) { var ls = can.core.Split(key, ice.DF); _msg.Push(nfs.PATH, ls[0]+ls[1]) })
					can.core.List(func.list, function(item) { var ls = can.core.Split(item, ice.DF, ice.DF); _msg.Push(nfs.PATH, "line:"+ls[1]+ice.DF+ls[0]) })
					can.core.Item(can.onengine.plugin.meta, function(key, value) { _msg.Push(nfs.PATH, "index:can."+key) })
					_msg.Copy(msg), cb(_msg)
				} else { cb(msg) }
			}, true)
		}}], function(list, input) { input.cancel(); var ls = can.core.Split(list[0], ice.DF, ice.DF); switch (ls[0]) {
			case "_open": return can.runAction(event, ls[0], ls[1])
			case ctx.INDEX:
			case web.DREAM: return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1], ls[0])
			case nfs.LINE: return can.onaction.selectLine(can, parseInt(ls[1]), true)
			default: can.core.List(can.db.paths, function(path) { if (list[0].indexOf(path) == 0) { can.onimport.tabview(can, path, list[0].slice(path.length)) } })
		} })._target; can.page.Modify(can, input, {"className": "input vimer open float"})
		can.page.style(can, input, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/4-34, html.TOP, can.ui.content.offsetHeight/4, html.RIGHT, "")
	},
	find: function(event, can) {
		var ui = can.page.Append(can, can._output, [{view: "vimer find float", list: [html.ACTION, html.OUTPUT],
			style: {left: can.ui.project.offsetWidth+can.ui.content.offsetWidth/4, top: can.ui.content.offsetHeight/2-60}}]); can.onmotion.move(can, ui._target)
		can.onmotion.delay(can, function() { can.page.style(can, ui._target, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/2-ui._target.offsetWidth/2) })
		var last = can.onaction._getLineno(can, can.current.line)
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
			find: function() { find(last+1, from.value) },
			grep: function() { can.onimport.exts(can, "inner/search.js", function(sub) {
				can.page.isDisplay(sub._target) || (sub._delay_init = false, sub.select()), meta.close()
				sub.runAction(can.request(event, {value: from.value}), nfs.GREP, [from.value, can.Option(nfs.PATH)])
			}) },
			replace: function() { var text = can.current.text(), line = can.onaction._getLineno(can, can.current.line)
				can.db.undo.push(function() { can.onaction.selectLine(can, line), can.onaction.modifyLine(can, line, text) })
				can.current.text(text.replace(from.value, to.value)), can.current.text().indexOf(from.value) == -1 && meta.find()
			}, close: function() { can.page.Remove(can, ui._target) },
		}); var from, to
	},
})
Volcanos(chat.ONEXPORT, {list: [mdb.COUNT, mdb.TYPE, nfs.FILE, nfs.LINE, ice.BACK],
	size: function(can, size, full) { if (size > 1) { return size } if (size > 0) { return size*full } },
	keys: function(can, path, file) { return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(ice.DF) },
	line: function(can, line) { return parseInt(can.core.Value(can.page.SelectOne(can, line, "td.line"), "innerText")) },
	text: function(can, line) { return can.core.Value(can.page.Select(can, can.onaction._getLine(can, line), "td.text")[0], "innerText") },
	content: function(can) { return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL) },
	position: function(can, index, total) { total = total||can.db.max; return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
	selection: function(can, str) { var s = document.getSelection().toString(), begin = str.indexOf(s), end = begin+s.length
		for (var i = begin; i >= 0; i--) { if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break } } return s
	},
	hash: function(can) { var hash = [can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE)].join(ice.DF)
		if (can.isCmdMode()) { return location.hash = hash } return hash
	},
	func: function(can) { var list = []
		function indent(text) { var indent = 0; for (var i = 0; i < text.length; i++) { switch (text[i]) {
			case ice.TB: indent+=4; break
			case ice.SP: indent++; break
			default: return indent
		} } }
		var package = "", block = "", current = "", percent = ""
		can.page.Select(can, can.ui.content, "tr.line>td.text", function(item, index) { var text = item.innerText, _indent = indent(text)
			function push(item) { list.push(item); if (index < can.Option(nfs.LINE)) { current = list[list.length-1], percent = " = "+parseInt((index+1)*100/(can.db.max||1))+"%" } }
			if (can.db.parse == nfs.JS) { var ls = can.core.Split(text, "\t (,", ice.DF)
				if (_indent == 0 && can.base.beginWith(text, "Volcanos")) {
					var _block = can.base.trimPrefix(ls[1], "chat.").toLowerCase()
					if (_block != block) { push("") } block = _block
					if (text.indexOf(chat._INIT) > -1) { push(block+ice.PT+chat._INIT+ice.DF+(index+1)) }
				} else if (_indent == 0 && can.base.beginWith(text, "var ")) {
					block = ls[1]
				} else if (_indent == 4 && ls[1] == ice.DF) {
					ls[0] && push(block+ice.PT+ls[0]+ice.DF+(index+1))
				}
			} else if (can.db.parse == nfs.GO) { var ls = can.core.Split(text, "\t *", "({:})")
				if (_indent == 0) {
					switch (ls[0]) {
						case "package": package = ls[1]; break
						case "func": if (ls[1] == "(") { ls[1] = ls[2]+ice.PT+ls[5]
							if (ls[5].toLowerCase()[0] == ls[5][0]) { push("- "+ls[1]+ice.DF+(index+1)) } else { push("+ "+ls[1]+ice.DF+(index+1)) } break
						}
						case "type":
						case "var":
							if (ls[1].toLowerCase()[0] == ls[1][0]) { push("- "+ls[1]+ice.DF+(index+1)) } else { push("+ "+package+ice.PT+ls[1]+ice.DF+(index+1)) } break
					}
				} else if (_indent == 4) {
					if (text.indexOf("MergeCommands(") > -1) { block = "cmds" } else if (text == "})") { block = "" }
				} else if (_indent == 8) {
					if (block == "cmds" && ls[1] == ice.DF) { push("+ "+package+ice.PT+ls[0]+ice.DF+(index+1)), block = package+ice.PT+ls[0] }
				} else if (_indent == 12) {
					if (block && ls[1] == ice.DF) { push("+ "+block+ice.SP+ls[0]+ice.DF+(index+1)) }
				}
			}
		}); return {list: list, current: current, percent: percent}
	},
})
Volcanos(chat.ONENGINE, {
	listen: shy("监听事件", function(can, key, cb) { arguments.callee.meta[key] = (arguments.callee.meta[key]||[]).concat(cb) }),
})
Volcanos(chat.ONKEYMAP, {
	_mode: {plugin: {
		Escape: shy("切换模式", function(event, can) { can.onaction.clear(event, can) }),
		r: shy("执行命令", function(event, can) { can.onaction.exec(event, can) }),
		v: shy("渲染界面", function(event, can) { can.onaction.show(event, can) }),
		f: shy("打开文件", function(event, can) { can.onaction.open(event, can) }),
		l: shy("打开右边标签", function(can) { var next = can._tab.nextSibling; next && next.click() }),
		h: shy("打开左边标签", function(can) { var prev = can._tab.previousSibling; prev && prev.click() }),
		x: shy("关闭标签", function(can) { can._tab._close() }),
	}}, _engine: {},
})
})()
