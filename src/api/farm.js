import axios from '@/libs/api.request'

//添加农场
export const addMap = (map) => {
	// console.log(newRtu)
  return axios.request({
    url: '/v1/addMap',
	data:map,
    method: 'post'
  })
}

//修改农场
export const updateMap = (newMap) => {
	// console.log(newRtu)
  return axios.request({
    url: '/v1/updateMap',
	data:newMap,
    method: 'post'
  })
}

//删除农场
export const delMap = (id) => {
	// console.log(newRtu)
	const data = new URLSearchParams()
	data.append('id', id)
  return axios.request({
    url: '/v1/delMap',
	data,
    method: 'post'
  })
}


//农场列表
export const getMapList = (orgId) => {
	// console.log(newRtu)
  return axios.request({
    url: '/v1/getMapList',
	params:{
		'orgId': orgId
	},
    method: 'get'
  })
}

//获取农场信息
export const getMap = (id) => {
	// console.log(newRtu)
  return axios.request({
    url: '/v1/getMap',
	params:{
		'id': id
	},
    method: 'get'
  })
}

//获取组织最顶农场信息
export const getTopMap = (orgId) => {
	// console.log(newRtu)
  return axios.request({
    url: '/v1/getTopMap',
	params:{
		'orgId': orgId
	},
    method: 'get'
  })
}

//获取农场数据
export const getMapData = (mapId) => {
	// console.log(newRtu)
  return axios.request({
    url: '/v1/getMapData',
	params:{
		'mapId': mapId
	},
    method: 'get'
  })
}