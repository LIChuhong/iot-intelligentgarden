<template>
	<div class="strListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchStrategy" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="strategyColumns" :data="strategyData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" size="small" @click="change(row)">选择</Button>

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
		strategyColumns
	} from '@/data/columns.js'
	import {
		getExeModeSwitchsStrategyList,
	} from '@/api/strategy.js'
	export default {
		name: 'mode_strategy_list',
		
		data() {
			return {
				strategyColumns: strategyColumns,
				strategyData: [],
				searchKey: '',
				exeMode: 1,
				maxId: 0,
				pageSize: 10,
				prevId: [0],
				tableLoading: false,
				strategyId: null,
				showStrategyInfo: false

			}
		},
		methods: {
			change(row){
				this.$emit('get-strategy-info',row)
			},
			searchStrategy(val) {
				this.searchKey = val
				this.maxId = 0
				this.prevId = [0]
				this.getStrategyList()

			},
			
			nextPage() {
				if(this.strategyData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getStrategyList()
				}
			
			},
			
			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getStrategyList()
				} else {
					this.$Message.warning('这是第一页');
				}
			
			},
			
			getStrategyList() {
				this.tableLoading = true
				getExeModeSwitchsStrategyList(this.exeMode, this.searchKey, this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.strategyData = data.switchsStrategyList.map(item => {
							if (this.maxId < item.id) {
								this.maxId = item.id
							}
							return item
						})
						// this.strategyData = data.switchsStrategyList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			}
		},
		created() {
			this.getStrategyList()
		}
	}
</script>

<style>
</style>
