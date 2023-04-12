Volcanos(chat.ONSYNTAX, {
	makefile: {prefix: {"#": code.COMMENT}, suffix: {":": code.COMMENT}, keyword: {
			"ifeq": code.KEYWORD, "ifneq": code.KEYWORD, "else": code.KEYWORD, "endif": code.KEYWORD,
		},
	},
	man: {
		prefix: {
			"NAME": code.KEYWORD,
			"SYNOPSIS": code.KEYWORD,
			"DESCRIPTION": code.KEYWORD,

			"AUTHOR": code.KEYWORD,
			"COPYRIGHT": code.KEYWORD,
			"LIBRARY": code.KEYWORD,
			"STANDARDS": code.KEYWORD,
			"SEE ALSO": code.KEYWORD,
			"HISTORY": code.KEYWORD,
			"BUGS": code.KEYWORD,
		},
	},
	vim: {prefix: {"\"": "comment"}, keyword: {
			"source": code.KEYWORD,
			"finish": code.KEYWORD,
			"set": code.KEYWORD,
			"let": code.KEYWORD,
			"end": code.KEYWORD,
			"if": code.KEYWORD,
			"else": code.KEYWORD,
			"elseif": code.KEYWORD,
			"endif": code.KEYWORD,
			"for": code.KEYWORD,
			"in": code.KEYWORD,
			"continue": code.KEYWORD,
			"break": code.KEYWORD,
			"endfor": code.KEYWORD,
			"try": code.KEYWORD,
			"catch": code.KEYWORD,
			"finally": code.KEYWORD,
			"endtry": code.KEYWORD,
			"call": code.KEYWORD,
			"function": code.KEYWORD,
			"return": code.KEYWORD,
			"endfunction": code.KEYWORD,

			"autocmd": code.KEYWORD,
			"command": code.KEYWORD,
			"execute": code.KEYWORD,
			"nnoremap": code.KEYWORD,
			"cnoremap": code.KEYWORD,
			"inoremap": code.KEYWORD,
			"colorscheme": code.KEYWORD,
			"highlight": code.KEYWORD,
			"syntax": code.KEYWORD,

			"has": code.FUNCTION,
			"type": code.FUNCTION,
			"empty": code.FUNCTION,
			"exists": code.FUNCTION,
			"executable": code.FUNCTION,
		},
	}, vimrc: {link: "vim"},
	c: {
		prefix: {
			"//": code.COMMENT,
			"/*": code.COMMENT,
			"*": code.COMMENT,
			"*/": code.COMMENT,
			"#": code.KEYWORD,
		},
		regexp: {
			"^u_\\w $": code.DATATYPE,
			"^\\w+_t$": code.DATATYPE,
			"^\\w+_pt$": code.DATATYPE,
			"^[-]*\\d+$": code.CONSTANT,
			"^[A-Z0-9_]+$": code.CONSTANT,
		},
		keyword: {
			"#include": code.KEYWORD, "#error": code.KEYWORD, "#line": code.KEYWORD,
			"#define": code.KEYWORD, "#undef": code.KEYWORD, "#ifndef": code.KEYWORD, "#ifdef": code.KEYWORD,
			"#if": code.KEYWORD, "#elif": code.KEYWORD, "#else": code.KEYWORD, "#endif": code.KEYWORD,

			"if": code.KEYWORD, "else": code.KEYWORD,
			"for": code.KEYWORD, "while": code.KEYWORD, "do": code.KEYWORD, "break": code.KEYWORD, "continue": code.KEYWORD,
			"switch": code.KEYWORD, "case": code.KEYWORD, "default": code.KEYWORD,
			"return": code.KEYWORD, "goto": code.KEYWORD,

			"void": code.DATATYPE, "char": code.DATATYPE, "int": code.DATATYPE, "float": code.DATATYPE, "double": code.DATATYPE,
			"unsigned": code.DATATYPE, "signed": code.DATATYPE, "short": code.DATATYPE, "long": code.DATATYPE,
			"struct": code.DATATYPE, "union": code.DATATYPE, "enum": code.DATATYPE,

			"auto": code.DATATYPE, "register": code.DATATYPE, "volatile": code.DATATYPE, "const": code.DATATYPE,
			"static": code.DATATYPE, "extern": code.DATATYPE, "typedef": code.DATATYPE,
			"sizeof": code.FUNCTION, "defined": code.FUNCTION,
		},
	}, h: {link: "c"},
	sh: {prefix: {"#": code.COMMENT}, suffix: {" {": code.COMMENT}, split: {operator: "{[($.,:;&<|>=)]}"}, regexp: {"[A-Z0-9_]+": code.CONSTANT, "ish_[A-Za-z0-9_]+": code.FUNCTION},
		func: function(can, push, text) { if (can.base.endWith(text, "() {")) { var ls = can.core.Split(text, "\t (){"); push(ls[0]) } },
		keyword: {
			"source": code.KEYWORD, "return": code.KEYWORD, "exit": code.KEYWORD,
			"require": code.KEYWORD, "request": code.KEYWORD,
			"local": code.KEYWORD, "export": code.KEYWORD,
			"if": code.KEYWORD, "then": code.KEYWORD, "elif": code.KEYWORD, "else": code.KEYWORD, "fi": code.KEYWORD,
			"for": code.KEYWORD, "while": code.KEYWORD, "do": code.KEYWORD, "done": code.KEYWORD, "continue": code.KEYWORD, "break": code.KEYWORD,
			"case": code.KEYWORD, "in": code.KEYWORD, "esac": code.KEYWORD,
			"true": code.CONSTANT, "false": code.CONSTANT,
			
			"history": code.FUNCTION, "alias": code.FUNCTION, "complete": code.FUNCTION, "compgen": code.FUNCTION, "bind": code.FUNCTION,
			"printf": code.FUNCTION, "echo": code.FUNCTION, "eval": code.FUNCTION, "test": code.FUNCTION, "trap": code.FUNCTION, "shift": code.FUNCTION,
			"cd": code.FUNCTION, "ls": code.FUNCTION, "rm": code.FUNCTION, "chmod": code.FUNCTION, "mkdir": code.FUNCTION, "mktemp": code.FUNCTION,
			"curl": code.FUNCTION, "wget": code.FUNCTION, "apk": code.FUNCTION, "yum": code.FUNCTION,
			"cat": code.FUNCTION, "head": code.FUNCTION, "tail": code.FUNCTION,
			"grep": code.FUNCTION, "cut": code.FUNCTION, "sed": code.FUNCTION, "tr": code.FUNCTION,
			"xargs": code.FUNCTION, "sudo": code.FUNCTION, "du": code.FUNCTION, "df": code.FUNCTION,
			"/dev/null": code.CONSTANT, "/dev/stdout": code.CONSTANT, "/dev/stderr": code.CONSTANT,
		},
	}, configure: {link: "sh"},
	shy: {prefix: {"#": code.COMMENT}, regexp: {"[A-Z_0-9]+": code.CONSTANT}, keyword: {"source": code.KEYWORD,
			"title": code.KEYWORD, "navmenu": code.KEYWORD, "premenu": code.KEYWORD, "chapter": code.KEYWORD, "section": code.KEYWORD, "endmenu": code.KEYWORD,
			"refer": code.KEYWORD, "brief": code.KEYWORD, "spark": code.KEYWORD, "shell": code.KEYWORD, "parse": code.KEYWORD,
			"order": code.KEYWORD, "table": code.KEYWORD, "chart": code.KEYWORD, "label": code.KEYWORD, "chain": code.KEYWORD, "sequence": code.KEYWORD,
			"field": code.KEYWORD, "image": code.KEYWORD, "video": code.KEYWORD, "audio": code.KEYWORD,
			
			"package": code.KEYWORD, "import": code.KEYWORD, "const": code.KEYWORD, "type": code.KEYWORD, "var": code.KEYWORD,
			"if": code.KEYWORD, "else": code.KEYWORD,
			"for": code.KEYWORD, "range": code.KEYWORD, "break": code.KEYWORD, "continue": code.KEYWORD,
			"switch": code.KEYWORD, "case": code.KEYWORD, "default": code.KEYWORD,
			"func": code.KEYWORD, "defer": code.KEYWORD, "return": code.KEYWORD,
			"init": code.FUNCTION, "main": code.FUNCTION, "list": code.FUNCTION, "info": code.FUNCTION,
			"map": code.DATATYPE, "struct": code.DATATYPE, "interface": code.DATATYPE, "string": code.DATATYPE, "int": code.DATATYPE,
			"true": code.CONSTANT, "false": code.CONSTANT,
			
			"kit": code.PACKAGE, "ice": code.PACKAGE, "m": code.OBJECT, "arg": code.OBJECT,
			"event": code.OBJECT, "can": code.OBJECT, "msg": code.OBJECT, "target": code.OBJECT,
		},
		func: function(can, push, text, indent, opts) { var ls = can.core.Split(text, "\t ")
			opts.chapter = opts.chapter||0
			if (ls[0] == "chapter") { opts.chapter++, opts.section = 0, push(opts.chapter+ice.SP+ls[1]) }
			if (ls[0] == "section") { opts.section++, push(opts.chapter+ice.PT+opts.section+ice.SP+ls[1]) }
		},
	},
	py: {prefix: {"#!": code.COMMENT, "# ": code.COMMENT}, keyword: {"import": code.KEYWORD, "from": code.KEYWORD, "return": code.KEYWORD, "print": code.FUNCTION}},
	go: {prefix: {"// ": code.COMMENT}, regexp: {"[A-Z_0-9]+": code.CONSTANT}, keyword: {
			"package": code.KEYWORD, "import": code.KEYWORD, "const": code.KEYWORD, "type": code.KEYWORD, "struct": code.KEYWORD, "interface": code.KEYWORD, "func": code.KEYWORD, "var": code.KEYWORD,
			"if": code.KEYWORD, "else": code.KEYWORD,
			"for": code.KEYWORD, "range": code.KEYWORD, "break": code.KEYWORD, "continue": code.KEYWORD,
			"switch": code.KEYWORD, "case": code.KEYWORD, "default": code.KEYWORD, "fallthrough": code.KEYWORD,
			"go": code.KEYWORD, "select": code.KEYWORD, "defer": code.KEYWORD, "return": code.KEYWORD,

			"iota": code.CONSTANT, "true": code.CONSTANT, "false": code.CONSTANT, "nil": code.CONSTANT,
			"int": code.DATATYPE, "int8": code.DATATYPE, "int16": code.DATATYPE, "int32": code.DATATYPE, "int64": code.DATATYPE,
			"uint": code.DATATYPE, "uint8": code.DATATYPE, "uint16": code.DATATYPE, "uint32": code.DATATYPE, "uint64": code.DATATYPE,
			"float32": code.DATATYPE, "float64": code.DATATYPE, "complex64": code.DATATYPE, "complex128": code.DATATYPE,
			"rune": code.DATATYPE, "string": code.DATATYPE, "byte": code.DATATYPE, "uintptr": code.DATATYPE,
			"bool": code.DATATYPE, "error": code.DATATYPE, "chan": code.DATATYPE, "map": code.DATATYPE,

			"init": code.FUNCTION, "main": code.FUNCTION, "print": code.FUNCTION, "println": code.FUNCTION, "panic": code.FUNCTION, "recover": code.FUNCTION,
			"new": code.FUNCTION, "make": code.FUNCTION, "len": code.FUNCTION, "cap": code.FUNCTION, "copy": code.FUNCTION, "append": code.FUNCTION, "delete": code.FUNCTION, "close": code.FUNCTION,
			"complex": code.FUNCTION, "real": code.FUNCTION, "imag": code.FUNCTION,

			"If": code.KEYWORD, "For": code.KEYWORD, "Switch": code.KEYWORD,
			"kit": code.PACKAGE, "ice": code.PACKAGE, "m": code.OBJECT, "msg": code.OBJECT,
			"Any": code.DATATYPE, "List": code.DATATYPE, "Map": code.DATATYPE, "Maps": code.DATATYPE, "Message": code.DATATYPE,
		},
		func: function(can, push, text, indent, opts) { var ls = can.core.Split(text, "\t *", "({:})")
			function isKey() { return opts.block == "cmds" && ls[1] == ":" && ls[2] == "{" } function isEnd() { return ls[0] == "}" }
			function prefix(key, pre) { return key.toLowerCase() == key? "- ": ("+ "+(pre? pre+ice.PT: "")) }
			if (indent == 0) { switch (ls[0]) {
				case "package": opts.package = ls[1]; break
				case "func": if (ls[1] == "(") { push(prefix(ls[5])+ls[2]+ice.PT+ls[5]); break }
				case "const":
				case "var": if (ls[1] == "(") { break }
				case "type": push(prefix(ls[1], opts.package)+ls[1]); break
			} opts.stack = [ls[0]] } else if (indent == 4 && opts.stack[0] == "func") {
				if (text.indexOf("MergeCommands(") > -1) { opts.block = "cmds" } else if (text.indexOf("}") == 0) { opts.block = "" }
			} else if (indent == 8) {
				if (isKey()) { push(prefix(ls[0], opts.package)+ls[0]), opts.cmds = opts.package+ice.PT+ls[0] }
			} else if (indent == 12) {
				if (isKey()) { push("+ "+opts.cmds+ice.SP+ls[0]) }
			}
		},
	}, mod: {prefix: {"//": code.COMMENT}, keyword: {"go": code.KEYWORD, "module": code.KEYWORD, "require": code.KEYWORD, "replace": code.KEYWORD}}, sum: {},
	js: {prefix: {"// ": code.COMMENT}, regexp: {"[A-Z_0-9]+": code.CONSTANT}, keyword: {
			"var": code.KEYWORD, "function": code.KEYWORD, "typeof": code.KEYWORD, "const": code.KEYWORD, "new": code.KEYWORD, "delete": code.KEYWORD,
			"if": code.KEYWORD, "else": code.KEYWORD,
			"for": code.KEYWORD, "in": code.KEYWORD, "while": code.KEYWORD, "break": code.KEYWORD, "continue": code.KEYWORD,
			"switch": code.KEYWORD, "case": code.KEYWORD, "default": code.KEYWORD,
			"return": code.KEYWORD, "try": code.KEYWORD, "catch": code.KEYWORD, "debugger": code.KEYWORD,

			"true": code.CONSTANT, "false": code.CONSTANT, "null": code.CONSTANT, "undefined": code.CONSTANT,
			"Array": code.DATATYPE, "JSON": code.DATATYPE, "Date": code.DATATYPE, "Math": code.DATATYPE, "XMLHttpRequest": code.DATATYPE, "WebSocket": code.DATATYPE,
			"event": code.OBJECT, "target": code.OBJECT,
			"window": code.OBJECT, "console": code.OBJECT, "navigator": code.OBJECT,
			"location": code.OBJECT, "history": code.OBJECT, "document": code.OBJECT,
			"arguments": code.OBJECT, "callee": code.OBJECT, "this": code.OBJECT,
			
			"setTimeout": code.FUNCTION, "alert": code.FUNCTION, "confirm": code.FUNCTION,
			"parseInt": code.FUNCTION, "parseFloat": code.FUNCTION, "encodeURIComponent": code.FUNCTION, "decodeURIComponent": code.FUNCTION,
			"hasOwnProperty": code.FUNCTION, "isArray": code.FUNCTION, "forEach": code.FUNCTION, "apply": code.FUNCTION, "call": code.FUNCTION,
			"length": code.FUNCTION, "split": code.FUNCTION, "trim": code.FUNCTION, "toLowerCase": code.FUNCTION, "indexOf": code.FUNCTION, "lastIndexOf": code.FUNCTION,
			"concat": code.FUNCTION, "reverse": code.FUNCTION, "slice": code.FUNCTION, "join": code.FUNCTION, "sort": code.FUNCTION, "push": code.FUNCTION, "pop": code.FUNCTION,
			"stringify": code.FUNCTION, "parse": code.FUNCTION,

			"Volcanos": code.FUNCTION, "shy": code.FUNCTION, "cbs": code.FUNCTION, "cb": code.FUNCTION,
			"kit": code.PACKAGE, "ice": code.PACKAGE,
			"can": code.OBJECT, "sub": code.OBJECT, "sup": code.OBJECT,
			"msg": code.OBJECT, "res": code.OBJECT,
		},
		func: function(can, push, text, indent, opts) { var ls = can.core.Split(text, "\t (,", ice.DF)
			if (indent == 0 && can.base.beginWith(text, "Volcanos")) {
				var _block = can.base.trimPrefix(ls[1], "chat.").toLowerCase()
				if (_block != opts.block) { push("") } opts.block = _block
				if (text.indexOf(chat._INIT) > -1) { push(opts.block+ice.PT+chat._INIT) }
			} else if (indent == 0 && can.base.beginWith(text, "var ")) {
				opts.block = ls[1]
			} else if (indent == 4 && ls[1] == ice.DF) {
				ls[0] && push(opts.block+ice.PT+ls[0])
			}
		},
	}, json: {},
	css: {prefix: {"// ": code.COMMENT, "/* ": code.COMMENT}, split: {operator: "{[(.,:;&>=)]}"},
		func: function(can, push, text) { text.indexOf("/* ") == 0 && push(can.base.trimPrefix(can.base.trimSuffix(text, " */"), "/* ")) },
		regexp: {
			"[-0-9]+deg": code.CONSTANT,
			"[-0-9]+rem": code.CONSTANT,
			"[-0-9]+px": code.CONSTANT,
			"[-0-9]+%": code.CONSTANT,
			"[-0-9]+": code.CONSTANT,
			"#[^ ;]+": code.CONSTANT,
		},
		keyword: {
			"body": code.KEYWORD, "fieldset": code.KEYWORD, "legend": code.KEYWORD, "form": code.KEYWORD, "input": code.KEYWORD, "select": code.KEYWORD, "textarea": code.KEYWORD,
			"table": code.KEYWORD, "thead": code.KEYWORD, "tbody": code.KEYWORD, "tr": code.KEYWORD, "th": code.KEYWORD, "td": code.KEYWORD,
			"h1": code.KEYWORD, "h2": code.KEYWORD, "h3": code.KEYWORD, "a": code.KEYWORD,
			"label": code.KEYWORD, "span": code.KEYWORD, "img": code.KEYWORD, "svg": code.KEYWORD, "div": code.KEYWORD,
			"video": code.KEYWORD,
			"hover": code.DATATYPE, "focus": code.DATATYPE, "not": code.DATATYPE, "type": code.FUNCTION, "name": code.FUNCTION,

			"padding": code.FUNCTION, "padding-left": code.FUNCTION, "padding-top": code.FUNCTION,
			"border": code.FUNCTION, "border-left": code.FUNCTION, "border-top": code.FUNCTION, "border-right": code.FUNCTION, "border-bottom": code.FUNCTION,
			"margin": code.FUNCTION, "margin-left": code.FUNCTION, "margin-top": code.FUNCTION, "margin-right": code.FUNCTION, "margin-bottom": code.FUNCTION,
			"display": code.FUNCTION, "visibility": code.FUNCTION, "overflow": code.FUNCTION, "position": code.FUNCTION, "z-index": code.FUNCTION, "box-sizing": code.FUNCTION, "border-box": code.CONSTANT,
			"height": code.FUNCTION, "width": code.FUNCTION, "min-width": code.FUNCTION, "max-height": code.FUNCTION,
			"left": code.FUNCTION, "top": code.FUNCTION, "right": code.FUNCTION, "bottom": code.FUNCTION,
			"border-radius": code.FUNCTION, "outline": code.FUNCTION, "box-shadow": code.FUNCTION,
			
			"solid": code.CONSTANT, "unset": code.CONSTANT,
			"block": code.CONSTANT, "none": code.CONSTANT, "hidden": code.CONSTANT, "visible": code.CONSTANT, "auto": code.CONSTANT, "relative": code.CONSTANT, "absolute": code.CONSTANT, "sticky": code.CONSTANT, "fixed": code.CONSTANT,
			"float": code.FUNCTION, "clear": code.FUNCTION, "both": code.CONSTANT,
			"transition": code.FUNCTION, "transform": code.FUNCTION, "translate": code.FUNCTION, "rotate": code.FUNCTION,
			
			"background-color": code.FUNCTION, "color": code.FUNCTION, "caret-color": code.FUNCTION,
			"font-family": code.FUNCTION, "font-style": code.FUNCTION, "font-weight": code.FUNCTION, "font-size": code.FUNCTION,
			"line-height": code.FUNCTION, "text-align": code.FUNCTION, "tab-size": code.FUNCTION, "white-space": code.FUNCTION,
			"monospace": code.CONSTANT, "italic": code.CONSTANT, "bold": code.CONSTANT, "center": code.CONSTANT,
			"cursor": code.FUNCTION, "pointer": code.CONSTANT,
			
			"dark": code.CONSTANT, "light": code.CONSTANT, "transparent": code.CONSTANT,
			"black": code.CONSTANT, "white": code.CONSTANT, "blue": code.CONSTANT, "red": code.CONSTANT, "yellow": code.CONSTANT,
			
			"green": code.CONSTANT,
			"purple": code.CONSTANT,
			"silver": code.CONSTANT,
			"gray": code.CONSTANT,
			"navy": code.CONSTANT,
			"teal": code.CONSTANT,
			
			"gold": code.CONSTANT,
			"orange": code.CONSTANT,
			"lavender": code.CONSTANT,
			"chocolate": code.CONSTANT,
			"dimgray": code.CONSTANT,
			"brown": code.CONSTANT,
			"snow": code.CONSTANT,
			
			"skyblue": code.CONSTANT,
			"aliceblue": code.CONSTANT,
			"cadetblue": code.CONSTANT,
			"cornflowerblue": code.CONSTANT,
			"royalblue": code.CONSTANT,
			"steelblue": code.CONSTANT,
			"darkblue": code.CONSTANT,
			"darkcyan": code.CONSTANT,
			"darkgray": code.CONSTANT,
			"darkgreen": code.CONSTANT,
			"lightblue": code.CONSTANT,
			"lightgray": code.CONSTANT,
			"lightgreen": code.CONSTANT,
			
			"cyan": code.CONSTANT,
			"magenta": code.CONSTANT,
			
			"word-break": code.FUNCTION,
			"vertical-align": code.FUNCTION,
			"calc": code.FUNCTION,
			"url": code.FUNCTION,
			"contexts": code.CONSTANT,
		},
	},
	html: {split: {operator: "<=/>"},
		keyword: {
			"DOCTYPE": code.KEYWORD, "html": code.KEYWORD, "head": code.KEYWORD, "body": code.KEYWORD,
			"meta": code.KEYWORD, "title": code.KEYWORD, "link": code.KEYWORD, "script": code.KEYWORD,
			"src": code.FUNCTION, "href": code.FUNCTION, "rel": code.FUNCTION, "style": code.FUNCTION, "width": code.FUNCTION, "height": code.FUNCTION,
			"class": code.FUNCTION,
			
			"fieldset": code.KEYWORD, "legend": code.KEYWORD, "form": code.KEYWORD,
			"h1": code.KEYWORD, "h2": code.KEYWORD, "h3": code.KEYWORD,
			"p": code.KEYWORD, "a": code.KEYWORD, "br": code.KEYWORD, "hr": code.KEYWORD,
			"label": code.KEYWORD, "span": code.KEYWORD, "img": code.KEYWORD, "svg": code.KEYWORD, "div": code.KEYWORD,
			"table": code.KEYWORD, "thead": code.KEYWORD, "tbody": code.KEYWORD, "tfoot": code.KEYWORD,
			"tr": code.KEYWORD, "th": code.KEYWORD, "td": code.KEYWORD, "ul": code.KEYWORD, "ol": code.KEYWORD, "li": code.KEYWORD,
			"colgroup": code.KEYWORD, "col": code.KEYWORD, "colspan": code.FUNCTION, "rowspan": code.FUNCTION,
			"video": code.KEYWORD, "audio": code.KEYWORD, "iframe": code.KEYWORD,
			
			"pre": code.KEYWORD, "code": code.KEYWORD, "sub": code.KEYWORD, "sup": code.KEYWORD, "em": code.KEYWORD, "strong": code.KEYWORD, "i": code.KEYWORD, "b": code.KEYWORD, "u": code.KEYWORD,
			"dl": code.KEYWORD, "dt": code.KEYWORD, "dd": code.KEYWORD,
			"var": code.KEYWORD, "kbd": code.KEYWORD, "samp": code.KEYWORD, "time": code.KEYWORD,
			"blockquote": code.KEYWORD, "q": code.KEYWORD, "cite": code.KEYWORD, "abbr": code.KEYWORD, "address": code.KEYWORD,
			"header": code.KEYWORD, "nav": code.KEYWORD, "main": code.KEYWORD, "aside": code.KEYWORD, "footer": code.KEYWORD, "article": code.KEYWORD, "section": code.KEYWORD,
			"source": code.KEYWORD, "muted": code.FUNCTION, "autoplay": code.FUNCTION, "loop": code.FUNCTION, "controls": code.FUNCTION,
			"rect": code.KEYWORD, "circle": code.KEYWORD, "fill": code.FUNCTION, "x": code.FUNCTION, "y": code.FUNCTION, "r": code.FUNCTION,
		},
	},
})

