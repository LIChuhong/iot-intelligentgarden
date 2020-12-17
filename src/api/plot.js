import axios from '@/libs/api.request'

//添加地块
export const addMassif = (iaMassif) => {
	//console.log(vmOrg)
  return axios.request({
  	url: '/v1/addMassif',
		data:iaMassif,
  	method: 'post'
  })
}

//更新地块
export const updateMassif = (iaMassif) => {
	//console.log(vmOrg)
  return axios.request({
  	url: '/v1/updateMassif',
		data:iaMassif,
  	method: 'post'
  })
}

//获取地块详情
export const getMassif = (id) => {
	return axios.request({
		url: '/v1/getMassif',
		params: {
			'id':id
		},
		method: 'get'
	})
}

//获取地块列表
export const getMassifList = (massifName,maxId,pageSize) => {
	return axios.request({
		url: '/v1/getMassifList',
		params:{
			'massifName':massifName,
			'maxId':maxId,
			'pageSize':pageSize
		},
		method: 'get'
	})
}

//添加画面数据
export const addIABigDataMap = (iaBigDataMap) => {
	//console.log(vmOrg)
  return axios.request({
  	url: '/v1/addIABigDataMap',
		data:iaBigDataMap,
  	method: 'post'
  })
}

//更新画面数据
export const updateIABigDataMap = (iaBigDataMap) => {
	//console.log(vmOrg)
  return axios.request({
  	url: '/v1/updateIABigDataMap',
		data:iaBigDataMap,
  	method: 'post'
  })
}

//获取画面数据列表
export const getIABigDataMapList = (mapName,maxId,pageSize) => {
	return axios.request({
		url: '/v1/getIABigDataMapList',
		params:{
			'mapName':mapName,
			'maxId':maxId,
			'pageSize':pageSize
		},
		method: 'get'
	})
}

//获取画面数据详情
export const getIABigDataMap = (id) => {
	return axios.request({
		url: '/v1/getIABigDataMap',
		params:{
			'id':id
		},
		method: 'get'
	})
}

//获取默认画面数据
export const getDefaultIABigDataMap = () => {
	return axios.request({
		url: '/v1/getDefaultIABigDataMap',
		method: 'get'
	})
}

//地块规划
export const updateIAMassifsMap = (iaMassifsMap) => {
	//console.log(vmOrg)
  return axios.request({
  	url: '/v1/updateIAMassifsMap',
		data:iaMassifsMap,
  	method: 'post'
  })
}

//获取数据画面列表
export const getIAVideoList = (iaBigDataMapId) => {
	return axios.request({
		url: '/v1/getIAVideoList',
		params:{
			'iaBigDataMapId':iaBigDataMapId
		},
		method: 'get'
	})
}

//获取地块土壤数据
export const getMassifSoilData = (massifId) => {
	return axios.request({
		url: '/v1/getMassifSoilData',
		params:{
			'massifId':massifId
		},
		method: 'get'
	})
}

//获取农场气象数据
export const getFarmWeatherData = (iaBigDataMapId) => {
	return axios.request({
		url: '/v1/getFarmWeatherData',
		params:{
			'iaBigDataMapId':iaBigDataMapId
		},
		method: 'get'
	})
}

//14.获取农场近日重要参数数据
export const getNearlyDayImportParaDataList = (wsRtuNumber,iaMassifId) => {
	return axios.request({
		url: '/v1/getNearlyDayImportParaDataList',
		params:{
			'wsRtuNumber':wsRtuNumber,
			'iaMassifId':iaMassifId
		},
		method: 'get'
	})
}