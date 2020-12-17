import {
	login,
	logout,
	getUserInfo,
	getMessage,
	getContentByMsgId,
	hasRead,
	removeReaded,
	restoreTrash,
	getUnreadCount
} from '@/api/user'
import {
	setToken,
	getToken,
	setTagNavListInLocalstorage,
	setRefreshTokenLocalstorage,
	getRefreshTokenLocalstorage,
	getLoginInfoLocalStorage,
	setLoginInfoLocalStorage
	
} from '@/libs/util'

export default {
	state: {
		refreshToken: getRefreshTokenLocalstorage(),
		localLoginInfo:getLoginInfoLocalStorage(),
		userInfo: '',
		userName: '',
		userId: '',
		avatarImgPath: '',
		token: getToken(),
		access: '',
		hasGetInfo: false,
		unreadCount: 0,
		messageUnreadList: [],
		messageReadedList: [],
		messageTrashList: [],
		messageContentStore: {}
	},
	mutations: {
		setLoginInfo(state,localLoginInfo) {
			state.localLoginInfo = localLoginInfo
		},
		setRefreshToken(state,refreshToken) {
			state.refreshToken = refreshToken
		},
		setUserInfo(state, user) {
			state.userInfo = user
		},
		setAvatar(state, avatarPath) {
			state.avatarImgPath = avatarPath
		},
		setUserId(state, id) {
			state.userId = id
		},
		setUserName(state, name) {
			state.userName = name
		},
		setAccess(state, access) {
			state.access = access
		},
		setToken(state, token) {
			state.token = token
			setToken(token)
		},
		setHasGetInfo(state, status) {
			state.hasGetInfo = status
		},
		setMessageCount(state, count) {
			state.unreadCount = count
		},
		setMessageUnreadList(state, list) {
			state.messageUnreadList = list
		},
		setMessageReadedList(state, list) {
			state.messageReadedList = list
		},
		setMessageTrashList(state, list) {
			state.messageTrashList = list
		},
		updateMessageContentStore(state, {
			msg_id,
			content
		}) {
			state.messageContentStore[msg_id] = content
		},
		moveMsg(state, {
			from,
			to,
			msg_id
		}) {
			const index = state[from].findIndex(_ => _.msg_id === msg_id)
			const msgItem = state[from].splice(index, 1)[0]
			msgItem.loading = false
			state[to].unshift(msgItem)
		}
	},
	getters: {
		messageUnreadCount: state => state.messageUnreadList.length,
		messageReadedCount: state => state.messageReadedList.length,
		messageTrashCount: state => state.messageTrashList.length
	},
	actions: {
		// 登录
		handleLogin({
			commit
		}, {
			userName,
			password,
			verCode
		}) {
			console.log(userName,password)
			setTagNavListInLocalstorage([])
			userName = userName.trim()
			return new Promise((resolve, reject) => {
				login(
					userName,
					password,
					verCode
				).then(res => {
					const data = res.data
					// console.log(data)
					if(data.success == 1){
						setLoginInfoLocalStorage(userName,password)
						// commit('setLoginInfo', data.refresh_token)
						if (data.refresh_token != null && data.refresh_token != '') {
							// setRefreshTokenLocalstorage(data.refresh_token)
							// console.log(getRefreshTokenLocalstorage())
							commit('setRefreshToken', data.refresh_token)
						}
					}
					commit('setToken', data.token)
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			})
		},
		// 退出登录
		handleLogOut({
			state,
			commit
		}) {
			return new Promise((resolve, reject) => {
				// logout(state.token).then(() => {
				//   commit('setToken', '')
				//   commit('setAccess', [])
				//   resolve()
				// }).catch(err => {
				//   reject(err)
				// })
				// 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
				commit('setToken', '')
				commit('setAccess', [])
				setTagNavListInLocalstorage([])
				resolve()
			})
		},
		// 获取用户相关信息
		getUserInfo({
			state,
			commit
		}) {
			// console.log(1)
			return new Promise((resolve, reject) => {

				try {
					getUserInfo(state.token).then(res => {
						const data = res.data

						if (data.success == 1) {
							const user = data.user
							// console.log(data)
							commit('setUserInfo', user)
							commit('setAvatar', user.userHeadImgUrl)
							// commit('setUserBelongOrgId', user.belongOrgId)
							commit('setUserId', user.id)
							commit('setUserName', user.userName)
							commit('setAccess', data.access)
							commit('setHasGetInfo', true)
							commit('setMessageCount', user.news) //判断是不是有新信息

						} else {
							// alert(errorMessage)
						}
						resolve(data)
					}).catch(err => {
						reject(err)
					})
				} catch (error) {
					reject(error)
				}
			})
		},
	}

}
