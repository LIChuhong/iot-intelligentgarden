<template>
	<div class="warnRtuStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入设备名称查找" style="width: 300px" @on-search="searchWarnRtu" />
		</div>
		<Table size="small" border :columns="warnRtuColumns" :data="warnRtuData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<Button icon="ios-create-outline" type="primary" size="small" @click="editor(row)"></Button>
				<Button type="text" size="small" @click="showWarnRtu(row,index)">详情</Button>
				
				<Poptip placement="left" :transfer="true" confirm title="你确定删除该设备关联吗?" @on-ok="del(row,index)">
				<Button icon="md-trash" type="error" size="small" ></Button>
				</Poptip>
			</template>
		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="详情信息" v-model="showWRdetails" footer-hide width="90">
			<Icon slot="close" type="md-close"  size="30"/>
			<warn-rtu-details v-if="showWRdetails" :rtuNumber = "rtuNumber"></warn-rtu-details>
		</Modal>
		<Modal title="编辑设备关联" v-model="showRtuWarn" footer-hide >
			<Icon slot="close" type="md-close"  size="30"/>
			<param-form v-if="showRtuWarn" :rtuNumber = "rtuNumber">编辑</param-form>
		</Modal>
	</div>
</template>

<script>
	import {
		warnRtuColumns
	} from '@/data/columns.js'
	import { warnRtuList,delRtuParamWarn } from '@/api/warn.js'
	import WarnRtuDetails from '../component/warn-rtu-details.vue'
	// import WarnFrom
	import ParamForm from '../component/param-form.vue'
	export default {
		components:{
			WarnRtuDetails,
			ParamForm
		},
		data() {
			return {
				showRtuWarn:false,
				tableLoading: false,
				warnRtuColumns: warnRtuColumns,
				showWRdetails: false,
				warnRtuData: [{}],
				rtuName:'',
				maxId:0,
				pageSize:10,
				prevId:[0],
				rtuNumber:null,
			}
		},
		methods: {
			editor(row){
				this.rtuNumber = row.rtuNumber
				this.showRtuWarn = true
			},
			del(row,index){
				this.tableLoading = true
				delRtuParamWarn(row.rtuNumber).then(res=>{
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.warnRtuData.splice(index, 1);
						this.$Message.success('删除成功')
					}else{
						this.$Message.error('删除失败')
					}
				}).catch(error=>{
					this.tableLoading = false
					alert(error)
				})
			},
			showWarnRtu(row,index){
				this.rtuNumber = row.rtuNumber
				this.showWRdetails = true
			},
			getWarnRtuList() {
				
				this.tableLoading = true
				warnRtuList(this.rtuName,this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						 // console.log(data)
						this.warnRtuData = data.rtuList.map(item => {
							
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							// this.warnList.push(item)
							return item
						})
						// this.warnList.push()
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					//this.mRtuListLoading = false
					alert(error)
				})
			},
			searchWarnRtu(val){
				
			},
			nextPage() {
				// console.log(this.prevId)
				// console.log(this.maxId)
				if (this.warnRtuData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getWarnRtuList()
				}
			
			},
			
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getWarnRtuList()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},
		},
		created() {
			// console.log(1)
			this.getWarnRtuList()
		}
	}
</script>

<style>
	.warnRtuStyle .selStyle {
		width: 80px;
		float: left;
		margin-right: 8px;
	}

	.warnRtuStyle .inputStyle {
		width: 300px;
		float: left;
	}

	@media screen and (min-width:300px) and (max-width:900px) {
		.warnRtuStyle {
			margin-top: 0.625rem;
		}
		.warnRtuStyle .inputStyle{
			width: 60%;
		}

	 .ivu-modal-body {
			padding: 0;
		}

		.warnRtuStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
