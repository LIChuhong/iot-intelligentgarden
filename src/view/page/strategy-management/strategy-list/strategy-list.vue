<template>
	<div class="strListStyle">
		<div style="padding-bottom: 20px;">
			<Input search enter-button placeholder="请输入关键字查找" style="width: 300px" @on-search="searchStrategy" />
		</div>
		<!-- <div style="height: 200px;"></div> -->
		<Table size="small" border :columns="strategyColumns" :data="strategyData" :loading="tableLoading">

			<template slot-scope="{ row, index }" slot="action">
				<!-- <Button type="primary" size="small" style="margin-right:0.5rem" @click="editor(row)">取消</Button> -->

				<div v-if="$store.state.app.iotInterFace == 0">
					<Poptip :transfer="true" placement="right" confirm title="确定取消当前策略吗?" @on-ok="cancelSwitchsStrategyMethod(row)">
						<Button type="text" size="small">取消</Button>
					</Poptip>
					<Poptip :transfer="true" style="margin:0 8px" placement="right" confirm  @on-ok="setControlStrategyMethod(row,abnormal)">
						<template slot="title">
							<Checkbox v-model="abnormal">异常立刻结束</Checkbox>
						</template>
						<Button type="text" size="small">启动</Button>
					</Poptip>

					<Button icon="ios-create-outline" type="primary" size="small" style="margin-right: 8px" @click="editor(row)">编辑</Button>
					<Poptip :transfer="true" confirm title="你确定删除该策略吗?" @on-ok="del(row,index)">
						<Button icon="md-trash" type="error" size="small">删除</Button>
					</Poptip>
				</div>
				<div v-else style="padding: 0.3125rem 0;">
					<Button icon="ios-create-outline" type="primary" size="small" style="margin-right:0.5rem" @click="editor(row)"></Button>
					<Poptip :transfer="true" placement="right" confirm title="你确定删除该策略吗?" @on-ok="del(row,index)">
						<Button icon="ios-trash" type="error" size="small"></Button>
					</Poptip>
					<div style="margin: 0.3125rem 0;">
						<Poptip :transfer="true" placement="right" confirm title="确定取消当前策略吗?" @on-ok="cancelSwitchsStrategyMethod(row)">
							<Button type="text" size="small">取消</Button>
						</Poptip>
					</div>
					<Poptip :transfer="true" placement="right" confirm @on-ok="setControlStrategyMethod(row,abnormal)">
						<template slot="title">
							<Checkbox v-model="abnormal">异常立刻结束</Checkbox>
						</template>
						<Button type="text" size="small">启动</Button>
					</Poptip>

				</div>
				<!-- <Button type="primary" size="small" style="margin-right:0.5rem" @click="editor(row)">手动</Button> -->
			</template>

		</Table>
		<div style="overflow: hidden;padding:0.625rem 0.625rem;">
			<Button type="primary" ghost style="float: right;" @click="nextPage">下一页</Button>
			<Button type="primary" ghost style="float: right;margin-right: 0.625rem;" @click="prevPage">上一页</Button>
		</div>
		<Modal title="编辑策略" v-model="showStrategyInfo" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<strategy-form :strategy-id="strategyId" v-if="showStrategyInfo">编辑</strategy-form>
		</Modal>
	</div>
</template>

<script>
	import {
		strategyColumns
	} from '@/data/columns.js'
	import {
		getSwitchsStrategyList,
		delSwitchsStrategy,
		cancelSwitchsStrategy,
		setControlStrategy
	} from '@/api/strategy.js'
	import StrategyForm from '../component/strategy-form.vue'
	export default {
		name: 'strategy_list',
		components: {
			StrategyForm
		},
		data() {
			return {
				strategyColumns: strategyColumns,
				strategyData: [],
				searchKey: '',
				orgId: this.$store.state.user.userInfo.orgId,
				maxId: 0,
				pageSize: 10,
				prevId: [0],
				tableLoading: false,
				strategyId: null,
				showStrategyInfo: false,
				abnormal:false

			}
		},
		methods: {
			setControlStrategyMethod(row,abnormal){
				this.tableLoading = true
				var rtuDataStrategy = {
					switchstrategyId:row.id,
					mustAllPass:abnormal
				}
				setControlStrategy(rtuDataStrategy).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						// this.strategyData.splice(index, 1);
						this.$Message.success('启用成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			cancelSwitchsStrategyMethod(row) {
				this.tableLoading = true
				cancelSwitchsStrategy(row.id).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						// this.strategyData.splice(index, 1);
						this.$Message.success('取消成功')
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			del(row, index) {
				console.log(row)
				this.tableLoading = true
				delSwitchsStrategy(row.id).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.strategyData.splice(index, 1);
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},

			searchStrategy(val) {
				this.searchKey = val
				this.maxId = 0
				this.prevId = [0]
				this.getStrategyList()

			},
			editor(row) {
				this.strategyId = row.id
				this.showStrategyInfo = true

			},
			nextPage() {
				// if (this.strategyData.length < this.pageSize) {
				// console.log(this.maxId)
				// console.log(this.prevId[this.prevId.length-1])
				if (this.maxId == this.prevId[this.prevId.length - 1]) {
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
				// alert(1)
				this.tableLoading = true
				getSwitchsStrategyList(this.orgId, this.searchKey, this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						this.strategyData = data.switchsStrategyList.map(item => {
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
			}
		},
		created() {
			this.getStrategyList()
		}
	}
</script>

<style>

	@media screen and (min-width:300px) and (max-width:900px) {
		.strListStyle {
			margin-top: 0.625rem;
		}

		.strListStyle .ivu-modal-body {
			/* padding: 0; */
		}

		.strListStyle .ivu-table-cell {
			padding: 0;
			margin: 0;
		}
	}
</style>
