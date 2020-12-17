import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}

export const getMenuList = () => {
	console.log(1)
  return axios.request({
    url: '/v1/getMenuList',
    method: 'get'
  })
}

