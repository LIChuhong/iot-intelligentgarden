<template>
	<div>
		<p class="appStyle">
			<span>应用名称：</span>
			<Input style="width: 70%;" v-model="appCheck.appName" placeholder="请输入应用名称" :maxlength="30"></Input>
		</p>
		<div v-show="appText =='修改'">
		<p class="appStyle"><span>AppKey：{{appCheck.appKey}}</span></p>
		<p class="appStyle"><span>AppSecret：{{appCheck.appSecret}}</span> <Button style="margin-left: 24px;" type="primary" @click="getNewAppSecretMethed">重置</Button></p>
		<p class="appStyle"><span>创建时间：{{appCheck.createTime}}</span></p>
		<p class="appStyle"><span>更新时间：{{appCheck.updateTime}}</span></p>
		<p class="appStyle"><span>启禁用：<Checkbox v-model="appCheck.enable"></Checkbox></span></p>
		</div>
		<div style="text-align: center;">
			<Button v-show="appText =='添加' " type="primary" @click="addAppMethod">{{appText}}</Button>
			<Button v-show="appText =='修改' " type="primary" @click="updateAppMethod">{{appText}}</Button>
		</div>
	</div>
</template>

<script>
	import {
		addAppCheck,
		updateAppCheck,
		getAppCheck,
		getNewAppSecret
	} from '@/api/application.js'
	export default {
		props:['userId'],
		data() {
			return {
				appCheck: {
					appName: '',
					appText: '添加'
				}
			}
		},
		methods: {
			addAppMethod(){
				if(this.appCheck.appName == null || this.appCheck.appName.trim() == ''){
					alert('应用名称不能为空')
					return
				}
				var userId = this.$store.state.user.userInfo.id
				var appCheck = {
					appName: this.appCheck.appName,
					userId: userId
				}
				addAppCheck(appCheck).then(res => {
					const data = res.data
					if (data.success == 1) {
						this.getAppCheckInfo(userId)
						this.$Message.success('应用信息创建成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			updateAppMethod() {
				if(this.appCheck.appName == null || this.appCheck.appName.trim() == ''){
					alert('应用名称不能为空')
					return
				}
				var appCheck = {
					appName: this.appCheck.appName,
					appSecret: this.appCheck.appSecret,
					enable:this.appCheck.enable,
					userId: this.appCheck.userId
				}
				updateAppCheck(appCheck).then(res => {
					const data = res.data
					if (data.success == 1) {
						this.$Message.success('应用信息修改成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})

			},
			getNewAppSecretMethed() {
				getNewAppSecret().then(res => {
					const data = res.data
					if (data.success == 1) {
						if (data.newAppSecret) {
							this.appCheck.appSecret = data.newAppSecret
							this.$Message.success('AppSecret新秘钥重置成功')
						}

					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			getAppCheckInfo(userId) {
				// var userId = this.$store.state.user.userInfo.id
				getAppCheck(userId).then(res => {
					const data = res.data
					if (data.success == 1) {
						console.log(data)
						if (data.appCheck != null && data.appCheck != '') {
							this.appCheck = data.appCheck
							this.appText = '修改'
						} else {
							this.appText = '创建'
						}
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			}
		},
		mounted() {
			var userId = this.$store.state.user.userInfo.id 
			if(this.userId != null && this.userId != ''){
				userId = this.userId
			}
			this.getAppCheckInfo(userId)
		}
	}
</script>

<style>
	.appStyle {
		margin-bottom: 24px;
	}
</style>
