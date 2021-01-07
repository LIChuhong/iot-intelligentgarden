<template>
	<div>
		<Form :label-width="100" ref="paramAssForm" :model="paramAssForm" label-position="left">

			<FormItem label="设备编号" prop="rtuNumber">
				<Input type="number" v-model="paramAssForm.rtuNumber" placeholder="请输入设备编号"></Input>
			</FormItem>
			<div style="height:18.75rem;overflow: auto;">
			<FormItem v-for="(item, index) in paramAssForm.warnParamList" :key="index" :label="'告警参数'+(index+1)" :prop="'warnParamList.' + index">
				<div>
					<Select v-model="item.warnParam" @on-open-change="changeWarnParam" placeholder="请选择告警参数">
						<Option v-for="i in parameterList" :value="i.id" :key="i.id">{{ i.parameterName }}</Option>
					</Select>
					<Row>
						<Col span="18">
						<p>告警名称:{{item.warnName}}</p>
						<p>告警上限:{{item.warnMaxValue}}</p>
						<p>告警下限:{{item.warnMinValue}}</p>
						</Col>
						<Col span="6" style="overflow: hidden;">
						<p><Button size="small" type="primary" @click="changeWarn(item.warnParam,index)">{{$t('choose')}}</Button></p>
						<p><Button size="small" v-show="index != 0" type="error" @click="handleRemove(index)" icon="ios-trash"></Button></p>
						<p><Button size="small" v-show="index == (paramAssForm.warnParamList.length-1)" type="primary" ghost @click="handleAddwarnParam" icon="ios-add" style="margin-top: 0.3125rem;" ></Button></p>
						
						</Col>
					</Row>
				</div>
			</FormItem>
			</div>
			<FormItem style="text-align: center;">
				<Button @click="handleReset('paramAssForm')" style="margin-right: 8px">{{$t('reset')}}</Button>
				<Button type="primary" @click="handleSubmit('paramAssForm')">
					<slot></slot>
				</Button>

			</FormItem>
		</Form>
		<Modal title="选择告警数值" v-model="showWarnParam" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<param-warn-list :listIndex="listIndex" v-if="showWarnParam" @change-warn-info="changeWarnInfo"></param-warn-list>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>


<script>
	import ParamWarnList from './param-warn-list.vue'
	import {
		rtuTypeParameterList,
		updateRtuParamWarnRelList,
		getRtuParamWarnRelDetList
	} from '@/api/warn.js'
	export default {
		components: {
			ParamWarnList
		},
		props:['rtuNumber'],
		data() {
			return {
				showSpin:false,
				paramAssForm: {
					rtuNumber: '',
					warnParamList: [{
						warnParam: '',
						warnName: '',
						warnId: null,
						warnMaxValue: null,
						warnMinValue: null,
					}],
				},
				parameterList: [],
				showWarnParam: false,
				listIndex: null,
			}
		},
		methods: {
			handleReset(name) {
				this.$refs[name].resetFields()
				this.paramAssForm.warnParamList = [{
						warnParam: '',
						warnName: '',
						warnId: null,
						warnMaxValue: null,
						warnMinValue: null,
					}]
			},
			getRtuWarnInfo(){
				if(this.rtuNumber != null && this.rtuNumber != ''){
					this.showSpin = true
					this.paramAssForm.rtuNumber = this.rtuNumber
					this.changeWarnParam(true)
					getRtuParamWarnRelDetList(this.rtuNumber).then(res=>{
						const data = res.data
						this.showSpin = false
						if(data.success == 1){
							
							this.paramAssForm.warnParamList=[]
							
							var list = data.parameterWarnRelationDetailsList
							for(var i = 0;i<list.length;i++){
								var param = list[i]
								this.paramAssForm.warnParamList.push({
									warnParam:param.parameterId,
									warnName:param.warnName,
									warnId:param.parameterWarnId,
									warnMaxValue:param.warnMaxValue,
									warnMinValue:param.warnMinValue
									
								})
							}
							
							// this.wRDetailsData = data.parameterWarnRelationDetailsList
						}else{
							this.$Message.error(data.errorMessage)
						}
					}).catch(error=>{
						this.showSpin = false
						alert(error)
					})
				}
			},
			changeWarnInfo(val, index) {
				this.showWarnParam = false
				this.paramAssForm.warnParamList[index].warnId = val.id
				this.paramAssForm.warnParamList[index].warnName = val.warnName
				this.paramAssForm.warnParamList[index].warnMinValue = val.warnMinValue
				this.paramAssForm.warnParamList[index].warnMaxValue = val.warnMaxValue
				// console.log(val)
			},
			changeWarn(warnParam, index) {
				if (warnParam != '') {
					this.listIndex = index
					this.showWarnParam = true
				} else {
					alert('请先选择设备参数，再进行选择')
				}
			},
			changeWarnParam(val) {
				// console.log(val)
				if (val == true) {
					if (this.paramAssForm.rtuNumber != null && this.paramAssForm.rtuNumber != '') {
						var rtuNumber = this.paramAssForm.rtuNumber
						rtuTypeParameterList(rtuNumber).then(res => {
							const data = res.data
							if (data.success == 1) {
								this.parameterList = data.parameterList
							}
						}).catch(error => {

							alert(error)
						})
					} else {
						alert('请先输入设备编号，再进行选择')
					}
				}
			},
			handleAddwarnParam() {
				this.paramAssForm.warnParamList.push({
					warnParam: '',
					warnName: '',
					warnId: null,
					warnMaxValue: null,
					warnMinValue: null
				})
			},
			handleRemove(index) {
				this.paramAssForm.warnParamList.splice(index, 1)
			},
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					var list = []
					var warnParamList = this.paramAssForm.warnParamList
					for (var j = 0; j < warnParamList.length; j++) {
						if(warnParamList[j].warnParam != '' && warnParamList[j].warnId != null){
							list.push({
								parameterId: warnParamList[j].warnParam,
								parameterWarnId: warnParamList[j].warnId
							})
						}
						
					}
					var rtuParameterWarnRelationList = {
						rtuNumber:Number(this.paramAssForm.rtuNumber),
						parameterWarnRelationList: list
					}
					this.showSpin = true
					updateRtuParamWarnRelList(rtuParameterWarnRelationList).then(res=>{
						const data = res.data
						this.showSpin = false
						if(data.success == 1){
							this.$Message.success('添加成功')
						}else{
							this.$Message.error(data.errorMessage)
						}
					}).catch(error=>{
						this.showSpin = false
						alert(error)
					})
					// console.log(list)

					console.log(rtuParameterWarnRelationList)
				})
			}
		},
		created() {
			this.getRtuWarnInfo()
		}
	}
</script>

<style>
</style>
