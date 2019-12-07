Volcanos("onimport", {
    init: function(can, msg, cb, target, option) {target.innerHTML = ""
        var table = can.node.AppendTable(can, target, msg, msg.append)
        table.onclick = function(event) {
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.onexport.init(event, can, msg, index, key)
                    })
                    break
                case "TH":
                case "TR":
                case "TABLE":
            }
        }
        table.oncontextmenu = function(event) {
            switch (event.target.tagName) {
                case "TD":
                    can.onimport.which(event, table, msg.append, function(index, key) {
                        can.oncarte(event, shy("", can.ondetail, can.ondetail.list, function(event, value, meta) {
                            meta[value](event, can, msg, index, key, value)
                        }))
                    })
                case "TH":
                case "TR":
                case "TABLE":
                    can.oncarte(event, shy("", can.onchoice, can.onchoice.list, function(event, value, meta) {
                        meta[value](event, can, msg, value)
                    }))
            }
            event.stopPropagation()
            event.preventDefault()
        }
        typeof cb == "function" && cb(msg);
    },
    which: function(event, table, list, cb) {if (event.target == table) {return cb(-1, "")}
        can.node.Select(table, "tr", can.core.List, function(tr, index) {if (event.target == tr) {return cb(index, "")}
            can.node.Select(tr, "th,td", can.core.List, function(td, order) {
                if (event.target == td) {return cb(index, list[order])}
            })
        })
    },
})
Volcanos("onaction", {list: [],
    onmouseover: function(event, can, msg, cb, target, option) {
        msg.Log(event, can, msg, index, key)
    },
})
Volcanos("onchoice", {list: ["copy", "复制", "下载"],
    copy: function(event, can, msg, value) {
        can.Log(event, can, msg, value)
    },
})
Volcanos("ondetail", {list: ["copy", "复制", "下载"],
    copy: function(event, can, msg, index, key, value) {
        can.Log(event, can, msg, index, key, value)
    },
})
Volcanos("onexport", {list: ["复制", "下载"],
    init: function(event, can, msg, index, key) {
        can.Log(event, can, msg, index, key)
    },
})

