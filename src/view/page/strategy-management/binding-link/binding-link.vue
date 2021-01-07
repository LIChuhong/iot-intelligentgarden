<template>
	<div class="bindingLinkStyle">
		<div style="text-align: center;margin-bottom: 1.25rem;">
			<span>设备编号：</span>
			<InputNumber :disabled="dis" style="width: 18.75rem;" :min="0" v-model="rtuNumber" placeholder="请输入设备编号"></InputNumber>
			<div class="btn1">
			<Button type="primary" icon="md-add" @click="showBindingLink = true" ghost style="margin: 0 1.25rem;">添加绑定</Button>
			<Button type="primary" @click="handleSubmit">提交</Button>
			</div>

		</div>
		<div>
			<p>绑定联动列表：</p>
			<Table size="small" border :columns="bindingLinkColumns" :data="bindingLinkData" :loading="tableLoading">

				<template slot-scope="{ row, index }" slot="linkageType">
					<span v-show="row.linkageType == 0">执行联动</span>
					<span v-show="row.linkageType == 1">反馈联动</span>
					<span v-show="row.linkageType == 2">监测联动</span>

				</template>

				<template slot-scope="{ row, index }" slot="action">

					<Button v-if="$store.state.app.iotInterFace == 0" icon="md-trash" type="error" size="small" @click="delLink(row,index)">{{$t('delete')}}</Button>
					<Button v-else icon="md-trash" type="error" size="small" @click="delLink(row,index)"></Button>
				</template>

			</Table>
		</div>
		<Modal title="选择联动" v-model="showBindingLink" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<binding-link-list :link-rtu-data="bindingLinkData" v-if="showBindingLink" @change-linding-ok="changeLindingOk"></binding-link-list>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size='18' class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>


</template>

<script>
	import {
		linkColumns
	} from '@/data/columns.js'
	import BindingLinkList from '../component/binding-link-list.vue'
	import {
		bindingRtuLinkage,getBindingRtuLinkage
	} from '@/api/strategy.js'
	export default {
		props:['number'],
		components: {
			BindingLinkList
		},
		data() {
			return {
				dis:false,
				showSpin:false,
				tableLoading: false,
				showBindingLink: false,
				bindingLinkColumns: linkColumns,
				rtuNumber: null,
				bindingLinkData: []
			}
		},
		methods: {
			getBindingRtuLinkInfo(){
				if(this.number != '' && this.number != null){
					this.rtuNumber = this.number
					this.showSpin = true
					this.dis = true
					getBindingRtuLinkage(this.number).then(res=>{
						const data = res.data
						this.showSpin = false
						if(data.success == 1){
							if(data.rtuLinkageList){
								this.bindingLinkData = data.rtuLinkageList
							}
						}else{
							this.$Message.error(data.errorMessage)
						}
					}).catch(error=>{
						this.showSpin = false
						alert(error)
					})
				}
			},
			delLink(row, index) {
				this.bindingLinkData.splice(index, 1)
			},
			handleSubmit() {
				if (this.rtuNumber == '') {
					alert('请先填写机器编号再进行提交')
					return;
				}
				var rtuLinkageIdList = []
				var list = this.bindingLinkData
				for(var i = 0;i<list.length;i++){
					rtuLinkageIdList.push(list[i].id)
				}
				var rtuLinkageIdList = {
					rtuNumber:parseInt(this.rtuNumber),
					rtuLinkageIdList:rtuLinkageIdList
					
				}
				this.showSpin = true
				bindingRtuLinkage(rtuLinkageIdList).then(res=>{
					const data = res.data
					this.showSpin = false
					if(data.success == 1){
						this.$Message.success('提交成功')
					}else{
						this.$Message.error(data.errorMessage)
					}
				}).catch(error=>{
					this.showSpin = false
					alert(error)
				})

			},
			changeLindingOk(list) {
				this.bindingLinkData = list
				this.showBindingLink = false
			}
		},
		mounted() {
			this.getBindingRtuLinkInfo()
		}
	}
</script>

<style>
	.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
	.bindingLinkStyle .btn1{
		display: inline-block;
	}
	@media screen and (min-width:300px) and (max-width:900px) {
		.bindingLinkStyle .btn1{
			display: block;
			margin-top: 0.625rem;
		}
		.bindingLinkStyle{
			padding-top: 0.625rem;
		}
		.bindingLinkStyle .ivu-modal-body {
			padding: 0;
		}
			
		.bindingLinkStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
