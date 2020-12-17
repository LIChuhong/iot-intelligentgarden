<template>
	<div class="timingListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchStrategy" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="timingColumns" :data="timingData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="timerType">
				<p v-show="row.timerType == 0">日</p>
				<p v-show="row.timerType == 1">星期</p>
				<p v-show="row.timerType == 2">月</p>
				<p>{{row.timerInterval}}</p>
			</template>

			<template slot-scope="{ row, index }" slot="action">
				<!-- <Button type="text" size="small" style="margin-right: 8px" @click="editor(row)">详情</Button> -->
				<Button icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)">编辑</Button>
				<Poptip :transfer="true" confirm title="你确定删除该定时吗?" @on-ok="del(row,index)">
					<Button icon="md-trash" type="error" size="small" style="margin-right: 8px">删除</Button>
				</Poptip>
				<i-switch :loading="row.switchLoading" v-model="row.enable" @on-change="setIsEnbleTiming(row)"></i-switch>

			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑定时" v-model="showTimingInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<timing-form :timing-id="timingId" v-if="showTimingInfo">编辑</timing-form>
		</Modal>
	</div>
</template>

<script>
	import {
		timingColumns
	} from '@/data/columns.js'
	import {
		getSwitchsStrategyTimerList,
		enableSwitchsStrategyTimer,
		delSwitchsStrategyTimer
	} from '@/api/strategy.js'
	import TimingForm from '../component/timing-form.vue'
	export default {
		name: 'timing_list',
		components: {
			TimingForm
		},
		data() {
			return {
				showTimingInfo:false,
				timingId: null,
				timingColumns: timingColumns,
				timingData: [],
				searchKey: '',
				maxId: 0,
				pageSize: 10,
				prevId: [0],
				tableLoading: false,
				strategyId: null,
				showStrategyInfo: false

			}
		},
		methods: {
			editor(row) {
				this.timingId = row.key
				this.showTimingInfo = true
			},
			del(row, index) {
				this.tableLoading = true
				delSwitchsStrategyTimer(row.key).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.timingData.splice(index, 1);
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			setIsEnbleTiming(row) {
				row.switchLoading = true
				enableSwitchsStrategyTimer(row.key, row.enable).then(res => {
					row.switchLoading = false
					const data = res.data
					if (data.success == 1) {
						if (row.enable) {
							this.$Message.success('定时启用成功')
						} else {
							this.$Message.success('定时禁用成功')
						}
					} else {
						this.$Message.error(data.errorMessage)
					}
					// console.log(this.orgListData)
				}).catch(error => {
					row.switchLoading = false
					alert(error)
				})
			},
			searchStrategy(val) {
				this.searchKey = val
				this.maxId = 0
				this.prevId = [0]
				this.getTimingList()

			},

			nextPage() {
				if (this.maxId == this.prevId[this.prevId.length - 1]) {
					this.$Message.warning('这是最后一页');
				} else {
					this.prevId.push(this.maxId)
					this.getTimingList()
				}

			},

			prevPage() {
				if (this.prevId.length > 1) {
					this.prevId.pop()
					this.maxId = this.prevId[this.prevId.length - 1]
					this.getTimingList()
				} else {
					this.$Message.warning('这是第一页');
				}

			},

			getTimingList() {
				this.tableLoading = true
				getSwitchsStrategyTimerList(this.searchKey, this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.timingData = data.switchsStrategyTimerList.map(item => {
							item.switchLoading = false
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

			this.getTimingList()
		}
	}
</script>

<style>
</style>
