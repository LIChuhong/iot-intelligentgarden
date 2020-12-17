<template>
	<div class="linkListStyle">
		<div style="margin-bottom: 0.625rem;overflow: hidden;">
			<span>已选择ID：</span>
			<Button style="float: right;" type="primary"  @click="changeOk">确定</Button>
		</div>
		<div>
			<div v-for="(item,i) in bindingLinkList" :key="i" style="background: #c5c8ce;padding: 0.3125rem;border-radius:5%;margin:0 0 0.3125rem 0.3125rem;display: inline-block;">{{item.id}}
				<Icon type="md-close" style="margin-left: 0.3125rem;cursor:pointer;" @click="delLinkRtu(i)" /></div>
		</div>
		<Table size="small" border :columns="linkColumns" :data="linkData" :loading="tableLoading">
			

			<template slot-scope="{ row, index }" slot="action">

				<Button ghost type="primary" size="small"  @click="change(row)">选择</Button>
			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
	
	</div>
</template>


<script>
	import {
		bindingLinkColumns
	} from '@/data/columns.js'
	import {
		getRtuLinkageList
	} from '@/api/strategy.js'
	
	export default {
		// name: 'link_list',
		props:['linkRtuData'],
		components:{
			
		},
		data() {
			return {
				bindingLinkList:[],
				showLinkInfo: false,
				linkColumns: bindingLinkColumns,
				linkData: [],
				tableLoading: false,
				searchKey: '',
				maxId: 0,
				pageSize: 10,
				prevId: [0],
			}
		},
		methods: {
			changeOk(){
				this.$emit('change-linding-ok',this.bindingLinkList)
			},
			delLinkRtu(i){
				this.bindingLinkList.splice(i, 1)
			},
			change(row){
				let bindingLinkList = this.bindingLinkList
				var index = 0
				for (var i in bindingLinkList) {
					if (bindingLinkList[i].id == row.id) {
						index++
					}
				}
				if (index == 0) {
					this.bindingLinkList.push(row)
				}
			},
			nextPage() {
				if (this.linkData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getLinkDataList()
				}

			},
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getLinkDataList()
				} else {
					this.$Message.warning('这是第一页');
				}

			},
			
			getLinkDataList() {
				this.tableLoading = true
				getRtuLinkageList(this.searchKey, this.maxId, this.pageSize).then(res => {
					this.tableLoading = false
					const data = res.data
					if (data.success == 1) {
						// console.log(data)
						// this.linkData = data.rtuLinkageList
						this.linkData = data.rtuLinkageList.map(item => {
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							// item.createTime = timestampToTime(item.createTime)
							return item
						})
									
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			}
		},

		mounted() {
			// var list = this.linkRtuData
			this.bindingLinkList = this.linkRtuData
			this.getLinkDataList()
		}
	}
</script>

<style>
</style>
