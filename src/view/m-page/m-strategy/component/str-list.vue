<template>
	<div>
	<List :loading="listLoading">
		<ListItem v-for="(item,index) in strategyData" :key="index">
			<ListItemMeta>
				<template slot="title" >
					<div style="padding: 0 1rem;font-size: 1rem;">
					<div>
						<span style="margin-right: 0.3125rem;color: #ff9900;">ID:{{item.id}}</span>
						<span>策略名称:<span style="color: #2d8cf0;">{{item.strategyName}}</span></span>
					</div>
					<div>所属组织:<span>{{item.orgName}}</span></div>
					<div>创建人:{{item.userName}}</div>
					</div>
				</template>
			</ListItemMeta>
			<template slot="action">
				<div>
					<Poptip :transfer="true" placement="right" confirm title="确定取消当前策略吗?" @on-ok="cancelSwitchsStrategyMethod(item)">
						<Button type="text" size="small">取消</Button>
					</Poptip>
					<Poptip :transfer="true" placement="right" confirm @on-ok="setControlStrategyMethod(item,abnormal)">
						<template slot="title">
							<Checkbox v-model="abnormal">异常立刻结束</Checkbox>
						</template>
						<Button type="text" size="small">启动</Button>
					</Poptip>
				</div>
				<div style="padding:0.625rem;">
					<Button size="small" icon="ios-create-outline" type="primary" style="margin-right:1rem" @click="editor(item)"></Button>
					<Poptip placement="right" :transfer="true" confirm title="你确定删除该策略吗?" @on-ok="del(item,index)">
						<Button size="small" icon="ios-trash" type="error" style="margin-right: 1rem"></Button>
					</Poptip>
					<!-- <i-switch size="small" :loading="item.switchLoading" v-model="item.enable" @on-change="setIsEnbleTiming(item)"></i-switch> -->
					
				</div>
				

			</template>

		</ListItem>
		<div v-show="addList" style="text-align: center;font-size: 1rem;padding: 0.625rem 0;"><a @click="getStrategyList">加载更多...</a></div>
	</List>
	<Modal title="编辑策略" v-model="showStrategyInfo" footer-hide>
		<Icon slot="close" type="md-close" size="30" />
		<strategy-form :strategy-id="strategyId" v-if="showStrategyInfo">编辑</strategy-form>
	</Modal>
	</div>
</template>

<script>
	import {
		getSwitchsStrategyList,
		delSwitchsStrategy,
		cancelSwitchsStrategy,
		setControlStrategy
	} from '@/api/strategy.js'
	import StrategyForm from '@/view/page/strategy-management/component/strategy-form.vue'
	export default {
		props:['orgId'],
		components: {
			StrategyForm
		},
		data() {
			return {
				listLoading:false,
				strategyData: [],
				searchKey: '',
				// orgId: this.$store.state.user.userInfo.orgId,
				maxId: 0,
				pageSize: 10,
				addList:true,
				abnormal: false,
				showStrategyInfo: false,
				strategyId: null,
			}
		},
		watch:{
			orgId(val){
				// console.log(val)
				this.strategyData = []
				this.maxId = 0
				this.getStrategyList()
			}
		},
		methods: {
			editor(row) {
				this.strategyId = row.id
				this.showStrategyInfo = true
			},
			setControlStrategyMethod(row, abnormal) {
				// this.listLoading = true
				var rtuDataStrategy = {
					switchstrategyId: row.id,
					mustAllPass: abnormal
				}
				setControlStrategy(rtuDataStrategy).then(res => {
					const data = res.data
					this.listLoading = false
					if (data.success == 1) {
						// this.strategyData.splice(index, 1);
						this.$Message.success('启用成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.listLoading = false
					alert(error)
				})
			},
			cancelSwitchsStrategyMethod(row) {
				// this.listLoading = true
				cancelSwitchsStrategy(row.id).then(res => {
					const data = res.data
					this.listLoading = false
					if (data.success == 1) {
						this.$Message.success('取消成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.listLoading = false
					alert(error)
				})
			},
			del(row, index) {
				// console.log(row)
				// this.listLoading = true
				delSwitchsStrategy(row.id).then(res => {
					const data = res.data
					this.listLoading = false
					if (data.success == 1) {
						this.strategyData.splice(index, 1)
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.listLoading = false
					alert(error)
				})
			},
			getStrategyList() {
				// alert(1)
				// this.listLoading = true
				getSwitchsStrategyList(this.orgId, this.searchKey, this.maxId, this.pageSize).then(res => {
					const data = res.data
					this.listLoading = false
					if (data.success == 1) {
						if(data.data){
							var list = data.data
							list.map(item => {
								if (this.maxId < item.id) {
									this.maxId = item.id
								}
								this.strategyData.push(item)
								return item
							})
							if (list.length == this.pageSize) {
								this.addList = true
							} else {
								this.addList = false
							}
						}
						
						// console.log(this.strategyData)
						// this.strategyData = data.switchsStrategyList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.listLoading = false
					alert(error)
				})
			}
		},
		mounted() {
			this.getStrategyList()
		}

	}
</script>

<style>
	@media screen and (min-width:300px) and (max-width:900px) {
		
	}
</style>
