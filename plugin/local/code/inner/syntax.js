Volcanos(chat.ONSYNTAX, {
	makefile: {prefix: {"#": code.COMMENT}, split: {operator: "($?.,):+="}, keyword: {
		"export": code.KEYWORD,
		"if": code.KEYWORD, "else": code.KEYWORD, "endif": code.KEYWORD,
		"ifeq": code.KEYWORD, "ifneq": code.KEYWORD,
		"ifdef": code.KEYWORD, "ifndef": code.KEYWORD,
		"define": code.KEYWORD, "endef": code.KEYWORD,
		"shell": code.KEYWORD,
		"PHONY": code.FUNCTION,
	}, include: ["sh"], func: function(can, push, text, indent) { var ls = can.core.Split(text, "", ":=")
		if (indent == 0 && ls[1] == ":" && ls[2] != "=") { push(text) }
	}, parse: function(can, text, wrap) { var ls = can.core.Split(text, "", ":=")
		if (ls[1] == ":" && ls[2] != "=" && can.base.beginWith(text, ls[0])) { return wrap(text, code.OBJECT) }
	}},
	man: {prefix: {
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
	}},
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
	}}, vimrc: {link: "vim"},
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
			"set": code.FUNCTION, "xargs": code.FUNCTION,
			"/dev/null": code.CONSTANT, "/dev/stdout": code.CONSTANT, "/dev/stderr": code.CONSTANT,
			
			"mkdir": code.FUNCTION, "rmdir": code.FUNCTION, "mktemp": code.FUNCTION, "du": code.FUNCTION, "df": code.FUNCTION,
			"cd": code.FUNCTION, "ls": code.FUNCTION, "ln": code.FUNCTION, "mv": code.FUNCTION, "rm": code.FUNCTION, "cp": code.FUNCTION,
			"groupadd": code.FUNCTION, "useradd": code.FUNCTION, "chown": code.FUNCTION, "sudo": code.FUNCTION,
			"curl": code.FUNCTION, "wget": code.FUNCTION, "apk": code.FUNCTION, "yum": code.FUNCTION,
			"cat": code.FUNCTION, "head": code.FUNCTION, "tail": code.FUNCTION,
			"grep": code.FUNCTION, "cut": code.FUNCTION, "sed": code.FUNCTION, "tr": code.FUNCTION,
			"make": code.FUNCTION, "file": code.FUNCTION, "vim": code.FUNCTION, "gcc": code.FUNCTION, "git": code.FUNCTION, "go": code.FUNCTION,
			"docker": code.FUNCTION,
		},
	func: function(can, push, text) { if (can.base.endWith(text, "() {")) { var ls = can.core.Split(text, "\t (){"); push(ls[0]) } },
	}, configure: {link: "sh"},
	shy: {
		prefix: {
			"#": code.COMMENT,
			"~": code.COMMENT,
		},
		regexp: {"[A-Z_0-9]+": code.CONSTANT},
		keyword: {
			"source": code.KEYWORD, "return": code.KEYWORD,
			"config": code.KEYWORD,
			"command": code.KEYWORD,
			"create": code.FUNCTION, "modify": code.FUNCTION, "insert": code.FUNCTION,
			"spide": code.DATATYPE, "serve": code.DATATYPE, "dream": code.DATATYPE,
			"user": code.DATATYPE,
			
			"title": code.KEYWORD, "navmenu": code.KEYWORD, "premenu": code.KEYWORD, "chapter": code.KEYWORD, "section": code.KEYWORD, "endmenu": code.KEYWORD,
			"refer": code.KEYWORD, "brief": code.KEYWORD, "spark": code.KEYWORD, "shell": code.KEYWORD, "parse": code.KEYWORD,
			"order": code.KEYWORD, "table": code.KEYWORD, "chart": code.KEYWORD, "label": code.KEYWORD, "chain": code.KEYWORD, "sequence": code.KEYWORD,
			"field": code.KEYWORD, "image": code.KEYWORD, "video": code.KEYWORD, "audio": code.KEYWORD,
			"style": code.KEYWORD,
			"inner": code.KEYWORD,
		},
		func: function(can, push, text, indent, opts) { var ls = can.core.Split(text, "\t ")
			opts.chapter = opts.chapter||0
			if (ls[0] == "chapter") { opts.chapter++, opts.section = 0, push(opts.chapter+lex.SP+ls[1]) }
			if (ls[0] == "section") { opts.section++, push(opts.chapter+nfs.PT+opts.section+lex.SP+ls[1]) }
		},
	},
	py: {prefix: {"#!": code.COMMENT, "# ": code.COMMENT}, keyword: {"import": code.KEYWORD, "from": code.KEYWORD, "return": code.KEYWORD, "print": code.FUNCTION}},
	proto: {prefix: {"// ": code.COMMENT}, regexp: {"[A-Z_0-9]+": code.CONSTANT}, keyword: {
		"syntax": code.KEYWORD, "package": code.KEYWORD, "option": code.FUNCTION,
		"service": code.KEYWORD, "rpc": code.KEYWORD, "returns": code.KEYWORD,
		"message": code.KEYWORD, "repeated": code.FUNCTION, "string": code.DATATYPE, "int64": code.DATATYPE,
	}},
	go: {prefix: {"// ": code.COMMENT}, regexp: {"[A-Z_0-9]+": code.CONSTANT},
		keyword: {
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
			function prefix(key, pre) { return key.slice(0, 1).toLowerCase() == key.slice(0, 1)? "- ": ("+ "+(pre? pre+nfs.PT: "")) }
			if (indent == 0) { switch (ls[0]) {
				case "package": opts.package = ls[1]; break
			case "func": if (ls[1] == "(") { var p = ls.indexOf(")"); push(prefix(ls[p+1])+ls[2]+nfs.PT+ls[p+1]+"()"); break }
				case "const":
				case "var": if (ls[1] == "(") { break } // ")"
				case "type": push(prefix(ls[1])+ls[1]+(ls[0]=="type"? "{}": ls[0]=="func"? "()": "")); break
			} opts.stack = [ls[0]] } else if (indent == 4 && opts.stack[0] == "func") {
			if (text.indexOf("MergeCommands(") > -1) { opts.block = "cmds" } else if (text.indexOf("}") == 0) { opts.block = "" }
			} else if (indent == 8) {
				if (isKey()) { push(prefix(ls[0], opts.package)+ls[0]), opts.cmds = ls[0] }
				// if (isKey()) { push(prefix(ls[0], opts.package)+ls[0]), opts.cmds = opts.package+nfs.PT+ls[0] }
			} else if (indent == 12) {
				if (isKey()) { push("+ "+opts.cmds+lex.SP+ls[0]) }
			}
		},
	},
	mod: {prefix: {"//": code.COMMENT}, split: {operator: "(=>)"}, keyword: {
		"go": code.KEYWORD, "module": code.KEYWORD, "require": code.KEYWORD, "replace": code.KEYWORD,
	}}, sum: {}, work: {keyword: {go: code.KEYWORD, use: code.KEYWORD}},
	js: {prefix: {"// ": code.COMMENT}, regexp: {"[A-Z_0-9]+": code.CONSTANT},
		keyword: {
			"let": code.KEYWORD, "const": code.KEYWORD, "var": code.KEYWORD,
			"if": code.KEYWORD, "else": code.KEYWORD,
			"switch": code.KEYWORD, "case": code.KEYWORD, "default": code.KEYWORD,
			"for": code.KEYWORD, "in": code.KEYWORD, "while": code.KEYWORD, "break": code.KEYWORD, "continue": code.KEYWORD,
			"try": code.KEYWORD, "catch": code.KEYWORD, "debugger": code.KEYWORD,
			"function": code.KEYWORD, "return": code.KEYWORD, "arguments": code.OBJECT, "callee": code.OBJECT, "this": code.OBJECT,
			
			"true": code.CONSTANT, "false": code.CONSTANT, "null": code.CONSTANT, "undefined": code.CONSTANT,
			"parseInt": code.FUNCTION, "parseFloat": code.FUNCTION, "encodeURIComponent": code.FUNCTION, "decodeURIComponent": code.FUNCTION,
			"setTimeout": code.FUNCTION, "alert": code.FUNCTION, "confirm": code.FUNCTION, "prompt": code.FUNCTION,
			"document": code.OBJECT, "console": code.OBJECT,
			"location": code.OBJECT, "history": code.OBJECT,
			"window": code.OBJECT, "navigator": code.OBJECT,
			"localStorage": code.OBJECT, "sessionStorage": code.OBJECT,
			
			"typeof": code.KEYWORD, "new": code.KEYWORD, "delete": code.KEYWORD,
			
			"import": code.KEYWORD, "from": code.KEYWORD, "export": code.KEYWORD, "default": code.KEYWORD,
			"class": code.KEYWORD, "static": code.KEYWORD,
			"async": code.KEYWORD, "await": code.KEYWORD,
			
			"Array": code.DATATYPE, "JSON": code.DATATYPE, "Date": code.DATATYPE, "Math": code.DATATYPE, "XMLHttpRequest": code.DATATYPE, "WebSocket": code.DATATYPE,
			
			"hasOwnProperty": code.FUNCTION, "isArray": code.FUNCTION, "forEach": code.FUNCTION, "apply": code.FUNCTION, "call": code.FUNCTION,
			"length": code.FUNCTION, "split": code.FUNCTION, "trim": code.FUNCTION, "toLowerCase": code.FUNCTION, "indexOf": code.FUNCTION, "lastIndexOf": code.FUNCTION,
			"concat": code.FUNCTION, "reverse": code.FUNCTION, "slice": code.FUNCTION, "join": code.FUNCTION, "sort": code.FUNCTION, "push": code.FUNCTION, "pop": code.FUNCTION,
			"stringify": code.FUNCTION, "parse": code.FUNCTION,
			"require": code.FUNCTION,
			
			"kit": code.CONSTANT, "ice": code.CONSTANT,
			"ctx": code.CONSTANT, "mdb": code.CONSTANT, "web": code.CONSTANT, "aaa": code.CONSTANT,
			"tcp": code.CONSTANT, "nfs": code.CONSTANT, "cli": code.CONSTANT, "log": code.CONSTANT,
			"code": code.CONSTANT, "wiki": code.CONSTANT, "chat": code.CONSTANT, "team": code.CONSTANT, "mall": code.CONSTANT,
			"http": code.CONSTANT, "html": code.CONSTANT, "icon": code.CONSTANT, "svg": code.CONSTANT,
			
			"can": code.OBJECT, "msg": code.OBJECT, "cb": code.FUNCTION, "target": code.OBJECT, "event": code.OBJECT,
			"Volcanos": code.FUNCTION, "shy": code.FUNCTION, "cbs": code.FUNCTION,
			"res": code.OBJECT, "sub": code.OBJECT, "sup": code.OBJECT,
		},
		complete: function(event, can, msg, target, pre, key) {
			var ls = can.core.Split(can.core.Split(pre, "\t {(:,)}").pop(), nfs.PT), list = {event: event, can: can, msg: msg, target: target, window: window}
			can.core.ItemKeys(key == ""? list: can.core.Value(list, ls)||can.core.Value(window, ls)||window, function(k, v) {
				msg.Push(mdb.NAME, k).Push(mdb.TEXT, (v+"").split(lex.NL)[0])
			})
		},
		func: function(can, push, text, indent, opts) { var ls = can.core.Split(text, "\t (,", nfs.DF)
			if (indent == 0 && can.base.beginWith(text, "Volcanos")) {
				var _block = can.base.trimPrefix(ls[1], "chat.").toLowerCase()
				if (_block != opts.block) { push("") } opts.block = _block
				if (text.indexOf(chat._INIT) > -1) { push(opts.block+nfs.PT+chat._INIT) }
			} else if (indent == 0 && can.base.beginWith(text, "var ")) {
				opts.block = ls[1]
			} else if (indent == 4 && ls[1] == nfs.DF) {
				ls[0] && push(opts.block+nfs.PT+ls[0])
			}
		},
	}, json: {split: {operator: "{[:,]}"}, keyword: {"true": code.CONSTANT, "false": code.CONSTANT}},
	css: {
		prefix: {"// ": code.COMMENT, "/* ": code.COMMENT},
		split: {operator: "{[(.,:;<!=>)]}"},
		regexp: {
			"#[^ ;]+": code.STRING, "[-0-9]+(deg|rem|px|s|%)?": code.STRING,
			"--[^ ();]+": code.CONSTANT,
		},
		keyword: {
			"not": code.DATATYPE, "first-child": code.DATATYPE, "last-child": code.DATATYPE, "nth-child": code.DATATYPE,
			"placeholder": code.DATATYPE, "hover": code.DATATYPE, "focus": code.DATATYPE,
			
			"$option": code.KEYWORD,
			"$action": code.KEYWORD,
			"$output": code.KEYWORD,
			"$project": code.KEYWORD,
			"$content": code.KEYWORD,
			
			"output": code.KEYWORD,
			"background-color": code.FUNCTION, "color": code.FUNCTION,
			"font-family": code.FUNCTION, "font-weight": code.FUNCTION, "font-style": code.FUNCTION, "font-size": code.FUNCTION, "line-height": code.FUNCTION,
			"text-align": code.FUNCTION, "white-space": code.FUNCTION, "word-break": code.FUNCTION, "letter-space": code.FUNCTION, "tab-size": code.FUNCTION,
			"vertical-align": code.FUNCTION,
			"padding": code.FUNCTION, "padding-left": code.FUNCTION, "padding-top": code.FUNCTION, "padding-right": code.FUNCTION, "padding-bottom": code.FUNCTION,
			"border": code.FUNCTION, "border-left": code.FUNCTION, "border-top": code.FUNCTION, "border-right": code.FUNCTION, "border-bottom": code.FUNCTION,
			"margin": code.FUNCTION, "margin-left": code.FUNCTION, "margin-top": code.FUNCTION, "margin-right": code.FUNCTION, "margin-bottom": code.FUNCTION,
			"box-sizing": code.FUNCTION, "border-radius": code.FUNCTION, "outline": code.FUNCTION, "box-shadow": code.FUNCTION,
			"height": code.FUNCTION, "width": code.FUNCTION, "min-width": code.FUNCTION, "max-width": code.FUNCTION, "min-height": code.FUNCTION, "max-height": code.FUNCTION,
			"display": code.FUNCTION, "float": code.FUNCTION, "clear": code.FUNCTION, "visibility": code.FUNCTION, "overflow": code.FUNCTION,
			"flex": code.FUNCTION, "align-items": code.FUNCTION, "justify-content": code.FUNCTION, "flex-direction": code.FUNCTION,
			"flex-grow": code.FUNCTION, "flex-shrink": code.FUNCTION, "flex-wrap": code.FUNCTION,
			"position": code.FUNCTION, "z-index": code.FUNCTION, "cursor": code.FUNCTION, "transition": code.FUNCTION,
			"transform": code.FUNCTION, "translate": code.FUNCTION, "rotate": code.FUNCTION,
			"stroke-width": code.FUNCTION, "stroke": code.FUNCTION, "fill": code.FUNCTION,
			
			"transparent": code.CONSTANT,
			"monospace": code.CONSTANT, "bold": code.CONSTANT, "italic": code.CONSTANT, "normal": code.CONSTANT,
			"center": code.CONSTANT,
			"border-box": code.CONSTANT,
			"calc": code.KEYWORD, "important": code.KEYWORD,
			"solid": code.CONSTANT, "dashed": code.CONSTANT,
			"0": code.CONSTANT, "none": code.CONSTANT, "unset": code.CONSTANT,
			"block": code.CONSTANT, "both": code.CONSTANT, "hidden": code.CONSTANT, "visible": code.CONSTANT, "auto": code.CONSTANT,
			"wrap": code.CONSTANT, "column": code.CONSTANT, "row-reverse": code.CONSTANT,
			"relative": code.CONSTANT, "absolute": code.CONSTANT, "sticky": code.CONSTANT, "static": code.CONSTANT, "fixed": code.CONSTANT,
			"left": code.FUNCTION, "top": code.FUNCTION, "right": code.FUNCTION, "bottom": code.FUNCTION,
			"pointer": code.CONSTANT, "copy": code.CONSTANT,
			
			"black": code.CONSTANT, "white": code.CONSTANT,
			"silver": code.CONSTANT, "gray": code.CONSTANT,
			"red": code.CONSTANT, "blue": code.CONSTANT,
			"cyan": code.CONSTANT, "aliceblue": code.CONSTANT,
			
			"--plugin-bg-color": code.CONSTANT, "--plugin-fg-color": code.CONSTANT,
			"--input-bg-color": code.CONSTANT, "--output-bg-color": code.CONSTANT,
			"--danger-bg-color": code.CONSTANT, "--notice-bg-color": code.CONSTANT,
			"--hover-bg-color": code.CONSTANT, "--hover-fg-color": code.CONSTANT,
			"--body-bg-color": code.CONSTANT, "--body-fg-color": code.CONSTANT,
			
			/*
			"text-shadow": code.FUNCTION,
			"caret-color": code.FUNCTION,
			
			"type": code.FUNCTION, "name": code.FUNCTION,
			"background": code.FUNCTION, "background-position": code.FUNCTION, "background-size": code.FUNCTION,
			
			
			"dark": code.CONSTANT, "light": code.CONSTANT,
			"yellow": code.CONSTANT,
			
			"green": code.CONSTANT,
			"purple": code.CONSTANT,
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
			
			"magenta": code.CONSTANT,
			
			"vertical-align": code.FUNCTION,
			"url": code.FUNCTION,
			"contexts": code.CONSTANT,
			*/
		}, include: ["html"],
		func: function(can, push, text) { text.indexOf("/* ") == 0 && push(can.base.trimPrefix(can.base.trimSuffix(text, " */"), "/* ")) },
	},
	html: {split: {operator: "<!=/>"}, keyword: {
		"DOCTYPE": code.KEYWORD, "html": code.KEYWORD, "head": code.KEYWORD, "body": code.KEYWORD,
		"meta": code.KEYWORD, "title": code.KEYWORD, "link": code.KEYWORD, "script": code.KEYWORD,
		"src": code.FUNCTION, "href": code.FUNCTION, "rel": code.FUNCTION, "style": code.FUNCTION,
		
		"h1": code.KEYWORD, "h2": code.KEYWORD, "h3": code.KEYWORD,
		"p": code.KEYWORD, "em": code.KEYWORD, "strong": code.KEYWORD, "sub": code.KEYWORD, "sup": code.KEYWORD, "i": code.KEYWORD, "b": code.KEYWORD, "u": code.KEYWORD,
		"pre": code.KEYWORD, "code": code.KEYWORD, "var": code.KEYWORD, "kbd": code.KEYWORD, "samp": code.KEYWORD,
		
		"ul": code.KEYWORD, "ol": code.KEYWORD, "li": code.KEYWORD,
		"table": code.KEYWORD, "thead": code.KEYWORD, "tbody": code.KEYWORD, "tfoot": code.KEYWORD,
		"tr": code.KEYWORD, "th": code.KEYWORD, "td": code.KEYWORD,
		"colgroup": code.KEYWORD, "col": code.KEYWORD, "colspan": code.FUNCTION, "rowspan": code.FUNCTION,
		
		"header": code.KEYWORD, "nav": code.KEYWORD, "main": code.KEYWORD, "aside": code.KEYWORD, "footer": code.KEYWORD, "article": code.KEYWORD, "section": code.KEYWORD,
		"a": code.KEYWORD, "div": code.KEYWORD, "span": code.KEYWORD, "br": code.KEYWORD, "hr": code.KEYWORD,
		"img": code.KEYWORD, "video": code.KEYWORD, "audio": code.KEYWORD, "canvas": code.KEYWORD, "iframe": code.KEYWORD,
		"svg": code.KEYWORD, "rect": code.KEYWORD, "circle": code.KEYWORD,
		
		"fieldset": code.KEYWORD, "legend": code.KEYWORD, "form": code.KEYWORD, "label": code.KEYWORD,
		"select": code.KEYWORD, "option": code.KEYWORD, "input": code.KEYWORD, "textarea": code.KEYWORD, "button": code.KEYWORD,
		"height": code.FUNCTION, "width": code.FUNCTION,
	}},
})
