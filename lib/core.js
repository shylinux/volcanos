Volcanos("core", {
	Defer: function(cb) { var defer = []; cb(defer)
		while (defer.length > 0) { defer.pop()() }
	},
	Keys: function() { var list = []
		for (var i = 0; i < arguments.length; i++) { var v = arguments[i]; switch (typeof v) {
			case code.OBJECT: for (var j = 0; j < v.length; j++) { v[j] && list.push(v[j]) } break
			case code.NUMBER: list.push(v+""); break
			case code.FUNCTION: v = v()
			default: v && list.push(v+"")
		} } return list.join(nfs.PT)
	},
	Value: function(data, key, value) { if (data == undefined) { return } if (key == undefined) { return data }
		if (typeof key == code.OBJECT) { if (key.length != undefined) { key = key.join(nfs.PT) } else { for (var k in key) { arguments.callee.call(this, data, k, key[k]) } return data } }
		if (value != undefined) { var _node = data, keys = key.split(nfs.PT)
			for (var i = 0; i < keys.length; i++) { var _next = _node[keys[i]]||{}; _node[keys[i]] = _next
				if (i < keys.length - 1) { _node = _next } else {
					if (value === "") {
						delete(_node[keys[i]])
					} else {
						_node[keys[i]] = value
					}
				}
			}
		}
		var node = data, keys = key.split(nfs.PT); while (node && keys.length > 0) { if (typeof node == "string") { return }
			if (keys[0] == "-1") { keys[0] = node.length-1 } node = node[keys[0]], keys = keys.slice(1)
		} return node == undefined? data[key]: node
	},
	Split: function(str) { if (!str || !str.length) { return [] }
		var opt = {detail: false}, arg = []; for (var i = 1; i < arguments.length; i++) { var v = arguments[i]; typeof v == code.OBJECT? opt = v: arg.push(v) }
		function _list(str) { var res = {}; for (var i = 0; i < str.length; i++) { res[str[i]] = true }; return res }
		var space = _list(arg[0]||"\t ,;\n")  // 空白符
		var block = _list(arg[1]||"{[()]}")   // 分隔符
		var quote = _list(arg[2]||"'\"`")     // 引用符
		var trans = _list(arg[3]||"\\")       // 转义符
		var res = [], begin = 0; function push(obj) { obj && res.push(typeof obj == code.STRING || opt.detail? obj: obj.text), begin = -1 }
		for (var s = "", i = 0; i < str.length; i++) {
			if (space[str[i]]) { if (s) { continue }
				begin > -1 && push(str.slice(begin, i)), opt.detail && push({type: code.SPACE, text: str.slice(i, i+1)})
			} else if (block[str[i]]) { if (s) { continue }
				begin > -1 && push(str.slice(begin, i)), push(str.slice(i, i+1))
			} else if (quote[str[i]]) {
				if (s == "") {
					begin > -1 && push(str.slice(begin, i)), s = str[i], begin = i+1
				} else if (s == str[i]) {
					push({type: code.STRING, text: str.slice(begin, i), left: s, right: str[i]}), s = "", begin = -1
				}
			} else if (trans[str[i]]) { begin == -1 && (begin = i), i++
			} else { begin == -1 && (begin = i) }
		} return begin > -1 && (s? push({type: code.STRING, text: str.slice(begin), left: s, right: ""}): push(str.slice(begin))), res
	},
	SplitInput: function(item, type) { if (typeof item == code.OBJECT) { return item } type = type||html.TEXT; switch (item) {
		case ctx.RUN: return {type: html.BUTTON, name: item}
		case ice.LIST: return {type: html.BUTTON, name: item, action: ice.AUTO}
		case ice.BACK: return {type: html.BUTTON, name: item}
		case mdb.NAME: return {type: html.TEXT, name: item}
		case mdb.TEXT: return {type: html.TEXTAREA, name: item}
		case ctx.ARGS: return {type: html.TEXTAREA, name: item}
		default: var ls = this.Split(item, lex.SP, "*:=@"), res = {type: type, name: ls[0]}; for (var i = 1; i < ls.length; i += 2) { switch (ls[i]) {
			case "*": res["need"] = "must", i--; break
			case nfs.DF: res[mdb.TYPE] = ls[i+1]; break
			case mdb.EQ:
			if (res[mdb.TYPE] == html.SELECT) { res.values = this.Split(ls[i+1]); for (var j = 1; j < res.values.length; j++) {
				if (res.values[0] == "" || res.values[0] == res.values[j]) { res.value = res.values[0], res.values = res.values.slice(1); break }
			} } else { res.value = ls[i+1] } break
			case ice.AT: res[ctx.ACTION] = ls[i+1]; break
		} } return res
	} },
	CallFunc: function(func, args, mod) { args = args||{}; var can = args["can"]||args[0], msg = args["msg"]||args[1], cb = args["cb"]
		if (Array.isArray(args)) { this.List(args, function(arg) { if (!arg) { return } if (arg.request && arg.run) { can = arg } else if (arg.Append && arg.Result) { msg = arg } else if (typeof arg == code.FUNCTION) { cb = arg } }) }
		func = typeof func == code.FUNCTION? func: typeof func == code.OBJECT && func.length > 0? this.Value(func[0], this.Keys(func.slice(1))): typeof func == code.STRING? this.Value(mod||can, func): null
		if (typeof func != code.FUNCTION) { if (typeof cb == code.FUNCTION) { cb() } return }
		var list = [], echo = false; args.length > 0? list = args: this.List(func.toString().split(")")[0].split("(")[1].split(mdb.FS), function(item, index) { item = item.trim(); if (item == "") { return }
			list.push(args[item] || msg&&msg.Option&&msg.Option(item) || can&&can.Conf&&can.Conf(item) || null); if (item == "cb") { echo = true }
		}); var res = func.apply(mod||can, list); if (msg && msg.Defer) { msg.Defer() }
		if (!echo && typeof cb == code.FUNCTION) { res && msg&&msg.Echo&&msg.Echo(res), arguments.callee.apply(this, [cb, {msg: msg, res: res}]) } return res
	},
	List: function(list, cb, interval, cbs) {
		if (typeof list == code.STRING) { list = [list] } else if (typeof list == code.NUMBER) { // [end cb interval]|[begin end interval]
			var begin = 0, end = list, step = typeof interval == code.NUMBER? interval: 1; if (typeof cb == code.NUMBER) { begin = list, end = cb, cb = null }
			list = []; for (var i = begin; i < end; i += step) { list.push(i) }
		} list = list||[]
		if (interval > 0) {
			function loop(i) { i >= list.length? typeof cbs == code.FUNCTION && cbs(list): cb(list[i], i, list), setTimeout(function() { loop(i+1) }, interval) }
			typeof cb == code.FUNCTION && list.length > 0 && setTimeout(function() { loop(0) }, interval/4)
		} else { var res = []
			for (var i = 0; i < list.length; i++) { var _res = typeof cb == code.FUNCTION? cb(list[i], i, list): list[i]; _res != undefined && res.push(_res) }
			list = res
		} return list
	},
	Next: function(list, cb, cbs, data) {
		switch (typeof list) {
			case code.OBJECT:
			if (list == null) { list = []; break } if (list.length == undefined) { var ls = []; for (var k in list) { ls.push(k) } list = ls } break
			default: if (list == undefined) { list = []; break } list = [list]
		}
		function next(i) {
			data = (i < list.length?
				typeof cb == code.FUNCTION && cb(list[i], function(_data) { data = _data||data, next(i+1) }, i, list, data):
			typeof cbs == code.FUNCTION && cbs(list))||data
		}
		return next(0), list
	},
	Item: function(obj, cb) { var list = [], keys = []
		if (obj && obj.detail && obj.option) {
			obj["detail"] && keys.push("detail")
			obj["option"] && keys.push("option")
			keys = keys.concat(obj.option, obj.append||[])
			obj["append"] && keys.push("append")
			obj["result"] && keys.push("result")
		} else {
			for (var k in obj) { keys.push(k) }
		}
		for (var i = 0; i < keys.length; i++) { var k = keys[i]; var res = typeof cb == code.FUNCTION? cb(k, obj[k], list): k; res != undefined && list.push(res) }
		return list
	},
	ItemKeys: function(obj, cb) { var list = [], keys = []; for (var k in obj) { keys.push(k) } keys.sort()
		for (var i in keys) { var k = keys[i]; var res = typeof cb == code.FUNCTION? cb(k, obj[k]): k; res != undefined && list.push(res) }
		return list
	},
	ItemOrder: function(obj, key, cb) { var list = [], order = [], keys = {}, vals = {}, i = 0
		for (var k in obj) { o = obj[k][key]||i++, order.push(o), keys[o] = k, vals[o] = obj[k] } order.sort()
		for (var i in order) { var k = order[i], res = typeof cb == code.FUNCTION? cb(keys[k], vals[k]): k; res != undefined && list.push(res) }
		return list
	},
	ItemForm: function(obj, cb) { var list = []
		for (var k in obj) { list = list.concat(this.List(obj[k], function(v, i) { return typeof cb == code.FUNCTION && cb(v, i, k, obj) })) }
		return list
	},
	ItemCB: function(meta, cb, can, item) { var list = []
		for (var k in meta) { if (k.indexOf("on") == 0 && typeof meta[k] == code.FUNCTION) { (function(k) { list.push(k)
			if (typeof cb == code.FUNCTION) {
				cb(k, meta[k])
			} else { cb[k] = function(event) { can.misc.Event(event, can, function(msg) {
				meta[k](event, can, item)
			}) } }
		})(k) } } return list
	},
	Timer: shy("定时器, value, [1,2,3,4], {delay, interval, length}", function(interval, cb, cbs) { var timer = {stop: false}
		if (interval == "0") { return cb && cb(), cbs && cbs() }
		function loop(i) { timer.stop || i >= interval.length && interval.length >= 0 || cb(timer, interval.interval||interval[i], i, interval)?
			typeof cbs == code.FUNCTION && cbs(timer, interval): setTimeout(function() { loop(i+1) }, interval.interval||interval[i+1])
		} interval = typeof interval == code.OBJECT? interval: [interval]; if (interval.interval == 0) { return cb(), timer }
		var delay = interval.delay||interval.interval/2||interval[0]
		return typeof cb == code.FUNCTION && (timer._timer = setTimeout(function() { loop(0) }, delay)), timer
	}),
})
