var kit = {proto: function(sub, sup) { return sub.__proto__ = sup, sub },
	Dict: function() { var res = {}, arg = arguments; for (var i = 0; i < arg.length; i += 2) { var key = arg[i]
		if (typeof key == "object") { i--
			if (key.length == undefined) {
				for (var k in key) { res[k] = key[k] }
			} else {
				for (var j = 0; j < key.length; j += 2) { res[key[j]] = key[j+1] }
			}
		} else if (typeof key == "string" && key) { res[key] = arg[i+1] }
	} return res },
}
var ice = {
	TB: "\t", SP: " ", DF: ":", EQ: "=", AT: "@", QS: "?", PS: "/", PT: ".", FS: ",", NL: "\n", LT: "<", GT: ">",
	LIST: "list", BACK: "back",

	MSG_FIELDS: "fields", MSG_SESSID: "sessid",
	MSG_DETAIL: "detail", MSG_OPTION: "option", MSG_APPEND: "append", MSG_RESULT: "result",
}
var ctx = {
	CONTEXT: "context", COMMAND: "command", CONFIG: "config", INPUTS: "inputs", FEATURE: "feature",
	CMDS: "cmds", INDEX: "index", ARGS: "args", STYLE: "style", DISPLAY: "display", ACTION: "action", RUN: "run",
	EXTRA_INDEX: "extra.index", EXTRA_ARGS: "extra.args",
}
var mdb = {
	EQ: ice.EQ, FS: ice.FS,
	TYPE: "type", NAME: "name", TEXT: "text", ICON: "icon", ICONS: "icons",
	KEY: "key", VALUE: "value", STATUS: "status", EXPIRE: "expire", EXTRA: "extra",
	DATA: "data", VIEW: "view", ORDER: "order",
}
var nfs = {
	DF: ice.DF, PS: ice.PS, PT: ice.PT,
}
var code = {
	COMMENT: "comment", KEYWORD: "keyword",
	PACKAGE: "package", DATATYPE: "datatype", FUNCTION: "function", CONSTANT: "constant",
	STRING: "string", NUMBER: "number", BOOLEAN: "boolean", OBJECT: "object", ARRAY: "array", UNDEFINED: "undefined",
	META: "Meta", ALT: "Alt", CONTROL: "Control", SHIFT: "Shift", TAB: "Tab", ESCAPE: "Escape", ENTER: "Enter",
	CMD: "Cmd", CTRL: "Ctrl", SPACE: "Space", BACKSPACE: "Backspace", ESC: "Esc", PS: "/",
}
var chat = {
	SHARE: "share", RIVER: "river", STORM: "storm", FIELD: "field", TOOL: "tool",
}
var http = {
	GET: "GET", PUT: "PUT", POST: "POST", DELETE: "DELETE",
	Accept: "Accept", ContentType: "Content-Type", ApplicationJSON: "application/json", ApplicationFORM: "application/x-www-form-urlencoded",
}
var html = {
	SELECT: "select", INPUT: "input", TEXT: "text", FILE: "file", TEXTAREA: "textarea", BUTTON: "button",
}
module.exports = {
	kit, ice,
	ctx, mdb,
	nfs,
	code, chat,
	http, html,
}
