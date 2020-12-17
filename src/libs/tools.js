export const forEach = (arr, fn) => {
	if (!arr.length || !fn) return
	let i = -1
	let len = arr.length
	while (++i < len) {
		let item = arr[i]
		fn(item, i, arr)
	}
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
	let len = Math.min(arr1.length, arr2.length)
	let i = -1
	let res = []
	while (++i < len) {
		const item = arr2[i]
		if (arr1.indexOf(item) > -1) res.push(item)
	}
	return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
	return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
	return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value, validList) {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true
		}
	}
	return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
	const timeStr = String(timeStamp)
	return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
	return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
	return num < 10 ? '0' + num : num
}

/**
 * @param {signalValue} 信号数值 数值
 * @returns {String} 处理后的字符图标
 */
export const getSignal = (signalValue) => {
	let signal = ''
	if (signalValue >= -85) {
		signal = " iconfont icon-signal4"
	} else if (signalValue >= -95 && signalValue < -85) {
		signal = " iconfont icon-signal3"
	} else if (signalValue >= -105 && signalValue < -95) {
		signal = " iconfont icon-signal2"
	} else if (signalValue >= -115 && signalValue < -105) {
		signal = " iconfont icon-signal1"
	} else if (signalValue >= -140 && signalValue < -115) {
		signal = " iconfont icon-signal0"
	} else {
		signal = ''
	}
	return signal
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
	const d = new Date(timeStamp * 1000)
	const year = d.getFullYear()
	const month = getHandledValue(d.getMonth() + 1)
	const date = getHandledValue(d.getDate())
	const hours = getHandledValue(d.getHours())
	const minutes = getHandledValue(d.getMinutes())
	const second = getHandledValue(d.getSeconds())
	let resStr = ''
	if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
	else resStr = month + '-' + date + ' ' + hours + ':' + minutes
	return resStr
}

/**
 * @param {String} date 传入的日期
 * @param {String} seperator1 要返回的时间字符串的间隔字符
 */
export const getNowFormatDate = (date, seperator1) => { //日期格式化

	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;

	return currentdate;
}

//日期时间格式化
export const getNowFormatDateTime = (date, seperator1) => { //日期格式化
	// console.log(date)
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + h + ':' + m + ':' + s;

	return currentdate;
}

//时间戳为10位需*1000，时间戳为13位的话不需乘1000
export const timestampToTime = timestamp => {
	var date = null
	if (timestamp.toString().length > 10) {
		date = new Date(timestamp)
	} else {
		date = new Date(timestamp * 1000);
	}
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return Y + M + D + h + m + s;
}

//时间戳为10位需*1000，时间戳为13位的话不需乘1000
export const timestampToTimeMethod = (timestamp, timeType) => {
	var date = null
	if (timestamp.toString().length > 10) {
		date = new Date(timestamp)
	} else {
		date = new Date(timestamp * 1000);
	}
	// var val = ''
	var Y = date.getFullYear();
	var M = date.getMonth() + 1;
	var D = date.getDate();
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	if (timeType == 'year') {
		return M
	} else if (timeType == 'month') {
		return M+'/'+D
	} else if (timeType == 'hours') {
		return h +':' + m
	} else {
		return Y + M + D + h + m + s;
	}
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
	// 判断当前传入的时间戳是秒格式还是毫秒
	const IS_MILLISECOND = isMillisecond(timeStamp)
	// 如果是毫秒格式则转为秒格式
	if (IS_MILLISECOND) Math.floor(timeStamp /= 1000)
	// 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
	timeStamp = Number(timeStamp)
	// 获取当前时间时间戳
	const currentTime = Math.floor(Date.parse(new Date()) / 1000)
	// 判断传入时间戳是否早于当前时间戳
	const IS_EARLY = isEarly(timeStamp, currentTime)
	// 获取两个时间戳差值
	let diff = currentTime - timeStamp
	// 如果IS_EARLY为false则差值取反
	if (!IS_EARLY) diff = -diff
	let resStr = ''
	const dirStr = IS_EARLY ? '前' : '后'
	// 少于等于59秒
	if (diff <= 59) resStr = diff + '秒' + dirStr
	// 多于59秒，少于等于59分钟59秒
	else if (diff > 59 && diff <= 3599) resStr = Math.floor(diff / 60) + '分钟' + dirStr
	// 多于59分钟59秒，少于等于23小时59分钟59秒
	else if (diff > 3599 && diff <= 86399) resStr = Math.floor(diff / 3600) + '小时' + dirStr
	// 多于23小时59分钟59秒，少于等于29天59分钟59秒
	else if (diff > 86399 && diff <= 2623859) resStr = Math.floor(diff / 86400) + '天' + dirStr
	// 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
	else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) resStr = getDate(timeStamp)
	else resStr = getDate(timeStamp, 'year')
	return resStr
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
	const ua = window.navigator.userAgent
	const isExplorer = (exp) => {
		return ua.indexOf(exp) > -1
	}
	if (isExplorer('MSIE')) return 'IE'
	else if (isExplorer('Firefox')) return 'Firefox'
	else if (isExplorer('Chrome')) return 'Chrome'
	else if (isExplorer('Opera')) return 'Opera'
	else if (isExplorer('Safari')) return 'Safari'
}

/**
 * 秒数转时分秒
 * @returns {String} 当前浏览器名称
 */
export const formatSeconds = (value) => {
	var secondTime = parseInt(value); // 秒
	var minuteTime = 0; // 分
	var hourTime = 0; // 小时
	if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = parseInt(secondTime / 60);
		//获取秒数，秒数取佘，得到整数秒数
		secondTime = parseInt(secondTime % 60);
		//如果分钟大于60，将分钟转换成小时
		if (minuteTime > 60) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = parseInt(minuteTime / 60);
			//获取小时后取佘的分，获取分钟除以60取佘的分
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	var result = "" + parseInt(secondTime);

	if (minuteTime > 0) {
		result = "" + parseInt(minuteTime) + ":" + result;
	} else {
		result = "" + '00' + ":" + result;
	}
	if (hourTime > 0) {
		result = "" + parseInt(hourTime) + ":" + result;
	} else {
		result = "" + '00' + ":" + result;
	}
	return result;
}

/**
 * 秒数转时分秒
 * @returns {String} 当前浏览器名称
 */
export const formatSeconds1 = (value) => {
	var secondTime = parseInt(value); // 秒
	var minuteTime = 0; // 分
	var hourTime = 0; // 小时
	if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = parseInt(secondTime / 60);
		//获取秒数，秒数取佘，得到整数秒数
		secondTime = parseInt(secondTime % 60);
		//如果分钟大于60，将分钟转换成小时
		if (minuteTime > 60) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = parseInt(minuteTime / 60);
			//获取小时后取佘的分，获取分钟除以60取佘的分
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	var result = "" + parseInt(secondTime) + "秒";

	if (minuteTime > 0) {
		result = "" + parseInt(minuteTime) + "分" + result;
	} else {
		result = "" + '0' + "分" + result;
	}
	if (hourTime > 0) {
		result = "" + parseInt(hourTime) + "时" + result;
	} else {
		result = "" + '0' + "时" + result;
	}
	return result;
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
	if (document.addEventListener) {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.addEventListener(event, handler, false)
			}
		}
	} else {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.attachEvent('on' + event, handler)
			}
		}
	}
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
	if (document.removeEventListener) {
		return function(element, event, handler) {
			if (element && event) {
				element.removeEventListener(event, handler, false)
			}
		}
	} else {
		return function(element, event, handler) {
			if (element && event) {
				element.detachEvent('on' + event, handler)
			}
		}
	}
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
	if (key) return key in obj
	else {
		let keysArr = Object.keys(obj)
		return keysArr.length
	}
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
	const keysArr1 = Object.keys(obj1)
	const keysArr2 = Object.keys(obj2)
	if (keysArr1.length !== keysArr2.length) return false
	else if (keysArr1.length === 0 && keysArr2.length === 0) return true
	/* eslint-disable-next-line */
	else return !keysArr1.some(key => obj1[key] != obj2[key])
}
