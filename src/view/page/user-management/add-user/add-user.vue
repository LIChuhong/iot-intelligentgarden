<template>
	<div class="userFormStyle">
		<Form ref="userForm" :model="userForm" :rules="userRule" :label-width="90" :label-colon="true" label-position="left">
			<FormItem label="用户名" prop="userName">
				<Input :maxlength="100" type="text" v-model="userForm.userName" placeholder="请输入用户名">
				</Input>
			</FormItem>
			<FormItem label="密码" prop="password">
				<Input :maxlength="18" type="password" v-model="userForm.password" placeholder="请输入密码">
				</Input>
			</FormItem>
			<FormItem label="确认密码" prop="againPwd">
				<Input type="password" v-model="userForm.againPwd" placeholder="请再次输入密码">
				</Input>
			</FormItem>
			<FormItem label="用户角色" prop="userRolesId">
				<RadioGroup v-model="userForm.userRolesId">
					<Radio v-for="item in userRolesList" :key="item.id" :label="item.id">{{item.userRolesName}}</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-if="$store.state.app.iotInterFace == 0" label="用户头像" prop="userHeadImgUrl">
				<Upload type="drag" ref="upload" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']"
				 :max-size="50" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="uploadAction" style="display: inline-block;width:100px;float: left;"
				 :headers="uploadHeaders" :on-error="handleError">
					<div style="width: 100px;height:100px;line-height: 100px;">
						<Icon type="ios-camera" size="20"></Icon>
						<img :src="userForm.userHeadImgUrl" style="height: 100%;width: 100%;position: absolute;top:0;left: 0;" />
					</div>
				</Upload>
				<p style="text-align: center;color: red;font-size: 12px;">建议上传图片大小为100px*100px，图片大小不超过50k的图片</p>

			</FormItem>

			<FormItem label="真实姓名" prop="realName">
				<Input :maxlength="20" type="text" v-model="userForm.realName" placeholder="请输入真实姓名">
				</Input>
			</FormItem>
			<FormItem label="联系电话" prop="telephone">
				<Input :maxlength="20" type="text" v-model="userForm.telephone" placeholder="请输入联系电话">
				</Input>
			</FormItem>

			<FormItem label="所属组织" prop="belongOrgId">
				<Input :disabled="disParentOrgId" readonly v-model="belongOrgName" search enter-button="选择" placeholder="请选择所属组织"
				 @on-search="showBelongOrgList"></Input>

			</FormItem>
			<FormItem style="text-align:center;">
				<Button @click="handleReset('userForm')" style="margin-right:0.625rem">重置</Button>
				<Button type="primary" @click="handleSubmit('userForm')">
					添加
				</Button>
			</FormItem>
		</Form>
		<Modal :title="'当前选择:'+ belongOrgTitle" v-model="showBelongOrg">
			<Icon slot="close" type="md-close"  size="30"/>
			<div class="tree-style">
				<org-tree v-if="showBelongOrg" @getBelongOrgInfo="showBelongOrgInfo" :orgTypeId="null"></org-tree>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" @click="belongOrgOk">确定</Button>
			</div>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>更新中...</div>
		</Spin>
	</div>
</template>

<script>
	import {
		getUserRolesList,
		addUser,
	} from '@/api/user'
	import OrgTree from '@/view/components/org-tree.vue'
	export default {
		name: 'add_user',
		components: {
			OrgTree
		},
		data() {
			const validateTel = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback(new Error('该列不能为空'));
				} else if (!value.replace(/[^\w\.\/]/ig, '')) {
					return callback(new Error('不能输入汉字'));
				} else if (value.length >= 12) {
					return callback(new Error('请输入正确号码'));
				} else {
					callback();
				}
			};
			const validatePassword = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback(new Error('密码不能为空'));
				} else if (value.length < 6 || value.length > 18) {
					return callback(new Error('密码不能少于6个字符或大于18个字符'));
				} else {
					callback();
				}
			};
			const validateAgainPwd = (rule, value, callback) => {
				if (!value) {
					return callback('请再次确认密码');
				} else if (value != this.userForm.password) {
					callback('两次密码不匹配，请重新输入');
				} else {
					callback();
				}
			};
			return {
				showSpin: false,
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgName: '', //所属组织名称
				belongOrgInfo: '', //所属组织信息

				userForm: {
					userName: '',
					password: '',
					againPwd: '',
					userRolesId: '',
					userHeadImgUrl: '/uploadFile/defaultImages/userHead.png',
					realName: '',
					telephone: '',
					belongOrgId: ''
				},
				uploadAction: this.$config.baseUrl.dev + '/v1/uploadFiles',
				uploadHeaders: {
					From: this.$store.state.app.iotInterFace,
					Token: this.$store.state.user.token,
					Dir: '/uploadFile/userHeadImages/'
				},
				userRule: {
					userName: [{
						required: true,
						message: '用户名不能为空',
						// validator: validateUserName,
						trigger: 'blur'
					}],
					realName: [{
						required: true,
						// validator: validateRealName,
						message: '请填写真实姓名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						type: 'password',
						//message: '密码不能为空',
						validator: validatePassword,
						trigger: 'blur'
					}],
					againPwd: [{
						required: true,
						type: 'password',
						validator: validateAgainPwd,
						trigger: 'blur'
					}],
					userRolesId: [{
						required: true,
						type: 'number',
						message: '请选择用户角色',
						trigger: 'change'
					}],
					belongOrgId: [{
						required: true,
						type: 'number',
						message: '请选择用户所属组织',
						trigger: 'change'
					}],
					telephone: [{
						required: true,
						// message: '联系电话不能为空',
						validator: validateTel,
						trigger: 'blur'
					}],
				},
			}
		},
		methods: {
			handleSuccess(response) {
				//console.log(response)
				if (response.success == 1) {
					this.userForm.userHeadImgUrl = response.srcList.toString()
				} else {
					this.$Message.error(response.errorMessage);
				}
			},
			handleError(error) {
				this.$Message.error(error);
			},
			handleFormatError(file) {
				this.$Message.warning('上传格式错误，请选择jpg/jpeg/png图片');
			},
			handleMaxSize(file) {
				this.$Message.warning('上传图片过大，请选择少于50kb的图片上传');
			},
			showBelongOrgList() { //显示所属组织列表
				this.belongOrgTitle = this.belongOrgName
				this.showBelongOrg = true

			},
			showBelongOrgInfo(data) { //显示所选所属组织信息
				this.belongOrgInfo = data
				this.belongOrgTitle = data[0].orgName
			},
			belongOrgOk() { //确定所属组织
				//const selectedNodes = this.$refs.belongOrgTree.getSelectedNodes();
				this.userForm.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},

			handleReset(name) {
				this.belongOrgName = ''
				this.$refs[name].resetFields();
			},
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						//this.$Message.success('Success!');
						const iaUser = {
							userName: this.userForm.userName,
							password: this.userForm.password,
							userRolesId: this.userForm.userRolesId,
							userHeadImgUrl: this.userForm.userHeadImgUrl,
							realName: this.userForm.realName,
							telephone: this.userForm.telephone,
							belongOrgId: this.userForm.belongOrgId
						}
						this.showSpin = true
						addUser(iaUser).then(res => {
							const data = res.data
							this.showSpin = false
							if (data.success == 1) {
								this.$Message.success('添加成功');

							} else {
								this.$Message.error(data.errorMessage);
							}
						}).catch(error => {
							this.showSpin = false
							alert(error)
						})

						//console.log(this.vmUser)
					} else {
						//this.$Message.error('Fail!');
					}
				})
			},

			showUserRolesList() {
				getUserRolesList().then(res => {
					const data = res.data
					if (data.success == 1) {
						//alert(JSON.stringify(data))
						this.userRolesList = data.userRolesList
						this.userForm.userRolesId = this.userRolesList[0].id
					} else {
						this.$Message.error(data.errorMessage);
					}

				}).catch(error => {
					alert(error)
				})
			}
		},
		created() {
			// this.$route.meta.keepAlive = true
			this.showUserRolesList()

		},

	}
</script>

<style>
	.userFormStyle {
		width: 50%;
		margin: 0 auto;
	}

	@media screen and (min-width:300px) and (max-width:900px) {
		.userFormStyle {
			width: 90%;
			margin: 0.625rem auto;
			/* margin: 0 auto; */
		}
	}
</style>
