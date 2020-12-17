<template>
	<div>
		<Form :label-width="100" ref="orgForm" :model="orgForm" :rules="orgRule" label-position="left">
			<FormItem label="组织名称" prop="orgName">
				<Input v-model="orgForm.orgName" placeholder="请输入组织名称" :maxlength="100"></Input>
			</FormItem>
			<FormItem label="组织类型" prop="orgTypeId">
				<RadioGroup v-model="orgForm.orgTypeId">
					<Radio v-for="item in orgTypeList" :key="item.id" :value="item.id" :label="item.id">{{item.orgTypeName}}</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-if="$store.state.app.iotInterFace == 0" label="组织Logo" prop="orgLogoUrl">

				<Upload type="drag" ref="upload" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']"
				 :max-size="50" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="uploadAction" style="display: inline-block;width:312px;float: left;"
				 :headers="uploadHeaders" :on-error="handleError">
					<div style="width: 312px;height:85px;line-height: 85px;">
						<Icon type="ios-camera" size="20"></Icon>
						<img :src="orgForm.orgLogoUrl" style="height: 100%;position: absolute;top:0;left: 0;" />
					</div>
				</Upload>
				<p style="text-align: center;color: red;font-size: 12px;">建议上传图片大小为312px*85px，图片大小不超过50k的图片</p>

			</FormItem>
			<FormItem label="所属组织" prop="parentOrgId">
				<Input readonly v-model="belongOrgName" search enter-button="选择" placeholder="请选择所属组织"
				 @on-search="showBelongOrgList"></Input>
			</FormItem>
			<FormItem label="组织简介" prop="orgDesc">
				<Input maxlength="500" v-model="orgForm.orgDesc" type="textarea" :rows="5" placeholder="如果写上组织简介,将更多了解你的组织喔..."></Input>
			</FormItem>
			<FormItem style="text-align: center;">
				<Button @click="handleReset('orgForm')" style="margin-right: 8px">重置</Button>
				<Button type="primary" @click="handleSubmit('orgForm')">
					<slot></slot>
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
		addOrg,
		getAllOrgTypeList,
		getOrg,
		updateOrg
	} from '@/api/org'
	import OrgTree from '@/view/components/org-tree.vue'
	export default {
		props: ['orgId'],
		components: {
			OrgTree
		},
		data() {
			const validateOrgName = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback(new Error('组织名称不能为空'));
				} else if (value.length >= 100) {
					return callback(new Error('输入字符过长'));
				} else {
					callback();
				}
			};
			return {
				showSpin: false,
				belongOrgTitle: '',
				belongOrgName: '', //所属组织名称
				belongOrgInfo: '', //所属组织信息
				orgForm: {
					orgName: '',
					orgLogoUrl: '/uploadFile/defaultImages/orgLogo.png',
					orgTypeId: '',
					orgDesc: '',
					parentOrgId: '',
				},
				uploadAction: this.$config.baseUrl.dev + '/v1/uploadFiles',
				uploadHeaders: {
					From: this.$store.state.app.iotInterFace,
					Token: this.$store.state.user.token,
					Dir: '/uploadFile/orgLogoImages/'
				},
				orgTypeList: [],
				orgRule: {
					orgName: [{
						required: true,
						validator: validateOrgName,
						trigger: 'blur'
					}],
					orgTypeId: [{
						required: true,
						type: 'number',
						message: '请选择组织类型',
						trigger: 'change'
					}],
					parentOrgId: [{
						required: true,
						message: '请选择用户所属组织',
						trigger: 'change'
					}],
				},
				showBelongOrg: false
			}
		},
		methods: {
			handleReset(name) {
				this.$refs[name].resetFields();
				this.belongOrgName = ''
				
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
				this.orgForm.parentOrgId = this.belongOrgInfo[0].orgId
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
			handleSuccess(response) {
				//console.log(response)
				if (response.success == 1) {
					this.orgForm.orgLogoUrl = response.srcList.toString()
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
			handleSubmit(name) { //提交表单
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.showSpin = true
						if (this.orgId != null && this.orgId != '') {
							updateOrg(this.orgForm).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('更新成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})

						} else {
							addOrg(this.orgForm).then(res => {
								this.showSpin = false
								const data = res.data
								if (data.success == 1) {
									this.$Message.success('添加成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}

					}
				})
			},
			getOrgType() {
				getAllOrgTypeList().then(res => { //获取组织类型列表
					const data = res.data
					if (data.success == 1) {
						this.orgTypeList = data.orgTypeList
						if (this.orgTypeList.length > 0) {
							this.orgForm.orgTypeId = this.orgTypeList[0].id
						}
						this.getOrgInfo()
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					alert(error)

				})
			},
			getOrgInfo() {
				if (this.orgId != null && this.orgId != '') {
					this.showSpin = true
					getOrg(this.orgId).then(res => {
						// console.log(res)
						this.showSpin = false
						const data = res.data
						if (data.success == 1) {
							const iaOrg = data.iaOrg
							this.orgForm = {
								id: iaOrg.id,
								orgName: iaOrg.orgName,
								orgLogoUrl: iaOrg.orgLogoUrl,
								orgTypeId: iaOrg.orgTypeId,
								parentOrgId: iaOrg.parentOrgId,
								orgDesc: iaOrg.orgDesc
							}
							this.belongOrgName = iaOrg.parentOrgName

						}else{
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				} else {
					// this.$Message.error('获取信息失败，请重试')
				}
			}

		},
		created() {
			this.getOrgType()
		},
		mounted() {
			
		}

	}
</script>

<style>
</style>
