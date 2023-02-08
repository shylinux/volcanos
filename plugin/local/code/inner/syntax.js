Volcanos(chat.ONSYNTAX, {
	makefile: {
		prefix: {"#": code.COMMENT},
		suffix: {":": code.COMMENT},
		keyword: {
			"ifeq": code.KEYWORD,
			"ifneq": code.KEYWORD,
			"else": code.KEYWORD,
			"endif": code.KEYWORD,
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
	vim: {
		prefix: {"\"": "comment"},
		keyword: {
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
			"#include": code.KEYWORD,
			"#define": code.KEYWORD,
			"#undef": code.KEYWORD,
			"#ifndef": code.KEYWORD,
			"#ifdef": code.KEYWORD,
			"#if": code.KEYWORD,
			"#elif": code.KEYWORD,
			"#else": code.KEYWORD,
			"#endif": code.KEYWORD,
			"#error": code.KEYWORD,
			"#line": code.KEYWORD,

			"if": code.KEYWORD,
			"else": code.KEYWORD,
			"for": code.KEYWORD,
			"while": code.KEYWORD,
			"do": code.KEYWORD,
			"break": code.KEYWORD,
			"continue": code.KEYWORD,
			"switch": code.KEYWORD,
			"case": code.KEYWORD,
			"default": code.KEYWORD,
			"return": code.KEYWORD,
			"goto": code.KEYWORD,

			"struct": code.DATATYPE,
			"union": code.DATATYPE,
			"enum": code.DATATYPE,

			"void": code.DATATYPE,
			"char": code.DATATYPE,
			"float": code.DATATYPE,
			"double": code.DATATYPE,
			"unsigned": code.DATATYPE,
			"signed": code.DATATYPE,
			"short": code.DATATYPE,
			"long": code.DATATYPE,
			"int": code.DATATYPE,

			"auto": code.DATATYPE,
			"typedef": code.DATATYPE,
			"register": code.DATATYPE,
			"volatile": code.DATATYPE,
			"extern": code.DATATYPE,
			"static": code.DATATYPE,
			"const": code.DATATYPE,

			"defined": code.FUNCTION,
			"sizeof": code.FUNCTION,

			"__FILE__": code.CONSTANT,
			"__LINE__": code.CONSTANT,
			"NULL": code.CONSTANT,
			"-1": code.CONSTANT,
			"0": code.CONSTANT,
			"1": code.CONSTANT,
			"2": code.CONSTANT,
		},
	}, h: {link: "c"},
	sh: {
		prefix: {"#": code.COMMENT},
		suffix: {" {": code.COMMENT},
		regexp: {
			"[A-Z0-9_]+": code.CONSTANT,
		},
		keyword: {
			"local": code.KEYWORD,
			"export": code.KEYWORD,
			"require": code.KEYWORD,
			"source": code.KEYWORD,
			"return": code.KEYWORD,
			"exit": code.KEYWORD,
			".": code.KEYWORD,

			"if": code.KEYWORD,
			"then": code.KEYWORD,
			"elif": code.KEYWORD,
			"else": code.KEYWORD,
			"fi": code.KEYWORD,
			"for": code.KEYWORD,
			"while": code.KEYWORD,
			"do": code.KEYWORD,
			"done": code.KEYWORD,
			"case": code.KEYWORD,
			"in": code.KEYWORD,
			"esac": code.KEYWORD,

			"shift": code.FUNCTION,
			"eval": code.FUNCTION,
			"trap": code.FUNCTION,
			"test": code.FUNCTION,
			"echo": code.FUNCTION,
			"cat": code.FUNCTION,
			"rm": code.FUNCTION,
			"mkdir": code.FUNCTION,
			"mktemp": code.FUNCTION,
			"history": code.FUNCTION,
			"complete": code.FUNCTION,
			"compgen": code.FUNCTION,
			"bind": code.FUNCTION,
			"alias": code.FUNCTION,

			"xargs": code.FUNCTION,
			"curl": code.FUNCTION,
			"sed": code.FUNCTION,
			"tr": code.FUNCTION,
			"du": code.FUNCTION,
			"cut": code.FUNCTION,
			"tail": code.FUNCTION,
			"head": code.FUNCTION,
			"grep": code.FUNCTION,

			"/dev/null": code.CONSTANT,
			"DEBUG": code.CONSTANT,
			"EXIT": code.CONSTANT,
		},
	}, configure: {link: "sh"},
	shy: {
		prefix: {"#": code.COMMENT},
		keyword: {
			"source": code.KEYWORD,
			"return": code.KEYWORD,
			"title": code.KEYWORD,
			"premenu": code.KEYWORD,
			"chapter": code.KEYWORD,
			"section": code.KEYWORD,
			"refer": code.KEYWORD,
			"spark": code.KEYWORD,
			"shell": code.KEYWORD,
			"field": code.KEYWORD,
			"chart": code.KEYWORD,
			"label": code.KEYWORD,
			"chain": code.KEYWORD,
			"image": code.KEYWORD,
			"sequence": code.KEYWORD,
		},
	},
	py: {
		prefix: {
			"#!": code.COMMENT,
			"# ": code.COMMENT,
		},
		keyword: {
			"import": code.KEYWORD,
			"from": code.KEYWORD,
			"return": code.KEYWORD,
			"print": code.FUNCTION,
		},
	},
	go: {
		prefix: {"//": code.COMMENT},
		regexp: {
			"[A-Z_0-9]+": code.CONSTANT,
		},
		keyword: {
			"package": code.KEYWORD,
			"import": code.KEYWORD,
			"const": code.KEYWORD,
			"type": code.KEYWORD,
			"struct": code.KEYWORD,
			"interface": code.KEYWORD,
			"func": code.KEYWORD,
			"var": code.KEYWORD,

			"if": code.KEYWORD,
			"else": code.KEYWORD,
			"for": code.KEYWORD,
			"range": code.KEYWORD,
			"break": code.KEYWORD,
			"continue": code.KEYWORD,
			"switch": code.KEYWORD,
			"case": code.KEYWORD,
			"default": code.KEYWORD,
			"fallthrough": code.KEYWORD,
			"go": code.KEYWORD,
			"select": code.KEYWORD,
			"defer": code.KEYWORD,
			"return": code.KEYWORD,

			"int": code.DATATYPE, "int8": code.DATATYPE, "int16": code.DATATYPE, "int32": code.DATATYPE, "int64": code.DATATYPE,
			"uint": code.DATATYPE, "uint8": code.DATATYPE, "uint16": code.DATATYPE, "uint32": code.DATATYPE, "uint64": code.DATATYPE,
			"float32": code.DATATYPE, "float64": code.DATATYPE, "complex64": code.DATATYPE, "complex128": code.DATATYPE,
			"rune": code.DATATYPE, "string": code.DATATYPE, "byte": code.DATATYPE, "uintptr": code.DATATYPE,
			"bool": code.DATATYPE, "error": code.DATATYPE, "chan": code.DATATYPE, "map": code.DATATYPE,

			"init": code.FUNCTION, "main": code.FUNCTION, "print": code.FUNCTION, "println": code.FUNCTION, "panic": code.FUNCTION, "recover": code.FUNCTION,
			"new": code.FUNCTION, "make": code.FUNCTION, "len": code.FUNCTION, "cap": code.FUNCTION, "copy": code.FUNCTION, "append": code.FUNCTION, "delete": code.FUNCTION, "close": code.FUNCTION,
			"complex": code.FUNCTION, "real": code.FUNCTION, "imag": code.FUNCTION,

			"iota": code.CONSTANT, "true": code.CONSTANT, "false": code.CONSTANT, "nil": code.CONSTANT,

			"kit": code.PACKAGE, "ice": code.PACKAGE,
			"Any": code.DATATYPE, "Map": code.DATATYPE, "Maps": code.DATATYPE, "Message": code.DATATYPE,
			"m": code.OBJECT, "msg": code.OBJECT,
		},
	}, godoc: {link: "go"},
	mod: {
		prefix: {"//": code.COMMENT},
		keyword: {
			"go": code.KEYWORD,
			"module": code.KEYWORD,
			"require": code.KEYWORD,
			"replace": code.KEYWORD,
		},
	}, sum: {},
	js: {
		prefix: {"// ": code.COMMENT},
		regexp: {"[A-Z_0-9]+": code.CONSTANT},
		keyword: {
			"const": code.KEYWORD,
			"var": code.KEYWORD,
			"new": code.KEYWORD,
			"typeof": code.KEYWORD,
			"function": code.KEYWORD,

			"if": code.KEYWORD,
			"else": code.KEYWORD,
			"for": code.KEYWORD,
			"in": code.KEYWORD,
			"while": code.KEYWORD,
			"break": code.KEYWORD,
			"continue": code.KEYWORD,
			"switch": code.KEYWORD,
			"case": code.KEYWORD,
			"default": code.KEYWORD,
			"return": code.KEYWORD,
			"debugger": code.KEYWORD,
			"try": code.KEYWORD,
			"catch": code.KEYWORD,

			"null": code.CONSTANT,
			"true": code.CONSTANT,
			"false": code.CONSTANT,
			"undefined": code.CONSTANT,

			"event": code.DATATYPE,
			"target": code.DATATYPE,
			"window": code.DATATYPE,
			"location": code.DATATYPE,
			"navigator": code.DATATYPE,
			"document": code.DATATYPE,
			"history": code.DATATYPE,
			"console": code.DATATYPE,
			"arguments": code.DATATYPE,
			"this": code.DATATYPE,
			"JSON": code.DATATYPE,
			"Date": code.DATATYPE,
			"Array": code.DATATYPE,
			"Date": code.DATATYPE,
			"Math": code.DATATYPE,
			"XMLHttpRequest": code.DATATYPE,
			"WebSocket": code.DATATYPE,

			"encodeURIComponent": code.FUNCTION,
			"decodeURIComponent": code.FUNCTION,
			"setTimeout": code.FUNCTION,
			"parseFloat": code.FUNCTION,
			"parseInt": code.FUNCTION,
			"delete": code.FUNCTION,
			"confirm": code.FUNCTION,
			"alert": code.FUNCTION,
			"hasOwnProperty": code.FUNCTION,
			"callee": code.FUNCTION,
			"apply": code.FUNCTION,
			"call": code.FUNCTION,
			"parse": code.FUNCTION,
			"pop": code.FUNCTION,
			"push": code.FUNCTION,
			"sort": code.FUNCTION,
			"join": code.FUNCTION,
			"slice": code.FUNCTION,
			"concat": code.FUNCTION,
			"indexOf": code.FUNCTION,
			"lastIndexOf": code.FUNCTION,
			"reverse": code.FUNCTION,
			"stringify": code.FUNCTION,
			"forEach": code.FUNCTION,
			"toLowerCase": code.FUNCTION,
			"length": code.FUNCTION,
			"split": code.FUNCTION,
			"trim": code.FUNCTION,
			"isArray": code.FUNCTION,
			
			"kit": code.DATATYPE,
			"ice": code.DATATYPE,
			"can": code.DATATYPE,
			"sub": code.DATATYPE,
			"sup": code.DATATYPE,
			"msg": code.DATATYPE,

			"shy": code.FUNCTION,
			"cbs": code.FUNCTION,
			"cb": code.FUNCTION,
			"Volcanos": code.FUNCTION,
		},
	}, json: {},
	css: {
		prefix: {"// ": code.COMMENT, "/* ": code.COMMENT},
		split: {operator: "{[(.,:;&>=)]}"},
		regexp: {
			"[-0-9]+deg": code.CONSTANT,
			"[-0-9]+rem": code.CONSTANT,
			"[-0-9]+px": code.CONSTANT,
			"[-0-9]+%": code.CONSTANT,
			"[-0-9]+": code.CONSTANT,
			"#[^ ;]+": code.CONSTANT,
		},
		keyword: {
			"body": code.KEYWORD,
			"fieldset": code.KEYWORD,
			"legend": code.KEYWORD,
			"form": code.KEYWORD,
			"input": code.KEYWORD,
			"select": code.KEYWORD,
			"textarea": code.KEYWORD,
			"table": code.KEYWORD,
			"thead": code.KEYWORD,
			"tbody": code.KEYWORD,
			"tr": code.KEYWORD,
			"th": code.KEYWORD,
			"td": code.KEYWORD,
			"h1": code.KEYWORD,
			"h2": code.KEYWORD,
			"h3": code.KEYWORD,
			"a": code.KEYWORD,
			"label": code.KEYWORD,
			"span": code.KEYWORD,
			"div": code.KEYWORD,
			"img": code.KEYWORD,
			"svg": code.KEYWORD,
			"hover": code.DATATYPE,
			"focus": code.DATATYPE,
			"not": code.DATATYPE,
			"type": code.FUNCTION,
			"name": code.FUNCTION,

			"display": code.FUNCTION,
			"visibility": code.FUNCTION,
			"overflow": code.FUNCTION,
			"position": code.FUNCTION,
			"z-index": code.FUNCTION,
			"padding": code.FUNCTION,
			"padding-left": code.FUNCTION,
			"padding-top": code.FUNCTION,
			"border": code.FUNCTION,
			"border-left": code.FUNCTION,
			"border-top": code.FUNCTION,
			"border-right": code.FUNCTION,
			"border-bottom": code.FUNCTION,
			"border-radius": code.FUNCTION,
			"margin": code.FUNCTION,
			"margin-left": code.FUNCTION,
			"margin-top": code.FUNCTION,
			"margin-right": code.FUNCTION,
			"margin-bottom": code.FUNCTION,
			"box-shadow": code.FUNCTION,
			"outline": code.FUNCTION,
			"height": code.FUNCTION,
			"width": code.FUNCTION,
			"min-width": code.FUNCTION,
			"max-height": code.FUNCTION,
			"left": code.FUNCTION,
			"top": code.FUNCTION,
			"right": code.FUNCTION,
			"bottom": code.FUNCTION,
			"box-sizing": code.FUNCTION,
			"border-box": code.CONSTANT,
			"block": code.CONSTANT,
			"none": code.CONSTANT,
			"auto": code.CONSTANT,
			"hidden": code.CONSTANT,
			"visible": code.CONSTANT,
			"relative": code.CONSTANT,
			"absolute": code.CONSTANT,
			"sticky": code.CONSTANT,
			"fixed": code.CONSTANT,
			"solid": code.CONSTANT,
			"unset": code.CONSTANT,
			"transition": code.FUNCTION,
			"transform": code.FUNCTION,
			"translate": code.FUNCTION,
			"rotate": code.FUNCTION,
			"float": code.FUNCTION,
			"clear": code.FUNCTION,
			"both": code.CONSTANT,
			
			"background-color": code.FUNCTION,
			"color": code.FUNCTION,
			"tab-size": code.FUNCTION,
			"font-size": code.FUNCTION,
			"font-family": code.FUNCTION,
			"font-weight": code.FUNCTION,
			"font-style": code.FUNCTION,
			"line-height": code.FUNCTION,
			"text-align": code.FUNCTION,
			"white-space": code.FUNCTION,
			"caret-color": code.FUNCTION,
			"cursor": code.FUNCTION,
			"pointer": code.CONSTANT,
			"center": code.CONSTANT,
			"monospace": code.CONSTANT,
			"italic": code.CONSTANT,
			
			"dark": code.CONSTANT,
			"light": code.CONSTANT,
			"transparent": code.CONSTANT,
			"black": code.CONSTANT,
			"white": code.CONSTANT,
			"yellow": code.CONSTANT,
			"blue": code.CONSTANT,
			"red": code.CONSTANT,
			
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
		},
		keyword0: {
			"word-break": code.FUNCTION,
			"vertical-align": code.FUNCTION,
			"calc": code.FUNCTION,
			"url": code.FUNCTION,
			"bold": code.CONSTANT,
			"contexts": code.CONSTANT,
		},
	},
	html: {
		keyword: {
			"DOCTYPE": code.KEYWORD,
			"html": code.KEYWORD,
			"head": code.KEYWORD,
			"body": code.KEYWORD,
			
			"meta": code.KEYWORD,
			"link": code.KEYWORD,
			"title": code.KEYWORD,
			
			"h1": code.KEYWORD,
			"h2": code.KEYWORD,
			"h3": code.KEYWORD,
			"p": code.KEYWORD,
			"em": code.KEYWORD,
			"strong": code.KEYWORD,
			"i": code.KEYWORD,
			"b": code.KEYWORD,
			"u": code.KEYWORD,
			"a": code.KEYWORD,
			"ul": code.KEYWORD,
			"ol": code.KEYWORD,
			"li": code.KEYWORD,
			"dl": code.KEYWORD,
			"dt": code.KEYWORD,
			"dd": code.KEYWORD,
			"br": code.KEYWORD,
			"hr": code.KEYWORD,
			"blockquote": code.KEYWORD,
			"q": code.KEYWORD,
			"cite": code.KEYWORD,
			"abbr": code.KEYWORD,
			"address": code.KEYWORD,
			"sub": code.KEYWORD,
			"sup": code.KEYWORD,
			"pre": code.KEYWORD,
			"code": code.KEYWORD,
			"var": code.KEYWORD,
			"kbd": code.KEYWORD,
			"samp": code.KEYWORD,
			"time": code.KEYWORD,
			"header": code.KEYWORD,
			"nav": code.KEYWORD,
			"main": code.KEYWORD,
			"aside": code.KEYWORD,
			"footer": code.KEYWORD,
			"article": code.KEYWORD,
			"section": code.KEYWORD,
			"span": code.KEYWORD,
			"div": code.KEYWORD,
			"img": code.KEYWORD,
			"video": code.KEYWORD,
			"audio": code.KEYWORD,
			"source": code.KEYWORD,
			"muted": code.FUNCTION,
			"autoplay": code.FUNCTION,
			"loop": code.FUNCTION,
			"controls": code.FUNCTION,
			"iframe": code.KEYWORD,
			
			"svg": code.KEYWORD,
			"rect": code.KEYWORD,
			"circle": code.KEYWORD,
			"fill": code.FUNCTION,
			"x": code.FUNCTION,
			"y": code.FUNCTION,
			"r": code.FUNCTION,
			
			"table": code.KEYWORD,
			"tr": code.KEYWORD,
			"th": code.KEYWORD,
			"td": code.KEYWORD,
			"colgroup": code.KEYWORD,
			"col": code.KEYWORD,
			"thead": code.KEYWORD,
			"tbody": code.KEYWORD,
			"tfoot": code.KEYWORD,
			"colspan": code.FUNCTION,
			"rowspan": code.FUNCTION,
			
			"href": code.FUNCTION,
			"rel": code.FUNCTION,
			"src": code.FUNCTION,
			"style": code.FUNCTION,
			"width": code.FUNCTION,
			"height": code.FUNCTION,
		},
	},
	zml: {
		render: {},
		prefix: {
			"# ": code.COMMENT,
		},
		keyword: {
			"return": code.KEYWORD,

			"head": code.KEYWORD,
			"left": code.KEYWORD,
			"main": code.KEYWORD,
			"foot": code.KEYWORD,
			"tabs": code.KEYWORD,

			"index": code.FUNCTION,
			"action": code.FUNCTION,
			"args": code.FUNCTION,
			"type": code.FUNCTION,
			"style": code.FUNCTION,
			"width": code.FUNCTION,

			"auto": code.CONSTANT,
			"username": code.CONSTANT,
		},
	},
})

