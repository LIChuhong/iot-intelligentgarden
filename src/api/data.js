import axios from '@/libs/api.request'

//消息列表
export const getMessageList = (pageNo,pageSize) => {
  return axios.request({
    url: '/v1/getMessageList',
		params:{
			'pageNo':pageNo,
			'pageSize':pageSize
		},
    method: 'get'
  })
}

//阅读消息
export const enableMessage = (id) => {
	const data = new URLSearchParams()
	data.append('id', id)
  return axios.request({
  	url: '/v1/enableMessage',
		data,
  	method: 'post'
  })
}


//删除消息
export const delMessage = (id) => {
	const data = new URLSearchParams()
	data.append('id', id)
  return axios.request({
  	url: '/v1/delMessage',
		data,
  	method: 'post'
  })
}

