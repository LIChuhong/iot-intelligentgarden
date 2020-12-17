import axios from 'axios'
import store from '@/store'
// import { Spin } from 'iview'
import {
	refreshTokenMethod,
	login
} from '@/api/user'
import router from '@/router'
const addErrorLog = errorInfo => {
	const {
		statusText,
		status,
		request: {
			responseURL
		}
	} = errorInfo
	let info = {
		type: 'ajax',
		code: status,
		mes: statusText,
		url: responseURL
	}
	if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}
//是否正在刷新的标记
let isRefreshing = false
//重试队列，每一项将是一个待执行的函数形式
let requests = []

class HttpRequest {
	constructor(baseUrl = baseURL) {
		this.baseUrl = baseUrl
		this.queue = {}
	}
	getInsideConfig() {
		const config = {
			baseURL: this.baseUrl,

			headers: {
				'Accept-Language': 'zh-cn',
				'From': store.state.app.iotInterFace,
				'Token': store.state.user.token
				// 'ContentType':'application/x-www-form-urlencoded;charset=UTF-8',

			}
		}
		return config
	}
	destroy(url) {
		delete this.queue[url]
		if (!Object.keys(this.queue).length) {
			// Spin.hide()
		}
	}
	interceptors(instance, url) {
		// 请求拦截
		instance.interceptors.request.use(config => {
			// 添加全局的loading...
			if (!Object.keys(this.queue).length) {
				// Spin.show() // 不建议开启，因为界面不友好
			}
			this.queue[url] = true
			return config
		}, error => {
			return Promise.reject(error)
		})
		// 响应拦截
		instance.interceptors.response.use(res => {
			this.destroy(url)
			const {
				data,
				status
			} = res
			const config = res.config
			if (data.errorCode === 'IA00000011' || data.errorCode == 'F000000005') {
				
				store.dispatch('handleLogOut', '')
				router.replace({
					path: '/login'
				
				})
// 				if (store.state.app.iotInterFace != 0) {
// 					if (!isRefreshing) {
// 						isRefreshing = true
// 						refreshTokenMethod(store.state.user.refreshToken).then(res1 => {
// 							const data = res1.data
// 							if (data.success == 1) {
// 								store.commit('setToken', data.newAccessToken)
// 								config.baseURL = ''
// 								config.headers['Token'] = data.newAccessToken
// 								requests.forEach(cb => cb(data.newAccessToken))
// 								requests = []
// 								return this.request(config)
// 							} else {
// 								const userName = store.state.user.localLoginInfo.userName
// 								const password = store.state.user.localLoginInfo.password
// 								isRefreshing = false
// 								login(userName, password, '').then(res => {
// 									const data = res.data
// 									if (data.success == 1) {
// 										if (data.refresh_token != null && data.refresh_token != '') {
// 											store.commit('setRefreshToken', data.refresh_token)
// 											store.commit('setToken', data.token)
// 											router.push({
// 												path: '/m_farm'
// 
// 											})
// 										}
// 									} else {
// 										alert(data.errorMessage)
// 										store.dispatch('handleLogOut', '')
// 										router.replace({
// 											path: '/login'
// 
// 										})
// 									}
// 								}).catch(error => {
// 									alert(error)
// 								})
// 							}
// 						}).catch(error => {
// 							alert(error)
// 							store.dispatch('handleLogOut', '')
// 							router.replace({
// 								path: '/login'
// 
// 							})
// 						}).finally(() => {
// 							isRefreshing = false
// 						})
// 
// 					} else {
// 						//正在刷新Token，将返回一个未执行resolve的promise
// 						return new Promise((resolve, reject) => {
// 							requests.push((token) => {
// 								config.baseURL = ''
// 								config.headers['Token'] = token
// 								resolve(config)
// 							})
// 						})
// 					}
// 				} else {
// 					store.dispatch('handleLogOut', '')
// 					router.replace({
// 						path: '/login'
// 
// 					})
// 				}
			}
			return {
				data,
				status
			}

		}, error => {
			this.destroy(url)
			let errorInfo = error.response
			if (!errorInfo) {
				const {
					request: {
						statusText,
						status
					},
					config
				} = JSON.parse(JSON.stringify(error))
				errorInfo = {
					statusText,
					status,
					request: {
						responseURL: config.url
					}
				}
			}
			if (error && error.response) {
				switch (error.response.status) {
					case 400:
						error.message = '请求错误'
						break
					case 401:
						error.message = '未授权，请登录'
						break
					case 403:
						error.message = '拒绝访问'
						break
					case 404:
						error.message = `请求地址出错: ${error.response.config.url}`
						break
					case 408:
						error.message = '请求超时'
						break
					case 500:
						error.message = '服务器内部错误'
						break
					case 501:
						error.message = '服务未实现'
						break
					case 502:
						error.message = '网关错误'
						break
					case 503:
						error.message = '服务不可用'
						break
					case 504:
						error.message = '网关超时'
						break
					case 505:
						error.message = 'HTTP版本不受支持'
						break
					default:
				}
			}
			addErrorLog(errorInfo)
			return Promise.reject(error)
		})
	}
	request(options) {
		const instance = axios.create()
		options = Object.assign(this.getInsideConfig(), options)
		this.interceptors(instance, options.url)
		return instance(options)
	}
}
export default HttpRequest
