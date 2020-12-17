<template>
	<div ref="divHeight" style="width: 100%;height: 100%;">
		<!-- {{rtuNumber}} -->
		<div style="padding:0 0.625rem 0.625rem">
			<Row style="margin-bottom:0.625rem;">
				<Col span="12" style="text-align:left">
				起始:
				<DatePicker :editable="false" v-model="st" type="datetime" format="MM-dd HH:mm" placeholder="起始时间" style="width:70%"></DatePicker>
				</Col>
				<Col span="12" style="text-align: right">
				结束:
				<DatePicker :editable="false" v-model="et" type="datetime" format="MM-dd HH:mm" placeholder="结束时间" style="width:70%"></DatePicker>
				</Col>
			</Row>
			<Row>
				<Col span="12" style="text-align:left">
				年份:
				<DatePicker :editable="false" v-model="yt" type="year" placeholder="查找年份" style="width:70%"></DatePicker>
				</Col>
				<Col span="12" style="text-align: right">
				<Button type="primary" @click="getWaterRecordListMethod">查找</Button>
				</Col>
			</Row>
		</div>
		<Table :max-height="tableHeight" size="small" border :columns="waterRecordColumns" :data="waterRecordData" :loading="tableLoading">
			<template slot-scope="{ row }" slot="operationType">
				<p v-show="row.operationType ==0">手动</p>
				<p v-show="row.operationType ==1">定时</p>
				<p v-show="row.operationType ==2">联动</p>
			</template>
		</Table>

	</div>
</template>

<script>
	import {
		waterRecordColumns
	} from '@/data/columns'
	import {
		getWaterRecordList
	} from '@/api/rtu'
	export default {
		props: ['rtuNumber'],
		data() {
			return {
				tableLoading: false,
				waterRecordData: [{}],
				waterRecordColumns: waterRecordColumns,
				st: new Date(new Date(new Date().toLocaleDateString()).getTime()),
				et: new Date(),
				yt: new Date(),
				tableHeight:500
				
			}
		},
		methods: {
			getWaterRecordListMethod() {
				var year = this.yt.getFullYear()
				var st = this.getTime(this.st)
				var et = this.getTime(this.et)
				// alert(st)
				this.tableHeight = this.$refs.divHeight.clientHeight-100
				this.tableLoading = true
				getWaterRecordList(this.rtuNumber, year, st, et).then(res => {
					const data = res.data
					this.tableLoading = false
					if (data.success == 1) {
						if(data.data){
							var waterRecord = data.data
							for(var i = 0;i<waterRecord.length;i++){
								var time = new Date(waterRecord[i].waterTime)
								waterRecord[i].time = this.getTime(time)
								waterRecord[i].exeTime = waterRecord[i].exeTime +'s'
							}
							this.waterRecordData = waterRecord
						}

					}else{
						this.$Message.error(data.errorMessage)
					}
				}).catch(error => {
					this.tableLoading = false

				})
			},
			getTime(data){
				var m = data.getMonth()+1
				var Mon = m<10?'0'+m:m
				var D = data.getDate()<10?'0'+data.getDate():data.getDate()
				var H = data.getHours()<10?'0'+data.getHours():data.getHours()
				var M = data.getMinutes()<10?'0'+data.getMinutes():data.getMinutes()
				return Mon + '-' + D+' '+H +':'+ M
			}

		},
		created() {
		},
		mounted() {
			this.getWaterRecordListMethod()
		}

	}
</script>

<style>
</style>
