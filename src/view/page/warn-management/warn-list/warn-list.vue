<template>
	<div class="warnListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入告警名称查找" style="width: 300px" @on-search="searchWarnName" />
		</div>
		<Table size="small" border :columns="warnListColumns" :data="warnListData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<Button v-if="$store.state.app.iotInterFace == 0" icon="ios-create-outline" type="primary" size="small" @click="show_warn_info(row,index)">编辑</Button>
				<Button v-else icon="ios-create-outline" type="primary" size="small" @click="show_warn_info(row,index)"></Button>

			</template>
		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑信息" v-model="showWarnInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<warn-from :warn-info="warnInfo" v-if="showWarnInfo" @update-success = "updateSuccess">编辑</warn-from>
		</Modal>
	</div>
</template>


<script>
	import WarnFrom from '../component/warn-form.vue'
	import {
		warnListColumns
	} from '@/data/columns.js'
	import {
		getParameterWarnInfoList
	} from '@/api/warn'
	export default {
		components:{
			WarnFrom
		},
		data() {
			return {
				warnListColumns:warnListColumns,
				warnListData:[],
				tableLoading:false,
				showWarnInfo:false,
				warnInfo:null,
				warnName:'',
				maxId:0,
				pageSize:10,
				prevId: [0],
				index:null
				// warnList:[]
			}
		},
		methods:{
			getWarnList() {
				this.tableLoading = true
				getParameterWarnInfoList(this.warnName,this.maxId, this.pageSize).then(res => {
					const data = res.data
					// console.log(data)
					this.tableLoading = false
					if (data.success == 1) {
						// console.log(data)
						this.warnListData = data.parameterWarnInfoList.map(item => {
							
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
			nextPage() {
				// console.log(this.prevId)
				// console.log(this.maxId)
				if (this.warnListData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getWarnList()
				}
			
			},
			
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getWarnList()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},
			show_warn_info(row,index){
				// console.log(row)
				this.warnInfo = row
				this.index = index
				this.showWarnInfo = true
			},
			updateSuccess(info){
				// console.log(info)
				this.warnListData[this.index].warnName = info.warnName
				this.warnListData[this.index].warnMaxValue = info.warnMaxValue
				this.warnListData[this.index].warnMinValue = info.warnMinValue
				
			},
			searchWarnName(val){
				this.warnName = val
				this.maxId = 0
				this.prevId = [0]
				this.getWarnList()
			}
		},
		created() {
			this.getWarnList()
		}
	}
</script>

<style>
	@media screen and (min-width:300px) and (max-width:900px) {
		.warnListStyle {
			margin-top: 0.625rem;
		}
	
		.warnListStyle .ivu-modal-body {
			padding: 0;
		}
	
		.warnListStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
