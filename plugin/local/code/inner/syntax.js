Volcanos(chat.ONSYNTAX, {help: "语法高亮",
	makefile: {
		prefix: {
			"#": code.COMMENT,
		},
		suffix: {
			":": code.COMMENT,
		},
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
	h: {
		render: {},
		link: "c",
	},
	c: {
		render: {},
		prefix: {
			"//": code.COMMENT,
			"/*": code.COMMENT,
			"*": code.COMMENT,
			"*/": code.COMMENT,
			"#": code.KEYWORD,
		},
		regexp: {
			"^u_\\w+$": code.DATATYPE,
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
	},
	sh: {
		render: {},
		split: {
			operator: "=",
		},
		prefix: {
			"#": code.COMMENT,
		},
		suffix: {
			" {": code.COMMENT,
		},
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

			"case": code.KEYWORD,
			"in": code.KEYWORD,
			"esac": code.KEYWORD,

			"eval": code.FUNCTION,
			"test": code.FUNCTION,
			"echo": code.FUNCTION,
			"mkdir": code.FUNCTION,
			"cat": code.FUNCTION,
			"rm": code.FUNCTION,
		},
	}, configure: {link: "sh"},
	shy: {
		prefix: {
			"#": code.COMMENT,
		},
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
	go: {
		render: {},
		split: {
			operator: "{([:.,*])}",
		},
		prefix: {
			"//": code.COMMENT,
		},
		keyword: {
			"package": code.KEYWORD,
			"import": code.KEYWORD,
			"type": code.KEYWORD,
			"struct": code.KEYWORD,
			"interface": code.KEYWORD,
			"const": code.KEYWORD,
			"var": code.KEYWORD,
			"func": code.KEYWORD,

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

			"false": "constant",
			"true": "constant",
			"nil": "constant",
			"iota": "constant",
			"-1": "constant",
			"0": "constant",
			"1": "constant",
			"2": "constant",
			"3": "constant",

			"int": code.DATATYPE, "int8": code.DATATYPE, "int16": code.DATATYPE, "int32": code.DATATYPE, "int64": code.DATATYPE,
			"uint": code.DATATYPE, "uint8": code.DATATYPE, "uint16": code.DATATYPE, "uint32": code.DATATYPE, "uint64": code.DATATYPE,
			"float32": code.DATATYPE, "float64": code.DATATYPE, "complex64": code.DATATYPE, "complex128": code.DATATYPE,
			"rune": code.DATATYPE, "string": code.DATATYPE, "byte": code.DATATYPE, "uintptr": code.DATATYPE,
			"bool": code.DATATYPE, "error": code.DATATYPE, "chan": code.DATATYPE, "map": code.DATATYPE,

			"msg": code.FUNCTION, "m": code.FUNCTION,
			"ice": code.FUNCTION, "kit": code.FUNCTION,
			"init": code.FUNCTION, "main": code.FUNCTION, "print": code.FUNCTION, "println": code.FUNCTION, "panic": code.FUNCTION, "recover": code.FUNCTION,
			"new": code.FUNCTION, "make": code.FUNCTION, "len": code.FUNCTION, "cap": code.FUNCTION, "copy": code.FUNCTION, "append": code.FUNCTION, "delete": code.FUNCTION, "close": code.FUNCTION,
			"complex": code.FUNCTION, "real": code.FUNCTION, "imag": code.FUNCTION,
		},
	},
	godoc: {
		render: {},
		link: "go",
	},
	mod: {
		split: {
			operator: "()",
		},
		prefix: {
			"//": code.COMMENT,
		},
		keyword: {
			"go": code.KEYWORD,
			"module": code.KEYWORD,
			"require": code.KEYWORD,
			"replace": code.KEYWORD,
			"=>": code.KEYWORD,
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
	js: {
		render: {},
		split: {
			operator: "{[(.,:;!|<*>)]}",
		},
		prefix: {
			"// ": code.COMMENT,
		},
		regexp: {
			// "can.*": code.FUNCTION,
		},
		keyword: {
			"var": code.KEYWORD,

			"if": code.KEYWORD,
			"else": code.KEYWORD,
			"for": code.KEYWORD,
			"while": code.KEYWORD,
			"switch": code.KEYWORD,
			"case": code.KEYWORD,
			"default": code.KEYWORD,
			"return": code.KEYWORD,

			"can": code.KEYWORD,
			"sub": code.KEYWORD,
			"sup": code.KEYWORD,
			"msg": code.KEYWORD,
			"res": code.KEYWORD,

			"ice": code.KEYWORD,
			"kit": code.KEYWORD,

			"event": code.KEYWORD,
			"target": code.KEYWORD,
			"window": code.KEYWORD,
			"location": code.KEYWORD,

			"null": code.CONSTANT,
			"true": code.CONSTANT,
			"false": code.CONSTANT,
			"undefined": code.CONSTANT,

			"function": code.FUNCTION,
			"arguments": code.FUNCTION,
			"this": code.FUNCTION,
			"delete": code.FUNCTION,
			"Volcanos": code.FUNCTION,
			"shy": code.FUNCTION,
			"cb": code.FUNCTION,
			"cbs": code.FUNCTION,
		},
	},
	css: {
		keyword: {
			"body": code.KEYWORD,
			"div": code.KEYWORD,
			"span": code.KEYWORD,
			"form": code.KEYWORD,
			"fieldset": code.KEYWORD,
			"legend": code.KEYWORD,
			"select": code.KEYWORD,
			"textarea": code.KEYWORD,
			"input": code.KEYWORD,
			"table": code.KEYWORD,
			"tr": code.KEYWORD,
			"th": code.KEYWORD,
			"td": code.KEYWORD,

			"background-color": code.FUNCTION,
			"font-family": code.FUNCTION,
			"font-weight": code.FUNCTION,
			"font-size": code.FUNCTION,
			"color": code.FUNCTION,
			"width": code.FUNCTION,
			"height": code.FUNCTION,
			"padding": code.FUNCTION,
			"border": code.FUNCTION,
			"margin": code.FUNCTION,
			"position": code.FUNCTION,
			"left": code.FUNCTION,
			"top": code.FUNCTION,
			"right": code.FUNCTION,
			"bottom": code.FUNCTION,
			"display": code.FUNCTION,
			"overflow": code.FUNCTION,
			"float": code.FUNCTION,
			"clear": code.FUNCTION,
			"cursor": code.FUNCTION,

			"z-index": code.FUNCTION,
			"tab-size": code.FUNCTION,
			"word-break": code.FUNCTION,
			"white-space": code.FUNCTION,
			"text-align": code.FUNCTION,
			"vertical-align": code.FUNCTION,
			"min-width": code.FUNCTION,
			"max-width": code.FUNCTION,
			"padding-left": code.FUNCTION,
			"padding-top": code.FUNCTION,
			"border-left": code.FUNCTION,
			"border-top": code.FUNCTION,
			"border-right": code.FUNCTION,
			"border-bottom": code.FUNCTION,
			"border-radius": code.FUNCTION,
			"border-spacing": code.FUNCTION,
			"margin-left": code.FUNCTION,
			"margin-top": code.FUNCTION,
			"margin-right": code.FUNCTION,
			"margin-bottom": code.FUNCTION,
			"box-shadow": code.FUNCTION,

			"0": "constant",
			"10px": "constant",
			"20px": "constant",
			"cyan": "constant",
			"gray": "constant",
			"yellow": "constant",
			"black": "constant",
			"white": "constant",
			"blue": "constant",
			"red": "constant",
			"green": "constant",
			"magenta": "constant",

			"monospace": "constant",
			"bold": "constant",
			"solid": "constant",
			"none": "constant",
			"block": "constant",
			"contexts": "constant",
			"both": "constant",
			"auto": "constant",

			"center": "constant",
			"relative": "constant",
			"absolute": "constant",
			"sticky": "constant",
			"fixed": "constant",
		},
	},
	iml: {
		render: {},
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

			"auto": "constant",
			"username": "constant",
		},
	},
})

