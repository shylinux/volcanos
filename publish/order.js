Volcanos("onengine", {
    river: {
        "two": {name: "two", storm: {
            "one": {name: "one", action: [
                {name: "some", help: "some", inputs: [
                    {type: "text", name: "one"},
                    {type: "button", name: "one"},
                ], engine: function(event, can, msg, pane, cmds, cb) {
                    msg.Echo("hello world")
                    typeof cb == "function" && cb(msg)
                }},
            ]},
            "two": {name: "two", action: [
                {name: "some", help: "some", inputs: [
                    {type: "text", name: "one"},
                    {type: "button", name: "one"},
                ], engine: function(event, can, msg, pane, cmds, cb) {
                    msg.Echo("hello world")
                    typeof cb == "function" && cb(msg)
                }},
                {name: "miss", help: "some", inputs: [
                    {type: "text", name: "one"},
                    {type: "button", name: "one"},
                ], engine: function(event, can, msg, pane, cmds, cb) {
                    msg.Echo("hello miss world")
                    typeof cb == "function" && cb(msg)
                }},
            ]},
        }},
    },
    remote: function(event, can, msg, pane, cmds, cb) {
        switch (pane._name) {
            case "River":
                if (cmds.length == 0) {
                    can.core.Item(can.onengine.river, function(key, value) {
                        msg.Push("key", key)
                        msg.Push("name", value.name)
                    })
                }
                break
            case "Storm":
                var river = can.onengine.river[cmds[0]]
                if (!river) { break }
                can.core.Item(river.storm, function(key, value) {
                    msg.Push("key", key)
                    msg.Push("name", value.name)
                })
                typeof cb == "function" && cb(msg)
                return true
            case "Action":
                var river = can.onengine.river[cmds[0]]
                var storm = river && river.storm[cmds[1]]
                if (!storm) { break } if (cmds.length == 2) {
                    can.core.List(storm.action, function(value) {
                        msg.Push("name", value.name||"")
                        msg.Push("help", value.help||"")
                        msg.Push("inputs", JSON.stringify(value.inputs||[]))
                    })
                    typeof cb == "function" && cb(msg)
                } else {
                    storm.action[cmds[2]].engine(event, can, msg, pane, cmds, cb)
                }
                return true
        }
        return false;
    },
}, [], function(can) {})
