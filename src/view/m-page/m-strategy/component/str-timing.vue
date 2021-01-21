<template>
	<div>
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
							<span style="float: right;">周期:{{item.timerInterval1}}</span>
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
						<i-switch size="small" :loading="item.switchLoading" v-model="item.enable" @on-change="setIsEnbleTiming(item)"></i-switch>
					</div>
		
				</template>
		
			</ListItem>
			<div v-show="addList" style="text-align: center;font-size: 1rem;padding: 0.625rem 0;"><a @click="getTimingList">加载更多...</a></div>
		</List>
		<Modal title="编辑定时" v-model="showTimingInfo" footer-hide :styles="{top: '50px'}">
			<Icon slot="close" type="md-close" size="30" />
			<timing-form :timing-id="timingId" v-if="showTimingInfo">编辑</timing-form>
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
	export default{
		props:['orgId'],
		components: {
			TimingForm
		},
		data(){
			return{
				timingDataList: [],
				pageSize: 10,
				maxId: 0,
				addList:true,
				timingId: null,
				showTimingInfo:false
			}
		},
		watch:{
			orgId(val){
				// console.log(val)
				this.timingDataList = []
				this.maxId = 0
				this.getTimingList()
			}
		},
		methods:{
			editorTiming(row) {
				this.timingId = row.key
				this.showTimingInfo = true
			},
			delTiming(row, index) {
				delSwitchsStrategyTimer(row.key).then(res => {
					const data = res.data
					if (data.success == 1) {
						this.timingDataList.splice(index, 1)
						this.$Message.success('删除成功')
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
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
			getTimingList() {
				getSwitchsStrategyTimerList(this.orgId,'', this.maxId, this.pageSize).then(res => {
					const data = res.data
					if (data.success == 1) {
						if (data.data) {
							var list = []
							list = data.data
							list.map(item => {
								item.switchLoading = false
								if (this.maxId < item.id) {
									this.maxId = item.id
								}
								if (item.timerType == 1) {
									var timerList = item.timerInterval.split(",")
									var timerInterval = []
									for (var i = 0; i < timerList.length; i++) {
										if (timerList[i] == '0') {
											timerInterval.push('日')
										}
										if (timerList[i] == '1') {
											timerInterval.push('一')
										}
										if (timerList[i] == '2') {
											timerInterval.push('二')
										}
										if (timerList[i] == '3') {
											timerInterval.push('三')
										}
										if (timerList[i] == '4') {
											timerInterval.push('四')
										}
										if (timerList[i] == '5') {
											timerInterval.push('五')
										}
										if (timerList[i] == '6') {
											timerInterval.push('六')
										}
									}
									item.timerInterval1 = timerInterval.toString()
								} else {
									item.timerInterval1 = item.timerInterval
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
					} else {
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					alert(error)
				})
			},
			
		},
		mounted() {
			this.getTimingList()
		}
	}
</script>

<style>
</style>
