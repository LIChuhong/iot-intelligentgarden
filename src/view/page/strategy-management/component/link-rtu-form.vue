<template>
	<div>
		<div v-for="(item,i) in parameterList" :key="i">
			<!-- <p v-show="item.parameterType.readWriteType == 0">{{item.parameterName}}:{{item.parameterType.typeDefaultValue}}{{item.unit}}</p> -->
			<div v-show="item.parameterType.readWriteType == 1" style="overflow: hidden;padding-bottom: 0.625rem;">
				<Checkbox v-model="item.check"> </Checkbox>
				<span>{{item.parameterName}}:</span><Input v-model="item.value" placeholder="请输入数值" style="width: 60%;float: right;" type="number" />
			</div>
			<div v-show="item.parameterType.readWriteType == 2 || item.parameterType.readWriteType == 3" style="overflow: hidden;padding-bottom: 0.625rem;">
				<i-switch size="small" @on-change="setIsEnbleOrg(row)"></i-switch>
			</div>

		</div>
		<div style="text-align: center;">
			<Button style="margin: 5px 0;" type="primary" @click="saveParameterDataList">提交</Button>
		</div>
		<Spin fix v-show="showSpin" style="background: rgba(255,255,255,0.3);">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>

	</div>
</template>

<script>
	import {
		rtuTypeParameterList
	} from '@/api/rtu.js'
	export default {
		props: ['rtuNumber','paramDataList'],
		data() {
			return {
				showSpin: false,
				parameterList: []
			}
		},
		methods: {
			saveParameterDataList() {
				var parameterDataList = []
				var list = this.parameterList
				for(var i = 0;i<list.length;i++){
					if(list[i].check){
						if(list[i].value == ''){
							list[i].value = 0
						}
						parameterDataList.push({
							parameterIndex:i,
							value:Number(list[i].value)
						})
					}
				}
				// console.log(parameterDataList)
				this.$emit('save-parameter-data',parameterDataList)
			
			},
			getLinkageParamList(rtuNumber) {
				if (rtuNumber) {
					this.showSpin = true
					rtuTypeParameterList(rtuNumber).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							// console.log(this.paramDataList)
							this.parameterList = []
							var list = data.parameterList
							var list1 = this.paramDataList
							for(var i = 0;i<list.length;i++){
								list[i].check = false
								list[i].value = 0
								if(list1 != null && list1 != ''){
									for(var j = 0;j <list1.length;j++){
										if(list1[j].parameterIndex == i){
											list[i].value = list1[j].value
											list[i].check = true
										}
									}
								}
								this.parameterList.push(list[i])
								
							}
							// this.parameterList = data.parameterList.map(item => {
							// 	
							// 	
							// 	item.check = false
							// 	return item
							// })
						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				} else {
					// this.parameterList = []
					// alert('请先填写联动设备编号，再进行联动参数选择')
				}

			},
		},
		mounted() {
			this.getLinkageParamList(this.rtuNumber)
		}
	}
</script>

<style>
</style>
