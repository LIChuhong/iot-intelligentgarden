<template>
	<div>
	<Form ref="rtuCopyModel" :model="rtuCopyModel" :rules="rtuCopyRule" :label-width="80">
		<FormItem label="复制数量" prop="copyCount">
			<Input type="number" v-model="rtuCopyModel.copyCount" placeholder="请输入复制数量">
			</Input>
		</FormItem>
		<FormItem style="text-align: center;">
			<Button type="primary" @click="handleSubmit('rtuCopyModel')">复制</Button>
		</FormItem>
	</Form>
	<Spin fix v-show="showSpin" class="show-spin-style">
		<Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
		<div>复制中...</div>
	</Spin>
	</div>
</template>

<script>
	import {
		copyRtu
	} from '@/api/rtu'
	export default {
		name: 'copy_rtu',
		props: ['rtuNumber'],
		data() {
			return {
				showSpin:false,
				rtuCopyModel: {
					copyCount: ''
				},
				rtuCopyRule: {
					copyCount: [{
						required: true,
						//type: 'number',
						message: '请输入复制数量',
						trigger: 'blur'
					}]
				}

			}
		},

		methods: {
			handleSubmit(name) {
				
				this.$refs[name].validate((valid) => {
					if (valid) {
						if (this.rtuNumber) {
							this.showSpin = true
							copyRtu(this.rtuNumber, this.rtuCopyModel.copyCount).then(res => {
								const data = res.data
								this.showSpin = false
								if (data.success == 1) {
									this.$Message.success('复制成功')
								} else {
									this.$Message.error(data.errorMessage)
								}
							}).catch(error=>{
								this.showSpin = false
								alert(error)
							})
						}

					} else {
					}
				})
			},

		},

	}
</script>

<style>
</style>
