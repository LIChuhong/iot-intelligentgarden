<template>
	<div ref="tabH" class="demo-tabs-style1" style="height: 100%;">
		<Tabs type="card" v-model="tabsName">
			<div slot="extra" style="padding:0.3rem 0.5rem 0;">
				<span class="demo-tabs-style2">
				<Button  @click="refresh" icon="md-refresh" style="margin-right: 0.625rem;"></Button>
				</span>
				<Button v-show="tabsName == '添加定时'" @click="addTiming" type="primary" icon="md-add">{{tabsName}}</Button>
				<Button v-show="tabsName == '添加策略'" @click="addStrategy" type="primary" icon="md-add">{{tabsName}}</Button>
			</div>
			<TabPane label="定时" name="添加定时" :style="{height:tabHeight,overflow:'auto'}">
				<List item-layout="vertical">
					<ListItem v-for="(item,index) in timingDataList" :key="index">
						<ListItemMeta>
							<template slot="title">
								<div style="overflow: hidden;padding: 0 1rem;">
									<span>定时名称:{{item.timerName}}</span>
									<span style="float: right;">类型:{{item.timerType == 0?'日':item.timerType == 1?'星期':'月'}}</span>
								</div>
								<div style="overflow: hidden;padding: 0 1rem;">
									<span>执行时间:<span style="color: #2d8cf0;">{{item.startTimer}}</span></span>
									<span style="float: right;">周期:{{item.timerInterval}}</span>
								</div>
								<div style="overflow: hidden;padding: 0 1rem;">
									<span>策略:<span style="color: #2d8cf0;">{{item.switchsStrategyName}}</span></span>
									<span style="float: right;">所属组织:{{item.orgName}}</span>
								</div>
							</template>
							<template slot="description">
								<div style="overflow: hidden;padding: 0 1rem;">
									<span>创建人:{{item.userName}}</span>
								</div>
							</template>
						</ListItemMeta>
						<template slot="action">
							<div style="text-align: right;padding: 0 1rem;">
								<Button size="small" icon="ios-create-outline" type="primary" style="margin-right:1rem" @click="editorTiming(item)"></Button>
								<Poptip placement="right" :transfer="true" confirm title="你确定删除该定时吗?" @on-ok="delTiming(item,index)">
									<Button size="small" icon="ios-trash" type="error" style="margin-right: 1rem"></Button>
								</Poptip>
								<i-switch size="small" :loading="item.switchLoading"  v-model="item.enable" @on-change="setIsEnbleTiming(item)"></i-switch>
							</div>

						</template>

					</ListItem>
					<div v-show="addList" style="text-align: center;font-size: 1rem;padding: 0.625rem 0;"><a @click="getTimingList">加载更多...</a></div>
				</List>

			</TabPane>
			<TabPane label="列表" name="添加策略" :style="{height:tabHeight,overflow:'auto'}">
				<strategy-list v-show="tabsName == '添加策略'"></strategy-list>
				<!-- <strategy-list></strategy-list>
				<strategy-list></strategy-list> -->
			</TabPane>
			<!-- <TabPane label="标签三">标签三的内容</TabPane> -->
		</Tabs>
		<Modal :title="timingText +'定时'" v-model="showTimingInfo" footer-hide :styles="{top: '50px'}">
			<Icon slot="close" type="md-close"  size="30"/>
			<timing-form :timing-id="timingId" v-if="showTimingInfo">{{timingText}}</timing-form>
		</Modal>
		<Modal title="添加策略" v-model="showStrategyInfo" footer-hide :styles="{top: '50px'}">
			<Icon slot="close" type="md-close"  size="30"/>
			<strategy-form v-show="showStrategyInfo">添加</strategy-form>
		</Modal>

	</div>
</template>

<script>
	import {
		getSwitchsStrategyTimerList,
		enableSwitchsStrategyTimer,
		delSwitchsStrategyTimer
	} from '@/api/strategy.js'
	import TimingForm from '@/view/page/strategy-management/component/timing-form.vue'
	import StrategyList from '@/view/page/strategy-management/strategy-list/strategy-list.vue'
	import StrategyForm from '@/view/page/strategy-management/component/strategy-form.vue'
	export default {
		components: {
			TimingForm,
			StrategyList,
			StrategyForm
		},
		data() {
			return {
				showTimingInfo: false,
				timingId: null,
				tabsName: '添加定时',
				pageSize: 10,
				maxId: 0,
				timingDataList: [],
				addList: false,
				tabHeight: '500px',
				timingText: '',
				showStrategyInfo: false
			}
		},
		methods: {
			refresh() {
				this.maxId = 0
				this.timingDataList = []
				this.getTimingList()
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
			editorTiming(row) {
				this.timingId = row.key
				this.timingText = '编辑'
				this.showTimingInfo = true
			},
			delTiming(row, index) {
				delSwitchsStrategyTimer(row.key).then(res => {
					const data = res.data
					if (data.success == 1) {
						this.timingDataList.splice(index, 1);
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}

				}).catch(error => {
					alert(error)
				})
			},
			getTimingList() {
				this.tabHeight = (this.$refs.tabH.clientHeight - 40) + 'px'
				getSwitchsStrategyTimerList('', this.maxId, this.pageSize).then(res => {
					const data = res.data
					if (data.success == 1) {
						if (data.switchsStrategyTimerList) {
							var list = []
							list = data.switchsStrategyTimerList
							list.map(item => {
								item.switchLoading = false
								if (this.maxId < item.id) {
									this.maxId = item.id
								}
								this.timingDataList.push(item)
								return item
							})
							if (list.length == this.pageSize) {
								this.addList = true
							} else {
								this.addList = false
							}
						}
						console.log(this.timingDataList)
						// this.strategyData = data.switchsStrategyList
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false
					alert(error)
				})
			},
			addTiming() {
				// alert(1)
				this.timingId = null
				this.timingText = '添加'
				this.showTimingInfo = true

			},
			addStrategy() {
				this.showStrategyInfo = true
			}
		},
		mounted() {
			this.getTimingList()
		}
	}
</script>

<style>
	 .ivu-modal-body {
		padding: 1rem;
	}
	@media screen and (min-width:300px) and (max-width:900px) {
		.demo-tabs-style2 .ivu-btn{
			padding: 0;
		}
		.demo-tabs-style1 .ivu-modal-body {
			padding: 1rem;
		}
		.demo-tabs-style1 .ivu-btn-icon-only.ivu-btn-small {
			/* font-size: 0.75rem; */
			padding: 0;
		}
		.demo-tabs-style1>.ivu-tabs-card>.ivu-tabs-content {
			/* height: 120px; */
			/* margin-top: -16px; */
		}

		.demo-tabs-style1 .ivu-tabs-bar {
			margin: 0;
		}

		.demo-tabs-style1>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-container {
			height: 2.5rem;
		}

		.demo-tabs-style1 .ivu-list-vertical .ivu-list-item-extra {
			margin: 0px;
		}

		.demo-tabs-style1 .ivu-list-vertical .ivu-list-item-meta {
			margin: 0px;
		}

		.demo-tabs-style1 .ivu-list-vertical .ivu-list-item-action {
			margin: 0px;
		}

		.demo-tabs-style1>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
			height: 2.4375rem;
			padding: 0.625rem 1rem 0.25rem
		}


	}
</style>
