<template>
	<div>
		<Form :label-width="80" ref="strategyForm" :model="strategyForm" :rules="strategyRule" label-position="left">

			<FormItem label="策略名称" prop="strategyName">
				<Input type="text" :maxlength="100" v-model="strategyForm.strategyName" placeholder="请输入策略名称"></Input>
			</FormItem>
			<FormItem label="所属组织" prop="belongOrgId">
				<Input readonly v-model="belongOrgName" search enter-button="选择" placeholder="请选择所属组织" @on-search="showBelongOrgList"></Input>
			</FormItem>
			<FormItem label="异常马上结束" prop="isMustAllPass">
				<Checkbox v-model="strategyForm.isMustAllPass"></Checkbox>
			</FormItem>
			<FormItem label="执行模式" prop="exeMode">
				<RadioGroup v-model="strategyForm.exeMode">
					<Radio :label="0"><span>手动</span></Radio>
					<Radio :label="1"><span>自动</span></Radio>
				</RadioGroup>
			</FormItem>
			<div style="height:12.5rem;overflow: auto;">
				<FormItem v-for="(item, index) in strategyForm.switchsGroupStrategyList" :key="index" :label="'策略小组'+(index+1)"
				 :prop="'switchsGroupStrategyList.' + index">
					<Row>
						<Col span="20">
						<FormItem :prop="'switchsGroupStrategyList.' + index +'.sortIndex'" :rules="{required: true, message: ' ',type:'number', trigger: 'blur'}">
							<span>排序：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
							<InputNumber style="width:50%;" :min="0" v-model="item.sortIndex" placeholder="请输入排序"></InputNumber>
						</FormItem>
						<FormItem :prop="'switchsGroupStrategyList.' + index +'.workTime'" :rules="{required: true, message: ' ', trigger: 'change'}">
							<span>工作时长：</span>
							<TimePicker :editable="false" v-model="item.workTime" format="HH:mm:ss" placeholder="选择工作时长" style="width:50%"></TimePicker>
						</FormItem>
						<FormItem :prop="'switchsGroupStrategyList.' + index +'.delayTime'" :rules="{required: true, message: ' ', trigger: 'change'}">
							<span>下组延迟：</span>
							<TimePicker :editable="false" v-model="item.delayTime" format="HH:mm:ss" placeholder="选择执行下组策略的延迟时间" style="width: 50%"></TimePicker>
						</FormItem>
						</Col>
						<Col span="4">
						<Button size="small" v-show="index == strategyForm.switchsGroupStrategyList.length-1" type="primary" ghost @click="handleAddSgsList(item.sortIndex)"
						 icon="ios-add"></Button>
						<Button size="small" v-show="index != 0" style="display:block;" type="error" @click="handleRemove(index)" icon="ios-trash"></Button>
						</Col>
					</Row>
					<FormItem :prop="'switchsGroupStrategyList.' + index +'.rtuNumberList'" :rules="{required: true,type:'array', message: '请选择操控设备', trigger: 'change'}">
						<span>操控设备：</span>
						<Button size="small" type="primary" ghost @click="addrtuList(index)" icon="md-add">添加设备</Button>
						<div>
							<span v-for="(i,index1) in item.rtuNumberList" :key="index1" style="background: #c5c8ce;padding: 0.3125rem;border-radius:5%;margin-left: 0.3125rem;">{{i.rtuNumber}}
								<Icon type="md-close" style="margin-left: 0.3125rem;cursor:pointer;" @click="delRtu(index,index1)" /></span>

						</div>

					</FormItem>
				</FormItem>
			</div>
			<FormItem style="text-align: center;">
				<Button @click="handleReset('strategyForm')" style="margin-right: 8px">重置</Button>
				<Button type="primary" @click="handleSubmit('strategyForm')">
					<slot></slot>
				</Button>

			</FormItem>
		</Form>
		<Modal :title="'当前选择:'+ belongOrgTitle" v-model="showBelongOrg">
			<Icon slot="close" type="md-close"  size="30"/>
			<div class="tree-style">
				<org-tree v-if="showBelongOrg" @getBelongOrgInfo="showBelongOrgInfo" :orgTypeId="null"></org-tree>
			</div>
			<div slot="footer">
				<Button type="primary" size="large" @click="belongOrgOk">确定</Button>
			</div>
		</Modal>
		<Modal title="选择操控设备列表" v-model="showRtuModal" footer-hide>
			<Icon slot="close" type="md-close"  size="30"/>
			<rtu-form v-if="showRtuModal" :list="list" @check-rtu-ok="checkRtuOk"></rtu-form>
		</Modal>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>

<script>
	import OrgTree from '@/view/components/org-tree.vue'
	import RtuForm from './rtu-list.vue'
	import {
		formatSeconds
	} from '@/libs/tools.js'
	import {
		addSwitchsStrategy,
		getSwitchsStrategy,
		updateSwitchsStrategy
	} from '@/api/strategy.js'
	export default {
		props: {
			strategyId: {
				type: Number
			}
		},
		components: {
			OrgTree,
			RtuForm
		},
		data() {
			const validateStrategyName = (rule, value, callback) => {
				if (!value || value.replace(/\s*/g, "") == "") {
					return callback(new Error('策略名称不能为空'));
				} else {
					callback();
				}
			};
			return {
				showSpin: false,
				showRtuModal: false,
				selLoading: false,
				showBelongOrg: false,
				belongOrgTitle: '',
				belongOrgInfo: '', //所属组织信息
				belongOrgName: '', //所属组织名称
				strategyForm: {
					strategyName: '',
					belongOrgId: '',
					isMustAllPass: true,
					exeMode: 0,
					switchsGroupStrategyList: [{
						sortIndex: 0,
						delayTime: '',
						workTime: '',
						rtuNumberList: []
					}]
				},
				rtuList: [],
				index: null,
				list: [],
				strategyRule: {
					strategyName: [{
						required: true,
						// message: '策略名称不能为空',
						validator: validateStrategyName,
						trigger: 'blur'
					}],
					belongOrgId: [{
						required: true,
						type: 'number',
						message: '请选择用户所属组织',
						trigger: 'change'
					}],
				}

			}
		},
		methods: {
			handleReset(name) {
				this.$refs[name].resetFields();
				this.belongOrgName = ''
				this.strategyForm.switchsGroupStrategyList = [{
					sortIndex: 0,
					delayTime: '',
					workTime: '',
					rtuNumberList: []
				}]

			},
			handleRemove(index) {
				this.strategyForm.switchsGroupStrategyList.splice(index, 1)
			},
			delRtu(index, index1) {
				this.strategyForm.switchsGroupStrategyList[index].rtuNumberList.splice(index1, 1)
			},
			checkRtuOk(list) {
				// console.log(list)
				this.strategyForm.switchsGroupStrategyList[this.index].rtuNumberList = list
				this.showRtuModal = false
				this.index = null
			},
			addrtuList(index) {
				this.index = index
				this.list = this.strategyForm.switchsGroupStrategyList[index].rtuNumberList
				this.showRtuModal = true
			},
			handleAddSgsList(index) {
				this.strategyForm.switchsGroupStrategyList.push({
					sortIndex: index+1,
					delayTime: '',
					workTime: '',
					rtuNumberList: []
				})
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
				this.strategyForm.belongOrgId = this.belongOrgInfo[0].id
				this.belongOrgName = this.belongOrgInfo[0].orgName
				this.showBelongOrg = false
			},
			getStrategyInfo() {

				if (this.strategyId != null && this.strategyId != '') {
					this.showSpin = true
					getSwitchsStrategy(this.strategyId).then(res => {
						this.showSpin = false
						const data = res.data
						if (data.success == 1) {
							// console.log(data)
							let switchsStrategy = data.switchsStrategy
							let switchsGroupStrategyList = []
							let list = switchsStrategy.switchsGroupStrategyList

							for (var i = 0; i < list.length; i++) {
								let rtuNumberList = []
								let list1 = list[i].rtuNumberList
								for (var j = 0; j < list1.length; j++) {
									rtuNumberList.push({
										rtuNumber: list1[j]
									})
								}
								switchsGroupStrategyList.push({
									sortIndex: list[i].sortIndex,
									delayTime: formatSeconds(list[i].delayTime),
									workTime: formatSeconds(list[i].workTime),
									rtuNumberList: rtuNumberList
								})
							}
							// console.log(switchsGroupStrategyList)
							this.strategyForm = {
								strategyName: switchsStrategy.strategyName,
								belongOrgId: switchsStrategy.belongOrgId,
								isMustAllPass: switchsStrategy.mustAllPass,
								switchsGroupStrategyList: switchsGroupStrategyList,
								exeMode: switchsStrategy.exeMode

							}
							this.belongOrgName = switchsStrategy.orgName

						} else {
							this.$Message.error(data.errorMessage)
						}
					}).catch(error => {
						this.showSpin = false
						alert(error)
					})
				}
			},

			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						let switchsGroupStrategyList = []
						let list = this.strategyForm.switchsGroupStrategyList
						for (var i = 0; i < list.length; i++) {
							let rtuNumberList = []
							let list1 = list[i].rtuNumberList
							for (var j = 0; j < list1.length; j++) {
								rtuNumberList.push(list1[j].rtuNumber)
							}
							// console.log(rtuNumberList)
							let delayTime = Number(list[i].delayTime.substr(0, 2)) * 3600 + Number(list[i].delayTime.substr(3, 2)) * 60 +
								Number(list[i].delayTime.substr(6, 2))
							let workTime = Number(list[i].workTime.substr(0, 2)) * 3600 + Number(list[i].workTime.substr(3, 2)) * 60 +
								Number(list[i].workTime.substr(6, 2))
							switchsGroupStrategyList.push({
								sortIndex: Number(parseInt(list[i].sortIndex)),
								delayTime: delayTime,
								workTime: workTime,
								rtuNumberList: rtuNumberList
							})
						}
						let strategyForm = {
							strategyName: this.strategyForm.strategyName,
							belongOrgId: this.strategyForm.belongOrgId,
							mustAllPass: this.strategyForm.isMustAllPass,
							switchsGroupStrategyList: switchsGroupStrategyList,
							exeMode: this.strategyForm.exeMode
						}
						this.showSpin = true
						if (this.strategyId != null && this.strategyId != '') {
							strategyForm.id = this.strategyId
							updateSwitchsStrategy(strategyForm).then(res => {
								this.showSpin = false
								const data = res.data
								if (data.success == 1) {
									this.$Message.success('更新成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						} else {
							addSwitchsStrategy(strategyForm).then(res => {
								this.showSpin = false
								const data = res.data
								if (data.success == 1) {
									this.$Message.success('添加成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})
						}



					}else{
						this.$Message.error('信息未完善')
					}

				})
			}

		},
		mounted() {
			this.getStrategyInfo()
		},
		created() {
			// this.getRtuList()
		}
	}
</script>

<style>
</style>
