const {ice, mdb, web, nfs, code, http} = require("../const.js")
const {Volcanos} = require("../proto.js")
module.exports =
Volcanos("base", {
	Obj: function(val, def) {
		try {
			if (typeof val == code.STRING) { if (val == "") { return def } val = JSON.parse(val) }
			if (typeof val == code.NUMBER) { return [val] }
			if (val.length > 0) { return val } for (var k in val) { return val } return def
		} catch (e) { return typeof val == code.STRING && val.split(mdb.FS) || def }
	},
	Copy: function(to, from, merge) { if (!from) { return to }
		if (arguments.length == 2 || typeof merge == code.BOOLEAN) { for (var k in from) { if (k == undefined) { continue }
			if (merge && to.hasOwnProperty(k) && to[k] != undefined && to[k] != "") { continue }
			if (from[k] === "") { delete(to[k]) } else { to[k] = from[k] }
		} return to } for (var i = 2; i < arguments.length; i++) { var k = arguments[i]; to[k] = from[k] } return to
	},
	Args: function() { var res = [], arg = arguments; function encode(k, v) { k && v != undefined && v != null && res.push(encodeURIComponent(k)+mdb.EQ+encodeURIComponent(v)) }
		for (var i = 0; i < arg.length; i += 2) { if (typeof arg[i] == code.OBJECT) {
			if (arg[i].length > 0) { for (var j = 0; j < arg[i].length; j += 2) { encode(arg[i][j], arg[i][j+1]) } } else { for (var k in arg[i]) { encode(k, arg[i][k]) } } i--
		} else { encode(arg[i], arg[i+1]) } } return res.join("&")
	},
	_parse: function(url, res) { var list = url.split("#")[0].split(ice.QS); res = res||{}, res._origin = list[0]
		list[1] && list[1].split("&").forEach(function(item) { var ls = item.split(mdb.EQ); res[decodeURIComponent(ls[0])] = decodeURIComponent(ls[1]) })
		return res
	},
	MergeURL: function(url) { var arg = this._parse(url); delete(arg._origin); for (var i = 1; i < arguments.length; i += 2) { delete(arg[arguments[i]]) }
		var arg = this.Args.apply(this, [arg].concat(Array.prototype.slice.call(arguments, 1))); return url.split(ice.QS)[0]+(arg? ice.QS+arg: "")
	},
	ParseURL: function(url) { var res = this._parse(url); res.link = url, res.origin = res._origin; return res },
	ParseJSON: function(str) { var res; if (typeof str == code.OBJECT) { return str }
		if (str.indexOf(ice.HTTP) == 0) {
			var res = this._parse(str, {type: web.LINK, name: "", text: str})
			return res.name = res._origin.split("://").pop().split(nfs.PS)[0], res
		}
		try { res = JSON.parse(str), res.text = res.text||str, res.type = res.type||nfs.JSON } catch (e) { res = {type: mdb.TEXT, text: str} } return res
	},
	Simple: function() { var res = []; for (var i = 0; i < arguments.length; i++) { var val = arguments[i]; switch (typeof val) {
		case code.OBJECT: if (val.length > 0) { res = res.concat(val); break }
			for (var k in val) { k && val[k] && res.push(k, val[k]) } break
		default: res.push(val)
	} } return res },
	AddUniq: function(list, value) { list = list||[], list.indexOf(value) == -1 && list.push(value); return list },
	isIn: function(item) { var arg = arguments; for (var i = 1; i < arg.length; i++) {
		if (typeof arg[i] == code.OBJECT && arg[i].length > 0 && arg[i].indexOf(item) > -1) { return true }
		if (item == arg[i]) { return true }
	} },
	isString: function(val) { return typeof val == code.STRING },
	isObject: function(val) { return typeof val == code.OBJECT },
	isArray: function(val) { return Array.isArray(val) },
	isFunc: function(val) { return typeof val == code.FUNCTION },
	toLast: function(list, value) { if (!list || list.length == 0) { return }
		for (var i = 0; i < list.length-1; i++) { if (list[i] == value) {
			for (i; i < list.length-1; i++) { list[i] = list[i+1] }
			list[list.length-1] = value
		} }
	},
	trimPrefix: function(str, pre) { if (typeof str != code.STRING) { return str } var arg = arguments, callee = arg.callee
		if (arg.length > 2) { for (var i = 1; i < arg.length; i++) { str = callee(str, arg[i]) } return str }
		if (str.indexOf(pre) == -1) { return str } return str.slice(pre.length)
	},
	trimSuffix: function(str, end) { while (str) { var index = str.lastIndexOf(end)
		if (index == -1 || index+end.length != str.length) { break } str = str.slice(0, index)
	} return str },
	trim: function(arg) { if (this.isString(arg)) { return arg.trim() }
		if (this.isArray(arg)) { for (var i = arg.length-1; i >= 0; i--) { if (!arg[i]) { arg.pop() } else { break } } } return arg
	},
})
