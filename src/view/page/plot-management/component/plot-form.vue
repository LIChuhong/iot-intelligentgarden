<template>
	<div>
		<Form :label-width="100" ref="plotForm" :model="plotForm" :rules="plotRule" label-position="left">

			<FormItem label="地块名称" prop="massifName">
				<Input type="text" :maxlength="100" v-model="plotForm.massifName" placeholder="请输入地块名称"></Input>
			</FormItem>
			<FormItem label="作物名称" prop="cropName">
				<Input type="text" :maxlength="100" v-model="plotForm.cropName" placeholder="请输入作物名称"></Input>
			</FormItem>

			<FormItem v-if="$store.state.app.iotInterFace == 0" label="作物图片" prop="cropImgUrl">
				<Upload type="drag" ref="upload" :show-upload-list="false" :on-success="handleSuccess" :format="['jpg','jpeg','png']"
				 :max-size="50" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :action="uploadAction" style="display: inline-block;width:100px;float: left;"
				 :headers="uploadHeaders" :on-error="handleError">
					<div style="width: 100px;height:100px;line-height: 100px;">
						<Icon type="ios-camera" size="20"></Icon>
						<img :src="plotForm.cropImgUrl" style="height: 100%;width: 100%;position: absolute;top:0;left: 0;" />
					</div>
				</Upload>
				<p style="text-align: center;color: red;font-size: 12px;">建议上传图片大小为100px*100px，图片大小不超过50k的图片</p>

			</FormItem>

			<FormItem label="关联设备" prop="rtuNumberList" style="overflow: hidden;position: relative;">
				<div style="float: left;width:100%;border: 0.0625rem solid #dcdee2;margin-top: 0.3125rem;">
					<span v-for="(i,index) in plotForm.rtuNumberList" :key="index" style="background: #c5c8ce;padding: 0.3125rem;border-radius:5%;margin-left: 0.3125rem;">{{i.rtuNumber}}
						<Icon type="md-close" style="margin-left: 0.3125rem;cursor:pointer;" @click="delRtu(index)" /></span>

				</div>
				<Button size="small" type="primary" ghost @click="addrtuList" icon="md-add">{{$t('add')+$t('rtu')}}</Button>
			</FormItem>
			<FormItem label="所属组织" prop="belongOrgId">
				<Input readonly v-model="belongOrgName" search :enter-button="$t('choose')" placeholder="请选择所属组织" @on-search="showBelongOrgList"></Input>
			</FormItem>


			<FormItem style="text-align: center;">
				<Button @click="handleReset('plotForm')" style="margin-right: 8px">{{$t('reset')}}</Button>
				<Button type="primary" @click="handleSubmit('plotForm')">
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
				<Button type="primary" size="large" @click="belongOrgOk">{{$t('ok')}}</Button>
			</div>
		</Modal>

		<Modal title="选择关联设备列表" v-model="showRtuModal" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<rtu-form v-if="showRtuModal" :list="list" @check-rtu-ok="checkRtuOk"></rtu-form>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>


<script>
	import OrgTree from '@/view/components/org-tree.vue'
	import RtuForm from '@/view/page/strategy-management/component/rtu-list.vue'
	import {
		addMassif,
		getMassif,
		updateMassif
	} from '@/api/plot.js'
	export default {
		props: ['plotId'],
		components: {
			RtuForm,
			OrgTree,
		},
		data() {
			return {
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgInfo: '', //所属组织信息
				belongOrgName: '', //所属组织名称
				showRtuModal: false,
				plotForm: {
					massifName: '',
					cropName: '',
					rtuNumberList: [],
					cropImgUrl: '',
					belongOrgId: ''
				},
				list: [],
				uploadAction: this.$config.baseUrl.dev + '/v1/uploadFiles',
				uploadHeaders: {
					From: this.$store.state.app.iotInterFace,
					Token: this.$store.state.user.token,
					Dir: '/uploadFile/cropImages/'
				},
				showSpin: false,
				plotRule: {
					massifName: [{
						required: true,
						message: '地块名称不能为空',
						// validator: validateUserName,
						trigger: 'blur'
					}],

					cropName: [{
						required: true,
						message: '作物名称不能为空',
						// validator: validateUserName,
						trigger: 'blur'
					}],

					belongOrgId: [{
						required: true,
						type: 'number',
						message: '请选择用户所属组织',
						trigger: 'change'
					}],
				}

			}
		},
		methods: {
			handleReset(name) {
				this.$refs[name].resetFields()
				this.belongOrgName = ''
			},
			getPlotInfo() {

				if (this.plotId != null && this.plotId != '') {
					this.showSpin = true
					getMassif(this.plotId).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							// console.log(data)
							let iaMassif = data.iaMassif
							let rtuNumberList = []
							let list = eval(iaMassif.rtuNumberListJson)
							// console.log(list)
							// 
							for (var i = 0; i < list.length; i++) {
								// console.log(i)
								rtuNumberList.push({
									rtuNumber: list[i]
								})
							}
							this.plotForm = {
								massifName: iaMassif.massifName,
								cropName: iaMassif.cropName,
								cropImgUrl: iaMassif.cropImgUrl,
								rtuNumberList: rtuNumberList,
								belongOrgId: iaMassif.belongOrgId
							}
							this.belongOrgName = iaMassif.orgName
							this.list = rtuNumberList

						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				}
			},
			handleSubmit(name) {
				// console.log(name)
				this.$refs[name].validate((valid) => {
					if (valid) {
						//this.$Message.success('Success!');
						var rtuNumberList = []
						var rtuList = this.plotForm.rtuNumberList
						for (var i = 0; i < rtuList.length; i++) {
							rtuNumberList.push(rtuList[i].rtuNumber)
						}
						var plotForm = {
							massifName: this.plotForm.massifName,
							cropName: this.plotForm.cropName,
							rtuNumberList: rtuNumberList,
							cropImgUrl: this.plotForm.cropImgUrl,
							belongOrgId: this.plotForm.belongOrgId
						}


						this.showSpin = true
						if (this.plotId != null && this.plotId != '') {
							console.log(this.plotId)
							plotForm.id = this.plotId
							updateMassif(plotForm).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('修改成功');
							
								} else {
									this.$Message.error(data.errorMessage);
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						} else {
							addMassif(plotForm).then(res => {
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
						}

						//console.log(this.vmUser)
					} else {
						//this.$Message.error('Fail!');
					}
				})
			},
			handleSuccess(response) {
				//console.log(response)
				if (response.success == 1) {
					this.plotForm.cropImgUrl = response.srcList.toString()
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
				this.plotForm.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
			addrtuList() {
				this.showRtuModal = true
			},
			checkRtuOk(list) {
				this.plotForm.rtuNumberList = list
				this.showRtuModal = false
			},
			delRtu(index) {
				this.plotForm.rtuNumberList.splice(index, 1)
			}
		},
		created() {
			this.getPlotInfo()
		}
	}
</script>

<style>
</style>
