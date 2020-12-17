<template>
	<Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
		<FormItem prop="userName">
			<Input v-model="form.userName" placeholder="请输入用户名">
			<span slot="prepend">
				<Icon :size="16" type="ios-person"></Icon>
			</span>
			</Input>
		</FormItem>
		<FormItem prop="password">
			<Input type="password" v-model="form.password" placeholder="请输入密码">
			<span slot="prepend">
				<Icon :size="16" type="md-lock"></Icon>
			</span>
			</Input>
		</FormItem>
		<FormItem prop="verCode">
			<Input v-model="form.verCode" placeholder="请输入验证码">
			<div slot="append" @click="changeCode">
				<!-- fdjdjd -->
				<img ref="verCodeRef" :src="verCodeSrc" alt="" width="60px" height="20px">
				<!-- <Icon :size="14" type="md-lock"></Icon> -->
			</div>
			</Input>
		</FormItem>
		<FormItem>
			<Button @click="handleSubmit" type="primary" long>登录</Button>
		</FormItem>
	</Form>
</template>
<script>
	//import config from '@/config'
	import {
		verifyCode
	} from '@/api/user'
	export default {
		name: 'LoginForm',
		props: {
			userNameRules: {
				type: Array,
				default: () => {
					return [{
						required: true,
						message: '账号不能为空',
						trigger: 'blur'
					}]
				}
			},
			passwordRules: {
				type: Array,
				default: () => {
					return [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}]
				}
			},
			verCodeRules: {
				type: Array,
				default: () => {
					return [{
						required: true,
						message: '验证码不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		data() {
			return {
				verCodeSrc: this.$config.baseUrl.dev + '/verifyCode?from=3',
				// verCodeSrc:'',
				form: {
					 userName: '',
					password: '',
					verCode: ''
				}
			}
		},
		computed: {
			rules() {
				return {
					userName: this.userNameRules,
					password: this.passwordRules,
					verCode: this.verCodeRules
				}
			}
		},
		methods: {
			changeCode() {
				//alert(this.$config. baseUrl.dev)
				this.verCodeSrc = this.$config.baseUrl.dev + '/verifyCode?from=3&rend=' + Math.random()
				// verifyCode().then(res=>{
				// 	const data = res.data
				// 	// console.log(data)
				// 	this.verCodeSrc = data
				// })

			},
			handleSubmit() {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						this.$emit('on-success-valid', {
							userName: this.form.userName,
							password: this.form.password,
							verCode: this.form.verCode
						})
					}
				})
			}
		},
		mounted() {

			this.changeCode()
		},
		// created() {
		// 	
		// }

	}
</script>
