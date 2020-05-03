Volcanos("onengine", {
    river: {
        one: {name: "some", storm: {
            one: {name: "some", action: [
                {name: "show", help: "some"},
            ]},
            two: {name: "some"},
        }},
        two: {name: "some", storm: {
            one: {name: "some"},
            two: {name: "two", action: {
                show: {name: "show", help: "some", inputs: [
                    {type: "text", name: "arg"},
                ]},
            }},
        }},
        three: {name: "some"},
    },

    remote: function(event, can, msg, pane, cmds, cb) { var meta = can.onengine;
        return false
        var river = meta.river[msg.Option("river")]
        var storm = river && river.storm[msg.Option("storm")]

        msg.Clear("append"); switch (pane._name) {
            case "River":
                can.core.Item(meta.river, function(key, value) {
                    msg.Push("key", key)
                    msg.Push("name", value.name)
                })
                break
            case "Storm":
                river && can.core.Item(river.storm, function(key, value) {
                    msg.Push("key", key)
                    msg.Push("name", value.name)
                })
                break
            case "Action":
                storm && can.core.List(storm.action, function(value) {
                    msg.Push("name", value.name)
                    msg.Push("help", value.help)
                })
                break
        }
        typeof cb == "function" && cb(msg);
        return true
    },
}, [], function(can) { })

