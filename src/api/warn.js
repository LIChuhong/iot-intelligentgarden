import axios from '@/libs/api.request'

//添加告警
export const addParameterWarnInfo = (parameterWarnInfo) => {
	//console.log(vmOrg)
	return axios.request({
		url: '/v1/addParameterWarnInfo',
		data: parameterWarnInfo,
		method: 'post'
	})
}

//3.更新告警信息
export const updateParameterWarnInfo = (parameterWarnInfo) => {
	//console.log(vmOrg)
	return axios.request({
		url: '/v1/updateParameterWarnInfo',
		data: parameterWarnInfo,
		method: 'post'
	})
}

//删除告警关联
export const delRtuParamWarn = (rtuNumber) => {
	const data = new URLSearchParams()
	data.append('rtuNumber', rtuNumber)
	//console.log(vmOrg)
	return axios.request({
		url: '/v1/deleteRtuParameterWarnRelationList',
		data,
		method: 'post'
	})
}
//获取合作信息
// export const getOrg = (id) => {
// 	return axios.request({
// 		url: '/v1/getOrg',
// 		params: {
// 			'id':id
// 		},
// 		method: 'get'
// 	})
// }

//获取告警列表
export const getParameterWarnInfoList = (warnName, maxId, pageSize) => {
	return axios.request({
		url: '/v1/getParameterWarnInfoList',
		params: {
			'warnName': warnName,
			'maxId': maxId,
			'pageSize': pageSize
		},
		method: 'get'
	})
}


//参数关联
export const updateRtuParamWarnRelList = (rtuParameterWarnRelationList) => {
	//console.log(vmOrg)
	return axios.request({
		url: '/v1/updateRtuParameterWarnRelationList',
		data: rtuParameterWarnRelationList,
		method: 'post'
	})
}

//获取设备参数
export const rtuTypeParameterList = (rtuNumber) => {
	return axios.request({
		url: '/v1/rtuTypeParameterList',
		params: {
			'rtuNumber': rtuNumber
		},
		method: 'get'
	})
}

//获取设备告警详情
export const getRtuParamWarnRelDetList = (rtuNumber) => {
	return axios.request({
		url: '/v1/getRtuParameterWarnRelationDetailsList',
		params: {
			'rtuNumber': rtuNumber
		},
		method: 'get'
	})
}

//获取告警设备
export const warnRtuList = (rtuName, maxId, pageSize) => {
	return axios.request({
		url: '/v1/warnRtuList',
		params: {
			'rtuName': rtuName,
			'maxId': maxId,
			'pageSize': pageSize
		},
		method: 'get'
	})
}