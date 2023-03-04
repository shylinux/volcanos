Volcanos("page", {
	ClassList: {
		has: function(can, target, key) { var list = target.className? target.className.split(ice.SP): []; return list.indexOf(key) > -1 },
		add: function(can, target, key) { Array.isArray(key) && (key = key.join(ice.SP))
			var list = target.className? target.className.split(ice.SP): []; can.core.List(can.core.Split(key), function(key) { can.base.AddUniq(list, key) })
			var value = list.join(ice.SP).trim(); return value != target.className && (target.className = value), value
		},
		del: function(can, target, key) { var list = target.className? target.className.split(ice.SP): []
			return target.className = can.core.List(list, function(value) { return value == key? undefined: value }).join(ice.SP).trim()
		},
		set: function(can, target, key, condition) { return (condition? this.add(can, target, key): this.del(can, target, key)).indexOf(key) > -1 },
		neg: function(can, target, key) { return (this.has(can, target, key)? this.del(can, target, key): this.add(can, target, key)).indexOf(key) > -1 },
	},
	SelectArgs: function(can, target, key, cb) {
		if (can.base.isUndefined(target)) { return can.page.SelectArgs(can, can._option, "").concat(can.page.SelectArgs(can, can._action, "")) }
		if (can.base.isUndefined(key)) { var value = {}; can.page.SelectArgs(can, target, "", function(item) { item.name && item.value && (value[item.name] = item.value) }); return [value] }
		if (can.base.isObject(key)) { return can.core.Item(key, function(key, value) { can.page.SelectArgs(can, target, key, value) }), [key] }
		if (!can.base.isFunc(cb)) { var value = cb; cb = function(item) { return item.name && (can.base.isUndefined(value)? item.value: (item.value = value))||"" } }
		if (key.indexOf(ice.PT) > -1) { return [""] }
		return can.page.Select(can, target, key? "select[name="+key+"],"+"input.select[type=button][name="+key+"],"+"input[name="+key+"],"+"textarea[name="+key+"]": ".args", cb)
	},
	SelectInput: function(can, target, name, cb) { return can.page.Select(can, target, "input[name="+name+"]", cb)[0] },
	SelectChild: function(can, target, key, cb) { var i = 0; return can.page.Select(can, target, key, function(node) { if (node.parentNode == target) { return cb(node, i++) } }) },
	SelectOne: function(can, target, key, cb) { return can.page.Select(can, target, key, function(target, index) { return index == 0 && can.base.isFunc(cb) && cb(target), target })[0] },
	Select: function(can, target, key, cb, interval, cbs) { target = target || document.body
		return can.core.List(key == ice.PT? [target]: target.querySelectorAll(can.page.Keys(key)), cb, interval, cbs)
	},
	Modify: function(can, target, value) { target = can.base.isString(target)? document.querySelector(target): target; if (!target) { return }
		can.base.isString(value)? (target.innerHTML = value): can.core.Item(value, function(key, val) {
			key == "className" && can.base.isArray(val) && (val = val.join(ice.SP)), !can.base.isObject(val)? (target[key] = val): can.core.Item(val, function(k, v) {
				if (can.base.isIn(k, "height", "width", "min-height", "max-height", "min-width", "max-width") && parseInt(v) < 0) { return target[key] && (target[key][k] = "") }
				if (can.base.isIn(k, "height", "width", "min-height", "max-height", "min-width", "max-width", "left", "top", "right", "bottom", "margin-left", "margin-top", "margin", "padding", "font-size") && v && (can.base.isNumber(v) || !can.base.endWith(v, "px"))) { v += "px" }
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
			if (item.view) { var list = can.core.List(item.view); if (can.base.isArray(list[0])) { list[0] = list[0].join(ice.SP) }
				list[0] && can.page.ClassList.add(can, data, list[0]), type = list[1]||type, data.innerHTML = list[2]||data.innerHTML||"", name = list[3]||name
			} else if (item.text) { var list = can.core.List(item.text); if (can.base.isArray(list[2])) { list[2] = list[2].join(ice.SP) }
				data.innerHTML = list[0]||data.innerHTML||"", type = list[1]||item.type||html.SPAN, list[2] && can.page.ClassList.add(can, data, list[2])
			} else if (item.icon) { var list = can.core.List(item.icon)
				type = html.SPAN, name = list[0], data.className = "icon "+list[0], data.innerText = can.page.unicode[list[0]]
			} else if (item.button) { var list = can.core.List(item.button); type = html.BUTTON, name = list[0]||name, data.innerText = can.user.trans(can, name)
				data.onclick = function(event) { can.misc.Event(event, can, function(msg) { can.base.isFunc(list[1]) && list[1](event, name), can.onkeymap.prevent(event) }) }
			} else if (item.select) { var list = item.select; type = html.SELECT, name = list[0][0], data.className = data.className||list[0][0]
				data.onchange = function(event) { can.misc.Event(event, can, function(msg) { can.base.isFunc(list[1]) && list[1](event, event.target.value, name) }) }
				item.list = list[0].slice(1).map(function(value) { return {type: html.OPTION, value: value, inner: can.user.trans(can, value)} })
			} else if (item.input) { var list = can.core.List(item.input); type = html.INPUT, name = list[0], data.className = data.className||list[0], data.type = data.type||html.TEXT
				data.onfocus = data.onfocus||function(event) { event.target.setSelectionRange(0, -1) }
				data.onkeydown = function(event) { can.base.isFunc(list[1]) && list[1](event) }
				data.onkeyup = function(event) { can.base.isFunc(list[2]) && list[2](event) }
			} else if (item.username) { var list = can.core.List(item.username); type = html.INPUT, name = list[0]||name||html.USERNAME
				data.className = list[1]||data.className||name, data.autocomplete = data.autocomplete||html.USERNAME
			} else if (item.password) { var list = can.core.List(item.password); type = html.INPUT, name = list[0]||name||html.PASSWORD
				data.className = list[1]||data.className||name, data.type = html.PASSWORD, data.autocomplete = data.autocomplete||"current-password"
			} else if (item.img) { var list = can.core.List(item.img); type = html.IMG, data.src = list[0]
			} else if (item.row) { type = html.TR, item.list = item.row.map(function(text) { return {text: [text, item.sub||html.TD]} })
			} else if (item.th) { type = html.TR, item.list = item.th.map(function(text) { return {text: [text, html.TH]} })
			} else if (item.td) { type = html.TR, item.list = item.td.map(function(text) { return can.base.isObject(text)? text: {text: [text, html.TD]} }) }
			if (type == html.SELECT)  { data.title = can.user.trans(can, data.title||name) }
			if (type == html.INPUT)  {
				if (data.type == html.TEXT||data.type == html.PASSWORD||!data.type) {
					data.placeholder = (data.placeholder||name||"").split(ice.PT).pop(), data.title = can.user.trans(can, data.title||data.placeholder)
					data.autocomplete = data.autocomplete||"off"
				} else if (data.type == html.BUTTON) { data.value = can.user.trans(can, data.value) }
			} if (type == html.TEXTAREA)  { data.placeholder = can.user.trans(can, (data.placeholder||name||"").split(ice.PT).pop()) }
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
				value.indexOf(ice.NL) > -1 && (value = value.trim().split(ice.NL)[0]+can.page.unicode.inner)
				return can.page.replace(can, value)
			} else { if (length > 5) {
				return can.page.unicode.inner }
			} return value
		}
		function show(value, deep) { deep = deep == undefined? 2: 0; switch (typeof value) {
			case lang.OBJECT: if (!value) { return {} }
				if (value._path) { return {value: "@\""+value._path+"\""} }
				if (value.tagName) { return {type: nfs.TARGET, value: "$ "+value.tagName.toLowerCase()+(value.className? ice.PT+value.className.replaceAll(ice.SP, ice.PT):"")} }
				if (deep < 0) { return {value: value.length == undefined? "{"+can.page.unicode.inner+"}": "["+can.page.unicode.inner+"]"} }
				if (value.length != undefined) { return {value: (value.length > 3? value.length+ice.SP: "")+"["+can.core.List(value, function(value, index) { if (index < 6) { return short(show(value, deep-1).value, index+1) } }).join(ice.FS)+"]"} }
				return {value: "{"+can.core.Item(value, function(key, val, list) { if (value.hasOwnProperty(key) && val && list.length < 7) { return short(key+ice.DF+show(val, deep-1).value, list.length) } }).join(ice.FS)+"}"}
			case lang.STRING: return {open: "s", close: "s", value: "\""+(deep == 2? value.replaceAll("\n", "\\n"): short(value))+"\""}
			case lang.NUMBER: return {open: "n", close: "n", value: value}
			case lang.BOOLEAN: return {open: "b", close: "b", value: value}
			case lang.FUNCTION: return {open: "f", close: "f", value: deep == 2? (""+value).split(ice.NL)[0]: "function(..) {..}"}
			default: return {value: value}
		} } var loaded = false, _show = show(value); _show.open = _show.open||open, _show.close = _show.close||close
		var ui = can.page.Append(can, target, [!key && value.tagName? can.page.AppendView(can, value): {view: [[html.ITEM, _show.type||typeof(value)], key == ""? html.SPAN: html.DIV], list: [
			{view: [mdb.ICON, html.SPAN, _show.close+ice.SP]}, {view: [mdb.NAME, html.SPAN, key || key === 0? key+ice.SP: ""]}, {view: [mdb.VALUE, html.SPAN, _show.value]},
		], onclick: function() { cb && cb(prefix, value); if (typeof value != lang.OBJECT) { return }
			ui.icon.innerText = (can.onmotion.toggle(can, ui.list)? _show.open: _show.close)+ice.SP
			if (loaded) { return } loaded = true, ui.icon.innerText = _show.open+ice.SP
			if (value.tagName) { can.page.Append(can, ui.list, [can.page.AppendView(can, value)]), can.onappend.style(can, mdb.VIEW, ui.list)
				can.core.List(can.core.Item(target, function(key, value) { if (["textContent", "innerHTML", "outerHTML"].indexOf(key) > -1 || typeof value == lang.FUNCTION || key.toUpperCase() == key) { return } return key }).sort(), function(key) {
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
			return item.value == "" || item.value == item.name? {type: html.SPAN, list: [{text: ice.SP}, {text: item.name}]}:
				{type: html.SPAN, list: [{text: ice.SP}, {text: item.name}, {text: ice.EQ}, {className: code.STRING, text: "\""+item.value+"\""}]}
		}): [] }
		var ui = {}; tag = tag||target.tagName.toLowerCase(), isclose = tag != mdb.META && tag != mdb.LINK, _field = field(target)
		var inner = target.innerHTML? can.page.unicode.inner: ""; if (target && target.tagName) { target.innerText == target.innerHTML && (inner = target.innerText) }
		return {view: mdb.VIEW, list: [
			{view: [[html.ITEM, target.tagName && target.tagName.toLowerCase()]], list: [
				{text: (target.children.length > 0? can.page.unicode.close: ice.SP)+ice.SP, _init: function(target) { ui.toggle = target }},
				{className: code.KEYWORD, text: can.page.replace(can, ice.LT)}, {className: code.KEYWORD, text: tag}, {type: html.SPAN, list: _field},
				{className: code.KEYWORD, text: can.page.replace(can, ice.GT)}, inner && {text: inner, _init: function(target) { ui.inner = target }},
				isclose && {className: code.KEYWORD, text: can.page.replace(can, ice.LT+ice.PS+tag+ice.GT), _init: function(target) { ui._close = target }},
			], onclick: function(event) { ui.toggle.innerText = (can.onmotion.toggle(can, ui.list)? can.page.unicode.open: can.page.unicode.close)+ice.SP
				ui.inner && can.onmotion.toggle(can, ui.inner), can.onmotion.toggle(can, ui.close), can.onmotion.toggle(can, ui._close)
				if (!loaded) { if (can.page.tagis(target, ctx.STYLE, nfs.SCRIPT)) { can.page.Append(can, ui.list, [{text: target.innerHTML}]) } else {
					can.page.Append(can, ui.list, can.core.List(target.children, function(node) { return can.page.AppendView(can, node, "", null, false, cb) }))
				} } loaded = true, can.base.isFunc(cb) && cb(target)
			}, onmouseenter: function() {
				can.page.Select(can, document.body, ".picker", function(target) { can.page.ClassList.del(can, target, "picker") })
				!can.page.tagis(target, nfs.SCRIPT) && can.onappend.style(can, "picker", target)
			}, _init: function(target) { can.onmotion.delay(can, function() { loaded && target.click() }) }},
			isclose && {view: [[html.LIST, html.HIDE]], style: {"margin-left": "20px"}, _init: function(target) { ui.list = target }, list: list},
			isclose && {view: [[html.ITEM, html.HIDE]], list: [{text: "  "}, {className: code.KEYWORD, text: can.page.replace(can, ice.LT+ice.PS+tag+ice.GT)}], _init: function(target) { ui.close = target }},
		]}
	},
	AppendTable: function(can, msg, target, list, cb) { if (!msg.append||msg.append.length == 0) { return }
		var ui = can.page.Append(can, target, [{type: html.TABLE, list: [{type: html.THEAD}, {type: html.TBODY}]}])
		can.page.Append(can, ui.thead, [{data: {dataset: {index: -1}}, th: can.core.List(list, function(key) { if (key[0] != "_") { return key } }) }])
		can.page.Append(can, ui.tbody, can.core.List(msg.Table(), function(item, index, array) {
			return {dataset: {index: index}, td: can.core.List(list, function(key) { if (key[0] != "_") { return cb(can.page.Color(item[key]).trim(), key, index, item, array) } }) }
		})); return can.page.OrderTable(can, ui.table)
	},
	OrderTable: function(can, table) { can.page.Select(can, table, html.TH, function(th, index) { th.onclick = function(event) { var dataset = event.target.dataset
		can.page.RangeTable(can, table, index, (dataset["asc"] = (dataset["asc"] == "1") ? 0: 1) == "1")
	} }); return table },
	RangeTable: function(can, table, index, asc) { index = can.base.isArray(index)? can.core.List(index, function(item) { if (item > -1) { return item } }): [index]; if (index.length == 0) { return }
		var list = can.page.Select(can, table, html.TR, function(tr) { if (can.page.isDisplay(tr)) { return tr } }).slice(1)
		var is_time = true, is_number = true; can.core.List(list, function(tr) { var text = tr.childNodes[index[0]].innerHTML; is_time = is_time && Date.parse(text) > 0, is_number = is_number && !isNaN(parseInt(text)) })
		var num_list = can.core.List(list, function(tr) { var text = tr.childNodes[index[0]].innerHTML; return is_time? Date.parse(text): is_number? can.base.ParseSize(text): text })
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
		case html.A: return "<a href='"+arg[1]+"' target='_blank'>"+(arg[2]||arg[1])+"</a>"
		case html.IMG: return arg[2]? "<img src='"+arg[1]+"' height="+arg[2]+">": "<img src='"+arg[1]+"'>"
		case html.SPAN: return arg[2]? "<span class='"+arg[2]+"'>"+arg[1]+"</span>": arg[1]
		default: /* type inner arg... */
			var list = ["<"+type]; for (var i = 2; i < arg.length; i += 2) { list.push(ice.SP+arg[i]+ice.EQ+arg[i+1]) }
			return list.concat(">", arg[1], "</", type, ">").join("")
	} },
	Color: function(text) { if (typeof text != lang.STRING) { return "" } text = text.replace(/\\n/g, "<br>")
		if (text.indexOf(ice.HTTP) == 0 && text.length > 10) { var ls = text.split(ice.SP); text = "<a href='"+ls[0]+"' target='_blank'>"+ls[0]+"</a>"+ls.slice(1).join(ice.SP) }
		if (text.indexOf("export ctx_dev=") == 0 && text.length > 10) {
			return "<div class='story' data-type='spark' data-name='shell'><div>"+"<span>"+text+"</span>"+"</div></div>"
		}
		if (text.indexOf("\033\[") == -1) { return text }
		text = text.replace(/\033\[31m/g, "<span style='color:#f00'>")
		text = text.replace(/\033\[32m/g, "<span style='color:#0f0'>")
		text = text.replace(/\033\[33m/g, "<span style='color:#ff0'>")
		text = text.replace(/\033\[34m/g, "<span style='color:#00f'>")
		text = text.replace(/\033\[36m/g, "<span style='color:#0ff'>")
		text = text.replace(/\033\[34;1m/g, "<span style='color:#00f'>")
		text = text.replace(/\033\[37;1m/g, "<span style='color:#fff'>")
		text = text.replace(/\033\[1m/g, "<span style='font-weight:bold'>")
		text = text.replace(/\033\[0m/g, "</span>")
		text = text.replace(/\033\[m/g, "</span>")
		return text
	},
	Keys: function() { var list = []; /* FS SP GT PT */ for (var i = 0; i < arguments.length; i++) { var v = arguments[i]; if (typeof v == lang.OBJECT) {
		for (var j = 0; j < v.length; j++) { if (typeof v[j] == lang.OBJECT) {
			for (var k = 0; k < v[j].length; k++) { if (typeof v[j][k] == lang.OBJECT) { v[j][k] = v[j][k].join(ice.PT) } }
			v[j] = v[j].join(ice.GT)
		} } list.push(v.join(ice.SP))
	} else { list.push(v+"") } } return list.join(ice.FS) },
	Cache: function(name, output, data) { if (!name) { return } var cache = output._cache||{}; output._cache = cache
		if (data) { if (output.children.length == 0) { return } var temp = document.createDocumentFragment()
			while (output.childNodes.length > 0) { var item = output.childNodes[0]; item.parentNode.removeChild(item), temp.appendChild(item) }
			return cache[name] = {node: temp, data: data}, name
		} output.innerHTML = ""; var list = cache[name]; if (!list) { return }
		while (list.node.childNodes.length > 0) { var item = list.node.childNodes[0]; item.parentNode.removeChild(item), output.appendChild(item) }
		return delete(cache[name]), list.data
	},
	insertBefore: function(can, list, before, parent) { parent = parent||before.parentNode
		var target = can.base.isArray(list)? can.page.Append(can, parent, list)._target: list
		return before && parent.insertBefore(target, before), target
	},
	styleHeight: function(can, target, value) { return can.page.style(can, target, html.HEIGHT, value), target.offsetHeight },
	styleWidth: function(can, target, value) { return can.page.style(can, target, html.WIDTH, value), target.offsetWidth },
	styleClass: function(can, target, value) { return can.page.Modify(can, target, {className: value}), target.className },
	style: function(can, target, style) { var value = {}; for (var i = 2; i < arguments.length; i += 2) {
		if (typeof arguments[i] == lang.OBJECT) { can.page.Modify(can, target, {style: arguments[i--]}) } else { value[arguments[i]] = arguments[i+1] }
	} return can.page.Modify(can, target, {style: value}), value },
	tagis: function(target) { if (!target || !target.tagName) { return }
		var type = target.tagName.toLowerCase(); for (var i = 1; i < arguments.length; i++) { if (type == arguments[i]) { return true } }
	},
	tagClass: function(target) { return target.tagName.toLowerCase()+(target.className? ice.PT+target.className.replaceAll(ice.SP, ice.PT): "") },
	isDisplay: function(target) { return target && target.style.display != html.NONE && target.className.indexOf(html.HIDE) == -1 },
	editable: function(can, item, ok) { item.setAttribute("contenteditable", ok) },
	draggable: function(can, item, ok) { item.setAttribute("draggable", ok) },
	height: function() { return window.innerHeight },
	width: function() { return window.innerWidth },
	ismodkey: function(event) { return [lang.META, lang.ALT, lang.CONTROL, lang.SHIFT].indexOf(event.key) > -1 },
	unicode: {
		menu: "☰", back: "◀", refresh: "↻", reback: "▶", delete: "✕", lt: "❮", gt: "❯", open: "▾", close: "▸", select: "▿", inner: "..",
			push: "\u21C8",
			pull: "\u21CA",
	},
	inputs: function(can, list, type) { var _list = []; for (var i = 0; i < list.length; i++) { switch (list[i]) {
		case "": _list.push(""); break
		case ice.AUTO:
			_list.push({type: html.BUTTON, name: ice.LIST})
			_list.push({type: html.BUTTON, name: ice.BACK})
			break
		case mdb.PAGE:
			_list.push({type: html.TEXT, name: mdb.LIMIT, value: can._msg.Option(mdb.LIMIT)})
			_list.push({type: html.TEXT, name: mdb.OFFEND, value: can._msg.Option(mdb.OFFEND)})
			_list.push(mdb.NEXT, mdb.PREV)
			break
		default:
			(function() { var item = can.core.SplitInput(list[i], type||html.BUTTON)
				if (item.type == html.SELECT) { item._init = function(target) { target.value = item.value||item.values[0], target.onchange = function(event) { can.misc.Event(event, can, function(msg) {
					can.run(event)
				}) } } } item.action && (function() { item._init = function(target) { can.onappend.figure(can, item, target) } })()
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
				item.value = value||item.value, input.list = item.values.map(function(value) { return {type: html.OPTION, value: value, inner: value} }); break
			case html.TEXTAREA: input.type = html.TEXTAREA // no break
			case html.USERNAME: // no break
			case html.PASSWORD: // no break
			case html.TEXT: item.className||can.page.ClassList.add(can, item, ctx.ARGS), item.name = item.name||item.type, item.value = value||item.value||""; break
			case html.UPLOAD: item.type = html.FILE, input.name = html.UPLOAD; break
			case html.BUTTON: item.value = item.value||item.name||mdb.LIST; break
		} return input
	},
	requireModules: function(can, libs, cb, cbs) {
		for (var i = 0; i < libs.length; i++) { if (libs[i].indexOf(ice.PS) == 0 || libs[i].indexOf(ice.HTTP) == 0) { continue }
			if (libs[i].indexOf(nfs._CSS) == -1 && libs[i].indexOf(nfs._JS) == -1) { libs[i] = libs[i]+"/lib/"+libs[i]+nfs._JS }
			libs[i] = "/require/node_modules/"+libs[i]
		} can.require(libs, cb, cbs)
	},
	requireDraw: function(can, cb) { can.page.ClassList.add(can, can._fields, "draw")
		can.require(["/plugin/local/wiki/draw.js", "/plugin/local/wiki/draw/path.js"], function() {
			can.onmotion.clear(can), can.onimport._show(can, can._msg), cb()
		})
	},
})
