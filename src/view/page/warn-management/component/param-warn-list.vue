<template>
	<div class="warnListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入告警名称查找" style="width: 300px" @on-search="searchWarnName" />
		</div>
		<Table size="small" border :columns="warnListColumns" :data="warnListData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" size="small" @click="changeWarn(row)">选择</Button>
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
		warnListColumns
	} from '@/data/columns.js'
	import {
		getParameterWarnInfoList
	} from '@/api/warn'
	export default {
		props:['listIndex'],
		data() {
			return {
				warnListColumns: warnListColumns,
				warnListData: [],
				tableLoading: false,
				warnInfo: null,
				warnName: '',
				maxId: 0,
				pageSize: 10,
				prevId: [0],

			}
		},
		methods: {
			changeWarn(row){
				this.$emit('change-warn-info',row,this.listIndex)
			},
			getWarnList() {
				this.tableLoading = true
				getParameterWarnInfoList(this.warnName, this.maxId, this.pageSize).then(res => {
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
						// this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					//this.mRtuListLoading = false
					alert(error)
				})
			},
			nextPage() {
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
			show_warn_info(row, index) {
				this.warnInfo = row
				this.index = index
				this.showWarnInfo = true
			},

			searchWarnName(val) {
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
</style>
