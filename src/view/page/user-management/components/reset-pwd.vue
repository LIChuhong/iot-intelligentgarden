<template>
	<Form ref="pwdModel" :model="pwdModel" :rules="pwdRule" :label-width="100">
		<FormItem label="新密码" prop="passwd">
			<Input type="password" v-model="pwdModel.passwd"></Input>
		</FormItem>
		<FormItem label="确认新密码" prop="passwdCheck">
			<Input type="password" v-model="pwdModel.passwdCheck"></Input>
		</FormItem>

		<FormItem>
			
			<Button @click="handleReset('pwdModel')">重置</Button>
			<Button type="primary" @click="handleSubmit('pwdModel')" style="margin-left: 8px">修改</Button>

		</FormItem>

	</Form>
</template>

<script>
	import {
		reSetPassword
	} from '@/api/user'
	export default {
		name: 'reset_pwd',
		props: {
			userId: {
				type: Number
			}
		},
		data() {
			const validatePassword = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback(new Error('密码不能为空'));
				} else if (value.length < 6 || value.length > 18) {
					return callback(new Error('密码不能少于6个字符或大于18个字符'));
				} else {
					if (this.pwdModel.passwdCheck !== '') {
						// 对第二个密码框单独验证
						this.$refs.pwdModel.validateField('passwdCheck');
					}
					callback();
				}
			};
			const validateAgainPwd = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback('请再次确认密码');
				} else if (value != this.pwdModel.passwd) {
					callback('两次密码不匹配，请重新输入');
				} else {
					callback();
				}
			};
			return {
				pwdModel: {
					passwd: '',
					passwdCheck: ''
				},
				pwdRule: {
					passwd: [{
						required: true,
						validator: validatePassword,
						trigger: 'blur'
					}],
					passwdCheck: [{
						required: true,
						validator: validateAgainPwd,
						trigger: 'blur'
					}],
				}
			}
		},
		methods: {
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						const newPassword = this.pwdModel.passwd
						if (this.userId != null && this.userId != '') {
							reSetPassword(this.userId, newPassword).then(res => {
								const data = res.data
								if (data.success == 1) {
									this.$Message.success('修改成功');

								} else {
									this.$Message.error(data.Message);
								}
							}).catch(error => {
								alert(error)
							})
						} else {
							this.$Message.error('修改失败')
						}


						//console.log(this.vmUser)
					} else {
						this.$Message.error('Fail!');
					}
				})
			},
			handleReset(name) {
				this.$refs[name].resetFields();
			}
		}
	}
</script>

<style>
</style>
