<template>
	<div class="plotListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchPlot" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="plotColumns" :data="plotData" :loading="tableLoading">
			<template slot-scope="{ row, index }" slot="cropImgUrl">
				<img :src="row.cropImgUrl" style="height: 3.125rem;width: 3.125rem;" />
			</template>
			<template slot-scope="{ row, index }" slot="action">
				<Button type="primary" ghost size="small" @click="checkPlot(row)">选择</Button>
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
		plotColumns
	} from '@/data/columns.js'
	import {
		getMassifList
	} from '@/api/plot.js'
	export default {
		data() {
			return {
				plotColumns: plotColumns,
				plotData: [{}],
				tableLoading: false,
				maxId: 0,
				pageSize: 10,
				prevId: [0],
				massifName: ''
			}
		},
		methods: {
			checkPlot(row){
				// console.log(row)
				this.$emit('get-plot-info',row)
			},
			nextPage() {
				if (this.plotData.length < this.pageSize) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getPlotList()
				}

			},

			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getPlotList()
				} else {
					this.$Message.warning('这是第一页');
				}

			},
			getPlotList() {
				this.tableLoading = true
				getMassifList(this.massifName, this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.plotData = data.iaMassifList.map(item => {
							// item.checkLoading = false
							// item.switchLoading = false
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
			},
			searchPlot(searchKey) {
				this.massifName = searchKey
				this.maxId = 0
				this.prevId = [0]
				this.getPlotList()
			}
		},
		created() {
			this.getPlotList()
		}

	}
</script>

<style>
</style>
