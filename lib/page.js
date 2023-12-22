Volcanos("page", {
	ClassList: {
		has: function(can, target, key) { var list = target.className && target.className.split? target.className.split(lex.SP): []; return list.indexOf(key) > -1 },
		add: function(can, target, key) { Array.isArray(key) && (key = key.join(lex.SP))
			var list = target.className? target.className.split(lex.SP): []; can.core.List(can.core.Split(key, " .,"), function(key) { can.base.AddUniq(list, key) })
			var value = list.join(lex.SP).trim(); return value != target.className && (target.className = value), value
		},
		del: function(can, target, key) { var list = target.className? target.className.split(lex.SP): []
			return target.className = can.core.List(list, function(value) { return value == key? undefined: value }).join(lex.SP).trim()
		},
		set: function(can, target, key, condition) { return (condition? this.add(can, target, key): this.del(can, target, key)).indexOf(key) > -1 },
		neg: function(can, target, key) { return (this.has(can, target, key)? this.del(can, target, key): this.add(can, target, key)).indexOf(key) > -1 },
		tag: function(can, target) { return [document.body.tagName.toLowerCase()].concat(document.body.classList).join(lex.PT) }
	},
	SelectArgs: function(can, target, key, cb) {
		if (can.base.isUndefined(target)) { return can.page.SelectArgs(can, can._option, "").concat(can.page.SelectArgs(can, can._action, "")) }
		if (can.base.isUndefined(key)) { var value = {}; can.page.SelectArgs(can, target, "", function(item) { item.name && item.value && (value[item.name] = item.value) }); return [value] }
		if (can.base.isObject(key)) { return can.core.Item(key, function(key, value) { can.page.SelectArgs(can, target, key, value) }), [key] }
		if (!can.base.isFunc(cb)) { var value = cb; cb = function(target) {
			can.base.isUndefined(value) || can.page.Select(can, target.parentNode, "span.value", function(target) { target.innerText = value })
			return target.name && (can.base.isUndefined(value)? target.value: (target.value = value))||""
		} }
		if (key.indexOf(nfs.PT) > -1) { return [""] } key && can.base.isString(cb) && can.page.Select(can, target, "div.item."+key+">span.value", cb)
		return can.page.Select(can, target, key? "select[name="+key+"],"+"input.select[type=button][name="+key+"],"+"input[type=text][name="+key+"],"+"textarea[name="+key+"]": ".args", cb)
	},
	SelectInput: function(can, target, name, cb) { return can.page.Select(can, target, "input[name="+name+"]", cb)[0] },
	SelectChild: function(can, target, key, cb) { return can.core.List(can.page.Select(can, target, key||"*", function(node) { if (node.parentNode == target) { return node } }), cb) },
	SelectOne: function(can, target, key, cb) { return can.page.Select(can, target, key, function(target, index) { return index == 0 && can.base.isFunc(cb) && cb(target), target })[0] },
	Select: function(can, target, key, cb, interval, cbs) { target = target || document.body, key = key||"*"
		return can.core.List(key == nfs.PT? [target]: target.querySelectorAll(can.page.Keys(key)), cb, interval, cbs)
	},
	Modify: function(can, target, value) { target = can.base.isString(target)? document.querySelector(target): target; if (!target) { return }
		can.base.isString(value)? (target.innerHTML = value): can.core.Item(value, function(key, val) {
			key == "className" && can.base.isArray(val) && (val = val.join(lex.SP)), !can.base.isObject(val)? (target[key] = val): can.core.Item(val, function(k, v) {
				if (can.base.isIn(k, "height", "width", "min-height", "max-height", "min-width", "max-width") && parseInt(v) < 0) { return target[key] && (target[key][k] = "") }
				if (can.base.isIn(k, "height", "width", "min-height", "max-height", "min-width", "max-width",
					"left", "top", "right", "bottom", "margin-left", "margin-top", "margin", "padding", "font-size") && v && (can.base.isNumber(v) || !can.base.endWith(v, "px"))) { v += "px" }
				target[key] && (target[key][k] = v)
			})
		}); return target
	},
	Create: function(can, key, value) { return can.page.Modify(can, document.createElement(key), value) },
	Remove: function(can, target) { return target && target.parentNode && target.parentNode.removeChild(target), target },
	Append: function(can, target, key, value) { if (can.base.isString(key)) { var res = can.page.Create(can, key, value); return target.appendChild(res), res }
		value = value||{}, can.core.List(key, function(item) { if (!item) { return } if (item.nodeName) { target.appendChild(item); return }
			if (can.base.isString(item)) { item = {view: [item]} }
			var type = item.type||html.DIV, data = item.data||{}, name = item.name||data.name||""; data.className = data.className||""
			can.core.Item(item, function(key, value) { switch (key) {
				case mdb.TYPE: break
				case mdb.NAME: break
				case mdb.DATA: break
				case mdb.LIST: break
				case html.CLICK: data.onclick = item.click; break
				case html.INNER: data.innerHTML = item.inner; break
				default: can.base.isUndefined(item[key]) || (data[key] = item[key])
			} })
			if (item.view) { var list = can.core.List(item.view); if (can.base.isArray(list[0])) { list[0] = list[0].join(lex.SP) }
				list[0] && can.page.ClassList.add(can, data, list[0]), type = list[1]||type, data.innerHTML = list[2]||data.innerHTML||"", name = list[3]||name
			} else if (item.text) { var list = can.core.List(item.text); if (can.base.isArray(list[2])) { list[2] = list[2].join(lex.SP) }
				data.innerHTML = list[0]||data.innerHTML||"", type = list[1]||item.type||html.SPAN, list[2] && can.page.ClassList.add(can, data, list[2])
			} else if (item.icon) { var list = can.core.List(item.icon)
				if (can.page.unicode[list[0]]) {
					type = html.SPAN, name = list[0], data.className = "icon "+list[0], data.innerText = can.page.unicode[list[0]]
				} else {
					type = "i", data.className = list[0]
				}
			} else if (item.button) { var list = can.core.List(item.button); type = html.BUTTON, name = list[0]||name, data.innerText = can.user.trans(can, name)
				data.onclick = function(event) { can.misc.Event(event, can, function(msg) { can.base.isFunc(list[1]) && list[1](event, name), can.onkeymap.prevent(event) }) }
			} else if (item.select) { var list = item.select; type = html.SELECT, name = list[0][0], data.className = data.className||list[0][0]
				data.onchange = function(event) { can.misc.Event(event, can, function(msg) { can.base.isFunc(list[1]) && list[1](event, event.target.value, name) }) }
				item.list = list[0].slice(1).map(function(value) { return {type: html.OPTION, value: value, inner: can.user.trans(can, value)} })
			} else if (item.input) { var list = can.core.List(item.input); type = html.INPUT, name = list[0], data.className = data.className||list[0], data.type = data.type||html.TEXT
				data.onkeydown = function(event) { can.base.isFunc(list[1]) && list[1](event) }
				data.onkeyup = function(event) { can.base.isFunc(list[2]) && list[2](event) }
			} else if (item.username) { var list = can.core.List(item.username); type = html.INPUT, name = list[0]||name||html.USERNAME
				// data.className = list[1]||data.className||name, data.autocomplete = data.autocomplete||html.USERNAME
				data.className = list[1]||data.className||name
			} else if (item.password) { var list = can.core.List(item.password); type = html.INPUT, name = list[0]||name||html.PASSWORD
				// data.className = list[1]||data.className||name, data.type = html.PASSWORD, data.autocomplete = data.autocomplete||"current-password"
				data.className = list[1]||data.className||name, data.type = html.PASSWORD
			} else if (item.img) { var list = can.core.List(item.img); type = html.IMG, data.src = list[0]
			} else if (item.row) { type = html.TR, item.list = item.row.map(function(text) { return {text: [text, item.sub||html.TD]} })
			} else if (item.th) { type = html.TR, item.list = item.th.map(function(text) { return {text: [text, html.TH]} })
			} else if (item.td) { type = html.TR, item.list = item.td.map(function(text) { return can.base.isObject(text)? text: {text: [text||"", html.TD]} }) }
			// if (type == html.SELECT)  { data.title = can.user.trans(can, data.title||name) }
			if (type == html.INPUT)  {
				if (data.type == html.TEXT||data.type == html.PASSWORD||!data.type) {
					data.placeholder = (data.placeholder||name||"").split(nfs.PT).pop(), data.title = can.user.trans(can, data.title||data.placeholder)
					data.autocomplete = data.autocomplete||"off"
				} else if (data.type == html.BUTTON) {
					// data.value = can.user.trans(can, data.value)
				}
			} if (type == html.TEXTAREA)  { data.placeholder = can.user.trans(can, (data.placeholder||name||"").split(nfs.PT).pop()) }
			can.core.List(["className", "placeholder", "title"], function(key) { data[key] || delete(data[key]) })
			name && (data.name = name); var node = can.page.Create(can, type, data)
			value[type] = value[name] = value[can.core.Split(data.className)[0]] = node, value._target = value._target||node, value.first = value.first||node, value.last = node
			item.list && can.page.Append(can, node, item.list, value), target && target.appendChild && target.appendChild(node), can.base.isFunc(item._init) && item._init(node, value)
		}); return value
	},
	Appends: function(can, target, key, value) { return target.innerHTML = "", can.page.Append(can, target, key, value) },
	AppendData: function(can, target, prefix, key, value, cb) { var open = can.page.unicode.open, close = can.page.unicode.close
		function short(value, length) {
			if (length == undefined) {
				value.indexOf(lex.NL) > -1 && (value = value.trim().split(lex.NL)[0]+can.page.unicode.inner)
				return can.page.trans(can, value)
			} else { if (length > 5) {
				return can.page.unicode.inner }
			} return value
		}
		function show(value, deep) { deep = deep == undefined? 2: 0; switch (typeof value) {
			case code.OBJECT: if (!value) { return {} }
				if (value._path) { return {value: "@\""+value._path+"\""} }
				if (value.tagName) { return {type: nfs.TARGET, value: "$ "+value.tagName.toLowerCase()+(value.className? nfs.PT+value.className.replaceAll(lex.SP, nfs.PT):"")} }
				if (deep < 0) { return {value: value.length == undefined? "{"+can.page.unicode.inner+"}": "["+can.page.unicode.inner+"]"} }
				if (value.length != undefined) { return {value: (value.length > 3? value.length+lex.SP: "")+"["+can.core.List(value, function(value, index) { if (index < 6) { return short(show(value, deep-1).value, index+1) } }).join(mdb.FS)+"]"} }
				return {value: "{"+can.core.Item(value, function(key, val, list) { if (value.hasOwnProperty(key) && val && list.length < 7) { return short(key+nfs.DF+show(val, deep-1).value, list.length) } }).join(mdb.FS)+"}"}
			case code.STRING: return {open: "s", close: "s", value: "\""+(deep == 2? value.replaceAll("\n", "\\n"): short(value))+"\""}
			case code.NUMBER: return {open: "n", close: "n", value: value}
			case code.BOOLEAN: return {open: "b", close: "b", value: value}
			case code.FUNCTION: return {open: "f", close: "f", value: deep == 2? (""+value).split(lex.NL)[0]: "function(..) {..}"}
			default: return {value: value}
		} } var loaded = false, _show = show(value); _show.open = _show.open||open, _show.close = _show.close||close
		var ui = can.page.Append(can, target, [!key && value.tagName? can.page.AppendView(can, value): {view: [[html.ITEM, _show.type||typeof(value)], key == ""? html.SPAN: html.DIV], list: [
			{view: [mdb.ICON, html.SPAN, _show.close+lex.SP]}, {view: [mdb.NAME, html.SPAN, key || key === 0? key+lex.SP: ""]}, {view: [mdb.VALUE, html.SPAN, _show.value]},
		], onclick: function() { cb && cb(prefix, value); if (typeof value != code.OBJECT) { return }
			ui.icon.innerText = (can.onmotion.toggle(can, ui.list)? _show.open: _show.close)+lex.SP
			if (loaded) { return } loaded = true, ui.icon.innerText = _show.open+lex.SP
			if (value.tagName) { can.page.Append(can, ui.list, [can.page.AppendView(can, value)]), can.onappend.style(can, mdb.VIEW, ui.list)
				can.core.List(can.core.Item(target, function(key, value) { if (["textContent", "innerHTML", "outerHTML"].indexOf(key) > -1 || typeof value == code.FUNCTION || key.toUpperCase() == key) { return } return key }).sort(), function(key) {
					target[key] && can.page.AppendData(can, ui.list, can.core.Keys(prefix, key), key, target[key], cb)
				})
			} else if (value.length != undefined) {
				can.core.List(value, function(value, index) { can.page.AppendData(can, ui.list, can.core.Keys(prefix, index), index, value, cb) })
			} else {
				can.core.List(can.core.Item(value, function(key, val) { if (
					(value["preventDefault"] && val && typeof val != code.FUNCTION) || (value["responseText"] && val && typeof val != code.FUNCTION) ||
					value.hasOwnProperty(key) && val) { return key } }).sort(), function(key) { can.page.AppendData(can, ui.list, can.core.Keys(prefix, key), key, value[key], cb) })
				var key = "__proto__"; value[key] && can.core.Item(value[key]).length > 0 && can.page.AppendData(can, ui.list, can.core.Keys(prefix, key), key, value[key], cb)
			}
		}}, {view: [[html.LIST, html.HIDE]], style: {"margin-left": "20px"}}])
		return ui
	},
	AppendView: function(can, target, tag, list, loaded, cb) {
		function field(target) { return target? can.core.List(target.attributes, function(item) {
			return item.value == "" || item.value == item.name? {type: html.SPAN, list: [{text: lex.SP}, {text: item.name}]}:
				{type: html.SPAN, list: [{text: lex.SP}, {text: item.name}, {text: mdb.EQ}, {className: code.STRING, text: "\""+item.value+"\""}]}
		}): [] }
		var ui = {}; tag = tag||target.tagName.toLowerCase(), isclose = tag != mdb.META && tag != web.LINK, _field = field(target)
		var inner = target.innerHTML? can.page.unicode.inner: ""; if (target && target.tagName) { target.innerText == target.innerHTML && (inner = target.innerText) }
		return {view: mdb.VIEW, list: [
			{view: [[html.ITEM, target.tagName && target.tagName.toLowerCase()]], list: [
				{text: (target.children.length > 0? can.page.unicode.close: lex.SP)+lex.SP, _init: function(target) { ui.toggle = target }},
				{className: code.KEYWORD, text: can.page.trans(can, ice.LT)}, {className: code.KEYWORD, text: tag}, {type: html.SPAN, list: _field},
				{className: code.KEYWORD, text: can.page.trans(can, ice.GT)}, inner && {text: inner, _init: function(target) { ui.inner = target }},
				isclose && {className: code.KEYWORD, text: can.page.trans(can, ice.LT+nfs.PS+tag+ice.GT), _init: function(target) { ui._close = target }},
			], onclick: function(event) { ui.toggle.innerText = (can.onmotion.toggle(can, ui.list)? can.page.unicode.open: can.page.unicode.close)+lex.SP
				ui.inner && can.onmotion.toggle(can, ui.inner), can.onmotion.toggle(can, ui.close), can.onmotion.toggle(can, ui._close)
				if (!loaded) { if (can.page.tagis(target, ctx.STYLE, nfs.SCRIPT)) { can.page.Append(can, ui.list, [{text: target.innerHTML}]) } else {
					can.page.Append(can, ui.list, can.core.List(target.children, function(node) { return can.page.AppendView(can, node, "", null, false, cb) }))
				} } loaded = true, can.base.isFunc(cb) && cb(target)
			}, onmouseenter: function() {
				can.page.Select(can, document.body, ".picker", function(target) { can.page.ClassList.del(can, target, "picker") })
				!can.page.tagis(target, nfs.SCRIPT) && can.onappend.style(can, "picker", target)
			}, _init: function(target) { can.onmotion.delay(can, function() { loaded && target.click() }) }},
			isclose && {view: [[html.LIST, html.HIDE]], style: {"margin-left": "20px"}, _init: function(target) { ui.list = target }, list: list},
			isclose && {view: [[html.ITEM, html.HIDE]], list: [{text: "  "}, {className: code.KEYWORD, text: can.page.trans(can, ice.LT+nfs.PS+tag+ice.GT)}], _init: function(target) { ui.close = target }},
		]}
	},
	AppendStyle: function(can, style) {
		var styleElement = document.createElement('style'); styleElement.type = 'text/css'
		document.getElementsByTagName('head')[0].appendChild(styleElement)
		styleElement.appendChild(document.createTextNode(style))
	},
	AppendTable: function(can, msg, target, list, cb) { if (!msg.append||msg.append.length == 0) { return }
		var ui = can.page.Append(can, target, [{type: html.TABLE, list: [
			{type: "colgroup", list: can.core.List(list, function(key) { if (key[0] != "_") {
				try { var value = can.Option(key) } catch {}
				if (value == undefined) { return {view: [key, "col"]} } return {view: [[key, "option"], "col"]}
		} }) }, {type: html.THEAD}, {type: html.TBODY}]}])
		can.page.Append(can, ui.thead, [{type: html.TR, data: {dataset: {index: -1}}, list: can.core.List(list, function(key) {
			if (key[0] != "_") {
				return {type: html.TH, list: [{text: can.user.trans(can, key, null, html.INPUT)}, {icon: "bi bi-sort-down-alt"}, {icon: "bi bi-sort-up"}]}
			}
		}) }])
		can.page.Append(can, ui.tbody, can.core.List(msg.Table(), function(item, index, array) {
			return {dataset: {index: index}, className: item[mdb.STATUS], td: can.core.List(list, function(key) { if (key[0] != "_") { return cb(can.page.Color(item[key]).trim(), key, index, item, array) } }) }
		})); return can.page.OrderTable(can, ui._target)
	},
	OrderTable: function(can, table) { can.page.Select(can, table, html.TH, function(th, index) { th.onclick = function(event) {
		var dataset = event.currentTarget.dataset
		can.onmotion.select(can, th.parentNode, html.TH, th)
		can.page.RangeTable(can, table, index, (dataset["asc"] = (dataset["asc"] == "1") ? 0: 1) == "1")
	} }); return table },
	RangeTable: function(can, table, index, asc) { index = can.base.isArray(index)? can.core.List(index, function(item) { if (item > -1) { return item } }): [index]; if (index.length == 0) { return }
		var list = can.page.Select(can, table, html.TR, function(tr) { if (can.page.isDisplay(tr)) { return tr } }).slice(1)
		var is_time = true, is_number = true; can.core.List(list, function(tr) {
			var text = tr.childNodes[index[0]].innerHTML;
			is_time = is_time && Date.parse(text) > 0, is_number = is_number && !isNaN(parseFloat(text||"0"))
		})
		var num_list = can.core.List(list, function(tr) { var text = tr.childNodes[index[0]].innerHTML; return is_time? Date.parse(text): is_number? can.base.ParseSize(text)||0: text })
		function isless(a, b, index) { if (a.childNodes[index[0]] && b.childNodes[index[0]]) {
			if (a.childNodes[index[0]].innerHTML < b.childNodes[index[0]].innerHTML) { return true }
			if (a.childNodes[index[0]].innerHTML > b.childNodes[index[0]].innerHTML) { return false }
		} return index.length > 1 && isless(a, b, index.slice(1)) }
		for (var i = 0; i < num_list.length; i++) { var min = i
			for (var j = i+1; j < num_list.length; j++) {
				if (asc? num_list[min] < num_list[j]: num_list[j] < num_list[min]) { min = j; continue }
				if (num_list[min] == num_list[j] && index.length > 1) { if (asc? isless(list[min], list[j], index.slice(1)): isless(list[j], list[min], index.slice(1))) { min = j } }
			}
			if (min != i) {
				var temp = num_list[i]; num_list[i] = num_list[min]; num_list[min] = temp
				var temp = list[i]; list[i] = list[min]; list[min] = temp
			}
			var tbody = list[i].parentElement; list[i].parentElement && tbody.removeChild(list[i]), tbody.appendChild(list[i])
		}
	},
	Format: function(type) { var arg = arguments; switch (type) {
		case html.A: return `<a href="${arg[1]}" target="_blank">${arg[2]||arg[1]}</a>`
		case html.IMG: return arg[3]? `<img src="${arg[1]}" height="${arg[2]}" width=${arg[3]}>`: arg[2]? `<img src="${arg[1]}" height="${arg[2]}">`: `<img src="${arg[1]}">`
		case html.SPAN: arg[2] && typeof arg[2] == code.OBJECT && arg[2].join && (arg[2] = arg[2].join(lex.SP))
			return arg[2]?  `<span class="${arg[2]}">${arg[1]}</span>`: arg[1]
		default: /* type inner arg... */
			var list = ["<"+type]; for (var i = 2; i < arg.length; i += 2) { list.push(lex.SP+arg[i]+mdb.EQ+arg[i+1]) }
			return list.concat(">", arg[1], "</", type, ">").join("")
	} },
	Color: function(text) { if (typeof text != code.STRING) { return "" } text = text.replace(/\\n/g, "<br>")
		if (text.indexOf(ice.HTTP) == 0 && text.length > 10) { var ls = text.split(lex.SP); text = "<a href='"+ls[0]+"' target='_blank'>"+decodeURI(ls[0])+"</a>"+ls.slice(1).join(lex.SP) }
		if (text.indexOf("export ctx_dev=") == 0 && text.length > 10) { return "<div class='story' data-type='spark' data-name='shell'><div>"+"<span>"+text+"</span>"+"</div></div>" }
		if (text.indexOf("\033\[") == -1) { return text }
		text = text.replace(/\033\[41m/g, "<span style='background-color:#f00'>")
		text = text.replace(/\033\[31m/g, "<span style='color:#f00'>")
		text = text.replace(/\033\[32m/g, "<span style='color:#0f0'>")
		text = text.replace(/\033\[33m/g, "<span style='color:#ff0'>")
		text = text.replace(/\033\[34m/g, "<span style='color:#00f'>")
		text = text.replace(/\033\[36m/g, "<span style='color:#0ff'>")
		text = text.replace(/\033\[37m/g, "<span style='color:gray'>")
		text = text.replace(/\033\[34;1m/g, "<span style='color:#00f'>")
		text = text.replace(/\033\[37;1m/g, "<span style='color:#fff'>")
		text = text.replace(/\033\[1m/g, "<span style='font-weight:bold'>")
		text = text.replace(/\033\[0m/g, "</span>")
		text = text.replace(/\033\[m/g, "</span>")
		return text
	},
	Keys: function() { var list = []; /* FS SP GT PT */ for (var i = 0; i < arguments.length; i++) { var v = arguments[i]; if (typeof v == code.OBJECT) {
		for (var j = 0; j < v.length; j++) { if (typeof v[j] == code.OBJECT) {
			for (var k = 0; k < v[j].length; k++) { if (typeof v[j][k] == code.OBJECT) { v[j][k] = v[j][k].join(nfs.PT) } }
			v[j] = v[j].join(ice.GT)
		} } list.push(v.join(lex.SP))
	} else { list.push(v+"") } } return list.join(mdb.FS) },
	Cache: function(name, output, data) { if (!name) { return } var cache = output._cache||{}; output._cache = cache
		if (data) { if (output.children.length == 0) { return } var temp = document.createDocumentFragment()
			while (output.childNodes.length > 0) { var item = output.childNodes[0]; item.parentNode.removeChild(item), temp.appendChild(item) }
			return cache[name] = {node: temp, data: data}, name
		} output.innerHTML = ""; var list = cache[name]; if (!list) { return }
		while (list.node.childNodes.length > 0) { var item = list.node.childNodes[0]; item.parentNode.removeChild(item), output.appendChild(item) }
		return delete(cache[name]), list.data
	},
	parentNode: function(can, target, tag) {
		for (target; target; target = target.parentNode) {
			if (can.page.tagis(target, tag)) { return target }
		}
	},
	insertBefore: function(can, target, before, parent) { parent = parent||before.parentNode
		if (can.base.isArray(target)) {
			return can.core.List(target, function(item) { if (!item) { return }
				var target = can.page.Append(can, parent, [item])._target
				return parent.insertBefore(target, before), target
			})[0]
		} return before && parent.insertBefore(target, before), target
	},
	styleHeight: function(can, target, value) { return can.page.style(can, target, html.HEIGHT, value), target.offsetHeight },
	styleWidth: function(can, target, value) { return can.page.style(can, target, html.WIDTH, value), target.offsetWidth },
	styleClass: function(can, target, value) { return can.page.Modify(can, target, {className: value}), target.className },
	style: function(can, target, style) { var value = {}; for (var i = 2; i < arguments.length; i += 2) {
		if (typeof arguments[i] == code.OBJECT) { can.page.Modify(can, target, {style: arguments[i--]}) } else { value[arguments[i]] = arguments[i+1] }
	} return can.page.Modify(can, target, {style: value}), value },
	tagis: function(target) { if (!target || !target.tagName) { return }
		function isin(ls, list) {
			for (var i = 0; i < ls.length; i++) { var has = false
				for (var j = 0; j < list; j++) { if (ls[i] == list[j]) { has = true } }
				if (!has) { return false }
			} return true
		}
		var type = target.tagName.toLowerCase(); for (var i = 1; i < arguments.length; i++) {
			var ls = arguments[i].split("."); if (type != ls[0]) { continue }
			if (isin(ls.slice(1), target.classList)) { return true }
		}
	},
	tagClass: function(target) { return target.tagName.toLowerCase()+(target.className? nfs.PT+target.className.replaceAll(lex.SP, nfs.PT): "") },
	isDisplay: function(target) { return target && target.style.display != html.NONE && target.className.indexOf(html.HIDE) == -1 },
	editable: function(can, item, ok) { item.setAttribute("contenteditable", ok) },
	draggable: function(can, item, ok) { item.setAttribute("draggable", ok) },
	height: function() { return window.innerHeight },
	width: function() { return window.innerWidth },
	ismodkey: function(event) { return [code.META, code.ALT, code.CONTROL, code.SHIFT].indexOf(event.key) > -1 },
	unicode: {
		refresh: "↻", goback: "↺", play: "▶", create: "+", insert: "+", prunes: "♻︎", prune: "♻︎",
		select: "▿", remove: "✕", delete: "✕",
		menu: "☰", open: "▾", close: "▸",
		prev: "❮", next: "❯",

		start: "+", // play: "▸",
		back: "◀", reback: "▶",
		push: "⇈", pull: "⇊",
		lt: "❮", gt: "❯",
		inner: "..",
		favor: "\u2606",
	},
	inputs: function(can, list, type) { var _list = []; for (var i = 0; i < list.length; i++) { switch (list[i]) {
		case "": _list.push(""); break
		case ice.AUTO:
			_list.push({type: html.BUTTON, name: ice.LIST})
			_list.push({type: html.BUTTON, name: ice.BACK})
			break
		case mdb.PAGE:
			_list.push({type: html.TEXT, name: mdb.OFFEND, value: can._msg.Option(mdb.OFFEND)})
			_list.push({type: html.TEXT, name: mdb.LIMIT, value: can._msg.Option(mdb.LIMIT), _init: function(target) {
				can.onappend.figure(can, {action: "key", run: function(event, cmds, cb) {
					var msg = can.request(event)
					msg.Push(cmds[1], "10")
					msg.Push(cmds[1], "30")
					msg.Push(cmds[1], "50")
					msg.Push(cmds[1], "100")
					cb(msg)
				}}, target, function() { can.Update() })
			}})
			_list.push(mdb.NEXT, mdb.PREV)
			break
		default:
			(function() { var item = can.core.SplitInput(list[i], type||html.BUTTON)
				if (item.type == html.SELECT) { item._init = function(target) { target.value = item.value||item.values[0], target.onchange = function(event) { can.misc.Event(event, can, function(msg) {
					can.run(event)
				}) } } } item.action && (function() { item._init = function(target) {
					can.onappend.figure(can, item, target, function() { can.Update({}, ) })
				} })()
				_list.push(item), type = item.type
			})()
	} } return _list },
	input: function(can, item, value) { var input = {type: html.INPUT, name: item.name, data: item, style: item.style||{}, dataset: {}, _init: item._init}
		item.value == ice.AUTO && (item.value = "", item.action = ice.AUTO), item.action == ice.AUTO && (input.dataset.action = ice.AUTO)
		switch (item.type = item.type||html.TEXT) {
			case html.SELECT: input.type = html.SELECT, item.className||can.page.ClassList.add(can, item, ctx.ARGS)
				item.values = can.base.isString(item.values)? can.core.Split(item.values): item.values
				if (!item.values && item.value) { item.values = can.core.Split(item.value), item.value = item.values[0] }
				if (item.values.slice(1).indexOf(item.values[0]) > -1) { item.value = item.value||item.values[0], item.values = item.values.slice(1) }
				item.value = value||item.value, input.list = item.values.map(function(value) {
					return {type: html.OPTION, value: value, inner: can.user.trans(can, value, null, html.VALUE)}
				}); break
			case html.TEXTAREA: input.type = html.TEXTAREA // no break
			case html.USERNAME: // no break
			case html.PASSWORD: // no break
			case html.TEXT: item.className||can.page.ClassList.add(can, item, ctx.ARGS), item.name = item.name||item.type, item.value = value||item.value||""; break
			case html.UPLOAD: item.type = html.FILE, input.name = html.UPLOAD; break
			case html.BUTTON: item.value = item.value||item.name||mdb.LIST; break
		} return input
	},
	requireChina: function(can, title, list, name, path) {
		can.onappend.plugin(can, {title: title, display: "/plugin/story/china.js", style: html.FLOAT, height: can.ConfHeight(), width: can.ConfHeight()}, function(sub) {
			sub.run = function(event, cmds, cb) { var msg = can.request(event, {title: title, name: name, path: path})
				can.core.List(list, function(item) { msg.Push(mdb.NAME, item.name), msg.Push(mdb.VALUE, item.value) }), cb(msg)
				can.onmotion.resize(can, sub._target, function(height, width) { sub.onimport.size(sub, height, width, true) })
			}
		})
	},
	requireModules: function(can, libs, cb, cbs) { if (!libs || libs.length == 0) { return cb && cb() }
		for (var i = 0; i < libs.length; i++) { if (libs[i].indexOf(nfs.PS) == 0 || libs[i].indexOf(ice.HTTP) == 0) { continue }
			if (libs[i].indexOf(nfs._CSS) == -1 && libs[i].indexOf(nfs._JS) == -1) { libs[i] = libs[i]+"/lib/"+libs[i]+nfs._JS }
			libs[i] = nfs.REQUIRE_MODULES+libs[i]
		} can.require(libs, cb, cbs)
	},
	requireDraw: function(can, cb) { can.require([chat.PLUGIN_LOCAL+"wiki/draw.js", chat.PLUGIN_LOCAL+"wiki/draw/path.js"], function() {
		can.onimport._last_init(can, can.request()), can.onappend.style(can, wiki.DRAW, can._fields), cb()
	}, function(can, mod, sub) { mod == chat.ONIMPORT && (can[mod]._last_init = sub._init) }) },
	drawText: function(can, text, size, margin, fonts) { text = text.slice(0, 1), size = size||80, margin = margin == undefined? 10: margin
		var colors = ["rgb(239,150,26)", 'rgb(255,58,201)', "rgb(111,75,255)", "rgb(36,174,34)", "rgb(80,80,80)"]
		var canvas = can.page.Create(can, html.CANVAS, {width: size, height: size}), ctx = canvas.getContext("2d")
		ctx.fillStyle = colors[Math.floor(Math.random()*(colors.length))], ctx.fillRect(margin, margin, size-2*margin, size-2*margin)
		ctx.fillStyle = cli.WHITE, ctx.font = (fonts||can.base.Min(size/text.length-30, 16))+"px Arial", ctx.textAlign = "center", ctx.textBaseline = "middle", ctx.fillText(text, size/2, size/2)
		return canvas.toDataURL(html.IMAGE_PNG, 1)
	},
	position: function(event, target) { var p = target.getBoundingClientRect(); return {x: event.clientX - p.x, y: event.clientY - p.y} },
	theme: function(cb) { var themeMedia = window.matchMedia("(prefers-color-scheme: dark)")
		cb && themeMedia.addListener(function(event) { cb(event.matches? html.DARK: html.LIGHT) })
		cb && cb(themeMedia.matches? html.DARK: html.LIGHT)
		return themeMedia.matches? html.DARK: html.LIGHT
	},
	parseAction: function(can, value) { var action = []
		can.page.Select(can, can.page.Create(can, html.DIV, value.action), html.INPUT, function(target) {
			action.push(target.name), target.name != target.value && can.user.trans(can, kit.Dict(target.name, target.value))
		})
		return action
	},
	buttonStyle: function(can, name) {
		return can.base.isIn(name, mdb.CREATE, mdb.INSERT, mdb.IMPORT, nfs.CLONE, cli.BUILD, cli.START, ctx.RUN, web.OPEN, web.UPLOAD, web.CONFIRM, aaa.LOGIN, code.AUTOGEN, code.COMPILE, "more", "sso", "add", "pull", "push", "commit", "startall", "preview", "auto-preview", ice.APP)? html.NOTICE:
			can.base.isIn(name, mdb.REMOVE, mdb.DELETE, mdb.PRUNES, mdb.PRUNE, nfs.TRASH, cli.RESTART, cli.STOP, cli.CLOSE, cli.REBOOT, web.CANCEL, code.UPGRADE, "drop", "stopall", "prockill")? html.DANGER: ""
	},
	exportValue: function(can, msg, target) { target = target||can._output
		msg.OptionDefault(ice.MSG_THEME, can.getHeaderTheme())
		msg.OptionDefault(ice.MSG_BG, can.page.styleValue(can, "--plugin-bg-color", target))
		msg.OptionDefault(ice.MSG_FG, can.page.styleValue(can, "--plugin-fg-color", target))
		msg.OptionDefault(ice.MSG_LANGUAGE, can.user.info.language)
		return msg
	},
	styleValue: function(can, key, target) { const styles = getComputedStyle(target||document.body); return styles.getPropertyValue(key) },
	styleValueInt: function(can, key, target) { return parseInt(can.base.trimSuffix(can.page.styleValue(can, key, target), "px")) }
})
