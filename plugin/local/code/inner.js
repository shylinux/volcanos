Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can), can.onappend.style(can, code.INNER)
		if (msg.Option(nfs.FILE)) { can.Option(nfs.FILE, msg.Option(nfs.FILE))
			msg.Option(nfs.PATH) && can.Option(nfs.PATH, msg.Option(nfs.PATH))
			msg.Option(nfs.LINE) && can.Option(nfs.LINE, msg.Option(nfs.LINE))
		} if (msg.Result() == "" && can.Option(nfs.LINE) == "1") { return }
		var files = can.core.Split(can.Option(nfs.FILE), ice.FS); can.Option(nfs.FILE, files[0])
		var paths = can.core.Split(can.Option(nfs.PATH), ice.FS); can.Option(nfs.PATH, paths[0])
		can.core.List(paths.concat(can.core.Split(msg.Option(nfs.REPOS))), function(p) { if (p && paths.indexOf(p) == -1 && p[0] != ice.PS) { paths.push(p) } })
		can.db = {paths: paths, tabview: {}, history: [], profile_size: {}, display_size: {}, toolkit: {}, extentions: {}}, can.onengine.plugin(can, can.onplugin)
		can.ui = can.onappend.layout(can, can._output, "", [html.PROJECT, [html.TABS, nfs.PATH, [html.CONTENT, html.PROFILE], html.DISPLAY, html.PLUG]])
		can.ui._content = can.ui.content, can.ui._profile = can.ui.profile, can.ui._display = can.ui.display
		can.onmotion.hidden(can, can.ui.plug)
		can.onengine.plugin(can, can.onplugin)
		switch (can.Mode()) {
			case chat.SIMPLE: can.onmotion.hidden(can, can.ui.project); break
			case chat.FLOAT: can.onmotion.hidden(can, can.ui.project); break
			case chat.CMD: can.onmotion.hidden(can, can._status), can.onimport._keydown(can) // no break
			case chat.FULL: // no break
			default: can.onimport.project(can, paths), can.onimport._tabs(can)
				can.onmotion.delay(can, function() { can.core.Next(files.slice(1), function(file, next) {
					can.onimport._tabview(can, can.Option(nfs.PATH), file, "", next)
				}, function() { files.length > 1 && can.onimport._tabview(can, paths[0], files[0], "")
					if (can.user.isWebview) { var last = can.misc.localStorage(can, "web.code.inner:currentFile"); if (!last) { return } }
					var ls = can.core.Split(last, ice.DF); ls.length > 0 && can.onmotion.delayLong(can, function() { can.onimport._tabview(can, ls[0], ls[1], ls[2]) })
				}) })
		}
		var hash = location.hash; can.db.tabview[can.onexport.keys(can)] = msg
		can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE), function() {
			if (can.isCmdMode() && hash) { var args = can.core.Split(decodeURIComponent(hash).slice(1), ice.DF)
				can.onmotion.delayLong(can, function() { can.onimport._tabview(can, args[args.length-3]||can.Option(nfs.PATH), args[args.length-2]||can.Option(nfs.FILE), args[args.length-1]) })
			}
		}), can.base.isFunc(cb) && cb(msg) 
	},
	_tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		if (!can.user.isWebview) {
			can.onimport.tabview(can, path, file, line, cb)
		} else if (!can.db.tabview[key]) { can.onimport.tabview(can, path, file, line, cb), can.db.tabview[key] = true }
	},
	_keydown: function(can) {
		can.onkeymap._build(can), can._root.onengine.listen(can, chat.ONKEYDOWN, function(event) {
			if (can.onkeymap.selectCtrlN(event, can, can.ui.tabs, html.DIV_TABS)) { return }
			can.db._key_list = can.onkeymap._parse(event, can, mdb.PLUGIN, can.db._key_list, can.ui.content)
		})
	},
	_tabs: function(can) { if (!can.isCmdMode()) { return can.ui.tabs = can._action }
		can.page.Append(can, can.ui.tabs, [{view: [[html.ICON, mdb.CREATE], html.DIV, "\u2630"], onclick: function() {
			can.user.carte(event, can, can.onaction, can.onaction.list)
		}}])
		can.user.isMobile || can.page.Append(can, can.ui.tabs, [{view: [mdb.TIME], _init: function(target) {
			can.core.Timer({interval: 100}, function() { can.page.Modify(can, target, can.user.time(can, null, "%y-%m-%d %H:%M:%S %w")) })
			can.onappend.figure(can, {action: "date", _hold: true}, target, function(sub, value) {})
		}}])
		can.user.info.avatar && can.page.Append(can, can.ui.tabs, [{view: [aaa.AVATAR], list: [{img: can.user.info.avatar}]}])
	},
	_tabInputs: function(can, ps, key, value, cb, target) {
		can.core.List(can.core.Split(value, ps), function(value, index, array) {
			can.page.Append(can, target, [{text: [value+(index<array.length-1? ps: ""), html.SPAN, html.ITEM], onclick: function(event) {
				can.onimport.tabInputs(event, can, ps, key, (array.slice(0, index).join(ps)||ice.PT)+ps, cb)
			}}])
		})
	},
	tabInputs: function(event, can, ps, key, pre, cb, parent) {
		can.runAction(event, mdb.INPUTS, [key, pre], function(msg) { var _trans = {}
			var carte = can.user[parent? "carteRight": "carte"](event, can, {_style: nfs.PATH}, msg.Table(function(value) {
				var p = can.core.Split(value[key], ps).pop()+(can.base.endWith(value[key], ps)? ps: ""); return _trans[p] = value[key], p
			}), function(event, button) {
				can.base.endWith(button, ps)? can.onimport.tabInputs(event, can, ps, key, pre+button, cb, carte): cb(can.core.Split(_trans[button], ps))
			}, parent)._target, file = can.core.Split(event.target.innerHTML.trim(), ice.PT)[0]
			can.page.Select(can, carte, html.DIV_ITEM, function(target) { target.innerHTML.trim() != event.target.innerHTML.trim() && can.base.beginWith(target.innerHTML, file+ice.PT) && carte.insertBefore(target, carte.firstChild) })
			function remove(p) { if (p && p._sub) { remove(p._sub), can.page.Remove(can, p._sub), delete(p._sub) } } if (parent) { remove(parent), parent._sub = carte }
		})
	},
	_tabFunc: function(can, target) {
		can.db.tabFunc = can.db.tabFunc||{}; var last = can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)]||{}; can.db.tabFunc[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = last
		var carte, list = [{input: ["filter", function(event) {
			if (event.key == lang.ESCAPE) { return can.page.Remove(can, carte._target) }
			can.onkeymap.selectItems(event, can, carte._target)
		}], _init: function(target) { can.onmotion.delay(can, function() { target.focus() }) }}]
		can.core.Item(last, function(key) { list.push(key) }), list.push("")
		var func = can.onexport.func(can);
		!can.user.isMobile && (can.db.parse == nfs.JS || can.db.parse == nfs.GO) && can.page.Append(can, target, [{view: [[html.ITEM, "func"], html.SPAN, (func.current||"function")+" / "+can.db.max+func.percent], onclick: function(event) {
			carte = can.user.carte(event, can, {_style: nfs.PATH}, list.concat(func.list), function(ev, button) { last[button] = true
				can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.core.Split(button, ice.DF)[1]), can.onmotion.clearFloat(can)
			})
		}}])
		can.ui.path.ondblclick = function(event) { can.onmotion.toggle(can, can.ui.project), can.onmotion.toggle(can, can.ui.tabs), can.onmotion.toggle(can, can.ui.plug), can.onimport.layout(can) }
		can.page.Append(can, can.ui.path, can.core.Item({
			"\u25E8 ": function(event) {
				if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
				can.onaction.show(event, can)
			},
			"\u25E8": shy({"font-size": "23px", rotate: "90deg", translate: "1px 1px"}, function(event) {
				if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
				can.onaction.exec(event, can)
			}),
			"\u25E7": function(event) { can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can) },
			"\u2756": !can.user.isMobile && shy({"font-size": "20px", translate: "0 2px"}, function(event) { can.onaction.plug(event, can) }),
			"\u271A": !can.user.isMobile && shy({"font-size": "20px", translate: "0 2px"}, function(event) { can.onaction.open(event, can) }),
		}, function(text, cb) { return cb && {text: [text, html.SPAN, html.VIEW], style: cb.meta, onclick: cb} }))
	},
	tabview: function(can, path, file, line, cb) { var key = can.onexport.keys(can, path, file)
		function isCommand() { return line == ctx.INDEX || path == ctx.COMMAND }
		function isDream() { return line == web.DREAM }
		function show(skip) { if (can.isCmdMode()) { can.onexport.title(can, path+file) }
			can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.db.tabview[key]
			can.Option(can.onimport.history(can, {path: path, file: file, line: line||can.misc.localStorage(can, "web.code.inner:selectLine:"+path+file)||can._msg.Option(nfs.LINE)||1}))
			can.onsyntax._init(can, can._msg, function(content) { var msg = can._msg
				can.onexport.hash(can), can.onmotion.select(can, can.ui.tabs, html.DIV_TABS, msg._tab), msg._tab.scrollIntoView()
				if (isCommand()) {
					can.ui.path.innerHTML = can.Option(nfs.FILE)
				} else if (isDream()) {
					can.ui.path.innerHTML = can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}))
				} else { can.ui.path.innerHTML = ""
					can.onimport._tabInputs(can, ice.PS, nfs.PATH, can.base.Path(can.Option(nfs.PATH), can.Option(nfs.FILE)), function(ls) {
						if (ls[0] == ice.SRC) {
							can.onimport.tabview(can, ls.slice(0, 1).join(ice.PS)+ice.PS, ls.slice(1).join(ice.PS))
						} else {
							can.onimport.tabview(can, ls.slice(0, 2).join(ice.PS)+ice.PS, ls.slice(2).join(ice.PS))
						}
					}, can.ui.path), can.onimport._tabFunc(can, can.ui.path)
				}
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_CONTENT, [[[html.IFRAME, html.CONTENT]]]), function(item) {
					if (can.onmotion.toggle(can, item, item == msg._content)) { can.ui.content = msg._content }
				}), can.ui.content._plugin = msg._plugin, msg._plugin && can.onmotion.delay(can, function() { msg._plugin.Focus() })
				can.page.SelectChild(can, can.ui._content.parentNode, can.page.Keys(html.DIV_PROFILE, [[[html.IFRAME, html.PROFILE]]]), function(item) {
					if (can.onmotion.toggle(can, item, item == msg._profile)) { can.ui.profile = msg._profile }
				}), can.ui.current && can.onmotion.toggle(can, can.ui.current, !isCommand() && !isDream())
				var ls = can.db.file.split(ice.PS); if (ls.length > 4) { ls = [ls.slice(0, 2).join(ice.PS)+"/.../"+ls.slice(-2).join(ice.PS)] }
				can.Status(kit.Dict("文件", ls.join(ice.PS), "类型", can.db.parse)), can.onimport.layout(can)
				can.onaction.selectLine(can, can.Option(nfs.LINE), true)
// 				if (!skip) { can.onaction.selectLine(can, can.Option(nfs.LINE), true) }
				can.base.isFunc(cb) && cb(), cb = null
			})
		}
		function load(msg) { var skip = false; can.db.tabview[key] = msg
			can.onimport.tabs(can, [{name: file.split(isCommand()? ice.PT: ice.PS).pop(), text: file, _menu: shy([nfs.SAVE, "compile"], function(event, button, meta) {
				can.onaction[button](event, can, button)
			})}], function(event, tabs) {
				can._tab = msg._tab = tabs._target, show(skip), skip = true
			}, function(tabs) { can.onengine.signal(can, "tabview.view.delete", msg)
				msg._content != can.ui._content && can.page.Remove(can, msg._content), msg._profile != can.ui._profile && can.page.Remove(can, msg._profile)
				delete(can.ui._content._cache[key]), delete(can.ui._profile._cache[key]), delete(can.ui.display._cache[key])
				delete(can._cache_data[key]), delete(can.db.tabview[key])
			}, can.ui.tabs)
		}
		if (can.db.tabview[key]) { return !can._msg._tab && !can.isSimpleMode()? load(can.db.tabview[key]): show() }
		isCommand()||isDream()? load(can.request({}, {index: file, line: line})): can.run({}, [path, file], load, true)
	},
	history: function(can, record) {
		can.base.Eq(record, can.db.history[can.db.history.length-1]) || can.db.history.push(record)
		return can.Status("跳转", can.db.history.length), record
	},
	project: function(can, path) {
		can.onimport.zone(can, can.core.Item(can.onfigure, function(name, cb) {
			if (can.base.isFunc(cb)) { return {name: name, _trans: can.onfigure._trans? can.onfigure._trans[name]||"": "", _init: function(target, zone) { return cb(can, target, zone, path) }} }
		}), can.ui.project), can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
	},
	profile: function(can, msg) { var sup = can.db.tabview[can.onexport.keys(can)]
		if (msg.Result().indexOf("<iframe ") > -1) { if (sup._profile != can.ui._profile) { can.page.Remove(can, sup._profile) }
			can.ui.profile = sup._profile = can.page.Append(can, can.ui._profile.parentNode, [{view: [html.PROFILE, html.IFRAME], src: msg.Append(mdb.LINK)}])._target
			can.onmotion.toggle(can, can.ui.profile, true), can.onimport.layout(can)
		} else { can.ui.profile = sup._profile = can.ui._profile
			can.onimport.process(can, msg, can.ui.profile, can.ui.profile.offsetHeight||can.ui.content.offsetHeight, can.db.profile_size[can.onexport.keys(can)]||(can.ConfWidth()-can.ui.project.offsetWidth)/2, function(sub) {
				can.db.profile_size[can.onexport.keys(can)] = sub.ConfWidth()
				can.onimport.layout(can)
			})
			can.page.Select(can, can.ui.profile, html.TABLE, function(target) { can.onmotion.delay(can, function() {
				if (target.offsetWidth < can.ui._profile.offsetWidth) { can.db.profile_size[can.onexport.keys(can)] = target.offsetWidth, can.onimport.layout(can) }
			}) })
		}
	},
	display: function(can, msg) { var target = can.ui.display
		can.onimport.process(can, msg, target, can.db.display_size[can.onexport.keys(can)]||can.ConfHeight()/2, target.offsetWidth, function(sub) {
			can.onmotion.delay(can, function() { can.page.style(can, sub._output, html.HEIGHT, "", html.MAX_HEIGHT, "")
				can.db.display_size[can.onexport.keys(can)] = can.base.Max(sub._output.offsetHeight+html.ACTION_HEIGHT+sub.onexport.statusHeight(sub), can.ConfHeight()/2)
				can.page.style(can, sub._output, html.MAX_HEIGHT, can.db.display_size[can.onexport.keys(can)]-html.ACTION_HEIGHT-sub.onexport.statusHeight(sub))
				can.onimport.layout(can)
			}), sub.onaction.close = function() { can.onmotion.hidden(can, target), can.onimport.layout(can) }
		})
	},
	process: function(can, msg, target, height, width, cb) { can.onmotion.clear(can, target)
		if (msg.Option(ice.MSG_PROCESS) == "_field") {
			msg.Table(function(item) { item.display = msg.Option(ice.MSG_DISPLAY), item.height = height-2*html.ACTION_HEIGHT, item.width = width
				item.type = "story"
				can.onimport.plug(can, item, function(sub) {
					can.page.ClassList.del(can, sub._target, html.HIDE)
					height && sub.ConfHeight(height-2*html.ACTION_HEIGHT), width && sub.ConfWidth(width)
					sub.onaction._output = function(_sub, _msg) { can.base.isFunc(cb) && cb(_sub, _msg) }
					sub.onaction.close = function() { can.onmotion.hidden(can, target), can.onimport.layout(can) }
				}, target)
			})
		} else if (msg.Option(ice.MSG_DISPLAY) != "") {
			can.onappend._output(can, msg, msg.Option(ice.MSG_DISPLAY), target, false, function(msg) { can.onmotion.delay(can, function() { can.onimport.layout(can) }) })
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
		can.onimport.plug(can, meta, function(sub) { can.onappend.style(sub, [html.FLOAT, html.HIDE])
			can.ui.plug.appendChild(sub._legend), sub._legend.onclick = function(event) { can.misc.Event(event, can, function(msg) {
				if (can.page.SelectOne(can, can.ui.plug, ice.PT+html.SELECT, function(target) {
					can.page.ClassList.del(can, target, html.SELECT); return target
				}) == event.target) { can.page.ClassList.add(can, sub._target, html.HIDE) } else {
					can.page.ClassList.add(can, event.target, html.SELECT)
					can.page.SelectChild(can, can.ui.plug.parentNode, can.core.Keys(html.FIELDSET, chat.PLUG), function(target) {
						if (!can.page.ClassList.set(can, target, html.HIDE, target != sub._target)) {
							if (sub._delay_init == true) { sub._delay_init = false, can.onmotion.delay(can, function() { sub._output.innerHTML == "" && sub.Update() }) }
						}
					})
				}
			}) }, sub._delay_init = true
			sub.onexport.record = function(sub, value, key, line) { if (!line.file && !line.line) { return }
				can.onimport.tabview(can, line.path||can.Option(nfs.PATH), can.base.trimPrefix(line.file, nfs.PWD)||can.Option(nfs.FILE), parseInt(line.line))
			}, sub.onaction.close = sub.select = function() { return sub._legend.click(), sub }
			sub.onimport.size(sub, can.ConfHeight()/2, can.ConfWidth()-can.ui.project.offsetWidth, true), can.base.isFunc(cb) && cb(sub)
		}, can.ui.plug.parentNode)
	},
	layout: function(can) {
		if (can.isSimpleMode()) { return can.page.style(can, can.ui.content, html.WIDTH, can.ConfWidth()) }
		if (can.isCmdMode()) { can.page.styleHeight(can, can._output, can.ConfHeight(can.page.height())), can.ConfWidth(can.page.width()) }
		var width = can.ConfWidth()+(can.user.isWindows && !can.isCmdMode()? 20: 0)
		var height = can.user.isMobile && can.isFloatMode()? can.page.height()-2*html.ACTION_HEIGHT: can.base.Min(can.ConfHeight(), 320)-1
		can.user.isMobile && can.isCmdMode() && can.page.style(can, can._output, html.MAX_HEIGHT, height)
		can.ui.size = {profile: can.db.profile_size[can.onexport.keys(can)]||0.5, display: can.db.display_size[can.onexport.keys(can)]||3*html.ACTION_HEIGHT}
		can.ui.layout(width, height, 0)
		var sub = can.ui.content._plugin; sub && sub.onimport.size(sub, can.ui.content.offsetHeight-2*html.ACTION_HEIGHT, can.ui.content.offsetWidth, true)
	},
	exts: function(can, url, cb) {
		can.onimport.toolkit(can, {index: "can._plugin", display: (url[0] == ice.PS || url.indexOf(ice.HTTP) == 0? "": can.base.Dir(can._path))+url}, function(sub) {
			sub.run = function(event, cmds, cb) {
				if (cmds.length > 0 && cmds[0] == ctx.ACTION) {
					can.run(can.request(event, can.Option()), cmds, cb||function(msg) {
						can.onappend._output(sub, msg, sub.Conf(ctx.DISPLAY))
					}, true)
				} else {
					can.onappend._output(sub, can.request(event), sub.Conf(ctx.DISPLAY))
				}
			}
			can.db.extentions[url.split("?")[0]] = sub, can.base.isFunc(cb)? cb(sub): sub.select()
		})
	},
}, [""])
Volcanos(chat.ONFIGURE, { 
	source: function(can, target, zone, path) { var total = 0
		function show(target, path) { can.run(can.request({}, {dir_root: path, dir_deep: true}), [nfs.PWD], function(msg) {
			can.onimport.tree(can, msg.Table(), nfs.PATH, ice.PS, function(event, item) { can.onimport.tabview(can, path, item.path) }, target)
			can.Status("目录", zone._total(total += msg.Length()))
		}, true) } if (path.length == 1) { return show(target, path[0]) }
		can.onimport.zone(can, can.core.List(path, function(path) { return {name: path, _init: function(target, zone) {
			can.onmotion.hidden(can, zone._action), can.onmotion.hidden(can, zone._target)
		}, _delay_show: function(target) { show(target, path) } }}), target), can.page.Remove(can, target.previousSibling)
	},
	plugin: function(can, target, zone) { var total = 0
		can.onimport.tree(can, can.core.Item(can.onengine.plugin.meta, function(key) { return total++, {index: key} }), ctx.INDEX, ice.PT, function(event, item) {
			can.onimport.tabview(can, can.Option(nfs.PATH), can.core.Keys(ice.CAN, item.index), ctx.INDEX)
		}, target), zone._total(total)
	},
})
Volcanos(chat.ONSYNTAX, {_init: function(can, msg, cb) {
		if (can.onmotion.cache(can, function(cache_data) {
			can.db.file && (cache_data[can.db.file] = {max: can.db.max, current: can.current, profile_display: can.ui.profile.className, display_display: can.ui.display.className})
			can.db.file = can.onexport.keys(can, can.Option(nfs.PATH), can.Option(nfs.FILE)); var p = cache_data[can.db.file]; if (p) {
				can.db.max = p.max, can.current = p.current, can.ui.profile.className = p.profile_display, can.ui.display.className = p.display_display
			} else { can.onmotion.hidden(can, can.ui.profile), can.onmotion.hidden(can, can.ui.display) }
			can.db.parse = can.base.Ext(can.db.file), can.Status("模式", mdb.PLUGIN); return can.db.file
		}, can.ui._content, can.ui._profile, can.ui._display)) { return can.base.isFunc(cb) && cb(msg._content) }
		if (msg.Option(ctx.INDEX)) { return can.onsyntax._index(can, msg, cb) }
		function init(p) { msg._can = can
		var list = ((new Error()).stack||"").split(ice.NL)
			can.db.max = 0, can.core.List(can.db.ls = msg.Result().split(ice.NL), function(item) { can.onaction.appendLine(can, item) })
			can.onengine.signal(can, "tabview.view.init", msg), can.base.isFunc(cb) && cb(msg._content = can.ui._content)
		} can.require(["inner/syntax.js"], function() { can.Conf(chat.PLUG) && (can.onsyntax[can.db.parse] = can.Conf(chat.PLUG))
			var p = can.onsyntax[can.db.parse]; !p? can.runAction({}, mdb.PLUGIN, [can.db.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
				init(p = can.onsyntax[can.db.parse] = can.base.Obj(msg.Result()||"{}"))
			}): init(p)
		})
	},
	_index: function(can, msg, cb) {
		if (can.Option(nfs.LINE) == web.DREAM) { can.ui.dream && can.onmotion.delay(can, function() { can.ui.dream.refresh() }, 5000)
			return can.base.isFunc(cb) && cb(msg._content = msg._content||can.page.insertBefore(can, [{view: [html.CONTENT, html.IFRAME],
				src: can.misc.MergePodCmd(can, {pod: can.Option(nfs.FILE)}), height: can.ui.content.offsetHeight, width: can.ui.content.offsetWidth}], can.ui._content))
		} var meta = {type: "story", index: msg.Option(ctx.INDEX), args: can.Option(nfs.PATH) == ctx.COMMAND && can.Option(nfs.LINE) != ctx.INDEX? [can.Option(nfs.LINE)]: []}
		return can.onimport.plug(can, meta, function(sub) {
			can.page.ClassList.del(sub, sub._target, html.HIDE)
			sub.onaction.close = function() { can.onaction.back(can), msg._tab._close() }
			sub.onexport.title = function(_, title) { can.page.Modify(can, msg._tab, title) }
			sub.onexport.record = function(_, value, key, line) {
				line.path && can.onimport.tabview(can, line.path, line.file, line.line)
			}
			sub.onimport._open = function(sub, msg, _arg) { var url = can.base.ParseURL(_arg), ls = url.origin.split("/chat/pod/")
				if (_arg.indexOf(location.origin) == 0 && ls.length > 1) {
					return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1].split(ice.PS)[0], web.DREAM), sub.Update()
				} return can.user.open(_arg), sub.Update()
			}, sub.onimport.size(sub, sub.ConfHeight(can.ui.content.offsetHeight-2*html.ACTION_HEIGHT), sub.ConfWidth(can.ui.content.offsetWidth), true)
			msg._plugin = sub, can.base.isFunc(cb) && cb(msg._content = can.ui._content), can.onmotion.delay(can, function() { sub.Focus() })
		}, can.ui._content)
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
				default:
					var t = can.core.Item(p.regexp, function(reg, type) { var m = text.match(new RegExp(reg)); if (m && m.length > 0 && m[0] == text) { return type} })
					return t && t.length > 0? wrap(text, t[0]): type? wrap(text, type): text
			}
		}).join(""))
		return line
	},
})
Volcanos(chat.ONACTION, {
	_getLine: function(can, line) { return can.page.Select(can, can.ui.content, "tr.line>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return td.parentNode } })[0] },
	_getLineno: function(can, line) { return can.page.Select(can, can.ui.content, "tr.line>td.line", function(td, index) { if (td.parentNode == line || index+1 == line) { return index+1 } })[0] },
	appendLine: function(can, value) {
		var ui = can.page.Append(can, can.ui._content, [{type: html.TR, className: "line", list: [
			{view: [nfs.LINE, html.TD, ++can.db.max], onclick: function(event) {
				can.onaction.selectLine(can, ui.tr)
			}, ondblclick: function(event) {
				can.onaction.find(event, can)
			}},
			{view: [html.TEXT, html.TD, can.onsyntax._parse(can, value)], onclick: function(event) {
				if (event.metaKey) {
					if (ui.text.innerText.indexOf(ice.HTTP) > -1) {
						var ls = (/(http[^ ]+)/).exec(ui.text.innerText)
						if (ls && ls[1]) {
							can.user.open(ls[1])
							return
						}
					}
				}
				can.onaction.selectLine(can, ui.tr)
			}, ondblclick: function(event) {
				can.onaction.searchLine(event, can, can.onexport.selection(can, ui.text.innerText))
			}}
		]}]); return ui.tr
	},
	selectLine: function(can, line, scroll) { if (!line) { return can.onexport.line(can, can.page.SelectOne(can, can.ui._content, "tr.select")) }
		can.page.Select(can, can.ui._content, "tr.line>td.line", function(td, index) { var tr = td.parentNode, n = parseInt(td.innerText)
			if (!can.page.ClassList.set(can, tr, html.SELECT, tr == line || n == line)) { return }
			line = tr, can.Status("行号", can.onexport.position(can, can.Option(nfs.LINE, n)))
		}); if (!can.base.isObject(line)) { return 0 }
		can.page.Select(can, line, "td.text", function(item) {
			can.current = {
				window: function() { return parseInt(can.ui._content.offsetHeight/can.current.line.offsetHeight) },
				scroll: function(count) { if (count) { can.ui._content.scrollTop += count*can.current.line.offsetHeight }
					return parseInt((can.current.line.offsetTop-can.ui._content.scrollTop)/can.current.line.offsetHeight)
				}, prev: function() { return line.previousSibling }, next: function() { return line.nextSibling },
				line: line, text: function(text) { return text != undefined && can.onaction.modifyLine(can, line, text), item.innerText },
			}, can.onimport.history(can, {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)})
			can.onexport.hash(can), scroll && can.onaction.scrollIntoView(can), can.onengine.signal(can, "tabview.line.select", can._msg)
		})
		can.misc.localStorage(can, "web.code.inner:currentFile", can.Option(nfs.PATH)+ice.DF+can.Option(nfs.FILE)+ice.DF+can.onaction._getLineno(can, can.current.line))
		can.misc.localStorage(can, "web.code.inner:selectLine:"+can.Option(nfs.PATH)+can.Option(nfs.FILE), can.onaction._getLineno(can, can.current.line))
		return can.onexport.line(can, line)
	},
	searchLine: function(event, can, value) {
		can.runAction(can.request(event, {name: value, text: can.current.text()}, can.Option()), code.NAVIGATE, [], function(msg) {
			msg.Append(nfs.FILE)? can.onimport.tabview(can, msg.Append(nfs.PATH), msg.Append(nfs.FILE), msg.Append(nfs.LINE)): can.user.toastFailure(can, "not found "+value)
		})
	},
	favorLine: function(event, can, value) {
		can.user.input(event, can, [{name: mdb.ZONE, value: "hi"}, {name: mdb.NAME, value: "hello"}], function(data) {
			can.runAction(event, code.FAVOR, [ctx.ACTION, mdb.INSERT, mdb.ZONE, data.zone||"",
				mdb.TYPE, can.db.parse, mdb.NAME, data.name||"", mdb.TEXT, (value||"").trimRight(),
				nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
			], function() { can.user.toastSuccess(can) })
		})
	},
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
	scrollIntoView: function(can, offset) { var window = can.current.window(); offset = offset||parseInt(window/4)+2
		var current = can.onaction._getLineno(can, can.current.line)
// 		var to = current/window*can.ui.content.offsetHeight+(offset-current%window)*can.current.line.offsetHeight
		var to = parseInt(current/window)*can.ui.content.offsetHeight+(parseInt(current%window)-offset-1)*can.current.line.offsetHeight
		can.ui.content.scrollTo(0, to)
	},
	back: function(can) { can.db.history.pop(); var last = can.db.history.pop(); last && can.onimport.tabview(can, last.path, last.file, last.line) },
	clear: function(event, can) {
		if (can.page.Select(can, can._root._target, "div.vimer.find.float", function(item) { return can.page.Remove(can, item) }).length > 0) { return }
		if (can.page.Select(can, can._root._target, ".input.float", function(item) { return can.page.Remove(can, item) }).length > 0) { return }
		if (can.page.Select(can, can.ui.plug, "legend.select", function(item) { return item.click(), item }).length > 0) { return }
		if (can.page.isDisplay(can.ui.display)) { return can.onmotion.hidden(can, can.ui.display), can.onimport.layout(can) }
		if (can.page.isDisplay(can.ui.profile)) { return can.onmotion.hidden(can, can.ui.profile), can.onimport.layout(can) }
		// can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can)
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
				can.core.List(msg.index, function() { msg.Push("cb", show) })
				_msg.Copy(msg), cb(_msg)
			} else { cb(msg) }
		}, true) }}], function(list) { show(list[0]) })
	},
	open: function(event, can) {
		var paths = can.core.List(can.db.paths, function(item) { if (can.base.endWith(item, "-story/", "-dict/")) { return } return item }).join(ice.FS)
		can.page.style(can, can.user.input(can.request(event, {paths: paths}), can, [{name: nfs.FILE, style: {width: can.ui.content.offsetWidth/2}, run: function(event, cmds, cb) {
			can.run(can.request(event, {paths: paths}), cmds, function(msg) {
				if (cmds[0] == ctx.ACTION && cmds[1] == mdb.INPUTS) { var _msg = can.request({}), func = can.onexport.func(can)
					can.core.Item(can.db.tabview, function(key) { var ls = can.core.Split(key, ice.DF); _msg.Push(nfs.PATH, ls[0]+ls[1]) })
					can.core.List(func.list, function(item) { var ls = can.core.Split(item, ice.DF, ice.DF); _msg.Push(nfs.PATH, "line:"+ls[1]+":"+ls[0]) })
					can.core.Item(can.onengine.plugin.meta, function(key, value) { _msg.Push(nfs.PATH, "index:can."+key) })
					_msg.Copy(msg), cb(_msg)
				} else { cb(msg) }
			}, true)
		}}], function(list, input) { input.cancel()
			var ls = can.core.Split(list[0], ice.DF, ice.DF); switch (ls[0]) {
				case "_open": return can.runAction(event, ls[0], ls[1])
				case ctx.INDEX:
				case web.DREAM: return can.onimport.tabview(can, can.Option(nfs.PATH), ls[1], ls[0])
				case nfs.LINE: return can.onaction.selectLine(can, parseInt(ls[1]), true)
				default: can.core.List(can.db.paths, function(path) { if (list[0].indexOf(path) == 0) { can.onimport.tabview(can, path, list[0].slice(path.length)) } })
			}
		})._target, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/4-34, html.TOP, can.ui.content.offsetHeight/4, html.RIGHT, "")
	},
	find: function(event, can) {
		var ui = can.page.Append(can, can._output, [{view: "vimer find float", list: [html.ACTION, html.OUTPUT],
			style: {left: can.ui.project.offsetWidth+can.ui.content.offsetWidth/4, top: can.ui.content.offsetHeight/2+4*can.current.line.offsetHeight}}])
		can.onmotion.delay(can, function() { can.page.style(can, ui._target, html.LEFT, can.ui.project.offsetWidth+can.ui.content.offsetWidth/2-ui._target.offsetWidth/2) })
		can.onmotion.move(can, ui._target)
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
				if (can.base.isObject(value)) {
					if (value.type == lang.SPACE) { return }
					value.type == lang.STRING && msg.Push(mdb.VALUE, value.left+value.text+value.right), msg.Push(mdb.VALUE, value.text)
				} else {
					if (value.indexOf(ice.PT) > -1) { msg.Push(mdb.VALUE, value.split(ice.PT).pop()) }
					msg.Push(mdb.VALUE, value)
				}
			}), cb(msg) }}, target)
		}
		var meta = can.onappend._action(can, [
			{type: html.TEXT, name: nfs.FROM, style: {width: 200}, _init: function(target) { from = target, complete(target, nfs.FIND), can.onmotion.delay(can, function() { target.focus() }) }},
			{type: html.BUTTON, name: nfs.FIND}, {type: html.BUTTON, name: nfs.GREP}, {type: html.TEXT, name: nfs.TO, _init: function(target) { to = target, complete(target, nfs.REPLACE) }},
			{type: html.BUTTON, name: nfs.REPLACE}, {type: html.BUTTON, name: cli.CLOSE},
		], ui.action, {_trans: {find: "查找", grep: "搜索", replace: "替换"},
			find: function() { find(last+1, from.value) },
			grep: function() { can.onimport.exts(can, "inner/search.js", function(sub) { sub.select(), meta.close(), can.onmotion.delay(can, function() { sub.runAction(event, nfs.GREP, [from.value, can.Option(nfs.PATH)]) }) }) },
			replace: function() { var text = can.current.text(), line = can.onaction._getLineno(can, can.current.line)
				can.db.undo.push(function() { can.onaction.selectLine(can, line), can.onaction.modifyLine(can, line, text) })
				can.current.text(text.replace(from.value, to.value)), can.current.text().indexOf(from.value) == -1 && meta.find()
			}, close: function() { can.page.Remove(can, ui._target) },
		}); var from, to
	},
})
Volcanos(chat.ONEXPORT, {list: ["目录", "类型", "文件", "行号", "跳转"],
	hash: function(can) { if (!can.isCmdMode()) { return }
		location.hash = [can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE)].join(ice.DF)
	},
	keys: function(can, path, file) { return [path||can.Option(nfs.PATH), file||can.Option(nfs.FILE)].join(ice.DF) },
	line: function(can, line) { return parseInt(can.core.Value(can.page.SelectOne(can, line, "td.line"), "innerText")) },
	position: function(can, index, total) { total = total||can.db.max; return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%" },
	selection: function(can, str) {
		var s = document.getSelection().toString(), begin = str.indexOf(s), end = begin+s.length
		for (var i = begin; i >= 0; i--) { if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break } }
		return s
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
			if (can.db.parse == nfs.JS) {
				if (_indent == 0 && can.base.beginWith(text, "Volcanos")) {
					var ls = can.core.Split(text, "\t ({:}),"); block = can.base.trimPrefix(ls[1], "chat.").toLowerCase()
					if (text.indexOf("_init") > -1) { push(block+ice.PT+"_init"+ice.DF+(index+1)) }
				} else if (_indent == 4) {
					var ls = can.core.Split(text, "\t ({:}),"); ls[0] && push(block+ice.PT+ls[0]+ice.DF+(index+1))
				}
			} else if (can.db.parse == nfs.GO) {
				var ls = can.core.Split(text, "\t *", "({:})")
				if (_indent == 0) {
					switch (ls[0]) {
						case "package": package = ls[1]; break
						case "func": if (ls[1] == "(") { ls[1] = ls[2]+ice.PT+ls[5]
							if (ls[5].toLowerCase()[0] == ls[5][0]) { push("- "+ls[1]+ice.DF+(index+1)) } else { push("+ "+ls[1]+ice.DF+(index+1)) } break
						}
						case "type":
						case "var":
							if (ls[1].toLowerCase()[0] == ls[1][0]) { push("- "+ls[1]+ice.DF+(index+1)) } else { push("+ "+package+"."+ls[1]+ice.DF+(index+1)) } break
					}
				} else if (_indent == 4) {
					if (text.indexOf("MergeCommands(") > -1) { block = "cmds" } else if (text == "})") { block = "" }
				} else if (_indent == 8) {
					if (block == "cmds" && ls[1] == ice.DF) { push("+ "+package+ice.PT+ls[0]+ice.DF+(index+1)), block = package+ice.PT+ls[0] }
				} else if (_indent == 12) {
					if (block && ls[1] == ice.DF) { push("+ "+block+ice.SP+ls[0]+ice.DF+(index+1)) }
				}
			}
		})
		return {list: list, current: current, percent: percent}
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
