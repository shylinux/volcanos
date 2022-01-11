Volcanos("onfigure", {help: "控件详情", list: [], date: {onclick: function(event, can, meta, cb, target) { cb(function(can, cbs) {
    function set(now) { target.value = can.user.time(can, now), can.close(), meta && meta.action == ice.AUTO && can.run({}) }

    // 添加控件
    var now = target.value? new Date(target.value): new Date()
    can.onmotion.clear(can, can._action), can.onappend._action(can, [cli.CLOSE,
        ["hour"].concat(can.core.List(24)), ["minute"].concat(can.core.List(0, 60, 5)), ["second"].concat(can.core.List(0, 60, 5)),
        "今天", "", "上一月", ["year"].concat(can.core.List(now.getFullYear() - 10, now.getFullYear() + 10)),
        ["month"].concat(can.core.List(1, 13)), "下一月",
    ], can._action, { close: function(event) { can.close() },
        "hour": function(event, can, key, value) {  now.setHours(parseInt(value)||0), show(now) },
        "minute": function(event, can, key, value) {  now.setMinutes(parseInt(value)||0), show(now) },
        "second": function(event, can, key, value) {  now.setSeconds(parseInt(value)||0), show(now) },
        "今天": function(event) {  now = new Date(), set(show(now)) },

        "上一月": function(event) {  now.setMonth(now.getMonth()-1), show(now) },
        "year": function(event, can, key, value) {  now.setFullYear(parseInt(value)), show(now) },
        "month": function(event, can, key, value) {  now.setMonth(parseInt(value)-1), show(now) },
        "下一月": function(event) {  now.setMonth(now.getMonth()+1), show(now) },

        "随机": function(event) {  now.setDate((Math.random() * 100 - 50) + now.getDate()), show(now) },
        "前一年": function(event) {  now.setFullYear(now.getFullYear()-1), show(now) },
        "后一年": function(event) {  now.setFullYear(now.getFullYear()+1), show(now) },
    })

    can.onmotion.clear(can, can._status)
    can._table = can.page.Appends(can, can._output, [{view: [chat.CONTENT, html.TABLE]}]).first
    var today = new Date(); function show(now) {
        // 设置控件
        can.Action("year", now.getFullYear())
        can.Action("month", now.getMonth()+1)
        can.Action("hour", now.getHours())
        can.Action("minute", parseInt(now.getMinutes()/5)*5)
        can.Action("second", parseInt(now.getSeconds()/5)*5)

        // 设置组件
        can.page.Appends(can, can._table, [{th: ["日", "一", "二", "三", "四", "五", "六"]}])
        var tr; function add(day, type) { if (day.getDay() == 0) { tr = can.page.Append(can, can._table, [{type: html.TR}]).last }
            can.page.Append(can, tr, [{text: [day.getDate(), html.TD, can.base.Time(today, "%y-%m-%d") == can.base.Time(day, "%y-%m-%d")? html.SELECT: type],
                dataset: {date: day.getTime()}, onclick: function(event) {
                    set(now = new Date(parseInt(event.target.dataset.date)))
                },
            }])
        }

        // 时间区间
        var one = new Date(now); one.setDate(1)
        var end = new Date(now); end.setMonth(now.getMonth()+1), end.setDate(1)
        var head = new Date(one); head.setDate(one.getDate()-one.getDay())
        var tail = new Date(end); tail.setDate(end.getDate()+7-end.getDay())

        // 时间序列
        for (var day = new Date(head); day < one; day.setDate(day.getDate()+1)) { add(day, mdb.PREV) }
        for (var day = new Date(one); day < end; day.setDate(day.getDate()+1)) { add(day, mdb.MAIN) }
        for (var day = new Date(end); end.getDay() != 0 && day < tail; day.setDate(day.getDate()+1)) { add(day, mdb.NEXT) }

        return now
    } show(now), can.onlayout.figure(event, can), can.base.isFunc(cbs) && cbs(can)
})}} }, [""])

