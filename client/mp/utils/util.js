const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function Number(d, n) {var result = [];
    while (d>0) {result.push(d % 10); d = parseInt(d / 10); n--}
    while (n > 0) {result.push("0"); n--}
    result.reverse();
    return result.join("");
}
function Time(t, fmt) {var now = t? new Date(t): new Date();
    fmt = fmt || "%y-%m-%d %H:%M:%S";
    fmt = fmt.replace("%y", now.getFullYear())
    fmt = fmt.replace("%m", Number(now.getMonth()+1, 2))
    fmt = fmt.replace("%d", Number(now.getDate(), 2))
    fmt = fmt.replace("%H", Number(now.getHours(), 2))
    fmt = fmt.replace("%M", Number(now.getMinutes(), 2))
    fmt = fmt.replace("%S", Number(now.getSeconds(), 2))
    return fmt
}
function Args(url, args) {var list = []
    for (var k in args) {
        list.push(encodeURIComponent(k)+"="+encodeURIComponent(args[k]))
    }
    return url+"?"+list.join("&")
}

module.exports = {
    formatTime: formatTime,
    Time: Time,
    Args: Args,
}
