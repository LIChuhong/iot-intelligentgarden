import axios from '@/libs/api.request'

//消息列表
export const getMessageList = (pageNo, pageSize) => {
	return axios.request({
		url: '/v1/getMessageList',
		params: {
			'pageNo':pageNo,
			'pageSize': pageSize
		},
		method: 'get'
	})
}

//阅读消息
export const enableMessage = (id) => {
	//console.log(vmOrg)
	const data = new URLSearchParams()
	data.append('id', id)
	return axios.request({
		url: '/v1/enableMessage',
		data: data,
		method: 'post'
	})
}

//删除消息
export const delMessage = (id) => {
	//console.log(vmOrg)
	const data = new URLSearchParams()
	data.append('id', id)
	return axios.request({
		url: '/v1/delMessage',
		data: data,
		method: 'post'
	})
}

//获取组织消息列表
export const getOrgMessageList = (orgId) => {
	return axios.request({
		url: '/v1/getOrgMessageList',
		params: {
			'orgId':orgId,
		},
		method: 'get'
	})
}

//获取地块告警消息列表
export const getMassifWarnMessageList = (massifId) => {
	return axios.request({
		url: '/v1/getMassifWarnMessageList',
		params: {
			'massifId':massifId,
		},
		method: 'get'
	})
}