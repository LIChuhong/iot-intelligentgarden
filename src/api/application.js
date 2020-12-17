import axios from '@/libs/api.request'

//添加应用信息
export const addAppCheck = (appCheck) => {
	//console.log(vmOrg)
	return axios.request({
		url: '/v1/addAppCheck',
		data: appCheck,
		method: 'post'
	})
}

//更新应用信息
export const updateAppCheck = (appCheck) => {
	//console.log(vmOrg)
	return axios.request({
		url: '/v1/updateAppCheck',
		data: appCheck,
		method: 'post'
	})
}

//获取应用信息
export const getAppCheck = (userId) => {
	return axios.request({
		url: '/v1/getAppCheck',
		params: {
			'userId': userId
		},
		method: 'get'
	})
}

//获取新应用密钥
export const getNewAppSecret = () => {
	return axios.request({
		url: '/v1/getNewAppSecret',
		method: 'get'
	})
}

//获取应用信息列表
export const getAppCheckList = (searchKey, maxId, pageSize) => {
	return axios.request({
		url: '/v1/getAppCheckList',
		params: {
			'searchKey': searchKey,
			'maxId': maxId,
			'pageSize': pageSize
		},
		method: 'get'
	})
}
