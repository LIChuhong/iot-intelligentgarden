<template>
	<div>
		<Form :label-width="100" ref="rtuForm" :model="rtuForm" :rules="rtuRule" label-position="left">
			<FormItem label="设备编号" prop="rtuNumber">
				<Input :disabled="disEditor" type="number" v-model="rtuForm.rtuNumber" placeholder="请输入设备编号" :maxlength="11"></Input>
			</FormItem>
			<FormItem label="设备名称" prop="rtuName">
				<Input type="text" :maxlength="100" v-model="rtuForm.rtuName" placeholder="请输入设备名称"></Input>
			</FormItem>
			<FormItem label="设备描述" prop="rtuDesc">
				<Input type="text" :maxlength="100" v-model="rtuForm.rtuDesc" placeholder="请输入设备描述"></Input>
			</FormItem>
			<FormItem label="设备类型" prop="rtuTypeId">
				<!-- {{newDeviceData.rtuTypeId}} -->
				<Select :disabled="disEditor" @on-open-change="openRtuTypeList" v-model="rtuForm.rtuTypeId" placeholder="请选择设备类型"
				 @on-change="getRtuType">
					<Option v-for="item in rtuTypeList" :key="item.id" :value="item.id">{{item.rtuTypeName}}</Option>
				</Select>
			</FormItem>
			<FormItem label="设备版本" prop="rtuVersion">
				<Input :disabled="disEditor" type="number" v-model="rtuForm.rtuVersion" placeholder="请输入设备版本"></Input>
			</FormItem>
			<FormItem label="生产日期" prop="makeDate">
				<DatePicker :disabled="disEditor" v-model="rtuForm.makeDate" type="date" :editable="false" placeholder="请选择生产日期"
				 format="yyyy-MM-dd" style="width: 200px"></DatePicker>
			</FormItem>
			<FormItem label="生产批次" prop="makeBatch">
				<Input :disabled="disEditor" type="number" v-model="rtuForm.makeBatch" placeholder="请输入设备生产批次"></Input>
			</FormItem>
			<FormItem v-show="showlora" label="网关编号" prop="gwRtuNumber">
				<Input type="number" v-model="rtuForm.gwRtuNumber" placeholder="请输入设备网关编号"></Input>
			</FormItem>

			<FormItem v-show="showlora" label="lora地址" prop="loraAddress">
				<Input type="number" v-model="rtuForm.loraAddress" placeholder="请输入设备lora地址"></Input>
			</FormItem>
			<FormItem v-show="showlora" label="lora信道" prop="loraChannel">
				<Input type="number" v-model="rtuForm.loraChannel" placeholder="请输入设备lora信道"></Input>
			</FormItem>
			<FormItem v-show="showlora" label="串口节点地址" prop="serialPortNodeAddress">
				<Input type="number" v-model="rtuForm.serialPortNodeAddress" placeholder="请输入设备串口节点地址"></Input>
			</FormItem>
			
			<FormItem label="所属组织" prop="belongOrgId">
				<Input readonly v-model="belongOrgName" search enter-button="选择" placeholder="请选择所属组织" @on-search="showBelongOrgList"></Input>
			</FormItem>
			<FormItem label="关联视频" prop="videoId">
				<Input readonly v-model="rtuForm.videoName" search enter-button="选择" placeholder="请选择关联视频" @on-search="showVideoList"></Input>
			</FormItem>
			<!-- <FormItem label="设备描述" prop="rtuDesc">
				<Input maxlength="500" v-model="rtuForm.rtuDesc" type="textarea" :rows="5" placeholder="请输入设备描述"></Input>
			</FormItem> -->
			<FormItem style="text-align: center;">
				<Button @click="handleReset('rtuForm')" style="margin-right: 8px">重置</Button>
				<Button type="primary" @click="handleSubmit('rtuForm')">
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

		<Spin fix v-show="showSpin" class="show-spin-style">
			<Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
		</Spin>
		<!-- <Spin fix v-show="spinShow">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>Loading</div>
		</Spin> -->
		<Modal title="选择关联视频" v-model="showVideo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<video-list v-if="showVideo" @get-video-info="getVideoInfo"></video-list>
		</Modal>
	</div>
</template>

<script>
	import {
		getAllRtuTypeList,
		addRtu,
		getRtu,
		updateRtu
	} from '@/api/rtu'
	import {
		getNowFormatDate
	} from '@/libs/tools'
	import VideoList from '@/view/components/video-list.vue'
	import OrgTree from '@/view/components/org-tree.vue'
	export default {
		props: ['rtuNumber'],
		components: {
			OrgTree,
			VideoList
		},
		data() {
			return {
				showVideo:false,
				disEditor: false,
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgName: '', //所属组织名称
				belongOrgInfo: '', //所属组织信息
				showSpin: false,
				showlora: false,
				rtuForm: {
					rtuNumber: '',
					rtuName: '',
					rtuTypeId: '',
					rtuVersion: '',
					rtuTypeTag: '',
					makeDate: new Date(),
					makeBatch: '',
					belongOrgId: '',
					gwRtuNumber: '',
					loraAddress: '',
					loraChannel: '',
					serialPortNodeAddress:'',
					rtuDesc: '',
					videoId:'',
					videoName:''
				},
				rtuRule: {
					rtuNumber: [{
						required: true,
						// type:'number',
						message: '机器编号不能为空',
						trigger: 'blur'
					}],
					rtuName: [{
						required: true,
						message: '机器名称不能为空',
						trigger: 'blur'
					}],
					rtuTypeId: [{
						required: true,
						type: 'number',
						message: '机器类型不能为空',
						trigger: 'change'
					}],
					rtuVersion: [{
						required: true,
						message: '设备版本不能为空',
						trigger: 'blur'
					}],
					makeDate: [{
						required: true,
						type: 'date',
						message: '请选择出产日期',
						trigger: 'change'
					}],
					belongOrgId: [{
						required: true,
						type: 'number',
						message: '请选择设备所属组织',
						trigger: 'change'
					}],
					makeBatch: [{
						required: true,
						// type:'number',
						message: '生产批次不能为空',
						trigger: 'blur'
					}],
					gwRtuNumber: [{
						required: true,
						// type:'number',
						message: '网关编号不能为空',
						trigger: 'blur'
					}],
					loraAddress: [{
						required: true,
						// type:'number',
						message: 'lora地址不能为空',
						trigger: 'blur'
					}],
					loraChannel: [{
						required: true,
						// type:'number',
						message: 'lora信道不能为空',
						trigger: 'blur'
					}],
					serialPortNodeAddress: [{
						required: true,
						// type:'number',
						message: '串口节点地址不能为空',
						trigger: 'blur'
					}],
				},

				deviceTypeList: [],
				rtuTypeList: []
			}
		},
		methods: {
			getVideoInfo(row){
				// console.log(row)
				this.rtuForm.videoId = row.id
				this.rtuForm.videoName = row.videoName
				this.showVideo = false
			},
			showVideoList(){
				this.showVideo = true
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
				this.rtuForm.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
			getRtuType(val) {
				// console.log(this.rtuTypeList)
				const rtuTypeList = this.rtuTypeList
				for (var i in rtuTypeList) {
					if (val == rtuTypeList[i].id) {
						this.rtuForm.rtuTypeTag = rtuTypeList[i].rtuTypeTag
						if (rtuTypeList[i].rtuCharacteristic == 2) {
							this.showlora = true
							this.rtuForm.gwRtuNumber = this.rtuForm.loraAddress = this.rtuForm.loraChannel = this.rtuForm.serialPortNodeAddress = ''
						} else {
							this.showlora = false
							this.rtuForm.gwRtuNumber = this.rtuForm.loraAddress = this.rtuForm.loraChannel = this.rtuForm.serialPortNodeAddress ='0'
						}
						break;
					}
				}
			},
			openRtuTypeList(val) {
				// console.log(val)
				if (val) {
					getAllRtuTypeList().then(res => {
						const data = res.data
						if (data.success == 1) {
							// console.log(data)
							this.rtuTypeList = data.rtuTypeList
						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						alert(error)
					})
				}
			},

			handleSubmit(name) {
				// alert(1)
				// console.log(this.rtuForm)
				this.$refs[name].validate((valid) => {
					if (valid) {
						var loraAddress = ''
						var loraChannel = ''
						var gwRtuNumber = ''
						var serialPortNodeAddress = ''
						if (this.showlora) {
							loraAddress = parseInt(this.rtuForm.loraAddress)
							loraChannel = parseInt(this.rtuForm.loraChannel)
							gwRtuNumber = parseInt(this.rtuForm.gwRtuNumber)
							serialPortNodeAddress = parseInt(this.rtuForm.serialPortNodeAddress)
						}
						var videoId = ''
						if(this.rtuForm.videoId != ''){
							videoId = parseInt(this.rtuForm.videoId)
						}
						const rtuForm = {
							'rtuNumber': parseInt(this.rtuForm.rtuNumber),
							'rtuName': this.rtuForm.rtuName,
							'rtuSerialNumber': 'l1' + '-' + this.rtuForm.rtuTypeTag + '-' + this.rtuForm.rtuVersion + '-' +
								getNowFormatDate(this.rtuForm.makeDate, '') + '-' + this.rtuForm.makeBatch + '-' + this.rtuForm.rtuNumber,
							'rtuTypeId': parseInt(this.rtuForm.rtuTypeId),
							'belongOrgId': parseInt(this.rtuForm.belongOrgId),
							'loraAddress': loraAddress,
							'loraChannel': loraChannel,
							'gwRtuNumber': gwRtuNumber,
							'serialPortNodeAddress': serialPortNodeAddress,
							'rtuDesc':this.rtuForm.rtuDesc,
							'videoId': videoId,
							
						}
						// this.$Message.error('添加成功')
						// console.log(rtuForm)
						this.showSpin = true
						if (this.rtuNumber != null && this.rtuNumber != '') {
							// console.log(this.id)
							rtuForm.id = this.rtuForm.id
							updateRtu(rtuForm).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('修改成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						} else {
							addRtu(rtuForm).then(res => {
								const data = res.data
								this.showSpin = false
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

					} else {

						this.$Message.error('添加失败')

					}
				})
			},
			handleReset(name) {
				this.$refs[name].resetFields()
				this.belongOrgName = ''
				this.rtuForm.videoName = ''
			},
			getRtuInfo() {
				if (this.rtuNumber != null && this.rtuNumber != '') {
					this.openRtuTypeList(true)
					this.showSpin = true
					this.disEditor = true
					getRtu(this.rtuNumber).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							const iaRtu = data.iaRtu
							if (iaRtu) {
								const rtuSerialNumber = iaRtu.rtuSerialNumber.split('-')
								this.rtuForm = {
									id: iaRtu.id,
									rtuNumber: iaRtu.rtuNumber.toString(),
									rtuName: iaRtu.rtuName,
									rtuTypeId: iaRtu.rtuTypeId,
									rtuVersion: rtuSerialNumber[2],
									rtuTypeTag: iaRtu.rtuTypeTag,
									makeDate: rtuSerialNumber[3],
									makeBatch: rtuSerialNumber[4],
									belongOrgId: iaRtu.belongOrgId,
									loraAddress: iaRtu.loraAddress.toString(),
									loraChannel: iaRtu.loraChannel.toString(),
									gwRtuNumber: iaRtu.gwRtuNumber.toString(),
									serialPortNodeAddress: iaRtu.serialPortNodeAddress.toString(),
									videoId:iaRtu.videoId,
									rtuDesc:iaRtu.rtuDesc
									
								}
								if(iaRtu.video != null){
									this.rtuForm.videoName = iaRtu.video.videoName
								}
								this.belongOrgName = iaRtu.orgName
								const rtuTypeList = this.rtuTypeList
								for (var i in rtuTypeList) {
									if (iaRtu.rtuTypeId == rtuTypeList[i].id) {
										if (rtuTypeList[i].rtuCharacteristic == 2) {
											this.showlora = true
										} else {
											this.showlora = false
										}
										break;
									}
								}
								// console.log(this.rtuForm)
							}
						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				}
			},

		},
		mounted() {
			// console.log(1)
			this.getRtuInfo()
		},
	}
</script>

<style>
</style>
