import axios from '@/libs/api.request'


//添加合作
export const addOrg = (newOrg) => {
	//console.log(vmOrg)
  return axios.request({
  	url: '/v1/addOrg',
		data:newOrg,
  	method: 'post'
  })
}

//3.更新合作信息
export const updateOrg = (newOrg) => {
	//console.log(vmOrg)
  return axios.request({
  	url: '/v1/updateOrg',
		data:newOrg,
  	method: 'post'
  })
}

//获取合作信息
export const getOrg = (id) => {
	return axios.request({
		url: '/v1/getOrg',
		params: {
			'id':id
		},
		method: 'get'
	})
}

//获取组织列表
export const getOrgList = (orgName,maxId,pageSize) => {
	return axios.request({
		url: '/v1/getOrgList',
		params:{
			'orgName':orgName,
			'maxId':maxId,
			'pageSize':pageSize
		},
		method: 'get'
	})
}

//获取子组织列表
export const getOrgChildrenList = () => {
	return axios.request({
		url: '/v1/getOrgChildrenList',
		method: 'get'
	})
}

//获取子合作代理
export const getVMOrgChildrenList = (orgTypeId) => {
	return axios.request({
		url: '/api2.0/getVMOrgChildrenList',
		params: {
			'orgTypeId':orgTypeId
		},
		method: 'get'
	})
}

//获取组织类型列表
export const getAllOrgTypeList = () => {
	return axios.request({
		url: '/v1/getAllOrgTypeList',
		method: 'get'
	})
}

//启禁用组织
export const isEnableOrg = (id,isEnable) => {
	//console.log(vmOrg)
	const data = new URLSearchParams()
	data.append('id', id)
	data.append('isEnable', isEnable)
  return axios.request({
  	url: '/v1/isEnableOrg',
		data,
  	method: 'post'
  })
}

