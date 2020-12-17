import axios from '@/libs/api.request'
import qs from 'qs'

//添加机器
export const addRtu = (newRtu) => {
	console.log(newRtu)
  return axios.request({
    url: '/v1/addRtu',
		data:newRtu,
    method: 'post'
  })
}

//复制机器
export const copyRtu = (rtuNumber,copyCount) => {
	const data = new URLSearchParams()
	data.append('rtuNumber', rtuNumber)
	data.append('copyCount', copyCount)
  return axios.request({
    url: '/v1/copyRtu',
		data,
    method: 'post'
  })
}

//获取机器信息
export const getRtu = (rtuNumber) => {
  return axios.request({
    url: '/v1/getRtu',
		params:{
			'rtuNumber': rtuNumber
		},
    method: 'get'
  })
}

//更新机器
export const updateRtu = (newRtu) => {
  return axios.request({
    url: '/v1/updateRtu',
		data:newRtu,
    method: 'post'
  })
}

//获取机器列表
export const getRtuList = (keyField,searchKey,maxId,pageSize) => {
  return axios.request({
    url: '/v1/getRtuList',
		params:{
			'keyField': keyField,
			'searchKey': searchKey,
			'maxId': maxId,
			'pageSize': pageSize
		},
    method: 'get'
  })
}

//查询机器实时数据
export const getRtuData = (rtuNumber) => {
  return axios.request({
    url: '/v1/getRtuData',
		params:{
			'rtuNumber': rtuNumber
		},
		method: 'get'
  })
}

//控制设备
export const setRtuData = (rtuData) => {
  return axios.request({
    url: '/v1/setRtuData',
		data:rtuData,
    method: 'post'
  })
}

//获取机器调试信息
export const debugRtu = (rtuNumber) => {
  return axios.request({
    url: '/v1/debugRtu',
  	params:{
  		'rtuNumber': rtuNumber
  	},
  	method: 'get'
  })
}

//清除机器调试信息
export const clearRtuLogs = (rtuNumber) => {
	const data = new URLSearchParams()
	data.append('rtuNumber', rtuNumber)
  return axios.request({
    url: '/v1/clearRtuLogs',
		data,
    method: 'post'
  })
}


//获取机器类型列表
export const getAllRtuTypeList = () => {
  return axios.request({
    url: '/v1/getAllRtuTypeList',
  	method: 'get'
  })
}

//获取设备类型参数
export const getRtuTypeParameterList = (rtuTypeId) => {
  return axios.request({
    url: '/v1/getRtuTypeParameterList',
		params:{
			'rtuTypeId': rtuTypeId
		},
    method: 'get'
  })
}


//启禁用机器
export const isEnableRtu = (rtuNumber,isEnable) => {
	//console.log(vmOrg)
	const data = new URLSearchParams()
	data.append('rtuNumber', rtuNumber)
	data.append('isEnable', isEnable)
  return axios.request({
  	url: '/v1/isEnableRtu',
		data,
  	method: 'post'
  })
}

//远程控制水肥一体机
export const setControlIASFRtu = (iasfRtuOrderData) => {
  return axios.request({
    url: '/v1/setControlIASFRtu',
		data:iasfRtuOrderData,
    method: 'post'
  })
}

//获取水肥一体机运行实况
export const getIASFRtuData = (sfRtuNumber) => {
  return axios.request({
    url: '/v1/getIASFRtuData',
			params:{
			'sfRtuNumber': sfRtuNumber
		},
  	method: 'get'
  })
}

//获取设备参数
export const rtuTypeParameterList = (rtuNumber) => {
  return axios.request({
    url: '/v1/rtuTypeParameterList',
		params:{
			'rtuNumber': rtuNumber
		},
    method: 'get'
  })
}

//获取浇灌器浇水记录
export const getWaterRecordList = (rtuNumber,year,st,et) => {
  return axios.request({
    url: '/v1/getWaterRecordList',
		params:{
			'rtuNumber': rtuNumber,
			'year': year,
			'st': st,
			'et': et,
		},
    method: 'get'
  })
}



//获取设备参数
export const controlYsOpen = (accessToken,deviceSerial,channelNo,direction,speed) => {
	// alert(1)
	// axios.baseUrl = ''
	// console.log(axios)
	// const data = new URLSearchParams()
	// data.append('accessToken', accessToken)
	// data.append('deviceSerial', deviceSerial)
	// data.append('channelNo', channelNo)
	// data.append('direction', direction)
	// data.append('speed', speed)
	const data = {
		'accessToken': accessToken,
		'deviceSerial': deviceSerial,
		'channelNo': channelNo,
		'direction':direction,
		'speed':speed
	}
  return  axios.request({
    url: 'https://open.ys7.com/api/lapp/device/ptz/start',
		data:qs.stringify(data),
    method: 'post'
  })
}



