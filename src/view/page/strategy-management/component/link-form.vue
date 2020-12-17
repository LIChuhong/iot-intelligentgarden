<template>
	<div>
		<Form ref="linkForm" :model="linkForm" :rules="linkRule" :label-width="90" :label-colon="true" label-position="left">
			<FormItem label="联动名称" prop="linkageName">
				<Input :maxlength="50" type="text" v-model="linkForm.linkageName" placeholder="请输入联动名称">
				</Input>
			</FormItem>
			<FormItem label="联动类型" prop="linkageType">
				<RadioGroup v-model="linkForm.linkageType">
					<Radio :label="0"><span>执行联动</span></Radio>
					<Radio :label="1"><span>反馈联动</span></Radio>
					<Radio :label="2"><span>监测联动</span></Radio>
					<Radio :label="3"><span>控制联动</span></Radio>
				</RadioGroup>
			</FormItem>

			<FormItem label="联动参数" prop="linkageParameterId">
				<span>{{linkForm.linkageParameterName}}</span>
				<Cascader style="display:inline-block;margin-left: 1.25rem;" :data="rtuTypeList" :load-data="getRtuTypeParamList"
				 @on-change="handleChange">
					<a href="javascript:void(0)">选择</a>
				</Cascader>
				<!-- {{linkForm.linkageParameterId}} -->
			</FormItem>
			<FormItem label="延迟秒数" prop="delay">
				<InputNumber :min="0"  v-model="linkForm.delay" :formatter="value => `${value}秒`" :parser="value => value.replace('秒', '')"></InputNumber>
			</FormItem>
			<FormItem label="最大值" prop="parameterMaxValue">
				<Input type="number" v-model="linkForm.parameterMaxValue" placeholder="请输入联动参数无法通过检测的最大值">
				</Input>
			</FormItem>
			<FormItem label="最小值" prop="parameterMinValue">
				<Input type="number" v-model="linkForm.parameterMinValue" placeholder="请输入联动参数无法通过检测的最小值">
				</Input>
			</FormItem>
			<FormItem label="提示" prop="tips">
				<Input :maxlength="100" type="textarea" v-model="linkForm.tips" placeholder="请输入联动参数无法通过检测的提示">
				</Input>
			</FormItem>
			<FormItem label="联动设备编号" prop="linkageRtuNumber">
				<Input type="number" v-model="linkForm.linkageRtuNumber" placeholder="请输入联动设备编号" :search="linkForm.linkageType == 2 || linkForm.linkageType == 3"
				 enter-button="设置" @on-search="getLinkageParamList">
				</Input>
			</FormItem>
			<FormItem v-show="linkForm.linkageType == 2" label="监测次数" prop="totalCount">
				<Input :maxlength="100" type="number" v-model="linkForm.totalCount" placeholder="请输入检测次数">
				</Input>
			</FormItem>

			<FormItem style="text-align:center;">
				<Button @click="handleReset('linkForm')" style="margin-right:0.625rem">重置</Button>
				<Button type="primary" @click="handleSubmit('linkForm')">
					<slot></slot>
				</Button>
			</FormItem>

		</Form>
		<Modal title="设置联动设备参数" v-model="linkRtuShow" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<!-- <sf-model v-if="iaSf.show"  :sf-rtu-number="iaSf.rtuNumber"></sf-model> -->
			<link-rtu-form v-if="linkRtuShow" :rtu-number="linkForm.linkageRtuNumber" :param-data-list="linkForm.rtuData?linkForm.rtuData.parameterDataList:''"
			 @save-parameter-data="saveParameterData"></link-rtu-form>
		</Modal>

		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>

</template>

<script>
	import LinkRtuForm from '../component/link-rtu-form.vue'
	import {
		addRtuLinkage,
		getRtuLinkage,
		updateRtuLinkage
	} from '@/api/strategy.js'
	import {
		rtuTypeParameterList,
		getAllRtuTypeList,
		getRtuTypeParameterList
	} from '@/api/rtu.js'
	export default {
		props: ['linkId'],
		components: {
			LinkRtuForm
		},
		data() {
			const validateLinkageName = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback(new Error('联动名称不能为空'));
				} else {
					callback();
				}
			};
			return {
				linkRtuShow: false,
				rtuTypeList: [],
				rtuTypeParameterList: [],
				showSpin: false,
				linkForm: {
					linkageName: '',
					linkageType: 0,
					linkageRtuNumber: '',
					linkageParameterId: '',
					linkageParameterName: '',
					delay: 0,
					parameterMaxValue: '',
					parameterMinValue: '',
					tips: '',
					linkageParameterIndex: '',
					rtuData: null,
					totalCount: 0,

				},
				parameterList: [],
				linkRule: {
					linkageName: [{
						required: true,
						// message: '联动名称不能为空',
						validator: validateLinkageName,
						trigger: 'blur'
					}],
					linkageType: [{
						required: true,
						type: 'number',
						message: '请选择联动类型',
						trigger: 'change'
					}],
					linkageRtuNumber: [{
						required: true,
						// type: 'number',
						message: '请输入设备编号',
						trigger: 'blur'
					}],
					linkageParameterId: [{
						required: true,
						type: 'number',
						message: '请选择联动参数',
						trigger: 'change'
					}],
					parameterMinValue: [{
						required: true,
						// type: 'number',
						message: '该项不能为空',
						trigger: 'blur'
					}],
					parameterMaxValue: [{
						required: true,
						// type: 'number',
						message: '该项不能为空',
						trigger: 'blur'
					}],
					delay: [{
						required: true,
						 type: 'number',
						message: '该项不能为空',
						trigger: 'blur'
					}],

				}

			}
		},
		methods: {
			handleChange(value, selectedData) {
				this.linkForm.linkageParameterId = selectedData[1].value
				this.linkForm.linkageParameterName = selectedData[1].label
				this.linkForm.linkageParameterIndex = selectedData[1].index
			},
			saveParameterData(parameterDataList) {
				this.linkForm.rtuData = {
					rtuNumber: parseInt(this.linkForm.linkageRtuNumber),
					orderType: this.linkForm.linkageType,
					parameterDataList: parameterDataList
				}
				this.linkRtuShow = false
			},
			getRtuTypeList() {
				getAllRtuTypeList().then(res => {
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						this.rtuTypeList = data.rtuTypeList.map(item => {
							item.value = item.id
							item.label = item.rtuTypeName
							item.children = []
							item.loading = false
							return item
						})
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			getRtuTypeParamList(item, callback) {
				item.loading = true
				getRtuTypeParameterList(item.value).then(res => {
					const data = res.data
					item.loading = false
					if (data.success == 1) {
						var list = data.parameterList
						for (var i = 0; i < list.length; i++) {
							item.children.push({
								value: list[i].id,
								label: list[i].parameterName,
								index: i
							})
						}
					} else {
						this.$Message.error(data.errorMessage)
					}
					callback();
				}).catch(error => {
					item.loading = false
					alert(error)
					callback();
				})

			},
			handleReset(name) {
				this.$refs[name].resetFields();
				this.linkForm.linkageParameterName = ''
			},
			getLinkInfo() {
				if (this.linkId != '' && this.linkId != null) {
					this.showSpin = true
					getRtuLinkage(this.linkId).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							var rtuLinkage = data.rtuLinkage
							this.linkForm = {
								linkageName: rtuLinkage.linkageName,
								linkageType: rtuLinkage.linkageType,
								linkageRtuNumber: rtuLinkage.linkageRtuNumber.toString(),
								linkageParameterId: rtuLinkage.linkageParameterId,
								linkageParameterIndex: rtuLinkage.linkageParameterIndex,
								linkageParameterName: rtuLinkage.parameterName,
								parameterMinValue: rtuLinkage.parameterMinValue.toString(),
								parameterMaxValue: rtuLinkage.parameterMaxValue.toString(),
								delay: rtuLinkage.delay,
								tips: rtuLinkage.tips,
								totalCount: rtuLinkage.totalCount

							}
							if (rtuLinkage.linkageType == 2 || rtuLinkage.linkageType == 3) {
								if (rtuLinkage.rtuData != null) {
									var list = rtuLinkage.rtuData.parameterDataList
									var parameterDataList = []
									for (var i = 0; i < list.length; i++) {
										parameterDataList.push({
											parameterIndex: list[i].parameterIndex,
											value: list[i].value
										})

									}
									this.linkForm.rtuData = {
										rtuNumber: rtuLinkage.linkageRtuNumber,
										orderType: rtuLinkage.linkageType,
										parameterDataList: parameterDataList
									}
								}else{
									this.linkForm.rtuData = null
								}
							} else {
								this.linkForm.rtuData = null
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
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.linkForm.totalCount = this.linkForm.totalCount ? parseInt(this.linkForm.totalCount) : 0
						var rtuLinkage = {
							linkageName: this.linkForm.linkageName,
							linkageType: this.linkForm.linkageType,
							linkageRtuNumber: parseInt(this.linkForm.linkageRtuNumber),
							linkageParameterId: this.linkForm.linkageParameterId,
							linkageParameterIndex: this.linkForm.linkageParameterIndex,
							delay: parseInt(this.linkForm.delay),
							parameterMinValue: Number(this.linkForm.parameterMinValue),
							parameterMaxValue: Number(this.linkForm.parameterMaxValue),
							tips: this.linkForm.tips,
							rtuData: this.linkForm.rtuData,
							totalCount: this.linkForm.totalCount
							// linkageParameterIconCode:"icon_p",
						}
						// console.log(rtuLinkage)
						this.showSpin = true
						if (this.linkId != null && this.linkId != '') {
							rtuLinkage.id = this.linkId
							updateRtuLinkage(rtuLinkage).then(res => {
								this.showSpin = false
								const data = res.data
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
							addRtuLinkage(rtuLinkage).then(res => {
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
			getLinkageParamList(val) {

				if (val) {
					if (this.linkForm.linkageRtuNumber != null && this.linkForm.linkageRtuNumber != '') {
						this.linkRtuShow = true
					} else {
						// this.parameterList = []
						alert('请先填写联动设备编号，再进行联动设备设置')
					}
				}
			},

		},
		watch: {
			'linkForm.linkageRtuNumber': function(val, oldVal) {
				// this.linkForm.linkageParameterId = ''
			}
		},
		mounted() {
			this.getRtuTypeList()
			this.getLinkInfo()
		}
	}
</script>

<style>
</style>
