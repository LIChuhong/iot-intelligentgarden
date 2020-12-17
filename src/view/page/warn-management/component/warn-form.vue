<template>
	<div>
		<Form :label-width="100" ref="warnForm" :model="warnForm" :rules="warnRule" label-position="left">
			<FormItem label="告警名称" prop="warnName">
				<Input v-model="warnForm.warnName" placeholder="请输入告警名称" :maxlength="50"></Input>
			</FormItem>
			<FormItem label="告警等级" prop="warnLevel">
				<RadioGroup v-model="warnForm.warnLevel">
					<Radio :label="0"><span>低</span></Radio>
					<Radio :label="1"><span>中</span></Radio>
					<Radio :label="2"><span>高</span></Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="告警上限" prop="warnMaxValue">
				<Input type="number" v-model="warnForm.warnMaxValue" placeholder="请输入告警上限" :maxlength="100"></Input>
			</FormItem>

			<FormItem label="告警下限" prop="warnMinValue">
				<Input type="number" v-model="warnForm.warnMinValue" placeholder="请输入告警下限" :maxlength="100"></Input>
			</FormItem>

			<FormItem style="text-align: center;">
				<Button @click="handleReset('warnForm')" style="margin-right: 8px">重置</Button>
				<Button type="primary" @click="handleSubmit('warnForm')">
					<slot></slot>
				</Button>
			</FormItem>
		</Form>
		<Spin fix v-show="showSpin">
			<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
			<div>加载中...</div>
		</Spin>
	</div>
</template>

<script>
	import {
		addParameterWarnInfo,
		updateParameterWarnInfo
	} from '@/api/warn'
	export default {
		 props: {
			 warnInfo:{
				 type:Object,
				default: funcution=>{
					return {}
				}
			 }
		 },
		
		data() {
			
			return {
				showSpin: false,
				warnForm: {
					warnName: '',
					warnMaxValue: null,
					warnMinValue:null,
					warnLevel:0
					
				},
				warnRule: {
					warnName: [{
						required: true,
						message: '告警名称不能为空',
						trigger: 'blur'
					}],
					warnMaxValue: [{
						required: true,
						// type:'number',
						message: '告警上限不能为空',
						trigger: 'blur'
					}],
					warnMinValue: [{
						required: true,
						// type:'number',
						message: '告警下限不能为空',
						trigger: 'blur'
					}],
					warnLevel: [{
						required: true,
						 type:'number',
						message: '请选择告警等级',
						trigger: 'change'
					}],
				},
			}
		},
		methods: {
			getWarnInfo(){
				if (this.warnInfo != null && this.warnInfo != '') {
					this.warnForm ={
						id: this.warnInfo.id,
						warnName:this.warnInfo.warnName,
						warnMinValue:String(this.warnInfo.warnMinValue),
						warnMaxValue:String(this.warnInfo.warnMaxValue),
						warnLevel:this.warnInfo.warnLevel
					}
				}
			},
			handleReset(name) {
				this.$refs[name].resetFields()
			},
			handleSubmit(name) { //提交表单
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.showSpin = true
						if (this.warnInfo != null && this.warnInfo != '') {
							updateParameterWarnInfo(this.warnForm).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('更新成功')
									this.$emit("update-success",this.warnForm)
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error => {
								this.showSpin = false
								alert(error)
							})

						} else {
							addParameterWarnInfo(this.warnForm).then(res => {
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

					}
				})
			},
			
		},
		created() {
			// 
		},
		mounted() {
			this.getWarnInfo()

		}

	}
</script>

<style>
</style>
