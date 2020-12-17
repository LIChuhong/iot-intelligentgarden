import axios from '@/libs/api.request'

export const login = ( userName, password, verCode ) => {
  let data = new URLSearchParams()
  let url = ''
  if (verCode == '' || verCode == null) {
  	data.append('userName', userName)
  	data.append('password', password)
  	url = '/v1/mLogin'
  } else {
  	data.append('userName', userName)
  	data.append('password', password)
  	data.append('verCode', verCode)
  	url = '/v1/login'
  }
  return axios.request({
  	url: url,
  	data,
  	method: 'post',
  	withCredentials: true
  })
}

export const getUserInfo = (token) => {
	// console.log(token)
  return axios.request({
    url: '/v1/get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

//刷新Token
export const refreshTokenMethod = (refreshToken) => {
	let data = new URLSearchParams()
	data.append('refresh_token', refreshToken)
  return axios.request({
    url: '/v1/refreshRefreshToken',
		data,
    method: 'post'
  })
}

//获取用户角色列表
export const getUserRolesList = () => {
	return axios.request({
		url: '/v1/getUserRolesList',
		method: 'get'
	})
}

//添加用户
export const addUser = (iaUser) => {
	//console.log(vmUser)
	return axios.request({
		url: '/v1/addUser',
		data: iaUser,
		method: 'post'
	})
}

//更新用户信息
export const updateUser = (iaUser) => {
	//console.log(vmUser)
	return axios.request({
		url: '/v1/updateUser',
		data: iaUser,
		method: 'post'
	})
}

//获取用户信息
export const getUser = (id) => {
	//console.log(typeof(vmUserId))
	id = parseInt(id)
	return axios.request({
		url: '/v1/getUser',
		params: {
			'id': id
		},
		method: 'get'
	})
}

//获取用户列表
export const getUserList = (searchKey, maxId, pageSize) => {
	return axios.request({
		url: '/v1/getUserList',
		params: {
			'searchKey': searchKey,
			'maxId': maxId,
			'pageSize': pageSize
		},
		method: 'get'
	})
}

//重置用户密码
export const reSetPassword = (iaUserId, newPassword) => {
	//console.log(vmUser)
	const data = new URLSearchParams()
	data.append('iaUserId', iaUserId)
	data.append('newPassword', newPassword)
	return axios.request({
		url: '/v1/reSetPassword',
		data,
		method: 'post'
	})
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
