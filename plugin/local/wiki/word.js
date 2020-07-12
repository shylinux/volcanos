Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onappend.table(can, target, "table", msg)
        can._output.innerHTML = msg.Result()

        can.page.Select(can, can._output, ".story", function(item) {var data = item.dataset
            var cb = can.onimport[data.type]; cb && cb(can, data, item)
        })
        return typeof cb == "function" && cb(msg)
    },
    field: function(can, item, target) { var meta = can.base.Obj(item.meta)
        meta.width = can.Conf("width")
        meta.height = can.Conf("height")
        can.onappend._init(can, meta, Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, (cmds[0] == "search"? []: ["action", "story", item.type, item.name, item.text]).concat(cmds), cb, true)
            }
        }, can._output, target)
    },
}, ["/plugin/local/wiki/word.css"])

