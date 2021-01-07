<template>
	<div>
		<Form :label-width="100" ref="timerForm" :model="timerForm" :rules="timerRule" label-position="left">
			<FormItem label="定时名称" prop="timerName">
				<Input type="text" :maxlength="50" v-model="timerForm.timerName" placeholder="请输入定时名称"></Input>
			</FormItem>
			<FormItem label="定时类型" prop="timerType">
				<RadioGroup v-model="timerForm.timerType">
					<Radio :label="0"><span>日</span></Radio>
					<Radio :label="1"><span>星期</span></Radio>
					<Radio :label="2"><span>月</span></Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-show="timerForm.timerType != 0" label="定时周期" prop="timerInterval">
				<CheckboxGroup v-show="timerForm.timerType == 1" v-model="timerInterval1">
					<Checkbox v-for="item in weekList" :key="item.value" :label="item.value">{{ item.label }}</Checkbox>
				</CheckboxGroup>
				<CheckboxGroup v-show="timerForm.timerType == 2" v-model="timerInterval2">
					<Checkbox v-for="n in 31" :key="n" :label="n"></Checkbox>
				</CheckboxGroup>
			</FormItem>
			<FormItem label="执行时间" prop="startTimer">
				<TimePicker confirm v-model="timerForm.startTimer" format="HH:mm" placeholder="请选择执行时间" :editable="false"></TimePicker>
			</FormItem>
			<FormItem label="控制策略" prop="switchsStrategyId">
				<Input readonly v-model="switchsStrategyName" search :enter-button="$t('choose')" placeholder="请选择控制策略" @on-search="showStrategyList"></Input>
			</FormItem>
			<FormItem label="所属组织" prop="belongOrgId">
				<Input readonly v-model="belongOrgName" search :enter-button="$t('choose')" placeholder="请选择所属组织" @on-search="showBelongOrgList"></Input>
			</FormItem>
			<FormItem style="text-align: center;">
				<Button @click="handleReset('timerForm')" style="margin-right: 8px">{{$t('reset')}}</Button>
				<Button type="primary" @click="handleSubmit('timerForm')">
					<slot></slot>
				</Button>
				
			</FormItem>
		</Form>
		<Modal title="选择控制策略" v-model="showStrategy" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<mode-strategy-list v-if="showStrategy" @get-strategy-info="getStrategyInfo"></mode-strategy-list>
		</Modal>
		<Modal :title="'当前选择:'+ belongOrgTitle" v-model="showBelongOrg">
			<Icon slot="close" type="md-close"  size="30"/>
			<div class="tree-style">
				<org-tree v-if="showBelongOrg" @getBelongOrgInfo="showBelongOrgInfo" :orgTypeId="null"></org-tree>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" @click="belongOrgOk">{{$t('ok')}}</Button>
			</div>
		</Modal>

		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>

<script>
	import OrgTree from '@/view/components/org-tree.vue'
	import ModeStrategyList from './mode-strategy-list.vue'
	import {
		getNowFormatDate
	} from '@/libs/tools'
	import {
		addSwitchsStrategyTimer,
		getSwitchsStrategyTimer,
		updateSwitchsStrategyTimer
	} from '@/api/strategy.js'
	export default {
		components: {
			OrgTree,
			ModeStrategyList
		},
		props: ['timingId'],
		data() {
			const validateTimerName = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback(new Error('定时名称不能为空'));
				} else {
					callback();
				}
			};
			return {
				showSpin: false,
				timerInterval1: [],
				timerInterval2: [],
				switchsStrategyName: '',
				showStrategy: false,
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgName: '', //所属组织名称
				belongOrgInfo: '', //所属组织信息
				timerForm: {
					timerName: '',
					timerType: 0,
					timerInterval: '',
					startTimer: '',
					belongOrgId: '',
					switchsStrategyId: ''

				},
				timerRule: {
					timerName: [{
						required: true,
						// message: '定时名称不能为空',
						validator: validateTimerName,
						trigger: 'blur'
					}],
					timerType: [{
						required: true,
						type: 'number',
						message: '请选择定时类型',
						trigger: 'change'
					}],
					startTimer: [{
						required: true,
						type: 'string',
						message: '请选择执行时间',
						trigger: 'change'
					}],
					belongOrgId: [{
						required: true,
						type: 'number',
						message: '请选择用户所属组织',
						trigger: 'change'
					}],
					switchsStrategyId: [{
						required: true,
						type: 'number',
						message: '请选择控制策略',
						trigger: 'change'
					}],
				},
				weekList: [{
					value: 0,
					label: '星期日'
				}, {
					value: 1,
					label: '星期一'
				}, {
					value: 2,
					label: '星期二'
				}, {
					value: 3,
					label: '星期三'
				}, {
					value: 4,
					label: '星期四'
				}, {
					value: 5,
					label: '星期五'
				}, {
					value: 6,
					label: '星期六'
				}, ]
			}
		},
		methods: {
			getTimingInfo() {
				if (this.timingId != null && this.timingId != '') {
					this.showSpin = true
					getSwitchsStrategyTimer(this.timingId).then(res => {
						const data = res.data
						this.showSpin = false
						if (data.success == 1) {
							
							var switchsStrategyTimer = data.switchsStrategyTimer
							var time = switchsStrategyTimer.startTimer.split(" ")
							this.timerForm = {
								id:switchsStrategyTimer.id,
								timerName:switchsStrategyTimer.timerName,
								timerType:switchsStrategyTimer.timerType,
								timerInterval:switchsStrategyTimer.timerInterval,
								belongOrgId:switchsStrategyTimer.belongOrgId,
								switchsStrategyId:switchsStrategyTimer.switchsStrategyId,
								startTimer:time[1]
							}
							if(switchsStrategyTimer.timerInterval){
								var timerInterval = switchsStrategyTimer.timerInterval.split(",").map(item=>{
									return parseInt(item)
								})
								if(switchsStrategyTimer.timerType == 1){
									this.timerInterval1 = timerInterval
								}
								if(switchsStrategyTimer.timerType == 2){
									this.timerInterval2 = timerInterval
								}
							}
							
							this.switchsStrategyName = switchsStrategyTimer.switchsStrategyName
							this.belongOrgName = switchsStrategyTimer.orgName
						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				}
			},
			handleReset (name) {
			    this.$refs[name].resetFields();
				this.switchsStrategyName = ''
				this.belongOrgName = ''
				
			},
			handleSubmit(name) {
				// console.log(getNowFormatDate(new Date(),'-'))
				this.$refs[name].validate((valid) => {
					if (valid) {

						if (this.timerForm.timerType == 1) {
							this.timerForm.timerInterval = this.timerInterval1.toString()
							if(this.timerForm.timerInterval == ''){
								alert('请选择定时周期')
								return
							}
						} else if (this.timerForm.timerType == 2) {
							this.timerForm.timerInterval = this.timerInterval2.toString()
							if(this.timerForm.timerInterval == ''){
								alert('请选择定时周期')
								return
							}
						} else {
							this.timerForm.timerInterval = ''
						}
						var date = getNowFormatDate(new Date(), '-')
						var switchsStrategyTimer = {
							timerName: this.timerForm.timerName,
							timerType: this.timerForm.timerType,
							timerInterval: this.timerForm.timerInterval,
							startTimer: date + ' ' + this.timerForm.startTimer,
							belongOrgId: this.timerForm.belongOrgId,
							switchsStrategyId: this.timerForm.switchsStrategyId
						}
						// console.log(switchsStrategyTimer)

						this.showSpin = true
						if(this.timingId != null && this.timingId != '') {
							switchsStrategyTimer.id = this.timerForm.id
							switchsStrategyTimer.key = this.timingId
							updateSwitchsStrategyTimer(switchsStrategyTimer).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('更新成功');
							
								} else {
									this.$Message.error(data.errorMessage);
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}else{
							addSwitchsStrategyTimer(switchsStrategyTimer).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('添加成功');
							
								} else {
									this.$Message.error(data.errorMessage);
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}

						
					} else {
						//this.$Message.error('Fail!');
					}
				})
			},

			getStrategyInfo(row) {
				// console.log(row)
				this.switchsStrategyName = row.strategyName
				this.timerForm.switchsStrategyId = row.id
				this.showStrategy = false

			},
			showStrategyList() {
				this.showStrategy = true
			},
			showBelongOrgList() { //显示所属组织列表
				this.belongOrgTitle = this.belongOrgName
				this.showBelongOrg = true

			},
			showBelongOrgInfo(data) { //显示所选所属组织信息
				this.belongOrgInfo = data
				this.belongOrgTitle = data[0].orgName
			},
			belongOrgOk() { //确定所属组织
				//const selectedNodes = this.$refs.belongOrgTree.getSelectedNodes();
				this.timerForm.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
		},
		mounted() {
			this.getTimingInfo()
		}
	}
</script>

<style>
</style>
